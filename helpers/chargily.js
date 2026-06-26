const { ChargilyClient } = require('@chargily/chargily-pay');

const client = new ChargilyClient({
  apiKey: process.env.CHARGILY_API_KEY,
  secretKey: process.env.CHARGILY_SECRET_KEY,
  environment: 'sandbox', // change to 'production' when live
});

async function createPayment({ amount, currency = 'dzd', success_url, failure_url, metadata }) {
  const payment = await client.payments.create({
    amount: Math.round(amount), // centimes
    currency,
    success_url,
    failure_url,
    metadata,
  });
  return payment;
}

async function verifyPayment(paymentId) {
  const payment = await client.payments.retrieve(paymentId);
  return payment;
}

module.exports = { createPayment, verifyPayment };
