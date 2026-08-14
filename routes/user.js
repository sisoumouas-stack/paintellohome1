var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

const middleware = require('../middleware');
const getCleanUserData = require('../utils/userData');
const sendFacebookCAPIEvent = require('../services/facebookCapi');
const Cart = require('../models/cart');
const Order = require('../models/order');
var header = require('../models/header');

// protect routes using csrf
var csrfProtection = csrf();
router.use(csrfProtection);

// UUID v4 generator function
function generateEventId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ==========================================
// 1. PROFILE ROUTE (Optimized for your View)
// ==========================================
router.get('/profile', middleware.isLoggedIn, async function(req, res, next) {
  try {
    const headers = await header.find({});
    
    // 1. Get User Stats and Orders
    // This finds orders where (user matches ID) OR (phone matches user phone)
    const orders = await Order.findUserCompleteHistory(req.user._id, req.user.numero);
    
    // 2. Track PageView
    const eventIdPageView = generateEventId();
    const userData = getCleanUserData(req);

    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
      });
    }

    // 3. Process Orders for Display (Calculate stats)
    let totalSpent = 0;
    let totalItems = 0;
    let deliveredOrders = 0;
    let deliveredItems = 0;
    
    const processedOrders = orders.map(order => {
      // Re-hydrate cart if needed for display
      const cart = new Cart(order.cart);
      order.items = cart.generateArray();

      // Ensure virtuals (like statusDisplay) are available
      // Note: Mongoose virtuals are usually auto-available in templates, 
      // but calculations below need raw data
      
      const orderTotal = order.totalWithShipping || 0;
      const orderQty = order.cart.totalQty || 0;

      totalSpent += orderTotal;
      totalItems += orderQty;

      if (order.status === 'delivered') {
        deliveredOrders++;
        deliveredItems += orderQty;
      }
      
      return order;
    });

    // 4. Prepare User Stats Object
    const userStats = {
      totalOrders: orders.length,
      totalSpent: totalSpent,
      totalItems: totalItems,
      deliveredOrders: deliveredOrders,
      deliveredItems: deliveredItems,
      memberSince: req.user.createdAt,
      statusCounts: {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      }
    };

    // 5. Render View
    res.render('user/profile', {
      orders: processedOrders,
      headers: headers,
      req: req,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      registrationEventId: req.session.completeRegistrationEventId || null,
      userStats: userStats,
      // Pass helper functions for the view if your logic relies on them inside EJS
      getStatusText: (s) => s, 
      getProgressWidth: (s) => 10
    });

  } catch (err) {
    console.error("❌ Error loading user profile:", err);
    res.redirect('/');
  }
});

// Logout Route
router.get('/logout', middleware.isLoggedIn, function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/user/signup');
  });
});

router.use('/', middleware.isNotLoggedIn, function(req, res, next) {
  next();
});

// Signup GET
router.get('/signup', async function(req, res, next) {
  try {
    var messages = req.flash('error');
    const eventIdPageView = generateEventId();
    const userData = getCleanUserData(req);

if (userData) {
  await sendFacebookCAPIEvent({
    eventName: "PageView",
    eventId: eventIdPageView,
    userData,
    eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
    testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
  });
}

    res.render('user/signup', {
      csrfToken: req.csrfToken(),
      messages: messages,
      req: req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Signup POST
router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), async function(req, res, next) {
  try {
    // 1. Generate Event ID
    const completeRegistrationEventId = generateEventId();
    req.session.completeRegistrationEventId = completeRegistrationEventId;
    
    // 2. LINK GUEST ORDERS (Crucial Step)
    if (req.user && req.user.numero) {
      await Order.linkGuestOrdersToUser(req.user.numero, req.user._id);
    }
    
    // 3. Send CAPI Event
    const userData = getCleanUserData(req);
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "CompleteRegistration",
        eventId: completeRegistrationEventId,
        userData,
        customData: {
          content_name: "User Registration",
          status: "registered",
          currency: "DZD"
        },
        eventSourceUrl: `https://${req.get("host")}/user/signup`,
        testEventCode: process.env.FB_TEST_EVENT_CODE
      });
    }

    res.render('user/welcome', {
      csrfToken: req.csrfToken(),
      user: req.user,
      completeRegistrationEventId: completeRegistrationEventId,
      req: req
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.redirect('/user/signup');
  }
});

router.get('/signin', async function(req, res, next) {
  try {
    var messages = req.flash('error');
    const eventIdPageView = generateEventId();
    const userData = getCleanUserData(req);

    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
      });
    }

    res.render('user/signin', {
      csrfToken: req.csrfToken(),
      messages: messages,
      req: req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });
  } catch (err) {
    console.error("❌ Signin PageView Error:", err);
    res.redirect('/');
  }
});


