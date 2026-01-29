import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Subscriber } from "@/app/models/Subscriber";

// app/api/subscribe/unsubscribe/route.ts

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token"); // Optional: Add a security token

    if (!email) return fail("Email is required", 400);

    // 1. Clean the email
    const cleanEmail = email.trim().toLowerCase();

    // 2. Perform the update
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: cleanEmail },
      { active: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) {
      // If not found, redirect to a "already unsubscribed" or home page
      return Response.redirect(new URL('/blog?status=not-found', req.url));
    }

    // 3. Redirect to a NICE landing page
    // Users hate seeing JSON after clicking a link!
    return Response.redirect(new URL('/unsubscribed-success', req.url));

  } catch (err: any) {
    console.error("Unsubscribe Error:", err);
    return Response.redirect(new URL('/blog?status=error', req.url));
  }
}