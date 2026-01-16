import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
  try {
    console.log(`Preparing to send ${type} email to:`, to);
    
    if (!to || !type) {
      throw new Error('Missing required parameters: to and type are required');
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) {
      throw new Error(`Invalid email type: ${type}. Available types: ${emailTemplates.map(t => t.label).join(', ')}`);
    }

    // Ensure we have required subscription data
    if (!subscription || !subscription.user) {
      throw new Error('Missing required subscription data or user information');
    }

    const mailInfo = {
      userName: subscription.user.name || 'Valued Customer',
      subscriptionName: subscription.name || 'Your Subscription',
      renewalDate: dayjs(subscription.endDate).format('MMM D, YYYY'),
      planName: subscription.name || 'Your Plan',
      price: subscription.price 
        ? `${subscription.currency || 'USD'} ${subscription.price}${subscription.frequency ? ` (${subscription.frequency})` : ''}` 
        : 'Not specified',
      paymentMethod: subscription.paymentMethod || 'your payment method',
    };

    console.log('Email content prepared:', JSON.stringify(mailInfo, null, 2));

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
      from: `Subscription Tracker <${accountEmail}>`,
      to: to,
      subject: subject,
      html: message,
      // Enable debug mode
      debug: true,
      logger: true
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Return a promise that resolves when the email is sent
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent successfully:', info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error('Error in sendReminderEmail:', error);
    throw error;
  }
};
