import { connectDB } from "@/app/lib/db/connect";
import { ok, fail } from "@/app/lib/response";
import { Subscriber } from "@/app/models/Subscriber";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return fail("Email is required", 400);

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { active: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) return fail("Subscriber not found", 404);

    return ok(null, "You have been successfully unsubscribed.");
  } catch (err: any) {
    return fail("Unsubscribe failed", 500, err.message);
  }
}