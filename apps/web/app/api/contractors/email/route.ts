import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;
    
    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'Missing email or name' }, { status: 400 });
    }
    
    // Email sending will be configured via AppGen Integrations
    // For now, log the email that would be sent
    console.log('Welcome email would be sent to:', email);
    console.log('Subject: Welcome to KONZA!');
    console.log('Message: Thank you for joining the Konza journey. Be a successful contractor today!');
    
    // In production, this will use the email service configured in AppGen Integrations
    // Example with Resend (when configured):
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'KONZA <onboarding@yourdomain.com>',
    //   to: email,
    //   subject: 'Welcome to KONZA!',
    //   html: `
    //     <h1>Welcome ${name}!</h1>
    //     <p>Thank you for joining the Konza journey. Be a successful contractor today!</p>
    //   `
    // });
    
    return NextResponse.json({ success: true, message: 'Email queued' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
