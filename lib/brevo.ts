const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendBrevoEmail({ to, subject, htmlContent }: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME;

  if (!apiKey || !senderEmail || !senderName) {
    throw new Error(
      "Brevo env vars missing (BREVO_API_KEY / BREVO_SENDER_EMAIL / BREVO_SENDER_NAME)"
    );
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo send failed (${res.status}): ${errBody}`);
  }
}

function otpEmailTemplate(otp: string): string {
  const watermarkUrl = "https://ik.imagekit.io/dgfqmzkoi/tr:w-260,o-10/branding/board_logo_ieCbVpAq4L.png";
  const headerLogoUrl = "https://ik.imagekit.io/dgfqmzkoi/tr:w-120,h-120/branding/board_logo_ieCbVpAq4L.png";

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>One-Time Password (OTP)</title>
  <style>
    :root {
      color-scheme: light only;
      supported-color-schemes: light;
    }
    html, body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background-color: #ffffff !important;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    /* Force pure white background and preserve colors in dark mode clients */
    @media (prefers-color-scheme: dark) {
      body, .email-body, .email-wrapper, .email-card {
        background-color: #ffffff !important;
      }
      .email-title {
        color: #ffffff !important;
      }
      .email-subtitle {
        color: #F1E4C3 !important;
      }
      .email-dark-text {
        color: #1e293b !important;
      }
      .email-muted-text {
        color: #475569 !important;
      }
      .email-otp-box {
        background-color: #F0F7FF !important;
        border-color: #93C5FD !important;
      }
      .email-otp-code {
        color: #0A58CA !important;
      }
      .email-footer-bg {
        background-color: #F8FAFC !important;
      }
    }
  </style>
</head>
<body class="email-body" style="margin: 0; padding: 0; background-color: #ffffff !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Outer Wrapper Table -->
  <table role="presentation" class="email-wrapper" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="width: 100%; background-color: #ffffff !important; margin: 0; padding: 24px 8px;">
    <tr>
      <td align="center" bgcolor="#ffffff" style="background-color: #ffffff !important;">
        
        <!-- Main Email Container Card (Max width 500px) -->
        <table role="presentation" class="email-card" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width: 500px; width: 100%; background-color: #ffffff !important; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
          
          <!-- Top Header: Logo + Bilingual Name -->
          <tr>
            <td align="center" bgcolor="#0A2545" style="background-color: #0A2545 !important; padding: 20px 20px; border-bottom: 3px solid #D4AF37;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" style="padding-bottom: 10px;">
                    <img src="${headerLogoUrl}" alt="Board Emblem" width="56" height="56" style="display: block; width: 56px; height: 56px; border: 0; outline: none; margin: 0 auto;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <div class="email-title" style="margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 0.5px; color: #ffffff !important; text-transform: uppercase; line-height: 1.2;">
                      INDIAN PARAMEDICAL BOARD OF INDIA
                    </div>
                    <div class="email-subtitle" style="margin-top: 4px; font-size: 12px; font-weight: 600; color: #F1E4C3 !important; line-height: 1.2;">
                      इण्डियन पैरामेडिकल बोर्ड ऑफ इण्डिया
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Center Content with Watermark Logo Background -->
          <tr>
            <td align="center" bgcolor="#ffffff" background="${watermarkUrl}" style="background-color: #ffffff !important; background-image: url('${watermarkUrl}'); background-repeat: no-repeat; background-position: center center; background-size: 220px auto; padding: 32px 24px;">
              
              <p class="email-dark-text" style="margin: 0 0 14px 0; font-size: 15px; color: #1E293B !important; font-weight: 600; text-align: center;">
                Your One-Time Password (OTP) is:
              </p>

              <!-- Highlighted OTP Container -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 16px auto;">
                <tr>
                  <td align="center" class="email-otp-box" bgcolor="#F0F7FF" style="background-color: #F0F7FF !important; border: 2px dashed #93C5FD; border-radius: 12px; padding: 14px 28px;">
                    <span class="email-otp-code" style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #0A58CA !important; display: block; line-height: 1;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p class="email-dark-text" style="margin: 0 0 20px 0; font-size: 13px; color: #334155 !important; line-height: 1.5; text-align: center;">
                This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
              </p>

              <!-- Subtle Divider Line -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 16px 0;">
                <tr>
                  <td style="border-top: 1px solid #E2E8F0; height: 1px;"></td>
                </tr>
              </table>

              <!-- Hindi Notice -->
              <p class="email-muted-text" style="margin: 0 0 6px 0; font-size: 13.5px; color: #475569 !important; line-height: 1.5; text-align: center;">
                आपका वन-टाइम पासवर्ड (OTP) है: <strong class="email-otp-code" style="color: #0A58CA !important; font-size: 16px; letter-spacing: 1px;">${otp}</strong>
              </p>
              <p class="email-muted-text" style="margin: 0; font-size: 12px; color: #64748b !important; line-height: 1.5; text-align: center;">
                यह OTP <strong>10 मिनट</strong> के लिए मान्य है। कृपया इसे किसी के साथ साझा न करें।
              </p>

            </td>
          </tr>

          <!-- Security Footer Notice -->
          <tr>
            <td align="center" bgcolor="#F8FAFC" class="email-footer-bg" style="background-color: #F8FAFC !important; padding: 14px 20px; border-top: 1px solid #E2E8F0;">
              <p class="email-muted-text" style="margin: 0; font-size: 11px; color: #64748b !important; line-height: 1.4; text-align: center;">
                This is an automated official security message from <strong>Indian Paramedical Board of India</strong>. If you did not request this OTP, please ignore this email.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  purpose: "admin_login" | "student_verification"
): Promise<void> {
  const subject =
    purpose === "admin_login"
      ? "Admin Login OTP - INDIAN PARAMEDICAL BOARD OF INDIA"
      : "Email Verification OTP - INDIAN PARAMEDICAL BOARD OF INDIA";

  await sendBrevoEmail({
    to,
    subject,
    htmlContent: otpEmailTemplate(otp),
  });
}
