import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { PostService } from "@/app/services/post.service";
import { Subscriber } from "@/app/models/Subscriber";
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

// Important: Ensure all models are registered for populates
import "@/app/models/Media";
import "@/app/models/Category";
import "@/app/models/Tag";
import "@/app/models/Subscriber";

const resend = new Resend(process.env.RESEND_API_KEY);

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    // 1. ATOMIC UPDATE: Force status to published
    // We pass an explicit object to ensure no DTO values interfere
    const updated = await PostService.update(id, {
      status: "published",
      publishedAt: new Date(),
    });

if (updated) {
  // ✅ This clears the cache for the admin drafts and the blog feed
  revalidatePath('/admin/drafts');
  revalidatePath('/blog');
  revalidatePath('/blog/latest');
}else{
  return fail("Post not found", 404);
}
    // 2. TRIGGER NOTIFICATIONS (NON-BLOCKING)
    // We don't await this so the API responds instantly, but we wrap it in a try/catch
    // 2. TRIGGER NOTIFICATIONS (NON-BLOCKING)
    (async () => {
      console.log("📡 Email Background Task: Started"); // Log 1
      try {
        const subscribers = await Subscriber.find({ active: true }, "email").lean();
        console.log(`📡 Email Background Task: Found ${subscribers.length} active subscribers in DB`); // Log 2
        
        const emails = subscribers
          .map((s: any) => s.email?.trim())
          .filter((email: string) => {
             // In Sandbox, we only allow your verified email
             const isVerified = email === 'prathmeshpawar4169@gmail.com';
             if (isVerified) console.log(`🎯 Found matching verified email: ${email}`);
             return isVerified;
          });

        console.log(`📡 Email Background Task: Final email list size: ${emails.length}`); // Log 3

        if (emails.length > 0) {
          const { data, error } = await resend.emails.send({
            from: 'Arihant Blog <onboarding@resend.dev>', // MUST use this for Sandbox
            to: emails,
            subject: `New Post: ${updated.title}`,
            html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Post from Arihant Blog</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              ${updated.coverImage?.url ? `
              <tr>
                <td>
                  <img src="${updated.coverImage.url}" alt="${updated.title}" width="600" style="width: 100%; height: auto; display: block;">
                </td>
              </tr>
              ` : ''}

              <tr>
                <td style="padding: 40px;">
                  <p style="text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; font-weight: 700; font-size: 12px; margin: 0 0 16px 0;">
                    New Article Published
                  </p>
                  <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; line-height: 1.2; margin: 0 0 20px 0;">
                    ${updated.title}
                  </h1>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    ${updated.excerpt || 'We just published a new story on our blog. Dive in to see the latest insights and updates.'}
                  </p>
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="left">
                        <a href="https://arihant-cms-xtre.vercel.app/blog/${updated.slug}" 
                           style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">
                          Read Full Article
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 40px; background-color: #f1f5f9; text-align: center;">
                  <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    © ${new Date().getFullYear()} Arihant Blog. All rights reserved.
                  </p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    You are receiving this because you subscribed to our newsletter. <br>
                    <a href="https://arihant-cms-xtre.vercel.app/api/public/unsubscribe?email=${encodeURIComponent(emails[0])}" 
   style="color: #6366f1; text-decoration: none; font-weight: bold;">
   Unsubscribe
</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`,
          });

          if (error) {
            console.error("❌ Resend API Error:", error);
          } else {
            console.log("✅ Resend Success. ID:", data?.id);
          }
        } else {
          console.log("⚠️ No valid subscribers matched the filter. Skipping send.");
        }
      } catch (err: any) {
        console.error("❌ Notification logic failed:", err.message);
      }
    })();

    // 3. SUCCESS RESPONSE
    // Return the updated post so the frontend can update its local state immediately
    return ok(updated, "Post published successfully");

  } catch (err: any) {
    console.error("💥 Publish Error:", err);
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    return fail("Failed to publish", 500, err?.message);
  }
}