// app/api/public/subscribe/route.ts
import { ok, fail } from "@/app/lib/response";
import { SubscriberService } from "@/app/services/subscriber.service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return fail("Please provide a valid email address", 400);
    }

    // Call the service logic
    const result = await SubscriberService.subscribe(email);

    return ok(result.data, result.message);
  } catch (err: any) {
    console.error("Newsletter Error:", err);
    return fail("Failed to subscribe", 500, err.message);
  }
}