"use server"

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Configure email transporter
function createTransporter() {
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  
  if (!user || !pass) {
    console.error('Email configuration missing: EMAIL_USER or EMAIL_PASSWORD not set');
    return null;
  }
  
  console.log(`Setting up email transporter for ${service} with user ${user}`);
  
  // Gmail-specific configuration
  if (service.toLowerCase() === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass, // This should be an App Password, not a regular password
      },
      debug: true, // Enable debug mode
      logger: true, // Log transport activity
    });
  }
  
  // Generic email service configuration
  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using the configured transporter
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('Could not create email transporter - check configuration');
      return false;
    }

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      // Continue trying to send anyway
    }

    const mailOptions = {
      from: `"EduMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    
    console.log(`Attempting to send email to ${to} with subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Gmail-specific error advice
    if (error.message?.includes('Invalid login')) {
      console.error('Gmail authentication failed. Please ensure:');
      console.error('1. You\'re using an App Password, not your regular password');
      console.error('2. 2-step verification is enabled on your Google account');
      console.error('3. Less secure app access is turned off');
    }
    
    return false;
  }
}

/**
 * Send an email using the SendGrid API as a fallback
 */
async function sendEmailFallback({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid API key not configured for fallback email');
    return false;
  }

  try {
    console.log('Attempting to send email via SendGrid fallback');
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject,
        }],
        from: { email: process.env.EMAIL_USER || 'notifications@edumate.app' },
        content: [{
          type: 'text/html',
          value: html,
        }],
      }),
    });

    if (response.ok) {
      console.log('Email sent successfully via SendGrid fallback');
      return true;
    } else {
      const errorData = await response.json();
      console.error('SendGrid API error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('SendGrid fallback error:', error);
    return false;
  }
}

/**
 * Send a login notification email to the user
 */
export async function sendLoginNotificationEmail(email: string, name: string, ipAddress: string, deviceInfo: string): Promise<boolean> {
  const currentDate = new Date().toLocaleString();
  const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://edumate-3d-instructor.vercel.app'}/dashboard`;
  
  console.log(`Preparing login notification email to ${email} for login from ${ipAddress}`);
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4f46e5; margin: 0;">EduMate</h1>
        <p style="color: #6b7280; font-size: 16px;">Your AI-powered English learning assistant</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #111827; margin-top: 0;">New Login Detected</h2>
        <p style="color: #4b5563; line-height: 1.5;">Hello ${name},</p>
        <p style="color: #4b5563; line-height: 1.5;">We detected a new login to your EduMate account.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-radius: 5px; border-left: 4px solid #4f46e5;">
          <p><strong>Time:</strong> ${currentDate}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p><strong>Device:</strong> ${deviceInfo}</p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.5;">If this was you, you can safely ignore this email. If you didn't log in recently, please secure your account by changing your password immediately.</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${loginLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
      </div>
      
      <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} EduMate. All rights reserved.</p>
      </div>
    </div>
  `;

  const emailOptions = {
    to: email,
    subject: 'New Login to Your EduMate Account',
    html,
  };

  // Try primary email method first
  const primarySent = await sendEmail(emailOptions);
  
  // If primary method fails, try fallback
  if (!primarySent) {
    console.log('Primary email delivery failed, attempting fallback...');
    return sendEmailFallback(emailOptions);
  }
  
  return primarySent;
} 