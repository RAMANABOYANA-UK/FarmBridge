/**
 * WhatsApp Service – Gupshup style
 * Replace the fetch URL & payload according to your provider docs
 * when you get the API keys.
 */

const sendWhatsAppTemplate = async ({ to, templateName, params = [] }) => {
  if (!process.env.GUPSHUP_API_KEY) {
    console.warn('[WhatsApp] Provider not configured – message skipped');
    return { success: false, error: 'WhatsApp not configured' };
  }

  try {
    // Example Gupshup template API (adjust as per their latest docs)
    const response = await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: process.env.GUPSHUP_API_KEY
      },
      body: new URLSearchParams({
        channel: 'whatsapp',
        source: process.env.GUPSHUP_SOURCE_NUMBER,
        destination: to.startsWith('91') ? to : `91${to}`,
        'src.name': process.env.GUPSHUP_APP_NAME,
        template: JSON.stringify({
          id: templateName,          // or use name depending on provider
          params
        })
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[WhatsApp] Error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[WhatsApp] Unexpected error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Convenience helpers (map these to real approved templates)
 */
const sendOtpWhatsApp = async (phone, otp) => {
  return sendWhatsAppTemplate({
    to: phone,
    templateName: 'otp_verification', // must be approved by Meta
    params: [otp]
  });
};

const sendOrderConfirmationWhatsApp = async (phone, order) => {
  return sendWhatsAppTemplate({
    to: phone,
    templateName: 'order_confirmation',
    params: [order.orderId || order._id.toString(), String(order.totalAmount)]
  });
};

const sendPaymentSuccessWhatsApp = async (phone, order) => {
  return sendWhatsAppTemplate({
    to: phone,
    templateName: 'payment_success',
    params: [order.orderId || order._id.toString(), String(order.totalAmount)]
  });
};

module.exports = {
  sendWhatsAppTemplate,
  sendOtpWhatsApp,
  sendOrderConfirmationWhatsApp,
  sendPaymentSuccessWhatsApp
};
