/**
 * emailService.js
 * Centralized email notification service for Zebrold Group.
 * Supports:
 * 1. EmailJS (if VITE_EMAILJS_* keys are configured)
 * 2. FormSubmit.co instant delivery (zero-config, delivers directly to inbox!)
 */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT || '';
const EMAILJS_TEMPLATE_CAREER = import.meta.env.VITE_EMAILJS_TEMPLATE_CAREER || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Destination email address for job application alerts and contact inquiries
const RECIPIENT_EMAIL = import.meta.env.VITE_NOTIFICATION_EMAIL || 'harisharish982005@gmail.com';

/**
 * Send email via FormSubmit.co (Zero-config instant delivery)
 */
async function sendFormSubmit(subject, data) {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/e47b516ed3bc726b88a99a2f1de91e8c`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[Zebrold Group] ${subject}`,
        _template: 'table',
        _captcha: 'false',
        ...data,
      })
    });

    const result = await response.json();
    if (response.ok && result.success !== 'false') {
      return { success: true, provider: 'FormSubmit' };
    } else {
      console.warn('[EmailService] FormSubmit notice:', result);
      return { success: false, error: result.message || 'FormSubmit request failed' };
    }
  } catch (err) {
    console.error('[EmailService] FormSubmit error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send an email via EmailJS REST API
 */
async function sendEmailJS(templateId, templateParams) {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      return { success: true, provider: 'EmailJS' };
    } else {
      const errorText = await response.text();
      console.error('[EmailService] EmailJS error:', errorText);
      return { success: false, error: errorText };
    }
  } catch (err) {
    console.error('[EmailService] Network exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Generate Zebrold Website Brand-Themed Candidate Email HTML
 */
export function generateCandidateStatusEmailHtml({ candidateName, jobTitle, status = 'APPLICATION RECEIVED', customMessage = '' }) {
  const statusUpper = (status || 'APPLICATION RECEIVED').toUpperCase();
  
  let statusColor = '#8B3A3A'; // Wine brand color default
  let defaultMessage = `Thank you for your application for the position of ${jobTitle || 'Software Engineer'} at Zebrold Group. Our talent team is reviewing your profile.`;

  if (statusUpper === 'HIRED') {
    statusColor = '#4CAF50'; // Green success or Gold highlight
    defaultMessage = `Congratulations! We are thrilled to offer you the position of ${jobTitle || 'Software Engineer'} at Zebrold. We will be sending over the formal offer letter shortly.\n\nWelcome aboard!`;
  } else if (statusUpper === 'INTERVIEW') {
    statusColor = '#D3B673'; // Gold / Warm highlight
    defaultMessage = `Great news! We would like to invite you for an interview for the ${jobTitle || 'position'} role at Zebrold. Our hiring team will contact you to schedule a convenient time.`;
  } else if (statusUpper === 'UNDER REVIEW') {
    statusColor = '#8B3A3A'; // Wine accent
    defaultMessage = `Your application for ${jobTitle || 'this position'} is currently under active review by our department leadership team. We will keep you posted on next steps.`;
  } else if (statusUpper === 'REJECTED') {
    statusColor = '#888888'; // Muted grey
    defaultMessage = `Thank you for your interest in Zebrold Group and for taking the time to apply for the ${jobTitle || 'position'} role. While we were impressed with your background, we have decided to move forward with other candidates at this time.`;
  }

  const messageBody = (customMessage || defaultMessage).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update - Zebrold Group</title>
</head>
<body style="margin:0; padding:0; background-color:#161817; font-family:'Open Sans', Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#161817; padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px; background-color:#222523; border:1px solid rgba(245, 242, 232, 0.12); border-radius:8px; overflow:hidden; box-shadow:0 12px 32px rgba(0,0,0,0.5);">
          
          <!-- Logo Header Box -->
          <tr>
            <td align="center" style="background-color:#F5F2E8; padding:28px 20px; border-bottom:3px solid #6E2A2A;">
              <div style="background-color:#222523; width:64px; height:64px; border-radius:6px; display:inline-block; text-align:center; line-height:64px;">
                <span style="color:#F9F9F7; font-family:'Passion One', Arial, sans-serif; font-size:38px; font-weight:900; letter-spacing:1px; line-height:64px; display:block;">Z</span>
              </div>
              <div style="margin-top:8px; font-size:11px; font-weight:700; letter-spacing:2px; color:#222523; text-transform:uppercase;">ZEBROLD GROUP</div>
            </td>
          </tr>

          <!-- Main Email Content -->
          <tr>
            <td style="padding:36px 32px 28px 32px;">
              <h1 style="color:#F9F9F7; font-size:24px; font-weight:700; margin:0 0 18px 0; letter-spacing:-0.3px;">Application Update</h1>
              
              <p style="color:#F5F2E8; font-size:15px; line-height:1.6; margin:0 0 12px 0;">Hi ${candidateName || 'Candidate'},</p>
              
              <p style="color:#CCCCCC; font-size:14px; line-height:1.6; margin:0 0 24px 0;">
                We have an update regarding your <strong>${jobTitle || 'software engineering'}</strong> application.
              </p>

              <!-- Status Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:26px;">
                <tr>
                  <td style="background-color:rgba(245, 242, 232, 0.04); border-left:4px solid ${statusColor}; padding:14px 18px; border-radius:3px;">
                    <span style="color:#AAAAAA; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px; display:inline-block; margin-right:8px;">Status:</span>
                    <span style="color:${statusColor}; font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px;">${statusUpper}</span>
                  </td>
                </tr>
              </table>

              <!-- Body Message -->
              <div style="color:#E0E0E0; font-size:14.5px; line-height:1.75; margin:0 0 28px 0;">
                ${messageBody}
              </div>

              ${statusUpper === 'HIRED' ? `
                <p style="color:#F9F9F7; font-size:16px; font-weight:700; margin:0 0 16px 0;">Welcome aboard!</p>
              ` : `
                <p style="color:#888888; font-size:13.5px; line-height:1.6; margin:24px 0 0 0;">
                  Best regards,<br/>
                  <strong style="color:#F9F9F7;">Zebrold Group Talent Team</strong>
                </p>
              `}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#1B1D1C; padding:20px; border-top:1px solid rgba(245, 242, 232, 0.08); font-size:11.5px; color:#777777;">
              © 2026 Zebrold. All rights reserved. &bull; Frankfurt am Main, Germany
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send email notifications for Contact Form / Floating Chatbot Inquiry
 */
export async function sendContactEmail({ name, email, company, subject, message }) {
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_CONTACT && EMAILJS_PUBLIC_KEY) {
    return await sendEmailJS(EMAILJS_TEMPLATE_CONTACT, {
      to_name: name || 'Valued Visitor',
      user_name: name || 'Valued Visitor',
      user_email: email,
      user_company: company || 'N/A',
      subject: subject || 'General Inquiry',
      message: message || '',
      reply_to: email,
    });
  }

  return await sendFormSubmit(`New Contact Inquiry: ${subject || 'General'}`, {
    'Sender Name': name || 'Visitor',
    'Sender Email': email,
    'Company / Organization': company || 'N/A',
    'Subject': subject || 'General Inquiry',
    'Message': message || 'No message content',
    '_replyto': email,
  });
}

/**
 * Send email notifications for Job Application
 */
export async function sendApplicationEmail({ candidateName, email, phone, jobTitle, department, coverNote, cvFileName }) {
  const brandedHtml = generateCandidateStatusEmailHtml({
    candidateName,
    jobTitle,
    status: 'APPLICATION RECEIVED',
    customMessage: `Thank you for applying for the ${jobTitle} position at Zebrold Group. We have received your application documents and your profile is being reviewed by our engineering and talent teams.`
  });

  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_CAREER && EMAILJS_PUBLIC_KEY) {
    return await sendEmailJS(EMAILJS_TEMPLATE_CAREER, {
      to_name: candidateName,
      candidate_name: candidateName,
      candidate_email: email,
      candidate_phone: phone || 'N/A',
      job_title: jobTitle || 'General Application',
      department: department || 'General',
      cover_note: coverNote || 'No cover note provided.',
      cv_file_name: cvFileName || 'Attached in system',
      email_html: brandedHtml,
      reply_to: email,
    });
  }

  return await sendFormSubmit(`New Job Application: ${jobTitle || 'General Position'}`, {
    'Candidate Name': candidateName,
    'Candidate Email': email,
    'Candidate Phone': phone || 'N/A',
    'Applied Position': jobTitle || 'General Position',
    'Department': department || 'General',
    'Cover Note': coverNote || 'No cover note provided',
    'CV Attachment Status': cvFileName ? `Uploaded (${cvFileName})` : 'Stored in Admin Portal',
    '_replyto': email,
    'Candidate Notification HTML': brandedHtml,
  });
}

/**
 * Send Candidate Status Update Email (Hired, Interview, Under Review, etc.)
 */
export async function sendCandidateStatusEmail({ candidateName, email, jobTitle, status, customMessage }) {
  const brandedHtml = generateCandidateStatusEmailHtml({
    candidateName,
    jobTitle,
    status,
    customMessage
  });

  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_CAREER && EMAILJS_PUBLIC_KEY) {
    return await sendEmailJS(EMAILJS_TEMPLATE_CAREER, {
      to_name: candidateName,
      candidate_name: candidateName,
      candidate_email: email,
      job_title: jobTitle,
      status: status,
      email_html: brandedHtml,
      reply_to: email,
    });
  }

  return await sendFormSubmit(`Application Status Update: ${status} - ${candidateName}`, {
    'Candidate Name': candidateName,
    'Candidate Email': email,
    'Job Title': jobTitle,
    'Updated Status': status,
    'Message': customMessage || 'Status updated in Zebrold Admin Portal',
    '_replyto': email,
    'Branded Email HTML': brandedHtml
  });
}

/**
 * Generate Zebrold Brand-Themed Admin Password Reset Email HTML
 */
export function generatePasswordResetEmailHtml({ recipientEmail, accountName, resetCode }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Password Reset Code - Zebrold Group</title>
</head>
<body style="margin:0; padding:0; background-color:#161817; font-family:'Open Sans', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#161817; padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:520px; background-color:#222523; border:1px solid rgba(245, 242, 232, 0.12); border-radius:8px; overflow:hidden;">
          <tr>
            <td align="center" style="background-color:#F5F2E8; padding:24px 20px; border-bottom:3px solid #6E2A2A;">
              <div style="background-color:#222523; width:54px; height:54px; border-radius:6px; display:inline-block; text-align:center; line-height:54px;">
                <span style="color:#F9F9F7; font-size:32px; font-weight:900;">Z</span>
              </div>
              <div style="margin-top:6px; font-size:11px; font-weight:700; letter-spacing:2px; color:#222523;">ZEBROLD ADMIN SECURITY</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="color:#F9F9F7; font-size:22px; margin:0 0 14px 0;">Admin Password Reset Code</h2>
              <p style="color:#E0E0E0; font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                Hello <strong>${accountName || 'Administrator'}</strong> (${recipientEmail}),<br/>
                We received a request to reset the password for your Zebrold Group Admin Console account.
              </p>
              
              <div style="background:rgba(212, 175, 55, 0.1); border:1px solid #D4AF37; border-radius:6px; padding:20px; text-align:center; margin-bottom:24px;">
                <span style="color:#888888; font-size:12px; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:6px;">Your 6-Digit Security Verification Code</span>
                <span style="color:#D4AF37; font-size:32px; font-weight:800; letter-spacing:6px; font-family:monospace;">${resetCode}</span>
              </div>

              <p style="color:#AAAAAA; font-size:13px; line-height:1.5;">
                Enter this code in the password reset panel. This code expires in 15 minutes. If you did not request this, please secure your account immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:#1B1D1C; padding:16px; font-size:11px; color:#777777;">
              © 2026 Zebrold International Holdings Limited &bull; Security Operations
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send Admin Password Reset Email
 */
export async function sendPasswordResetEmail({ recipientEmail, accountName, resetCode }) {
  const brandedHtml = generatePasswordResetEmailHtml({ recipientEmail, accountName, resetCode });

  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_CAREER && EMAILJS_PUBLIC_KEY) {
    return await sendEmailJS(EMAILJS_TEMPLATE_CAREER, {
      to_name: accountName,
      user_email: recipientEmail,
      subject: 'Zebrold Admin Console Password Reset Code',
      email_html: brandedHtml,
      reply_to: 'security@zebrold.com'
    });
  }

  return await sendFormSubmit(`Admin Console Password Reset Request (${recipientEmail})`, {
    'Account Name': accountName,
    'Recipient Email': recipientEmail,
    'Verification Code': resetCode,
    'Request Timestamp': new Date().toISOString(),
    'Security Note': 'Password reset OTP generated for Zebrold Admin Console',
    '_replyto': recipientEmail,
    'Branded Email HTML': brandedHtml
  });
}

