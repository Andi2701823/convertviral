import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

// Validation schema
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  planType: z.enum(['premium', 'business']),
  referralCode: z.string().optional(),
  source: z.string().optional()
});

// Generate discount code
function generateDiscountCode(planType: string): string {
  const prefix = planType === 'premium' ? 'PREM' : 'BIZ';
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}50_${random}`;
}

// Generate referral code
function generateReferralCode(email: string): string {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return hash.substring(0, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);
    
    const { email, name, planType, referralCode, source } = validatedData;
    
    // Get client IP for duplicate prevention
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check if email already exists
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email }
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 400 }
      );
    }

    // Generate codes
    const discountCode = generateDiscountCode(planType);
    const userReferralCode = generateReferralCode(email);
    
    // Find referrer if referral code provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await prisma.waitlistEntry.findFirst({
        where: { referralCode: referralCode }
      });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email,
        name: name || null,
        planType,
        discountCode,
        referralCode: userReferralCode,
        referredBy,
        ipAddress: clientIP,
        source: source || 'direct'
      }
    });

    // Send confirmation email and schedule automation sequence
    try {
      const { EmailAutomation } = await import('@/lib/email');
      await EmailAutomation.scheduleWaitlistSequence({
        email,
        name: name || 'there',
        planType,
        discountCode,
        referralCode: userReferralCode
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      discountCode,
      referralCode: userReferralCode,
      message: 'Successfully joined waitlist'
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planType = searchParams.get('planType');
    
    if (planType && !['premium', 'business'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const whereClause = planType ? { planType } : {};
    
    const count = await prisma.waitlistEntry.count({
      where: whereClause
    });

    return NextResponse.json({ count });

  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email service function (implement with your preferred email provider)
async function sendConfirmationEmail({
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
  // TODO: Implement with your email service (SendGrid, Resend, etc.)
  // For now, just log the email content
  console.log('Sending confirmation email:', {
    to: email,
    subject: `Welcome to ConvertViral ${planType} Waitlist! 🎉`,
    content: `
      Hi ${name},
      
      Welcome to the ConvertViral ${planType} waitlist!
      
      Your early bird discount code: ${discountCode}
      Your referral code: ${referralCode}
      
      We'll notify you as soon as ${planType} features launch.
      
      Best regards,
      ConvertViral Team
    `
  });
  
  // Example implementation with a hypothetical email service:
  /*
  await emailService.send({
    to: email,
    subject: `Welcome to ConvertViral ${planType} Waitlist! 🎉`,
    template: 'waitlist-confirmation',
    data: {
      name,
      planType,
      discountCode,
      referralCode,
      launchDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  });
  */
}