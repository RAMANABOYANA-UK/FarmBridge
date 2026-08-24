const { Resend } = require('resend');

let _resend = null;
const getResend = () => {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
};

const FROM = process.env.EMAIL_FROM || 'FarmConnect <noreply@yourdomain.com>';

/**
 * Send a plain / HTML email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY missing – email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Email] Unexpected error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * OTP Email Template
 */
const sendOtpEmail = async (to, otp, purpose = 'verification') => {
  const subject = `Your FarmConnect OTP: ${otp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">FarmConnect</h2>
      <p>Your One-Time Password (OTP) for <strong>${purpose}</strong> is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0; color: #1b5e20;">
        ${otp}
      </div>
      <p>This OTP is valid for <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
      <p style="color: #666; font-size: 13px;">If you did not request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};

/**
 * Order Confirmation Email
 */
const sendOrderConfirmationEmail = async (to, order) => {
  const subject = `Order Confirmed – #${order.orderId || order._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">Order Confirmed!</h2>
      <p>Hi,</p>
      <p>Your order <strong>#${order.orderId || order._id}</strong> has been placed successfully.</p>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p>We will notify you once the farmer accepts the order.</p>
      <br/>
      <p style="color: #666; font-size: 13px;">Thank you for choosing FarmConnect.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
};

/**
 * Payment Success Email
 */
const sendPaymentSuccessEmail = async (to, order) => {
  const subject = `Payment Received – Order #${order.orderId || order._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">Payment Successful</h2>
      <p>We have received your payment of <strong>₹${order.totalAmount}</strong> for order #${order.orderId || order._id}.</p>
      <p>The farmer has been notified.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
};

/**
 * Generic Order Status Update
 */
const sendOrderStatusEmail = async (to, order, statusText) => {
  const subject = `Order Update – #${order.orderId || order._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #2e7d32;">Order Status Updated</h2>
      <p>Your order <strong>#${order.orderId || order._id}</strong> is now: <strong>${statusText}</strong>.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusEmail
};
