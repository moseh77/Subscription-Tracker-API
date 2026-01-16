import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      userId: req.user._id,
      status: 'active'  // Ensure new subscriptions are active by default
    });

    const workflowUrl = `${SERVER_URL}/api/v1/workflows/subscription/reminder`;
    console.log('Triggering workflow with URL:', workflowUrl);
    
    let workflowRunId;
    try {
      const result = await workflowClient.trigger({
        url: workflowUrl,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          'content-type': 'application/json',
        },
        retries: 0,
      });
      workflowRunId = result.workflowRunId;
      console.log('Workflow triggered successfully:', workflowRunId);
    } catch (error) {
      console.error('Error triggering workflow:', error);
      // Continue with the response even if workflow fails
      workflowRunId = 'workflow-trigger-failed';
    }

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user._id.toString() !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ userId: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}