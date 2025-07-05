import { z } from 'zod';

// Email templates
export const emailTemplates = {
  waitlistConfirmation: {
    subject: (planType: string) => `Welcome to ConvertViral ${planType} Waitlist! 🎉`,
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ConvertViral Waitlist</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
          .discount-code { background: #f0f9ff; border: 2px dashed #0ea5e9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .social-links { margin: 20px 0; }
          .social-links a { display: inline-block; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're on the list!</h1>
            <p>Welcome to ConvertViral ${data.planType} waitlist</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            
            <p>Thank you for joining the ConvertViral ${data.planType} waitlist! You're now part of an exclusive group getting early access to our premium features.</p>
            
            <div class="discount-code">
              <h3>🎁 Your Early Bird Discount Code</h3>
              <h2 style="color: #0ea5e9; font-family: monospace; letter-spacing: 2px;">${data.discountCode}</h2>
              <p><strong>Save 50% when ${data.planType} launches!</strong></p>
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>📧 We'll email you the moment ${data.planType} features go live</li>
              <li>🎯 You'll get priority access before the general public</li>
              <li>💰 Your 50% discount will be automatically applied</li>
              <li>🚀 Plus exclusive bonuses for early supporters</li>
            </ul>
            
            <h3>Share & Earn More Rewards</h3>
            <p>Share your referral code <strong>${data.referralCode}</strong> with friends and earn additional bonuses:</p>
            <ul>
              <li>3 referrals = Extra 10% discount</li>
              <li>5 referrals = Free month when you upgrade</li>
              <li>10+ referrals = Lifetime 20% discount</li>
            </ul>
            
            <div class="social-links">
              <a href="https://twitter.com/intent/tweet?text=I'm%20waiting%20for%20@ConvertViral%20${data.planType}%20features!%20Join%20me%20with%20code%20${data.referralCode}%20for%20early%20bird%20pricing%20🚀&url=https://convertviral.com/pricing" class="button">Share on Twitter</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://convertviral.com/pricing" class="button">Share on Facebook</a>
            </div>
            
            <p>Questions? Just reply to this email - we're here to help!</p>
            
            <p>Best regards,<br>The ConvertViral Team</p>
          </div>
          
          <div class="footer">
            <p>ConvertViral - Professional File Conversion Made Simple</p>
            <p><a href="https://convertviral.com/unsubscribe?email=${data.email}">Unsubscribe</a> | <a href="https://convertviral.com/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  leadMagnetWelcome: {
    subject: (magnetType: string) => `Your Free ${magnetType.charAt(0).toUpperCase() + magnetType.slice(1)} is Ready! 📚`,
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Free Download is Ready</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .download-button { display: inline-block; background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 20px 0; }
          .bonus-section { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 Your Download is Ready!</h1>
            <p>Thanks for downloading our ${data.magnetType}</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            
            <p>Thank you for downloading our ${data.magnetType}! You can access it using the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.downloadUrl}" class="download-button">📥 Download Your ${data.magnetType}</a>
            </div>
            
            <p><small>This download link will be active for 7 days.</small></p>
            
            <div class="bonus-section">
              <h3>🎁 Bonus: Want More Free Resources?</h3>
              <p>As a thank you, here are some additional free resources:</p>
              <ul>
                <li><a href="https://convertviral.com/blog/conversion-tips">10 Pro Conversion Tips</a></li>
                <li><a href="https://convertviral.com/tools/batch-converter">Free Batch Converter Tool</a></li>
                <li><a href="https://convertviral.com/templates">Professional Templates</a></li>
              </ul>
            </div>
            
            <h3>What's Next?</h3>
            <p>Over the next few days, I'll send you:</p>
            <ul>
              <li>📖 Advanced conversion techniques</li>
              <li>🛠️ Tool recommendations and reviews</li>
              <li>💡 Pro tips from industry experts</li>
              <li>🎯 Exclusive offers and early access</li>
            </ul>
            
            <p>Questions about the ${data.magnetType}? Just reply to this email!</p>
            
            <p>Best regards,<br>The ConvertViral Team</p>
          </div>
          
          <div class="footer">
            <p>ConvertViral - Professional File Conversion Made Simple</p>
            <p><a href="https://convertviral.com/unsubscribe?email=${data.email}">Unsubscribe</a> | <a href="https://convertviral.com/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  
  launchNotification: {
    subject: () => `🚀 ConvertViral Premium is LIVE! Your 50% discount is waiting...`,
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Premium Features Are Live!</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 20px 0; }
          .urgency { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .features { background: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 IT'S HERE!</h1>
            <p>ConvertViral Premium is officially LIVE</p>
          </div>
          
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            
            <p>The wait is over! ConvertViral Premium features are now live and ready for you to use.</p>
            
            <div class="urgency">
              <h3>⏰ Your 50% Early Bird Discount Expires in 48 Hours!</h3>
              <p>Use code: <strong style="font-size: 24px; color: #ef4444;">${data.discountCode}</strong></p>
            </div>
            
            <div class="features">
              <h3>🎯 What You Get with Premium:</h3>
              <ul>
                <li>✅ Unlimited file conversions</li>
                <li>✅ 500MB file size limit</li>
                <li>✅ No watermarks</li>
                <li>✅ Priority processing</li>
                <li>✅ Batch conversion</li>
                <li>✅ Advanced format options</li>
                <li>✅ Email support</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="https://convertviral.com/upgrade?code=${data.discountCode}" class="cta-button">🎉 Claim Your 50% Discount Now</a>
            </div>
            
            <p><strong>Remember:</strong> This early bird pricing is only available for the first 48 hours and only for waitlist members like you.</p>
            
            <p>After that, Premium goes to regular pricing at $4.99/month.</p>
            
            <p>Thank you for being part of our journey from the beginning!</p>
            
            <p>Best regards,<br>The ConvertViral Team</p>
          </div>
          
          <div class="footer">
            <p>ConvertViral - Professional File Conversion Made Simple</p>
            <p><a href="https://convertviral.com/unsubscribe?email=${data.email}">Unsubscribe</a> | <a href="https://convertviral.com/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Email service interface
export interface EmailService {
  send(params: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void>;
}

// Mock email service for development
class MockEmailService implements EmailService {
  async send(params: { to: string; subject: string; html: string; from?: string }) {
    console.log('📧 Mock Email Sent:', {
      to: params.to,
      subject: params.subject,
      from: params.from || 'noreply@convertviral.com',
      htmlLength: params.html.length
    });
    
    // Simulate email delivery delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Email service factory
export function createEmailService(): EmailService {
  // In production, you would return the actual email service
  // For example, with SendGrid:
  /*
  if (process.env.SENDGRID_API_KEY) {
    return new SendGridEmailService(process.env.SENDGRID_API_KEY);
  }
  */
  
  // For now, return mock service
  return new MockEmailService();
}

// Email automation functions
export async function sendWaitlistConfirmation({
  email,
  name,
  planType,
  discountCode,
  referralCode
}: {
  email: string;
  name: string;
  planType: string;
  discountCode: string;
  referralCode: string;
}) {
  const emailService = createEmailService();
  const template = emailTemplates.waitlistConfirmation;
  
  await emailService.send({
    to: email,
    subject: template.subject(planType),
    html: template.html({ name, planType, discountCode, referralCode, email })
  });
}

export async function sendLeadMagnetWelcome({
  email,
  name,
  magnetType,
  downloadUrl
}: {
  email: string;
  name: string;
  magnetType: string;
  downloadUrl: string;
}) {
  const emailService = createEmailService();
  const template = emailTemplates.leadMagnetWelcome;
  
  await emailService.send({
    to: email,
    subject: template.subject(magnetType),
    html: template.html({ name, magnetType, downloadUrl, email })
  });
}

export async function sendLaunchNotification({
  email,
  name,
  planType,
  discountCode
}: {
  email: string;
  name: string;
  planType: string;
  discountCode: string;
}) {
  const emailService = createEmailService();
  const template = emailTemplates.launchNotification;
  
  await emailService.send({
    to: email,
    subject: template.subject(),
    html: template.html({ name, planType, discountCode, email })
  });
}

// Email automation scheduler (you would typically use a job queue like Bull or Agenda)
export class EmailAutomation {
  static async scheduleWaitlistSequence({
    email,
    name,
    planType,
    discountCode,
    referralCode
  }: {
    email: string;
    name: string;
    planType: string;
    discountCode: string;
    referralCode: string;
  }) {
    // Send immediate confirmation
    await sendWaitlistConfirmation({ email, name, planType, discountCode, referralCode });
    
    // Schedule follow-up emails (in production, use a job queue)
    console.log('📅 Scheduled email sequence for:', email);
    
    // Day 3: Reminder about benefits
    // Day 7: Social proof and urgency
    // Day 14: Additional resources
    // Launch day: Launch notification
  }
  
  static async scheduleLeadMagnetSequence({
    email,
    name,
    magnetType,
    downloadUrl
  }: {
    email: string;
    name: string;
    magnetType: string;
    downloadUrl: string;
  }) {
    // Send immediate welcome with download
    await sendLeadMagnetWelcome({ email, name, magnetType, downloadUrl });
    
    // Schedule follow-up emails
    console.log('📅 Scheduled lead magnet sequence for:', email);
    
    // Day 1: Tips and tricks
    // Day 3: Case studies
    // Day 7: Tool recommendations
    // Day 14: Upgrade offer
  }
}