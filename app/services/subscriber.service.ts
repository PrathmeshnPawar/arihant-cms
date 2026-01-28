import { connectDB } from "@/app/lib/db/connect";
import { Subscriber } from "@/app/models/Subscriber";

export class SubscriberService {
  static async subscribe(email: string) {
    await connectDB();
    
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if they already exist
    const existing = await Subscriber.findOne({ email: normalizedEmail });

    if (existing) {
      if (!existing.active) {
        // Reactivate if they previously unsubscribed
        existing.active = true;
        existing.unsubscribedAt = undefined;
        await existing.save();
        return { success: true, message: "Welcome back! Subscription reactivated.", data: existing };
      }
      return { success: true, message: "You are already subscribed!", data: existing };
    }

    // 2. Create new subscriber
    const newSubscriber = await Subscriber.create({
      email: normalizedEmail,
      active: true,
      subscribedAt: new Date()
    });

    return { success: true, message: "Subscription successful!", data: newSubscriber };
  }

  static async unsubscribe(email: string) {
    await connectDB();
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { active: false, unsubscribedAt: new Date() },
      { new: true }
    );
    return subscriber;
  }
}