const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOrderConfirmation = async ({ to, devoteeName, offeringName, totalAmount, orderId }) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Order Confirmation - ${offeringName}`,
    html: `
      <p>Dear ${devoteeName},</p>
      <p>Your order for <strong>${offeringName}</strong> has been confirmed.</p>
      <p>Amount: ₹${totalAmount}</p>
      <p>Order ID: ${orderId}</p>
      <p>Thank you for your offering.</p>
    `,
  });
};

module.exports = { sendOrderConfirmation };
