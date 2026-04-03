const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async ({ amount, currency = 'INR', receipt }) => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt,
  });
};

const verifyWebhookSignature = (body, signature) => {
  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');
  return expected === signature;
};

module.exports = { createOrder, verifyWebhookSignature };
