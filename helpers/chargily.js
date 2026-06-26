const { ChargilyClient } = require('@chargily/chargily-pay');

const client = new ChargilyClient({
  apiKey: process.env.CHARGILY_API_KEY,
  secretKey: process.env.CHARGILY_SECRET_KEY,
  environment: 'sandbox', // use 'production' when live
});

async function createPayment({ amount, currency = 'dzd', success_url, failure_url, metadata }) {
  // ✅ correct method: client.createPayment (not client.payments.create)
  const payment = await client.createPayment({
    amount: Math.round(amount), // centimes
    currency,
    success_url,
    failure_url,
    metadata,
  });
  return payment;
}

async function verifyPayment(paymentId) {
  // ✅ correct method: client.getPayment (not client.payments.retrieve)
  const payment = await client.getPayment(paymentId);
  return payment;
}

module.exports = { createPayment, verifyPayment };