// ==========================================
// 2. SIGNIN POST (Updated to Link Orders)
// ==========================================
router.post('/signin', passport.authenticate('local-signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), async function(req, res, next) {
    
    // ✅ NEW LOGIC: When user successfully logs in, check for guest orders
    try {
        if (req.user && req.user.numero) {
            console.log(`👤 User logged in: ${req.user.firstName}. Checking for guest orders...`);
            
            // Execute the linking logic defined in your Order model
            const result = await Order.linkGuestOrdersToUser(req.user.numero, req.user._id);
            
            if (result.modifiedCount > 0) {
                console.log(`🔗 Successfully linked ${result.modifiedCount} previous guest orders to this account.`);
            }
        }
    } catch (error) {
        console.error("⚠️ Error linking guest orders on signin:", error);
        // We do not stop the login process if this fails
    }

    // Standard Redirect Logic
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
});
// ⚠️ requireAdmin est un PLACEHOLDER — à ajuster une fois que j'ai vu ton models/user.js.
// Par défaut ça vérifie req.user.isAdmin, ce qui ne bloquera RIEN si ce champ n'existe pas.
function requireAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.isAdmin) return next();
  return res.status(403).send("Accès refusé");
}

const WINDOW_MS = 24 * 60 * 60 * 1000;

// Liste des conversations (une ligne par numéro, dernier message en premier)
router.get('/admin/whatsapp', requireAdmin, async (req, res) => {
  try {
    const conversations = await WhatsAppMessage.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: '$phone',
          customerName: { $first: '$customerName' },
          lastText: { $first: '$text' },
          lastDirection: { $first: '$direction' },
          lastAt: { $first: '$createdAt' },
          unread: { $sum: { $cond: [{ $and: [{ $eq: ['$direction','in'] }, { $eq: ['$read', false] }] }, 1, 0] } }
      }},
      { $sort: { lastAt: -1 } }
    ]);
    res.render('admin/whatsapp-inbox', { conversations, user: req.user });
  } catch (err) {
    console.error("❌ WhatsApp inbox error:", err);
    res.status(500).send("Server Error");
  }
});

// Thread d'une conversation + formulaire de réponse
router.get('/admin/whatsapp/:phone', requireAdmin, async (req, res) => {
  try {
    const phone = req.params.phone;
    const messages = await WhatsAppMessage.find({ phone }).sort({ createdAt: 1 }).lean();
    if (messages.length === 0) return res.status(404).send("Conversation introuvable");

    await WhatsAppMessage.updateMany({ phone, direction: 'in', read: false }, { $set: { read: true } });

    const lastInbound = [...messages].reverse().find(m => m.direction === 'in');
    const withinWindow = lastInbound ? (Date.now() - new Date(lastInbound.createdAt).getTime()) < WINDOW_MS : false;

    res.render('admin/whatsapp-thread', {
      phone,
      customerName: messages[messages.length - 1].customerName || phone,
      messages,
      withinWindow,
      user: req.user
    });
  } catch (err) {
    console.error("❌ WhatsApp thread error:", err);
    res.status(500).send("Server Error");
  }
});

// Envoi de la réponse
router.post('/admin/whatsapp/:phone/reply', requireAdmin, async (req, res) => {
  try {
    const phone = req.params.phone;
    const text = (req.body.text || '').trim();
    if (!text) {
      req.flash('error', 'Message vide.');
      return res.redirect(`/admin/whatsapp/${phone}`);
    }

    await axios.post(`https://graph.facebook.com/v19.0/${process.env.META_PHONE_ID}/messages`, {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: text }
    }, {
      headers: { Authorization: `Bearer ${process.env.META_WA_TOKEN}`, 'Content-Type': 'application/json' }
    });

    await WhatsAppMessage.create({ phone, direction: 'out', text });
    res.redirect(`/admin/whatsapp/${phone}`);
  } catch (err) {
    console.error("❌ WhatsApp reply error:", err.response?.data || err.message);
    // Cas le plus probable : la fenêtre de 24h est dépassée, WhatsApp refuse les messages libres
    req.flash('error', "Échec de l'envoi — le client n'a peut-être pas écrit depuis plus de 24h (WhatsApp bloque alors les messages libres, seuls les modèles pré-approuvés passent).");
    res.redirect(`/admin/whatsapp/${req.params.phone}`);
  }
});
module.exports = router;
