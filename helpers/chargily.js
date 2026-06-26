const { ChargilyClient } = require('@chargily/chargily-pay');

// Initialization for Chargily Pay V2
// Pass your Secret Key (starts with api_sk_...) to the 'api_key' property.
const client = new ChargilyClient({
  api_key: process.env.CHARGILY_SECRET_KEY, 
});

/**
 * Creates a checkout link for the user
 */
async function createPayment({ amount, currency = 'dzd', success_url, failure_url, metadata }) {
  // ❌ client.createPayment does not exist
  // ✅ client.createCheckout is the correct V2 method
  const checkout = await client.createCheckout({
    amount: Math.round(amount), // Note: V2 expects the actual amount in DZD (e.g. 1000 for 1000 DA), not centimes.
    currency,
    success_url,
    failure_url,
    metadata,
  });
  
  return checkout;
}

/**
 * Verifies or retrieves a checkout status
 */
async function verifyPayment(checkoutId) {
  // ❌ client.getPayment does not exist
  // ✅ client.getCheckout is the correct V2 method
  const checkout = await client.getCheckout(checkoutId);
  return checkout;
}

module.exports = { createPayment, verifyPayment };
