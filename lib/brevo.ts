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
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="color: #1a1a1a; margin-bottom: 4px;">INDIAN PARAMEDICAL BOARD OF INDIA</h2>
      <p style="color: #333;">Your One-Time Password (OTP) is:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0a58ca; margin: 12px 0;">${otp}</p>
      <p style="color: #333;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;" />
      <p style="color: #555;">आपका वन-टाइम पासवर्ड (OTP) है: <strong>${otp}</strong></p>
      <p style="color: #555;">यह OTP <strong>10 मिनट</strong> के लिए मान्य है। इसे किसी के साथ साझा न करें।</p>
    </div>
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
