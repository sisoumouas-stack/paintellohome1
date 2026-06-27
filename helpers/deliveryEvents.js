// helpers/deliveryEvents.js
const { sendFacebookCAPIEvent } = require('../services/facebookCapi'); // adjust the path

// UUID v4 generator function
function generateEventId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
async function sendPurchaseForDeliveredCOD(order) {
  // Only for COD orders that have stored user data
  if (order.paymentMethod !== "cod" || !order.metaUserData || Object.keys(order.metaUserData).length === 0) {
    console.log("⚠️ Skip Purchase – not a valid COD order or missing user data");
    return;
  }

  const eventId = generateEventId();
  const userData = order.metaUserData;

  // Build contents from the saved cart
  const contents = order.cart.items.map(item => ({
    id: item.item._id ? item.item._id.toString() : item.item.toString(),
    quantity: item.qty,
    item_price: item.price || (item.unitPrice ? item.unitPrice : 0),
  }));
  const content_ids = contents.map(c => c.id);

  try {
    await sendFacebookCAPIEvent({
      eventName: "Purchase",
      eventId: eventId,
      userData: userData,
      customData: {
        value: order.totalWithShipping || order.cart.totalPrice,
        currency: "DZD",
        content_type: "product",
        content_category: 'COD',
        content_ids: content_ids,
        contents: contents,
      },
      eventSourceUrl: `https://${process.env.DOMAIN || "www.paintello.uk"}/order/${order._id}`,
      testEventCode: process.env.FB_TEST_EVENT_CODE,
    });
    console.log(`✅ Purchase event sent for delivered COD order ${order._id}, eventID: ${eventId}`);
  } catch (err) {
    console.error(`❌ Failed to send Purchase for order ${order._id}:`, err);
  }
}

module.exports = { sendPurchaseForDeliveredCOD };
