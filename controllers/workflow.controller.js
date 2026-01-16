import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  console.log('Workflow triggered with payload:', context.requestPayload);
  
  const { subscriptionId } = context.requestPayload;
  if (!subscriptionId) {
    console.error('No subscriptionId provided in workflow context');
    return;
  }

  console.log(`Fetching subscription: ${subscriptionId}`);
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription) {
    console.error(`Subscription ${subscriptionId} not found`);
    return;
  }

  console.log('Subscription found:', {
    id: subscription._id,
    endDate: subscription.endDate,
    userId: subscription.userId?._id || subscription.userId
  });

  // Consider subscription active if status is 'active' or undefined (for backward compatibility)
  if (subscription.status && subscription.status !== 'active') {
    console.log(`Subscription ${subscriptionId} is not active (status: ${subscription.status}). Skipping reminders.`);
    return;
  }

  const renewalDate = dayjs(subscription.endDate);
  const now = dayjs();

  if (renewalDate.isBefore(now)) {
    console.log(`Renewal date (${renewalDate.format('YYYY-MM-DD')}) has already passed for subscription ${subscriptionId}.`);
    return;
  }

  console.log(`Setting up reminders for subscription ${subscriptionId} ending on ${renewalDate.format('YYYY-MM-DD')}`);

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    const label = `${daysBefore} days before renewal`;
    
    if (dayjs().isSame(reminderDate, 'day')) {
      // If it's the reminder date, trigger immediately
      console.log(`Triggering immediate ${label} reminder`);
      await triggerReminder(context, label, subscription);
    } else if (dayjs().isBefore(reminderDate)) {
      // If reminder is in the future, schedule it
      console.log(`Scheduling ${label} reminder for ${reminderDate}`);
      await sleepUntilReminder(context, label, reminderDate);
      
      // After waking up, check if we should still send the reminder
      if (dayjs().isSame(reminderDate, 'day')) {
        console.log(`Triggering scheduled ${label} reminder`);
        await triggerReminder(context, label, subscription);
      }
    }
    // If we're past the reminder date, skip it
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    const subscription = await Subscription.findById(subscriptionId)
      .populate('userId', 'name email');
    
    if (!subscription) {
      console.error(`Subscription ${subscriptionId} not found`);
      return null;
    }
    
    if (!subscription.userId) {
      console.error(`No user found for subscription ${subscriptionId}`);
      return null;
    }
    
    return subscription;
  });
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    try {
      console.log(`Triggering ${label} reminder`);
      
      // Check if we have the populated user data
      if (!subscription.userId || !subscription.userId.email) {
        // If not populated, fetch the subscription with populated user
        const subWithUser = await Subscription.findById(subscription._id || subscription.id)
          .populate('userId', 'name email');
        
        if (!subWithUser || !subWithUser.userId) {
          throw new Error('User not found for subscription');
        }
        subscription = subWithUser;
      }

      // Create a clean subscription object without using toObject()
      const subscriptionData = {
        name: subscription.name,
        endDate: subscription.endDate,
        price: subscription.price,
        currency: subscription.currency || 'USD',
        frequency: subscription.frequency,
        paymentMethod: subscription.paymentMethod || 'your payment method',
        user: {
          name: subscription.userId.name,
          email: subscription.userId.email
        }
      };

      await sendReminderEmail({
        to: subscription.userId.email,
        type: label,
        subscription: subscriptionData
      });
      
      console.log(`Successfully triggered ${label} reminder`);
    } catch (error) {
      console.error('Error in triggerReminder:', error);
      throw error; // This will make the workflow fail visibly
    }
  });
}
