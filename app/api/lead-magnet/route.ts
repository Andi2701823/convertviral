import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const leadMagnetSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  magnetType: z.enum(['ebook', 'checklist', 'template', 'course', 'toolkit']),
  interests: z.array(z.string()).optional(),
  source: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadMagnetSchema.parse(body);
    
    const { email, name, magnetType, interests, source } = validatedData;
    
    // Get client IP for analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Here you would typically:
    // 1. Save to database
    // 2. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 3. Send welcome email with download link
    
    // For now, we'll simulate the process
    console.log('Lead magnet signup:', {
      email,
      name,
      magnetType,
      interests,
      source,
      ip: clientIP,
      timestamp: new Date().toISOString()
    });

    // Send welcome email and schedule automation sequence
    try {
      const { EmailAutomation } = await import('@/lib/email');
      await EmailAutomation.scheduleLeadMagnetSequence({
        email,
        name,
        magnetType,
        downloadUrl: getDownloadUrl(magnetType)
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    // Simulate adding to email marketing service
    try {
      await addToEmailList({
        email,
        name,
        magnetType,
        interests,
        source
      });
    } catch (listError) {
      console.error('Failed to add to email list:', listError);
      // Don't fail the request if list addition fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to lead magnet',
      downloadUrl: getDownloadUrl(magnetType)
    });

  } catch (error) {
    console.error('Lead magnet signup error:', error);
    
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

// Get download URL based on magnet type
function getDownloadUrl(magnetType: string): string {
  const downloadUrls = {
    ebook: '/downloads/conversion-guide.pdf',
    checklist: '/downloads/conversion-checklist.pdf',
    template: '/downloads/conversion-templates.zip',
    course: '/courses/conversion-mastery',
    toolkit: '/downloads/conversion-toolkit.zip'
  };
  
  return downloadUrls[magnetType as keyof typeof downloadUrls] || '/downloads/default.pdf';
}

// Send welcome email with download link
async function sendWelcomeEmail({
  email,
  name,
  magnetType
}: {
  email: string;
  name: string;
  magnetType: string;
}) {
  // TODO: Implement with your email service (SendGrid, Resend, etc.)
  console.log('Sending welcome email:', {
    to: email,
    subject: `Your Free ${magnetType.charAt(0).toUpperCase() + magnetType.slice(1)} is Ready! 📚`,
    content: `
      Hi ${name},
      
      Thank you for downloading our ${magnetType}!
      
      Download Link: ${getDownloadUrl(magnetType)}
      
      This link will be active for 7 days.
      
      Best regards,
      ConvertViral Team
    `
  });
  
  // Example implementation with a hypothetical email service:
  /*
  await emailService.send({
    to: email,
    subject: `Your Free ${magnetType.charAt(0).toUpperCase() + magnetType.slice(1)} is Ready! 📚`,
    template: 'lead-magnet-welcome',
    data: {
      name,
      magnetType,
      downloadUrl: getDownloadUrl(magnetType),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  });
  */
}

// Add to email marketing list
async function addToEmailList({
  email,
  name,
  magnetType,
  interests,
  source
}: {
  email: string;
  name: string;
  magnetType: string;
  interests?: string[];
  source?: string;
}) {
  // TODO: Implement with your email marketing service
  console.log('Adding to email list:', {
    email,
    name,
    tags: [magnetType, source || 'lead_magnet'],
    interests,
    customFields: {
      leadMagnet: magnetType,
      signupSource: source || 'website',
      signupDate: new Date().toISOString()
    }
  });
  
  // Example implementation with Mailchimp:
  /*
  await mailchimp.lists.addListMember('your-list-id', {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: name,
      LMAGNET: magnetType,
      SOURCE: source || 'website'
    },
    tags: [magnetType, 'lead_magnet']
  });
  */
  
  // Example implementation with ConvertKit:
  /*
  await convertKit.subscribers.create({
    email,
    first_name: name,
    tags: [magnetType, 'lead_magnet'],
    fields: {
      lead_magnet: magnetType,
      signup_source: source || 'website'
    }
  });
  */
}

// GET endpoint for analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const magnetType = searchParams.get('type');
    
    // Return download stats (you would get this from your database)
    const stats = {
      total: 10247,
      ebook: 4521,
      checklist: 2834,
      template: 1892,
      course: 756,
      toolkit: 244,
      recent: 156 // last 24 hours
    };
    
    if (magnetType && magnetType in stats) {
      return NextResponse.json({
        type: magnetType,
        downloads: stats[magnetType as keyof typeof stats]
      });
    }
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error('Lead magnet stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}