import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { requireAdmin } from "@/app/lib/guard";
import { PostService } from "@/app/services/post.service";
import { Subscriber } from "@/app/models/Subscriber"; // Assuming you have this model
import { Resend } from 'resend'; // Recommended for Next.js

const resend = new Resend(process.env.RESEND_API_KEY);

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await ctx.params;

    // 1. Update Post Status in DB
    const updated = await PostService.update(id, {
      status: "published",
      publishedAt: new Date(),
    });

    if (!updated) return fail("Post not found", 404);

    // 2. TRIGGER EMAIL NOTIFICATION
    // We do this inside a try/catch so even if email fails, the post stays published
    try {
      const subscribers = await Subscriber.find({ active: true }, "email");
      const emails = subscribers.map((s) => s.email);

      if (emails.length > 0) {
        await resend.emails.send({
          from: 'Arihant Blog <onboarding@resend.dev>',
          to: emails,
          subject: `New Post: ${updated.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2>${updated.title}</h2>
              <p>${updated.excerpt || 'Check out our latest story on Arihant Blog.'}</p>
              <a href="https://arihant-cms-xtre.vercel.app/blog/${updated.slug}" 
                 style="background: #020617; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Read Full Article
              </a>
              <hr style="margin-top: 30px;" />
              <p style="font-size: 12px; color: gray;">You received this because you are subscribed to Arihant Blog.</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("❌ Email failed to send, but post is published:", emailErr);
    }

    return ok(updated, "Post published and subscribers notified");
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") return fail("Unauthorized", 401);
    if (err?.message === "FORBIDDEN") return fail("Forbidden", 403);

    return fail("Failed to publish post", 500, err?.message);
  }
}