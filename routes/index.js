const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
var express = require('express')
var router = express.Router()
var Cart = require("../models/cart");
const getMetaUserData = require('../utils/metaUserData');
const sendMetaCAPIEvent = require('../services/metaCapi');
const nodemailer = require('nodemailer');
const axios = require('axios');
const User = require('../models/user'); // ✅ ADD THIS LINE
const getCleanUserData = require('../utils/userData');
const sendFacebookCAPIEvent = require('../services/facebookCapi'); // NEW: Official SDK
const { createPayment, verifyPayment } = require('../helpers/chargily');

require('dotenv').config();
const twilio = require('twilio');
const Notification = require('../models/notification');
var Producthome = require('../models/producthome');
var Paintello = require('../models/paintello');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const Order = require('../models/order');
const Powers = require('../models/powers');
const middleware = require('../middleware');
const ReturnRequest = require('../models/ReturnRequest');
const { isLoggedIn } = require('../middleware/index');
const mongoose = require('mongoose');

const { sendAdminOrderEmail, sendClientReplyEmail, sendReturnConfirmationEmail } = require('../utils/mailer');
var Blue = require('../models/blue');
var Pink = require('../models/pink');
var Grey = require('../models/grey');
var Green = require('../models/green');
var Yelloow = require('../models/yelloow');
var Neutral = require('../models/neutral');
const passport = require('passport');

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/');
  });

// Politique de confidentialité
router.get('/privacy', async (req, res) => {
  try {
    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (PRIVACY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
      });

      console.log("✅ Privacy Policy PageView sent");
      
      // ✅ Log test event code if used
      if (req.query.test_event_code) {
        console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
      }
    } else {
      console.log("🤖 Bot detected – Privacy Policy PageView skipped");
    }

    res.render('privacy', {
      title: 'Politique de Confidentialité',
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });
  } catch (err) {
    console.error("❌ Error loading privacy policy page:", err);
    res.status(500).send("Error loading privacy policy");
  }
});

// Conditions générales d’utilisation
router.get('/terms', async (req, res) => {
  try {
    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (TERMS PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
      });

      console.log("✅ Terms & Conditions PageView sent");
      
      // ✅ Log test event code if used
      if (req.query.test_event_code) {
        console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
      }
    } else {
      console.log("🤖 Bot detected – Terms & Conditions PageView skipped");
    }

    res.render('terms', {
      title: 'Conditions Générales d\'Utilisation',
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });
  } catch (err) {
    console.error("❌ Error loading terms & conditions page:", err);
    res.status(500).send("Error loading terms & conditions");
  }
});

var furniteur = require('../models/furniteur');
var rug = require('../models/rug');
var cuisin = require('../models/cuisin');
var clean = require('../models/clean');
var coat = require('../models/coat');
var sample = require('../models/sample');
var tool = require('../models/tool');




var Cart = require("../models/cart");

var sale = require('../models/saleH');
var header = require('../models/header');
var shipping = require('../models/shipping');


router.get("/coulors/blue", async function(req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;
      
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
      });

      console.log("✅ Blue Colors PageView sent");
      
      // ✅ Log test event code if used
      if (req.query.test_event_code) {
        console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
      }
    } else {
      console.log("🤖 Bot detected – Blue Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/blue", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/blue:", err);
    res.status(500).send("Error loading page");
  }
});
router.get("/blue/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const blue = await Blue.findById(cleanId);
    
    // ✅ Check if product exists
    if (!blue) {
      return res.status(404).send("Product not found");
    }

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;
      const testEventCode = req.query.test_event_code || process.env.FB_TEST_EVENT_CODE; // ✅ Facebook Test Event Code

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl,
        testEventCode // ✅ Pass test event code
      });

      // ✅ 2. ViewContent (PRODUCT DATA)
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: blue.title,
          content_ids: [blue.id],
          contents: [{
            id: blue.id,
            quantity: 1,
            item_price: blue.price
          }],
          content_type: "blue_paint",
          value: blue.price,
          currency: "DZD"
        },
        eventSourceUrl,
        testEventCode // ✅ Pass test event code
      });

      console.log("✅ PageView + ViewContent sent (human user)");
      
      // ✅ Log test event code if used
      if (testEventCode) {
        console.log(`🔬 Facebook Test Event Code: ${testEventCode}`);
        console.log("📊 Testing events in Facebook Events Manager...");
      }
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/blue", {
      blue,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated(),
      testEventCode: req.query.test_event_code // Pass to template if needed
    });

  } catch (err) {
    console.error("❌ Error loading blue product:", err);
    res.status(500).send("Error loading product");
  }
});

router.get("/add-to-cart-blue/:id", async function(req, res) {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const blueId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const blue = await Blue.findById(blueId);

    if (!blue) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(blue, blue.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();
    
    // ✅ Get Facebook Test Event Code
    const testEventCode = process.env.FB_TEST_EVENT_CODE;

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: blue.title,
        content_ids: [blue.id],
        contents: [
          {
            id: blue.id,
            quantity,
            item_price: blue.price
          }
        ],
        content_type: "blue_paint",
        value: blue.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
      testEventCode // ✅ Facebook Test Event Code
    });

    console.log("✅ AddToCart sent with synced Event ID");
    
    // ✅ Log test event code if used
    if (testEventCode) {
      console.log(`🔬 Facebook Test Event Code Used: ${testEventCode}`);
      console.log("📊 Check Facebook Events Manager for test events!");
    }

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/coulors/greens", async function(req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Green Colors PageView sent");
    } else {
      console.log("🤖 Bot detected – Green Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/greens", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/greens:", err);
    res.status(500).send("Error loading page");
  }
});
router.get("/green/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const green = await Green.findById(cleanId);
    
    // ✅ Check if product exists
    if (!green) {
      return res.status(404).send("Product not found");
    }

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // ✅ 2. ViewContent (PRODUCT DATA)
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: green.title,
          content_ids: [green.id],
          contents: [{
            id: green.id,
            quantity: 1,
            item_price: green.price
          }],
          content_type: "green_paint",
          value: green.price,
          currency: "DZD"
        },
        eventSourceUrl
      });

      console.log("✅ PageView + ViewContent sent (human user)");
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/green", {
      green,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated()
    });

  } catch (err) {
    console.error("❌ Error loading green product:", err);
    res.status(500).send("Error loading product");
  }
});
router.get("/add-to-cart-green/:id", async function(req, res) {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const greenId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const green = await Green.findById(greenId);

    if (!green) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(green, green.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: green.title,
        content_ids: [green.id],
        contents: [
          {
            id: green.id,
            quantity,
            item_price: green.price
          }
        ],
        content_type: "green_paint",
        value: green.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
    });

    console.log("✅ AddToCart sent with synced Event ID");

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/coulors/grey", async function(req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Grey Colors PageView sent");
    } else {
      console.log("🤖 Bot detected – Grey Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/grey", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/grey:", err);
    res.status(500).send("Error loading page");
  }
});
router.get("/grey/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const grey = await Grey.findById(cleanId);
    
    // ✅ Check if product exists
    if (!grey) {
      return res.status(404).send("Product not found");
    }

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // ✅ 2. ViewContent (PRODUCT DATA)
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: grey.title,
          content_ids: [grey.id],
          contents: [{
            id: grey.id,
            quantity: 1,
            item_price: grey.price
          }],
          content_type: "grey_paint",
          value: grey.price,
          currency: "DZD"
        },
        eventSourceUrl
      });

      console.log("✅ PageView + ViewContent sent (human user)");
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/grey", {
      grey,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated()
    });

  } catch (err) {
    console.error("❌ Error loading grey product:", err);
    res.status(500).send("Error loading product");
  }
});
router.get("/add-to-cart-grey/:id", async function(req, res) {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const greyId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const grey = await Grey.findById(greyId);

    if (!grey) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(grey, grey.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: grey.title,
        content_ids: [grey.id],
        contents: [
          {
            id: grey.id,
            quantity,
            item_price: grey.price
          }
        ],
        content_type: "grey_paint",
        value: grey.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
    });

    console.log("✅ AddToCart sent with synced Event ID");

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});
  router.get("/coulors/yellowv2", async function(req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Yellow Colors PageView sent");
    } else {
      console.log("🤖 Bot detected – Yellow Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/yellowv2", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/yellowv2:", err);
    res.status(500).send("Error loading page");
  }
});
router.get("/yelloow/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const yelloow = await Yelloow.findById(cleanId);
    
    // ✅ Check if product exists
    if (!yelloow) {
      return res.status(404).send("Product not found");
    }

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // ✅ 2. ViewContent (PRODUCT DATA)
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: yelloow.title,
          content_ids: [yelloow.id],
          contents: [{
            id: yelloow.id,
            quantity: 1,
            item_price: yelloow.price
          }],
          content_type: "yellow_paint",
          value: yelloow.price,
          currency: "DZD"
        },
        eventSourceUrl
      });

      console.log("✅ PageView + ViewContent sent (human user)");
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/yelloow", {
      yelloow,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated()
    });

  } catch (err) {
    console.error("❌ Error loading yellow product:", err);
    res.status(500).send("Error loading product");
  }
});
router.get("/add-to-cart-yelloow/:id", async function(req, res) {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const yelloowId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const yelloow = await Yelloow.findById(yelloowId);

    if (!yelloow) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(yelloow, yelloow.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: yelloow.title,
        content_ids: [yelloow.id],
        contents: [
          {
            id: yelloow.id,
            quantity,
            item_price: yelloow.price
          }
        ],
        content_type: "yellow_paint",
        value: yelloow.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
    });

    console.log("✅ AddToCart sent with synced Event ID");

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/coulors/pink", async function(req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Pink Colors PageView sent");
    } else {
      console.log("🤖 Bot detected – Pink Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/pink", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/pink:", err);
    res.status(500).send("Error loading page");
  }
});

router.get("/pink/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const pink = await Pink.findById(cleanId);
    
    // ✅ Check if product exists
    if (!pink) {
      return res.status(404).send("Product not found");
    }

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // ✅ 2. ViewContent (PRODUCT DATA)
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: pink.title,
          content_ids: [pink.id],
          contents: [{
            id: pink.id,
            quantity: 1,
            item_price: pink.price
          }],
          content_type: "pink_paint",
          value: pink.price,
          currency: "DZD"
        },
        eventSourceUrl
      });

      console.log("✅ PageView + ViewContent sent (human user)");
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/pink", {
      pink,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated()
    });

  } catch (err) {
    console.error("❌ Error loading pink product:", err);
    res.status(500).send("Error loading product");
  }
});

router.get("/add-to-cart-pink/:id", async function(req, res) {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const pinkId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const pink = await Pink.findById(pinkId);

    if (!pink) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(pink, pink.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: pink.title,
        content_ids: [pink.id],
        contents: [
          {
            id: pink.id,
            quantity,
            item_price: pink.price
          }
        ],
        content_type: "pink_paint",
        value: pink.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
    });

    console.log("✅ AddToCart sent with synced Event ID");

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/coulors/neutral", async function (req, res) {
  try {
    const headers = await header.find({});

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (CATEGORY PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Neutral Colors PageView sent");
    } else {
      console.log("🤖 Bot detected – Neutral Colors PageView skipped");
    }

    // ✅ Render page
    res.render("coulors/neutral", {
      headers,
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading coulors/neutral:", err);
    res.status(500).send("Error loading page");
  }
});


router.get("/neutral/:id", async (req, res) => {
  try {
    const neutral = await Neutral.findById(req.params.id);

    // ✅ Generate Event IDs (server authority)
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    const eventIdCheckout = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // ✅ 1. PageView (MINIMAL)
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // ✅ 2. ViewContent (PRODUCT DATA) - Added content_name like producthome route
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: neutral.title, // Assuming neutral has a title field
          content_ids: [neutral.id],
          contents: [{
            id: neutral.id,
            quantity: 1,
            item_price: neutral.price
          }],
          content_type: "neutral_paint",
          value: neutral.price,
          currency: "DZD"
        },
        eventSourceUrl
      });

      console.log("✅ PageView + ViewContent sent (human user)");
    } else {
      console.log("🤖 Bot detected – no CAPI events sent");
    }

    // ✅ Store future funnel Event IDs
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
      checkout: eventIdCheckout
    };

    // ✅ Render page with consistent meta event IDs naming
    res.render("event/neutral", {
      neutral,
      req,
      metaEventIdView: eventIdView,        // Changed from metaEventIdViewContent
      metaEventIdCart: eventIdCart,
      metaEventIdCheckout: eventIdCheckout,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      login: req.isAuthenticated()
    });

  } catch (err) {
    console.error("❌ Error loading neutral product:", err);
    res.status(500).send("Error loading product");
  }
});

router.get("/add-to-cart-neutral/:id", async function (req, res) {
  try {
    const neutralId = req.params.id;
    const quantity = parseInt(req.query.qty) || 1;
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const neutral = await Neutral.findById(neutralId);

    // ✅ Add quantity correctly
    for (let i = 0; i < quantity; i++) {
      cart.add(neutral, neutral.id);
    }
    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: neutral.title, // Added content_name like the second example
        content_ids: [neutral.id],
        contents: [
          {
            id: neutral.id,
            quantity,
            item_price: neutral.price
          }
        ],
        content_type: "neutral_paint",
        value: neutral.price * quantity,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
    });

    console.log("✅ AddToCart sent with synced Event ID");

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;
    
    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});


router.get("/shop", async (req, res) => {
  try {
    const cart = new Cart(req.session.cart || {});
    const shippings = await shipping.find({});

    // ✅ Generate Event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Shop PageView sent");
    } else {
      console.log("🤖 Bot detected – Shop PageView skipped");
    }

    // ✅ Optional: pending Meta event cleanup (kept as-is)
    const metaEvent = req.session.metaEventData
      ? { id: req.session.metaEventId, ...req.session.metaEventData }
      : null;

    if (req.session.metaEventData) {
      delete req.session.metaEventId;
      delete req.session.metaEventData;
    }

    // ✅ Generate products array from cart
    const products = cart.generateArray ? cart.generateArray() : [];
    const totalPrice = cart.totalPrice || 0;
    const totalQty = cart.totalQty || 0;

    // ✅ Render shop page - PASS THE CART OBJECT!
    res.render("event/shop", {
      metaEvent,
      cart: cart,  // 👈 ADD THIS LINE - Pass the cart object
      products: products,
      shippings,
      totalPrice: totalPrice,
      totalQty: totalQty,  // 👈 Optional: Pass totalQty separately
      user: req.user || null,
      req,
      metaEventIdPageView: eventIdPageView
    });

  } catch (err) {
    console.error("❌ Error in /shop route:", err);
    res.status(500).send("Error loading shop");
  }
});

router.get("/", async function (req, res) {
  try {
    const successMsg = req.flash("success")[0];
    const headers = await header.find({});

    // ✅ Generate Event ID (server authority)
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`
      });

      console.log("✅ Home PageView sent");
    } else {
      console.log("🤖 Bot detected – Home PageView skipped");
    }

    // ✅ Render page
    res.render("event/home", {
      headers,
      req,
      successMsg,
      metaEventIdPageView: eventIdPageView,
      user: req.user
    });

  } catch (err) {
    console.error("❌ Error loading home page:", err);
    res.status(500).send("Error loading page");
  }
});

    
        router.get('/reduce/:id', function (req, res, next) {
            const productId = req.params.id;
            const cart = new Cart(req.session.cart ? req.session.cart : {});
            cart.reduceByOne(productId);
            req.session.cart = cart;
            res.redirect('/shop');
        });
        
        router.get('/remove/:id', function (req, res, next) {
            const productId = req.params.id;
            const cart = new Cart(req.session.cart ? req.session.cart : {});
            cart.removeItem(productId);
            req.session.cart = cart;
            res.redirect('/shop');
        });
// Cart routes - make sure they work with discounted items
router.post("/cart/increase/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!req.session.cart) {
      return res.json({ success: false, error: "Cart not found" });
    }
    
    const cart = new Cart(req.session.cart);
    
    // Check if this is a discounted item
    const item = cart.items[productId];
    if (item && item.isDiscounted) {
      // Handle discounted item
      cart.addDiscounted(item.item, productId, item.discountPercent || 0.3);
    } else {
      // Handle regular item
      cart.increaseQty(productId);
    }
    
    req.session.cart = cart;
    
    res.json({
      success: true,
      qty: cart.items[productId]?.qty || 0,
      itemTotal: cart.items[productId]?.price || 0,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
      hasDiscountChanged: false
    });
  } catch (error) {
    console.error("Increase cart error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add this to your cart routes (where you handle remove, decrease, etc.)
router.post("/cart/remove/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!req.session.cart) {
      return res.json({ success: false, error: "Cart not found" });
    }
    
    const cart = new Cart(req.session.cart);
    
    // Check if this is a main product that has a discounted item
    const item = cart.items[productId];
    
    if (item && !item.isDiscounted) {
      // This is a main product - check if there's any discounted item that depends on it
      const hasDiscountedItem = Object.values(cart.items).some(
        cartItem => cartItem.isDiscounted && 
                   cartItem.discountedWith === productId
      );
      
      if (hasDiscountedItem) {
        return res.json({ 
          success: false, 
          error: "Cannot remove main product while discounted item is in cart. Please remove the discounted item first or remove both together." 
        });
      }
    }
    
    // Remove item
    cart.removeItem(productId);
    
    req.session.cart = cart;
    
    res.json({
      success: true,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty
    });
    
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Also update the decrease route
router.post("/cart/decrease/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!req.session.cart) {
      return res.json({ success: false, error: "Cart not found" });
    }
    
    const cart = new Cart(req.session.cart);
    
    // Check if item exists
    if (!cart.items[productId]) {
      return res.json({ success: false, error: "Item not in cart" });
    }
    
    const item = cart.items[productId];
    
    // If this is a main product and we're decreasing to 0 (removing it)
    if (!item.isDiscounted && item.qty === 1) {
      // Check if there's a discounted item that depends on it
      const hasDiscountedItem = Object.values(cart.items).some(
        cartItem => cartItem.isDiscounted && 
                   cartItem.discountedWith === productId
      );
      
      if (hasDiscountedItem) {
        return res.json({ 
          success: false, 
          error: "Cannot remove main product while discounted item is in cart." 
        });
      }
    }
    
    // Handle decrease
    cart.decreaseQty(productId);
    
    req.session.cart = cart;
    
    res.json({
      success: true,
      qty: cart.items[productId]?.qty || 0,
      itemTotal: cart.items[productId]?.price || 0,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
      hasDiscountChanged: false
    });
    
  } catch (error) {
    console.error("Decrease cart error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post("/cart/remove-both", async (req, res) => {
  try {
    const { mainProductId, discountedProductId } = req.body;
    
    if (!req.session.cart) {
      return res.json({ success: false, error: "Cart not found" });
    }
    
    const cart = new Cart(req.session.cart);
    
    // Remove both items
    cart.removeItem(mainProductId);
    cart.removeItem(discountedProductId);
    
    req.session.cart = cart;
    
    res.json({
      success: true,
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty
    });
    
  } catch (error) {
    console.error("Remove both error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
        
router.get("/checkout", async function (req, res) {
  if (!req.session.cart) {
    return res.redirect("/shop");
  }

  const cart = new Cart(req.session.cart);
  const errMsg = req.flash("error")[0];

  // ✅ Calculate discount information
  let discountAmount = 0;
  let totalBeforeDiscount = 0;
  let hasDiscount = false;
  
  // Calculate discount details
  if (cart.items) {
    for (const id in cart.items) {
      const item = cart.items[id];
      
      if (item.isDiscounted) {
        hasDiscount = true;
        // Calculate discount amount (30% of original price)
        const originalPrice = item.originalPrice || item.item.price;
        const discountedPrice = item.unitPrice || (item.price / item.qty);
        const discountPerUnit = originalPrice - discountedPrice;
        discountAmount += discountPerUnit * item.qty;
      }
      
      // Calculate total before discount
      const unitPrice = item.unitPrice || (item.price / item.qty);
      totalBeforeDiscount += (item.originalPrice || item.item.price) * item.qty;
    }
  }
  
  const totalAfterDiscount = cart.totalPrice;
  
  // ✅ Always generate Event IDs (server authority)
  const eventIdPageView = generateEventId();
  const eventIdInitiateCheckout = generateEventId();

  try {
    // ✅ BOT-SAFE user data (DO NOT build manually)
    const userData = getCleanUserData(req);

    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;

      // =============================
      // 1. PageView (MINIMAL)
      // =============================
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl
      });

      // =============================
      // 2. Prepare cart contents for Facebook
      // =============================
      const contents = [];
      const content_ids = [];

      if (cart.items) {
        for (const id in cart.items) {
          const item = cart.items[id];
          const productId = item.item._id || item.item.id;
          const unitPrice = item.unitPrice || (item.price / item.qty);

          contents.push({
            id: productId,
            quantity: item.qty,
            item_price: unitPrice  // Use unit price, not total price
          });

          content_ids.push(productId);
        }
      }
      
      const testEventCode = req.query.test_event_code || process.env.FB_TEST_EVENT_CODE;
      
      // =============================
      

      console.log("✅ Checkout events sent (human user)", {
        pageView: eventIdPageView,
        
        value: totalAfterDiscount,
        discountAmount: discountAmount,
        items: cart.totalQty
      });

    } else {
      console.log("🤖 Bot detected – checkout CAPI skipped");
    }

  } catch (error) {
    console.error("❌ Checkout CAPI error:", error);
  }

  // ✅ Render page with discount information
  res.render("event/checkout", {
    totalPrice: totalAfterDiscount, // Already discounted total
    totalBeforeDiscount: totalBeforeDiscount, // For display
    discountAmount: discountAmount, // For display
    hasDiscount: hasDiscount, // For display
    errMsg,
    noError: !errMsg,
    cart: cart, // Pass cart object
    metaEventIdPageView: eventIdPageView,
  
    user: req.user,
    req: req // Pass req for session access in template
  });
});

          
router.post("/checkout", async function (req, res) {
  if (!req.session.cart) return res.redirect("/shop");

  const cart = new Cart(req.session.cart);
  const freeShippingThreshold = 5000;
  const wilayaShippingInfo = {
   "adrar": { fee: 800, delay: "4–6 jours", communes: ["Adrar","Reggane","Aoulef","Timimoun","Zaouiet Kounta","Fenoughil","Bouda","Tamentit","Sali","Tsabit","In Zghmir","Ouled Ahmed Timmi", "Akabli", "Bordj Badji Mokhtar", "Charouine", "Deldoul", "Metarfa", "Ouled Aissa", "Sebaa", "Talmin", "Tamest", "Tamantit", "Tinerkouk", "Zaouiet el Arab"] },
   "chlef": { fee: 500, delay: "2–4 jours", communes: ["Chlef","Ténès","Oued Fodda","El Karimia","Sidi Akkacha","Ouled Fares","Sendjas","El Marsa","Oued Goussine","Taougrit","Zeboudja","Benairia","Herenfa","Beni Haoua","Beni Rached","Sobha","Labiod Medjadja", "Abou El Hassane", "Aïn Merane", "Beni Bouateb", "Bougouffa", "Breira", "Chettia", "Dahra", "El Hadjadj", "Harchoun", "Moussadek", "Oued Sly", "Ouled Abbes", "Ouled Ben Abdelkader", "Sidi Abderrahmane", "Tadjena", "Talassa", "Tenes", "Zeghaia"] },
  "laghouat": { fee: 650, delay: "3–5 jours", communes: ["Laghouat","Aflou","Brida","Sidi Makhlouf","Ksar El Hirane","Gueltat Sidi Saad","El Assafia","Oued Morra","Tadjmout","El Ghicha","Hassi R'Mel","Sebgag","Ain Madhi", "Benacer Ben Chohra", "El Houaita", "Hadj Mechri", "Kheneg", "Oued M'Zi", "Sidi Bouzid", "Tadjemout", "Taouiala", "Touggourt", "Zelfana"] },
  "oum el bouaghi": { fee: 550, delay: "2–4 jours", communes: ["Oum El Bouaghi","Ain Beida","Ain M'Lila","Sigus","Ain Babouche","Behir Chergui","Fkirina","Ksar Sbahi","El Fedjoudj","Souk Naamane","El Belala","Ain Kercha", "Ain Diss", "Ain Fakroun", "Ain Zitoun", "Berriche", "Bir Chouhada", "Dhalaa", "El Amiria", "El Djazia", "El Harmilia", "Fkirina", "Hanchir Toumghani", "Meskiana", "Oued Nini", "Ouled Gacem", "Ouled Hamla", "Ouled Zouai", "Rahia", "Souk Naamane", "Zorg"] },
  "batna": { fee: 550, delay: "2–4 jours", communes: ["Batna","Timgad","Barika","Merouana","N Gaous","Arris","Ain Touta","Seriana","Chemora","Djerma","Fesdis","Ouled Fadel","Oued Chaaba","El Madher","Tazoult", "Ain Djasser", "Ain Yagout", "Arris", "Azil Abderrahmane", "Boulhilat", "Boumaguer", "Bouzina", "Chir", "Djezzar", "El Hassi", "Foum Toub", "Ghassira", "Gosbat", "Guigba", "Hidoussa", "Ichemoul", "Inoughissen", "Kimmel", "Lazrou", "M'doukel", "Menaa", "Oued El Ma", "Ouled Ammar", "Ouled Aouf", "Ouled Sellem", "Ouled Si Slimane", "Rahbat", "Ras El Aioun", "Sefiane", "Seggana", "Talkhamt", "Taxlent", "Teniet El Abed", "Tighanimine", "Tilatou", "Timgad", "Tkout", "Zanet El Beida"] },
  "bejaia": {
  fee: 500,
  delay: "2–3 jours",
  communes: [
    "Sidi Aïch","Aït-Smail","Akbou","Akfadou","Amalou", "Amizour","Barbacha","Chellata","Darguina","Draâ El-Kaïd","Leflaye","Feraoun","Ighram","Kendira","Kherrata","Melbou","Ouzellaguen","Seddouk","Souk Oufella","Sidi Ayad","Tamokra","Tamridjet","Taskriout","Tazmalt","Tibane","Tichy","Tifra","Toudja","Tizi N'Berber","Bouhamza","Boukhelifa","Aït Mellikeche","Beni Djellil","Beni Ksila","Beni Maouche","Ighil Ali","Fenaïa Ilmaten","Oued Ghir","Souk El Ténine","Taourirt Ighil","Tinebdar","Timezrit","Tala Hamza","Adekar","Boudjellil","Chemini","Aït R'zine","Aokas","Bejaia","El Kseur"
  ]
},
  "biskra": { fee: 600, delay: "3–5 jours", communes: ["Biskra","El Kantara","Sidi Okba","Tolga","Ouled Djellal","Mekhadma","Zeribet El Oued","Ourlal","Chetma","El Haouch","Doucen","Foughala","Branis", "Ain Naga", "Ain Zaatout", "Bordj Ben Azzouz", "Bouchagroune", "Chaiba", "Djemorah", "El Feidh", "El Hadjab", "El Outaya", "Khenguet Sidi Nadji", "Lioua", "M'Chouneche", "M'Lili", "Oumache", "Oum Laadham", "Sidi Khaled", "Tolga", "Zeribet el Oued"] },
  "bechar": { fee: 750, delay: "4–6 jours", communes: ["Bechar","Kenadsa","Beni Ounif","Taghit","Abadla","Ouled Khoudir","Erg Ferradj","Beni Abbes","Timoudi","Tamtert","Igli", "Boukais", "El Ouata", "Meridja", "Mogheul", "Tabelbala"] },
  "blida": { fee: 300, delay: "1–2 jours", communes: ["Blida","Boufarik","Bouinan","Ouled Yaich","Beni Mered","Chebli","Mouzaïa","Meftah","Oued El Alleug","Larbaa","Chréa","Soumaa","El Affroun", "Ain Romana", "Ben Khlil", "Beni Tamou", "Bouarfa", "Bougara", "Bouinan", "Chemini", "Djebabra", "El Hamdania", "Guerrouaou", "Hammam Melouane", "Mouzaia", "Oued Djer", "Ouled Selama", "Souhane", "Tamesguida"] },
  "bouira": { fee: 450, delay: "2–3 jours", communes: ["Bouira","Ain Turk","El Asnam","Sour El Ghozlane","Lakhdaria","Bechloul","Haizer","Bir Ghbalou","Taghzout","El Hachimia","Dirah","El Khabouzia","Maamora", "Aghbalou", "Ahl El Ksar", "Ain Bessam", "Ain El Hadjar", "Ait Laaziz", "Aomar", "Bordj Okhriss", "Bouderbala", "Boukram", "Chorfa", "Dechmia", "Djebahia", "El Adjiba", "El Hakimia", "El Ksour", "Guerrouma", "Hadjera Zerga", "Hanif", "Kadiria", "Lakhdaria", "M'Chedellah", "Mezdour", "Oued El Berdi", "Ouled Rached", "Raouraoua", "Ridane", "Saharidj", "Souk El Khemis", "Taguedit", "Z'barbar"] },
  "tamanrasset": { fee: 900, delay: "5–8 jours", communes: ["Tamanrasset","In Guezzam","In Salah","Tin Zaouatine","Abalessa", "Ain Guezzam", "Ain Salah", "Foggaret Ezzoua", "Idles", "Tazrouk"] },
  "tebessa": { fee: 600, delay: "3–5 jours", communes: ["Tebessa","Bir El Ater","Cheria","El Aouinet","El Kouif","Negrine","Bir Mokadem","El Malabiod","Boukhadra","Morsott", "Ain Zerga", "Bedjene", "Bekkaria", "Bir Dheheb", "Boulhaf Dyr", "El Meridj", "El Ogla", "Ferkane", "Guorriguer", "Hammamet", "Maafa", "Mechroha", "Ouenza", "Oum Ali", "Saf Saf El Ouesra", "Stah Guentis", "Telidjen", "Youkous Les"] },
  "tlemcen": { fee: 500, delay: "2–4 jours", communes: ["Tlemcen","Maghnia","Remchi","Hennaya","Sabra","Chetouane","Ghazaouet","Nedroma","Ain Fezza","Ain Tallout","Bensekrane", "Ain Fetah", "Ain Ghoraba", "Ain Kebira", "Ain Nehala", "Ain Tellout", "Ain Youcef", "Amieur", "Azails", "Bab El Assa", "Beni Bahdel", "Beni Boussaid", "Beni Mester", "Beni Ouarsous", "Beni Semiel", "Beni Snous", "Bouhlou", "Chetouane", "Dar Yaghmouracene", "Djebala", "El Aricha", "El Bouihi", "El Gor", "Fellaoucene", "Hammam Boughrara", "Hennaya", "Honaïne", "Marsa Ben M'Hidi", "Msirda", "Nador", "Oued Lakhdar", "Ouled Mimoun", "Ouled Riyah", "Sebbaa Chioukh", "Sebdou", "Sidi Abdelli", "Sidi Djillali", "Sidi Medjahed", "Souani", "Souahlia", "Terni", "Zenet"] },
  "tiaret": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Tiaret", "Sougueur", "Meghila", "Mahdia", "Aïn Bouchekif", "Rahouia", "Medroussa", "Frenda", "Sidi Ali Mellal", "Oued Lilli", "Aïn Deheb", "Aïn Kermes", "Dahmouni", "Djebilet Rosfa", "Faidja", "Guertoufa", "Hamadia", "Ksar Chellala", "Madna", "Mechraa Sfa", "Medrissa", "Mellakou", "Nadorah", "Naima", "Oued Lilli", "Rechaiga", "Sebaine", "Sebt", "Serghine", "Si Abdelghani", "Sidi Abderrahmane", "Sidi Bakhti", "Sidi Hosni", "Takhemaret", "Tidda", "Tousnina", "Zmalet El Emir Abdelkader"]
  },
  "tizi ouzou": {
    fee: 400,
    delay: "2–3 jours",
    communes: ["Tizi Ouzou", "Azazga", "Aït Yahia", "Larbaâ Nath Irathen", "Ouaguenoun", "Draâ El Mizan", "Makouda", "Freha", "Illoula Oumalou", "Iferhounène", "Tigzirt", "Azeffoun", "Abi Youcef", "Aghrib", "Aïn El Hammam", "Aït Aggouacha", "Aït Bouaddou", "Aït Chafâa", "Aït Khelili", "Aït Mahmoud", "Aït Oumalou", "Aït Toudert", "Aït Yahia Moussa", "Akbil", "Akerrou", "Assi Youcef", "Beni Aïssi", "Beni Douala", "Beni Yenni", "Boghni", "Boudjima", "Bounouh", "Bouzeguène", "Draâ Ben Khedda", "Frikat", "Iboudrarene", "Idjeur", "Iflissen", "Mechtras", "Mizrana", "Ouacif", "Ouadhia", "Oued Aïssi", "Sidi Naâmane", "Souk El Thenine", "Tadmaït", "Timizart", "Tirmitine", "Yakouren", "Zekri"]
  },
  "algiers": {
    fee: 300,
    delay: "1–2 jours",
    communes: ["Alger-Centre", "Sidi M'Hamed", "El Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche", "Bir Mourad Raïs", "El Biar", "Bouzareah", "Birkhadem", "El Harrach", "Baraki", "Oued Smar", "Bachdjerrah", "Hussein Dey", "Kouba", "Bourouba", "Dar El Beïda", "Bab Ezzouar", "Ben Aknoun", "Dely Ibrahim", "Hammamet", "Raïs Hamidou", "Djasr Kasentina", "El Mouradia", "Hydra", "Mohammadia", "Bordj El Kiffan", "El Magharia", "Beni Messous", "Les Eucalyptus", "Birtouta", "Tessala El Merdja", "Ouled Chebel", "Sidi Moussa", "Aïn Taya", "Bordj El Bahri", "El Marsa", "H'Raoua", "Rouïba", "Reghaïa", "Aïn Benian", "Staoueli", "Zeralda", "Mahelma", "Rahmania", "Souidania", "Cheraga", "Ouled Fayet", "El Achour", "Draria", "Douera", "Baba Hassen", "Khraicia", "Saoula"]
  },
  "djelfa": {
    fee: 600,
    delay: "3–5 jours",
    communes: ["Djelfa", "Hassi Bahbah", "Aïn Oussera", "Dar Chioukh", "El Idrissia", "Charef", "Messaad", "Zaâfrane", "El Khemis", "Guernini", "Aïn Chouhada", "Aïn El Ibel", "Aïn Fekka", "Aïn Maabed", "Aïn Oussera", "Amourah", "Ben Haroun", "Beni Yagoub", "Birine", "Bouira Lahdab", "Douis", "El Guedid", "Faidh El Botma", "Guettara", "Had Sahary", "Hassi Fedoul", "Hassi Lazreg", "Moudjebara", "Oum Laadham", "Sed Rahal", "Selmana", "Sidi Baïzid", "Sidi Ladjel", "Tadmit", "Zaccar"]
  },
  "jijel": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Jijel", "Taher", "El Aouana", "Texenna", "Chekfa", "Ziama Mansouriah", "El Milia", "Settara", "Aïn El Kebira", "Aïn Errich", "Bordj T'har", "Boudria Ben Yadjis", "Bouraoui Belhadef", "Boussif Ouled Askeur", "Chahna", "Djimla", "El Ancer", "El Kennar Nouchfi", "Emir Abdelkader", "Erraguene", "Ghebala", "Kaous", "Kheïri Oued Adjoul", "Oudjana", "Ouled Rabah", "Ouled Yahia Khadrouche", "Selma Benziada", "Sidi Abdelaziz", "Sidi Marouf", "Sidi Maârouf"]
  },
  "setif": {
    fee: 550,
    delay: "2–4 jours",
    communes: ["Sétif", "El Eulma", "Aïn Arnat", "Beni Ourtilane", "Babor", "Guenzet", "Bougaâ", "Aïn Oulmene", "Guidjel", "Beni Aziz", "Aïn Abessa", "Aïn Azel", "Aïn El Kebira", "Aïn Lahdjar", "Aïn Legraj", "Aïn Roua", "Aïn Sebt", "Amoucha", "Bazer Sakhra", "Beidha Bordj", "Belaa", "Bellaa", "Beni Chebana", "Beni Fouda", "Beni Hocine", "Beni Mouhli", "Bir El Arch", "Bir Haddada", "Bouandas", "Bousselam", "Dehamcha", "Djemila", "Draâ Kebila", "El Ouricia", "Guelal", "Hammam Guergour", "Hammam Souhna", "Maâouia", "Maâkla", "Mechta Ouled Bourenane", "Mezloug", "Ouled Addouane", "Ouled Sabor", "Ouled Si Ahmed", "Ouled Tebben", "Rasfa", "Salah Bey", "Serdj El Ghoul", "Tachouda", "Talaifacene", "Taya", "Tella"]
  },
  "saida": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Saïda", "Moulay Larbi", "Tircine", "Aïn El Hadjar", "Ouled Khaled", "Doui Thabet", "Hounet", "Aïn Sekhouna", "Aïn Soltane", "El Hassasna", "Maâmora", "Ouled Brahim", "Ouled Brahim", "Sidi Ahmed", "Sidi Amar", "Sidi Boubekeur", "Youb"]
  },
  "skikda": {
    fee: 550,
    delay: "2–4 jours",
    communes: ["Skikda", "Collo", "El Hadaik", "El Harrouch", "Azzaba", "Ben Azzouz", "Filfila", "Ramdane Djamel", "Oum Toub", "Aïn Bouziane", "Aïn Charchar", "Aïn Kechra", "Aïn Zouit", "Beni Bechir", "Beni Oulbane", "Beni Zid", "Bin El Ouiden", "Bouchetata", "Cheraia", "Djendel Saadi Mohamed", "Emdjez Edchich", "Es Sebt", "Grarem", "Hamadi Krouma", "Kanoua", "Kerkera", "Oued Zehour", "Ouled Attia", "Ouled Habbaba", "Ouled Hbaba", "Salah Bouchaour", "Sidi Mezghiche", "Tamalous", "Zerdazas", "Zitouna"]
  },
  "sidi bel abbes": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Sidi Bel Abbès", "Sfisef", "Mostefa Ben Brahim", "Aïn El Berd", "Tessala", "Ben Badis", "Telagh", "Merine", "Tenira", "Makedra", "Aïn Adden", "Aïn El Berd", "Aïn Kada", "Aïn Thrid", "Amarnas", "Bedrabine El Mokrani", "Belarbi", "Benachiba Chelia", "Bir El Hammam", "Boudjebaa El Bordj", "Boukhanefis", "Chetouane Belaila", "Dhaya", "El Hacaiba", "Hassi Dahou", "Hassi Zahana", "Lamtar", "M'Cid", "Marhoum", "Merdja Sidi Abed", "Mezaourou", "Moulay Slissen", "Oued Sebaa", "Oued Sefioun", "Oued Taourira", "Ras El Ma", "Redjem Demouche", "Sehala Thaoura", "Sidi Ali Benyoub", "Sidi Ali Boussidi", "Sidi Chaib", "Sidi Dahou Dehiles", "Sidi Hamadouche", "Sidi Khaled", "Sidi Lahcene", "Sidi Yacoub", "Tabia", "Tafissour", "Taoudmout", "Teghalimet", "Telagh", "Tenezara", "Zerouala"]
  },
  "guelma": {
    fee: 550,
    delay: "2–4 jours",
    communes: ["Guelma", "Bouchegouf", "Aïn Larbi", "Nechmaya", "Oued Zenati", "Bouati Mahmoud", "Belkheir", "Aïn Makhlouf", "Hammam Debagh", "Aïn Ben Beida", "Aïn Reggada", "Aïn Sandel", "Bendaoud", "Beni Mezline", "Bordj Sabat", "Dahouara", "Djeballah Khemissi", "El Fedjoudj", "Guelaat Bou Sbaa", "Hammam Maskhoutine", "Hammam N'bails", "Heliopolis", "Houari Boumediene", "Khezaras", "Medjez Amar", "Medjez Sfa", "Nadorah", "Oued Cheham", "Oued Ferragha", "Ras El Agba", "Roknia", "Sellaoua Announa", "Tamlouka"]
  },
  "constantine": {
    fee: 500,
    delay: "2–3 jours",
    communes: ["Constantine", "El Khroub", "Zighout Youcef", "Aïn Smara", "Didouche Mourad", "Ibn Ziad", "Hamma Bouziane", "Aïn Abid", "Ben Badis", "El Haria", "El Koura", "Ibn Ziad", "Messaoud Boudjeriou", "Ouled Rahmoune"]
  },
  "mostaganem": {
    fee: 450,
    delay: "2–3 jours",
    communes: ["Mostaganem", "Aïn Tedles", "Bouguirat", "Hassi Mameche", "Mesra", "Sirat", "Achaacha", "Sidi Ali", "Fornaka", "Kheïr Eddine", "Aïn Boudinar", "Aïn Nouissy", "Benabdelmalek Ramdane", "Bir El Djir", "Bouguirat", "Dar Yaghmoracene", "Fornaka", "Hadjadj", "Hassi Maameche", "Khadra", "Mansourah", "Mazagran", "Nekmaria", "Oued El Kheïr", "Ouled Boughalem", "Ouled Maallah", "Safsaf", "Sayada", "Sidi Bellater", "Sidi Lakhdar", "Souaflia", "Sour", "Stidia", "Tazgait", "Touahria"]
  },
  "msila": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["M'sila", "Ouled Derradj", "Sidi Aïssa", "Aïn El Hadjel", "Bou Saâda", "Ben Srour", "Maadid", "Hammam Dhalaâ", "Magra", "Aïn El Melh", "Aïn Fares", "Aïn Khadra", "Belaïba", "Beni Ilmane", "Benzouh", "Berhoum", "Bir Foda", "Bouti Sayah", "Chellal", "Dehahna", "Djebel Messaad", "El Hamel", "El Houamed", "Khettouti Sed El Jouli", "Khoubana", "M'Tarfa", "Menaa", "Mohamed Boudiaf", "Ouanougha", "Ouled Addi Guebala", "Ouled Atia", "Ouled Madhi", "Ouled Mansour", "Ouled Sidi Brahim", "Oultem", "Sidi Ameur", "Sidi Hadjeres", "Slim", "Souamaa", "Tamsa", "Tarmount", "Zarzour"]
  },
  "mascara": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Mascara", "Sig", "Ghriss", "Bouhanifia", "Oued Taria", "Froha", "Tizi", "El Bordj", "Zahana", "Aïn Fekan", "Aïn Ferah", "Aïn Fras", "Aïn Fekan", "Alaimia", "Aouf", "Benian", "Bou Henni", "Chorfa", "El Gaada", "El Ghomri", "El Gueitena", "El Keurt", "Ferraguig", "Gharrous", "Guerdjoum", "Hacine", "Khalouia", "Makhda", "Maoussa", "Moha Ou Ali", "Nesmoth", "Oggaz", "Oued El Abtal", "Ras El Ain Amirouche", "Sedjerara", "Sehailia", "Sidi Abdeldjebar", "Sidi Abdelmoumene", "Sidi Boussaid", "Sidi Kada", "Tighennif", "Zahana", "Zelamta"]
  },
 "ouargla": {
    fee: 700,
    delay: "4–6 jours",
    communes: ["Ouargla", "Hassi Messaoud", "Rouissat", "N'Goussa", "Sidi Khouiled", "Aïn Beida", "Touggourt", "El Hadjira", "Benaceur", "Blidet Amor", "El Alia", "El Borma", "El Haoud", "Hassi Ben Abdellah", "M'Naguer", "Nezla", "Sidi Slimane", "Taïbet"]
  },
  "oran": {
    fee: 400,
    delay: "2–3 jours",
    communes: ["Oran", "Es Senia", "Arzew", "Gdyel", "Bir El Djir", "Hassi Bounif", "Mers El Kebir", "Aïn El Turk", "Bethioua", "Sidi Chami", "Aïn Biya", "Ben Freha", "Boufatis", "Bousfer", "El Ançor", "El Braya", "El Kerma", "Hassi Ben Okba", "Hassi Bounif", "Hassi Mefsoukh", "Misserghin", "Oued Tlelat", "Sidi Benyebka", "Tafraoui"]
  },
  "el bayadh": {
    fee: 750,
    delay: "4–6 jours",
    communes: ["El Bayadh", "Bougtob", "Rogassa", "Brezina", "Labiodh Sidi Cheikh", "Chellala", "Arbaouat", "Ghassoul", "Boussemghoun", "Boualem", "Cheheima", "El Abiodh Sidi Cheikh", "El Bnoud", "El Kheither", "Kef El Ahmar", "Krakda", "Rogassa", "Sidi Ameur", "Sidi Slimane", "Sidi Tiffour", "Stitten", "Tousmouline"]
  },
  "bordj bou arreridj": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Bordj Bou Arreridj", "Rabta", "Zemmoura", "El Hamadia", "El Achir", "Hasnaoua", "Aïn Taghrout", "Djaafra", "Mansoura", "Medjana", "Aïn Tesra", "Belimour", "Ben Daoud", "Bir Kasdali", "Bordj Ghedir", "Bordj Zemmoura", "Colla", "Djerrah", "El Euch", "El M'hir", "Ghilassa", "Haraza", "Ksour", "M'Cif", "Ouled Brahem", "Ouled Dahmane", "Ouled Sidi Brahim", "Ras El Oued", "Sidi Embarek", "Taglait", "Tassameurt", "Tefreg", "Teniet En Nasr", "Tixter"]
  },
  "boumerdes": {
    fee: 350,
    delay: "1–2 jours",
    communes: ["Boumerdès", "Dellys", "Thenia", "Boudouaou", "Khemis El Khechna", "Naciria", "Si Mustapha", "Bordj Menaiel", "Ouled Moussa", "Tidjelabine", "Afir", "Ammal", "Baghlia", "Ben Choud", "Beni Amrane", "Boudouaou El Bahri", "Bouzegza Keddara", "Chabet El Ameur", "Corso", "Djinet", "Isser", "Khemis El Khechna", "Larbatache", "Leghata", "Ouled Aissa", "Ouled Hedadj", "Ouled Haddadj", "Taourga", "Timezrit", "Zemmouri"]
  },
  "el tarf": {
    fee: 600,
    delay: "3–5 jours",
    communes: ["El Tarf", "Bouhadjar", "Ben M'Hidi", "Bouteldja", "Souarekh", "El Kala", "Berrihane", "Raml Souk", "Zitouna", "Aïn El Assel", "Aïn Kerma", "Asfour", "Ben Mehdi", "Bougous", "Chebaita Mokhtar", "Chihani", "Echatt", "Zerizer", "Zitouna"]
  },
  "tindouf": {
    fee: 1000,
    delay: "6–9 jours",
    communes: ["Tindouf", "Oum El Assel"]
  },
  "tissemsilt": {
    fee: 500,
    delay: "3–5 jours",
    communes: ["Tissemsilt", "Bordj Bounaama", "Lardjem", "Beni Chaib", "Theniet El Had", "Khémisti", "Melaab", "Bordj Emir Abdelkader", "Sidi Boutouchent", "Ammari", "Beni Lahcene", "Bordj El Emir Abdelkader", "Boucaid", "Khemisti", "Larbaa", "Layoune", "Maacem", "Sidi Abed", "Sidi Slimane", "Tamellahet", "Youssoufia"]
  },
  "el oued": {
    fee: 700,
    delay: "4–6 jours",
    communes: ["El Oued", "Djamaa", "Bayoudh", "Mih Ouensa", "Robbah", "Reguiba", "Kouinine", "Guemar", "Taghzout", "Beni Guecha", "Douar El Ma", "El Ogla", "Hassani Abdelkrim", "Magrane", "Mih Ouansa", "Nakhla", "Oued El Alenda", "Oum Touyour", "Sidi Amrane", "Sidi Khellil", "Still", "Taleb Larbi", "Trifaoui"]
  },
  "khenchela": {
    fee: 600,
    delay: "3–5 jours",
    communes: ["Khenchela", "Chelia", "Chechar", "El Hamma", "Baghai", "Bouhmama", "Aïn Touila", "Kais", "Tamza", "Bab El Assa", "Bouaichoune", "Djellal", "El Mahmal", "Ensigha", "Ferkane", "Khirane", "M'Sara", "M'toussa", "Ouled Rechache", "Remila", "Taouzianat", "Yabous"]
  },
  "souk ahras": {
    fee: 600,
    delay: "3–5 jours",
    communes: ["Souk Ahras", "Taoura", "Bir Bouhouche", "Heddada", "Mechroha", "Sedrata", "Oum El Adhaim", "Ouled Driss", "Ouillen", "Zaarouria", "Khedara", "Aïn Zana", "Drea", "Hanencha", "Khemissa", "Merahna", "Oued Keberit", "Ouled Moumen", "Ragouba", "Safel El Ouiden", "Sidi Fredj", "Terraguelt", "Tiffech", "Zouabi"]
  },
  "tipaza": {
    fee: 350,
    delay: "1–2 jours",
    communes: ["Tipaza", "Merad", "Koléa", "Bou Ismail", "Cherchell", "Hadjout", "Sidi Amar", "Fouka", "Aïn Tagourait", "Menaceur", "Ahmar El Aïn", "Aïn Defla", "Aïn Taggourait", "Attatba", "Bou Haroun", "Bourkika", "Chaiba", "Damous", "Douaouda", "Gouraya", "Hadjeret Ennous", "Khemisti", "Larhat", "Messelmoun", "Nador", "Sidi Ghiles", "Sidi Rached", "Sidi Semiane"]
  },
  "mila": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Mila", "Tikrirt", "Sidi Merouane", "Chelghoum Laïd", "Ferdjioua", "Tassadane Haddada", "Rouached", "Grah Bou Noura", "Hamala", "Aïn Beida Harriche", "Aïn Mellouk", "Amira Arras", "Benyahia Abderrahmane", "Bouhatem", "Chigara", "Derradji Bousselah", "El Ayadi Barbes", "El Mechira", "Oued Athmania", "Oued Endja", "Oued Seguen", "Ouled Khalouf", "Sidi Khelifa", "Tadjenanet", "Tassadane Haddada", "Teleghma", "Terrai Bainen", "Terrai Bainen", "Tiberguent", "Yahia Beni Guecha", "Zeghaia"]
  },
 "ain defla": {
    fee: 400,
    delay: "2–3 jours",
    communes: ["Aïn Defla", "El Abadia", "Miliana", "Boumedfaa", "El Amra", "Djelida", "Tacheta Zougagha", "Rouina", "Khemis Miliana", "Bordj Emir Khaled", "Aïn Benian", "Aïn Bouyahia", "Aïn Lechiekh", "Aïn Soltane", "Aïn Torki", "Bathia", "Belaas", "Ben Allal", "Birbouche", "Bordj Emir Khaled", "Boumedfaa", "Djemaa Ouled Cheikh", "El Attaf", "El Hassania", "El Maine", "Hammam Righa", "Hoceinia", "Mekhatria", "Oued Chorfa", "Oued Djemaa", "Rouina", "Sidi Lakhdar", "Tarik Ibn Ziad", "Tiberkanine", "Zeddine"]
  },
  "naama": {
    fee: 750,
    delay: "4–6 jours",
    communes: ["Naâma", "Mécheria", "Sfissifa", "Aïn Sefra", "Kasdir", "Tiout", "El Biodh", "Assela", "Aïn Ben Khelil", "Djeniane Bourzeg", "Mekmen Ben Amar", "Moghrar", "Ouargla", "Sidi Boumediene", "Tiout"]
  },
  "ain temouchent": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Aïn Témouchent", "Sidi Safi", "El Amria", "Hammam Bouhadjar", "Oulhaca El Gheraba", "El Malah", "Aghlal", "Chaabat El Ham", "Aïn El Arbaa", "Aïn Kihal", "Aïn Tolba", "Beni Saf", "Bouzedjar", "Chentouf", "El Emir Abdelkader", "Hassasna", "Hassi El Ghella", "Oued Berkeche", "Oued Sebbah", "Ouled Boudjemaa", "Ouled Kihal", "Sidi Ben Adda", "Sidi Ouriache", "Tamzoura", "Terga"]
  },
  "ghardaia": {
    fee: 700,
    delay: "4–6 jours",
    communes: ["Ghardaïa", "El Atteuf", "Metlili", "Berriane", "El Guerrara", "Zelfana", "Dhayet Bendhahoua", "Bounoura", "Dhayet Bendhahoua", "El Meniaa", "Sebseb"]
  },
  "relizane": {
    fee: 500,
    delay: "2–4 jours",
    communes: ["Relizane", "Oued Rhiou", "Mansourah", "Yellel", "Mazouna", "Ammi Moussa", "El H'Madna", "Ouled Sidi Mihoub", "Mediouna", "Sidi Saâda", "Aïn Rahma", "Aïn Tarek", "Bendaoud", "Beni Dergoun", "Beni Zentis", "Dar Ben Abdellah", "Djidioua", "El Guettar", "El Hamri", "El Matmar", "El Ouldja", "Had Echkalla", "Hamri", "Kalaa", "Lahlef", "Mendes", "Merine", "Merrahi", "Oued Essalem", "Ouled Aiche", "Ouled Sidi Lazreg", "Ramka", "Sidi Khettab", "Sidi Lazreg", "Sidi M'Hamed Ben Ali", "Sidi M'Hamed Benaouda", "Souk El Had", "Zemmora"]
  },
"el mghair": {
    fee: 700,
    delay: "4–6 jours",
    communes: ["El M'Ghair", "Djamaa", "Oum Touyour", "Sidi Amrane", "Still", "Taleb Larbi", "Trifaoui"]
  },
  "el menia": {
    fee: 750,
    delay: "4–6 jours",
    communes: ["El Menia", "Hassi Messaoud", "Hassi Gara", "El Borma", "El Haoud", "Hassi Ben Abdellah"]
  },
  "ouled djellal": {
    fee: 650,
    delay: "4–6 jours",
    communes: ["Ouled Djellal", "Sidi Khaled", "Doucen", "Besbes", "Chaiba", "Ras El Miad", "Sidi Okba"]
  },
  "beni abbes": {
    fee: 800,
    delay: "5–7 jours",
    communes: ["Beni Abbes", "Tamtert", "El Ouata", "Ouled Khoudir", "Igli", "Kerzaz", "Taghit"]
  },
  "timimoun": {
    fee: 800,
    delay: "5–7 jours",
    communes: ["Timimoun", "Tinerkouk", "Ouled Said", "Aougrout", "Charouine", "Deldoul", "Metarfa", "Ouled Aissa"]
  },
  "touggourt": {
    fee: 700,
    delay: "4–6 jours",
    communes: ["Touggourt", "Megarine", "Nezla", "Sidi Slimane", "Blidet Amor", "Benaceur", "Taïbet"]
  },
  "djanet": {
    fee: 950,
    delay: "6–9 jours",
    communes: ["Djanet", "Bordj El Haouass", "Illizi", "Debdeb", "In Amenas"]
  },
  "in salah": {
    fee: 850,
    delay: "6–9 jours",
    communes: ["In Salah", "Foggaret Ezzoua", "Ain Salah Sud", "Foggaret Ezzaouia", "In Salah Nord"]
  },
  "in guezzam": {fee: 1000,delay: "7–10 jours",communes: ["In Guezzam", "Tin Zouatine", "Taessa", "Ain Guezzam"]
  },
"annaba": { fee: 500, delay: "2–3 jours", communes: [
    "Annaba", "El Bouni", "El Hadjar", "Sidi Amar", "Treat", "Aïn Berda", "Berrahal", 
    "Cheurfa", "Chetaïbi", "Echatt", "El Eulma", "Oued El Aneb", "Serraïdi", 
    "Sidi Salem", "Oued Kouba", "Bouchegouf", "Aïn Charchar", "Zighoud Youcef"
  ]
},
"illizi": {  fee: 950, delay: "6–9 jours", communes: [
    "Illizi", "Djanet", "In Amenas", "Bordj El Haouass", "Debdeb", "Tin Alkoum"
  ]
},
"medea": { fee: 450, delay: "2–3 jours", communes: [
    "Médéa", "Berrouaghia", "Ksar El Boukhari", "Aïn Boucif", "Aziz", "Beni Slimane", 
    "Bouaichoune", "Boumedfaa", "Chabounia", "Chelalet El Adhaoura", "Derrag", 
    "Draa Essamar", "El Azizia", "El Omaria", "Guelb El Kébir", "Kef Lakhdar", 
    "Mezerana", "Ouamri", "Ouled Antar", "Ouled Bouachra", "Ouled Deide", 
    "Ouled Hellal", "Ouled Maaref", "Rebaia", "Saneg", "Sedraia", "Seghouane", 
    "Si Mahdjoub", "Sidi Demed", "Sidi Naamane", "Souagui", "Tablat", "Tafraout", 
    "Tamesguida", "Tizi Mahdi", "Tlatet Eddouair", "Zoubiria"
  ]
},
"bordj badji mokhtar": { fee: 900, delay: "5–8 jours", communes: ["Bordj Badji Mokhtar", "Timiaouine", "Zaouiet Kounta"]}
};
      
  
  const shippingFees = {
  "ADRAR": 800,
  "CHLEF": 500,
  "LAGHOUAT": 650,
  "OUM EL BOUAGHI": 550,
  "BATNA": 550,
  "BEJAIA": 500,
  "BISKRA": 600,
  "BECHAR": 750,
  "BLIDA": 300,
  "BOUIRA": 450,
  "TAMANRASSET": 900,
  "TEBESSA": 600,
  "TLEMCAN": 500,
  "TIARET": 500,
  "TIZI OUZOU": 400,
  "DJELFA": 600,
  "JIJEL": 500,
  "SETIF": 550,
  "SAIDA": 500,
  "SKIKDA": 550,
  "SIDI BELABBES": 500,
  "GEULMA": 550,
  "ANNABA": 550,
  "CONSTANTINE": 500,
  "MEDEA": 450,
  "MOSTAGANEM": 450,
  "M'SILA": 500,
  "MASCARA": 500,
  "OUERGLA": 700,
  "EL BAYADH": 750,
  "BOUMERDAS": 350,
  "EL TAREF": 600,
  "TINDOUF": 1000,
  "TISSEMSIL": 500,
  "EL OUED": 700,
  "KHENCHLA": 600,
  "SOUK AHRAS": 600,
  "TIPAZA": 350,
  "MILA": 500,
  "AIN DEFLA": 400,
  "NAAMA": 750,
  "AIN TEMOUCHENT": 500,
  "GHARDAIA": 700,
  "RELIZANE": 500,
  "ALGIERS": 300,
  "ORAN": 400,
  "EL M'GHAIAR": 700,
  "EL MENIA": 750,
  "OULED DJELLAL": 650,
  "BENI ABBES": 800,
  "TIMIMOUN": 800,
  "TOUGGOURT": 700,
  "DJANET": 950,
  "IN SALEH": 850,
  "IN GUEZZAM": 1000,
  "BORDJ BADJI MOKHTAR": 950,
  "TARF": 600,
  "ILLIZI": 950,
  "TAMANRASSET": 900,
  "Default": 700
};
 const {
    firstName,
    lastName,
    address,
    city,
    commune,
    numero:  rawNumero,
    paymentMethod,
  } = req.body;
   const cityNormalised = (city || "").toLowerCase().trim();

  const shipping = wilayaShippingInfo[selectedcity] || { fee: 1000, delay: "3-5 days" };
  
  // Determine fee
  const shippingFee = cart.totalPrice >= freeShippingThreshold ? 0 : shipping.fee;
  const finalTotalPrice = cart.totalPrice + shippingFee;
 // ===============================
  // 1. CASH ON DELIVERY (COD)
  // ===============================
  if (paymentMethod === "cod") {
    try {
      const order = new Order({
        user: req.user || null,
        cart: cart,
        address,
        firstName,
        lastName,
        commune,
        country: "Algeria",
        city: cityNormalised,
        numero: "213" + rawNumero.replace(/^0+/, "").replace(/\D/g, ""),
        shippingFee,
        deliveryDelay: shipping.delay,
        orderType: req.user ? "user" : "guest",
        totalWithShipping: finalTotalPrice,
      });

      await order.save();

      // Generate InitiateCheckout event ID
      const eventIdInitiateCheckout = generateEventId();
      const userData = getCleanUserData(req);

      if (userData) {
        await sendFacebookCAPIEvent({
          eventName: "InitiateCheckout",
          eventId: eventIdInitiateCheckout,
          userData,
          customData: {
            content_ids: cart.generateArray().map(p => p.item._id.toString()),
            contents: cart.generateArray().map(p => ({
              id: p.item._id.toString(),
              quantity: p.qty,
              item_price: p.item.price,
            })),
            content_type: "product",
            value: finalTotalPrice,
            currency: "DZD",
            num_items: cart.totalQty || 0,
          },
          eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
          testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
        });
        console.log("✅ CAPI InitiateCheckout sent for COD", eventIdInitiateCheckout);
      }


 // ✅ Prepare WhatsApp message payload (using cityNormalised)
const payload = {
  messaging_product: "whatsapp",
  to: "213" + rawNumero.replace(/^0+/, "").replace(/\D/g, ""),
  type: "template",
  template: {
    name: "commande_confirmee",
    language: { code: "fr" },
    components: [
      {
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: "https://www.paintello.uk/img/logo.png"
            }
          }
        ]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: firstName || "Client" },
          { type: "text", text: cart.totalPrice.toString() + " DZD" },
          { type: "text", text: shippingFee === 0 ? "GRATUIT" : shippingFee.toString() + " DZD" },
          { type: "text", text: finalTotalPrice.toString() + " DZD" },
          { type: "text", text: shipping.delay },
          { type: "text", text: `${address}, ${cityNormalised}` }   // ✅ fixed
        ]
      }
    ]
  }
};

try {
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.META_PHONE_ID}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.META_WA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log("✅ WhatsApp message sent:", response.data);
} catch (err) {
  console.error("❌ WhatsApp error:", err.response?.data || err.message);
}

// ✅ Send admin email (using cityNormalised)
await sendAdminOrderEmail({
  name: firstName,
  numero: "213" + rawNumero.replace(/^0+/, "").replace(/\D/g, ""),
  subtotal: cart.totalPrice.toString(),
  shippingFee: shippingFee === 0 ? "FREE" : shippingFee.toString() + " DZD",
  total: finalTotalPrice.toString(),
  deliveryDelay: shipping.delay,
  address: `${address}, ${commune}, ${cityNormalised}`   // ✅ fixed
});
    
  // ✅ Clear cart after saving
    req.session.cart = null;

   // Store confirmation data
      req.session.confirmationData = {
        paymentMethod: "cod",
        eventId: eventIdInitiateCheckout,
        eventName: "InitiateCheckout",
        firstName,
        lastName,
        address,
        city: cityNormalised,
        commune,
        cartTotal: cart.totalPrice,
        shippingFee,
        deliveryDelay: shipping.delay,
        totalPrice: finalTotalPrice,
        cartItems: cart.generateArray(),
        isFreeShipping: cart.totalPrice >= freeShippingThreshold,
        // optional: pass content_ids for Pixel
      };

      return res.redirect("/confirmation");
    } catch (err) {
      console.error("COD order error:", err);
      req.flash("error", "Erreur lors de la commande.");
      return res.redirect("/checkout");
    }
  }
 // 2. ONLINE PAYMENT (Chargily)
  // ===============================
  req.session.pendingOrder = {
    cart: req.session.cart,
    firstName,
    lastName,
    address,
    city: cityNormalised,
    commune,
    shippingFee,
    shippingDelay: shipping.delay,
    finalTotalPrice,
    rawNumero,
    user: req.user || null,
  };

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const successUrl = `${baseUrl}/payment/success`;
  const failureUrl = `${baseUrl}/checkout?payment=failed`;

  try {
    const amountInCents = Math.round(finalTotalPrice * 100);
    const payment = await createPayment({
      amount: amountInCents,
      currency: "dzd",
      success_url: successUrl,
      failure_url: failureUrl,
      metadata: { session_id: req.sessionID },
    });
    return res.redirect(payment.checkout_url);
  } catch (error) {
    console.error("❌ Chargily payment creation error:", error);
    req.flash("error", "Erreur lors de la création du paiement.");
    return res.redirect("/checkout");
  }
});

router.get("/payment/success", async (req, res) => {
  const paymentId = req.query.payment;
  if (!paymentId || !req.session.pendingOrder) return res.redirect("/checkout");

  try {
    const payment = await verifyPayment(paymentId);

    if (payment.status !== "paid") {
      req.flash("error", "Le paiement n'a pas abouti.");
      return res.redirect("/checkout");
    }

    const pending = req.session.pendingOrder;
    const cart = new Cart(pending.cart);
    const cleanNumero = "213" + pending.rawNumero.replace(/^0+/, "").replace(/\D/g, "");

    const order = new Order({
      user: pending.user,
      cart: cart,
      address: pending.address,
      firstName: pending.firstName,
      lastName: pending.lastName,
      commune: pending.commune,
      country: "Algeria",
      city: pending.city,
      numero: cleanNumero,
      shippingFee: pending.shippingFee,
      deliveryDelay: pending.shippingDelay,
      orderType: pending.user ? "user" : "guest",
      totalWithShipping: pending.finalTotalPrice,
    });

    await order.save();

    // Generate Purchase event ID
    const eventIdPurchase = generateEventId();
    const userData = getCleanUserData(req);

    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "Purchase",
        eventId: eventIdPurchase,
        userData,
        customData: {
          value: pending.finalTotalPrice,
          currency: "DZD",
          content_type: "product",
          content_ids: cart.generateArray().map(p => p.item._id.toString()),
          contents: cart.generateArray().map(p => ({
            id: p.item._id.toString(),
            quantity: p.qty,
            item_price: p.item.price,
          })),
        },
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE,
      });
      console.log("✅ CAPI Purchase sent for Chargily", eventIdPurchase);
    }

    // WhatsApp / Email (same as before)
    
// ✅ Prepare WhatsApp message payload (using cityNormalised)
const payload = {
  messaging_product: "whatsapp",
  to: "213" + rawNumero.replace(/^0+/, "").replace(/\D/g, ""),
  type: "template",
  template: {
    name: "commande_confirmee",
    language: { code: "fr" },
    components: [
      {
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: "https://www.paintello.uk/img/logo.png"
            }
          }
        ]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: firstName || "Client" },
          { type: "text", text: cart.totalPrice.toString() + " DZD" },
          { type: "text", text: shippingFee === 0 ? "GRATUIT" : shippingFee.toString() + " DZD" },
          { type: "text", text: finalTotalPrice.toString() + " DZD" },
          { type: "text", text: shipping.delay },
          { type: "text", text: `${address}, ${cityNormalised}` }   // ✅ fixed
        ]
      }
    ]
  }
};

try {
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.META_PHONE_ID}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${process.env.META_WA_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log("✅ WhatsApp message sent:", response.data);
} catch (err) {
  console.error("❌ WhatsApp error:", err.response?.data || err.message);
}

// ✅ Send admin email (using cityNormalised)
await sendAdminOrderEmail({
  name: firstName,
  numero: "213" + rawNumero.replace(/^0+/, "").replace(/\D/g, ""),
  subtotal: cart.totalPrice.toString(),
  shippingFee: shippingFee === 0 ? "FREE" : shippingFee.toString() + " DZD",
  total: finalTotalPrice.toString(),
  deliveryDelay: shipping.delay,
  address: `${address}, ${commune}, ${cityNormalised}`   // ✅ fixed
});

    // Clear cart and pending order
    req.session.cart = null;
    req.session.pendingOrder = null;

    // Store confirmation data
    req.session.confirmationData = {
      paymentMethod: "chargily",
      eventId: eventIdPurchase,
      eventName: "Purchase",
      value: pending.finalTotalPrice,
      currency: "DZD",
      content_ids: cart.generateArray().map(p => p.item._id.toString()),
      contents: cart.generateArray().map(p => ({
        id: p.item._id.toString(),
        quantity: p.qty,
        item_price: p.item.price,
      })),
      firstName: pending.firstName,
      lastName: pending.lastName,
      address: pending.address,
      city: pending.city,
      commune: pending.commune,
      cartTotal: cart.totalPrice,
      shippingFee: pending.shippingFee,
      deliveryDelay: pending.shippingDelay,
      totalPrice: pending.finalTotalPrice,
      cartItems: cart.generateArray(),
      isFreeShipping: cart.totalPrice >= 5000,
    };

    return res.redirect("/confirmation");
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    req.flash("error", "Erreur lors de la vérification du paiement.");
    return res.redirect("/checkout");
  }
});

router.get("/confirmation", async (req, res) => {
  const data = req.session.confirmationData;
  if (!data) {
    return res.redirect("/");
  }

  const eventIdPageView = generateEventId();
  const userData = getCleanUserData(req);

  try {
    if (userData) {
      const testEventCode = data.testEventCode || req.query.test_event_code || process.env.FB_TEST_EVENT_CODE;
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode,
      });
      console.log("✅ Confirmation PageView sent");
    } else {
      console.log("🤖 Bot detected – confirmation PageView skipped");
    }

    // Build the full data object to send to the template
    const renderData = {
      ...data,
      metaEventIdPageView: eventIdPageView,
      user: req.user,
      req,
    };

    // Render the template, then clear the session AFTER the response is sent
    res.render("event/confirmation", renderData, (err, html) => {
      // Clear sensitive session data regardless of render success
      req.session.confirmationData = null;

      if (err) {
        console.error("❌ Confirmation render error:", err);
        return res.status(500).send("Erreur d'affichage de la confirmation.");
      }
      res.send(html);
    });
  } catch (err) {
    console.error("❌ Confirmation route error:", err);
    // Even on error, clear session so user can restart
    req.session.confirmationData = null;
    return res.redirect("/checkout");
  }
});




router.get('/shipping-fee/:wilaya', (req, res) => {
  const { wilaya } = req.params;
  const fee = item.shippingFees[wilaya];

  if (fee !== undefined) {
    res.json({ wilaya, shippingFee: fee });
  } else {
    res.status(404).json({ error: 'Wilaya not found' });
  }
});
router.post('/update-cart/:id', (req, res) => {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let productId = req.params.id;
  let newQty = parseInt(req.body.quantity);

  if (newQty > 0) {
    cart.update(productId, newQty);
  }
  req.session.cart = cart;
  res.redirect('/shop'); // or wherever the cart page is
});
          
router.post('/cart/increase/:id', (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart || {});
  cart.increaseQty(productId);
  req.session.cart = cart;

  res.json({
    qty: cart.items[productId].qty,
    itemTotal: cart.items[productId].price,
    totalPrice: cart.totalPrice
  });
});

router.post('/cart/decrease/:id', (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart || {});
  cart.decreaseQty(productId);
  req.session.cart = cart;

  let qty = 0, itemTotal = 0;
  if (cart.items[productId]) {
    qty = cart.items[productId].qty;
    itemTotal = cart.items[productId].price;
  }

  res.json({
    qty: qty,
    itemTotal: itemTotal,
    totalPrice: cart.totalPrice
  });
});


var Newsletter = require('../models/newsletter')


// Newsletter route
router.post('/subscribe', async function (req, res) {
  const email = req.body.email;

  if (!email) {
    req.flash('error', 'Email is required.');
    return res.redirect('/'); // Redirect to homepage or newsletter page
  }

  try {
    // Save to database
    const newEmail = new Newsletter({ email: email });
    await newEmail.save();

    // Setup nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.EMAIL_PASS
      }
    });

    // Mail options
    let mailOptions = {
      from: `"Paintello" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Paintello!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Thank you for subscribing!</h2>
          <p>We’re excited to have you with us. Expect great offers and design inspiration in your inbox.</p>
        </div>
      `
    };

    // Send mail
await transporter.sendMail(mailOptions);

    req.flash('success', 'Subscription successful! Please check your email.');
    res.redirect('event/confirmation'); // Redirect to homepage (or any page you choose)
  } catch (err) {
    console.error('Newsletter error:', err);
    req.flash('error', 'Something went wrong. Please try again later.');
    res.redirect('event/confirmation'); // Redirect back with error
  }
});


router.get("/contact", async function(req, res){
    try {
        // ✅ Generate PageView event ID
        const eventIdPageView = generateEventId();

        // ✅ Bot-safe user data (same helper everywhere)
        const userData = getCleanUserData(req);

        // --------------------
        // PAGE VIEW (CONTACT PAGE)
        // --------------------
        if (userData) {
            await sendFacebookCAPIEvent({
                eventName: "PageView",
                eventId: eventIdPageView,
                userData,
                eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
                testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
            });

            console.log("✅ Contact PageView sent");
            
            // ✅ Log test event code if used
            if (req.query.test_event_code) {
                console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
            }
        } else {
            console.log("🤖 Bot detected – Contact PageView skipped");
        }

        res.render("event/contact", {
            req,
            metaEventIdPageView: eventIdPageView,
            user: req.user
        });
    } catch (err) {
        console.error("❌ Error loading contact page:", err);
        res.status(500).send("Error loading contact page");
    }
});

// Track Login Page
router.get("/track-login", async function(req, res){
    try {
        // ✅ Generate PageView event ID
        const eventIdPageView = generateEventId();

        // ✅ Bot-safe user data (same helper everywhere)
        const userData = getCleanUserData(req);

        // --------------------
        // PAGE VIEW (TRACK LOGIN PAGE)
        // --------------------
        if (userData) {
            await sendFacebookCAPIEvent({
                eventName: "PageView",
                eventId: eventIdPageView,
                userData,
                eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
                testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
            });

            console.log("✅ Track Login PageView sent");
            
            // ✅ Log test event code if used
            if (req.query.test_event_code) {
                console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
            }
        } else {
            console.log("🤖 Bot detected – Track Login PageView skipped");
        }

        // Helper functions (unchanged)
        const getStatusText = (status) => {
            const statusMap = {
                'pending': 'En Attente',
                'confirmed': 'Confirmée',
                'processing': 'En Préparation',
                'ready_for_pickup': 'Prête à Expédier',
                'shipped': 'Expédiée',
                'out_for_delivery': 'En Livraison',
                'delivered': 'Livrée',
                'cancelled': 'Annulée',
                'refunded': 'Remboursée',
                'on_hold': 'En Attente'
            };
            return statusMap[status] || status;
        };

        const getReturnStatusText = (status) => {
            const statusMap = {
                'none': 'Aucun',
                'requested': 'Demandé',
                'approved': 'Approuvé',
                'rejected': 'Rejeté',
                'processing': 'En Cours',
                'completed': 'Terminé'
            };
            return statusMap[status] || status;
        };

        const getPaymentStatusText = (status) => {
            const statusMap = {
                'pending': 'En Attente',
                'paid': 'Payé',
                'failed': 'Échoué',
                'refunded': 'Remboursé',
                'partially_refunded': 'Partiellement Remboursé'
            };
            return statusMap[status] || 'En Attente';
        };

        res.render("event/track-login", {
            error: req.flash('error')[0],
            success: req.flash('success')[0],
            getStatusText,
            getReturnStatusText,
            getPaymentStatusText,
            req,
            metaEventIdPageView: eventIdPageView,
            user: req.user
        });
    } catch (err) {
        console.error("❌ Error loading track-login page:", err);
        res.status(500).send("Error loading track login page");
    }
});
// Process Track Login
router.post('/track-login', async (req, res) => {
    try {
        let { numero } = req.body;
        
        // Validate Algerian phone number
        if (!/^0[5-7][0-9]{8}$/.test(numero)) {
            req.flash('error', 'رقم الهاتف غير صحيح - يجب أن يبدأ بـ 05/06/07 ويتكون من 10 أرقام');
            return res.redirect('/track-login');
        }
  console.log("📱 User searching with phone:", numero);
          // ✅ FIX: Check for user account with multiple phone formats
        let existingUser = null;
        
        // Try different formats the phone could be stored in User model
        const possibleUserPhones = [
            numero,                           // 0551477635 (as entered)
            '0' + numero.substring(1),       // 0551477635 (alternative)
            numero.replace(/\D/g, ''),       // 0551477635 (digits only)
            
            // Also try international format (if User model converts like Order)
            '213' + numero.substring(1).replace(/\D/g, ''),  // 213551477635
            parseInt('213' + numero.substring(1).replace(/\D/g, ''), 10) // as number
        ];
        
        console.log("🔍 Checking user accounts with formats:", possibleUserPhones);
        
        // Try each format until we find a user
        for (const phoneFormat of possibleUserPhones) {
            const user = await User.findOne({ 
                numero: phoneFormat 
            });
            
            if (user) {
                existingUser = user;
                console.log(`✅ Found user with phone format: ${phoneFormat} (${typeof phoneFormat})`);
                break;
            }
        }
        
        if (!existingUser) {
            console.log("❌ No user account found with any phone format");
        }
        
        // ✅ Generate PageView event ID
        const eventIdPageView = generateEventId();
        
        // ✅ Bot-safe user data (same helper everywhere)
        const userData = getCleanUserData(req);

        // --------------------
        // PAGE VIEW (TRACK ORDER RESULTS)
        // --------------------
        if (userData) {
            await sendFacebookCAPIEvent({
                eventName: "PageView",
                eventId: eventIdPageView,
                userData,
                eventSourceUrl: `https://${req.get("host")}/track-order`,
                testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
            });

            console.log("✅ Track Order Results PageView sent");
            
            // ✅ Log test event code if used
            if (req.query.test_event_code) {
                console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
            }
            
            // ✅ Also send a Search event for order tracking
            await sendFacebookCAPIEvent({
                eventName: "Search",
                eventId: generateEventId(),
                userData,
                customData: {
                    search_string: "order_tracking",
                    content_type: "order",
                    value: 0,
                    currency: "DZD"
                },
                eventSourceUrl: `https://${req.get("host")}/track-order`,
                testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
            });

            console.log("✅ Order Tracking Search event sent");
        } else {
            console.log("🤖 Bot detected – Track Order events skipped");
        }

        const orders = await Order.findByAnyPhoneFormat(numero);
       console.log("📊 Orders found:", orders.length);
      // Calculate order count
        const orderCount = orders.length;
          // If orders exist but no user account, suggest creating one
    let suggestAccountCreation = false;
    if (orderCount > 0 && !existingUser) {
      suggestAccountCreation = true;
    }
        // Helper functions
        const getStatusText = (status) => {
            const statusMap = {
                'pending': 'En Attente',
                'confirmed': 'Confirmée',
                'processing': 'En Préparation',
                'ready_for_pickup': 'Prête à Expédier',
                'shipped': 'Expédiée',
                'out_for_delivery': 'En Livraison',
                'delivered': 'Livrée',
                'cancelled': 'Annulée',
                'refunded': 'Remboursée',
                'on_hold': 'En Attente'
            };
            return statusMap[status] || status;
        };

        const getReturnStatusText = (status) => {
            const statusMap = {
                'none': 'Aucun',
                'requested': 'Demandé',
                'approved': 'Approuvé',
                'rejected': 'Rejeté',
                'processing': 'En Cours',
                'completed': 'Terminé'
            };
            return statusMap[status] || status;
        };

        const getPaymentStatusText = (status) => {
            const statusMap = {
                'pending': 'En Attente',
                'paid': 'Payé',
                'failed': 'Échoué',
                'refunded': 'Remboursé',
                'partially_refunded': 'Partiellement Remboursé'
            };
            return statusMap[status] || 'En Attente';
        };

        const getProgressWidth = (status) => {
            const progressMap = {
                'pending': 10,
                'confirmed': 30,
                'processing': 50,
                'ready_for_pickup': 60,
                'shipped': 75,
                'out_for_delivery': 90,
                'delivered': 100,
                'cancelled': 100,
                'refunded': 100,
                'on_hold': 10
            };
            return progressMap[status] || 10;
        };

        const getTimelineStatus = (currentStatus, checkStatus) => {
            const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
            const currentIndex = statusOrder.indexOf(currentStatus);
            const checkIndex = statusOrder.indexOf(checkStatus);
            
            if (checkIndex < currentIndex) return 'completed';
            if (checkIndex === currentIndex) return 'active';
            return '';
        };

        if (orderCount === 0) {
            req.flash('error', 'لا توجد طلبات مرتبطة بهذا الرقم');
            return res.render('event/track-order', {
                orders: [],
                phoneNumber: numero,
                error: req.flash('error')[0],
                getStatusText,
                orderCount: 0, // ✅ Add orderCount here
                getReturnStatusText,
                getPaymentStatusText,
                getProgressWidth,
                getTimelineStatus,
                req,
                metaEventIdPageView: eventIdPageView,
                user: { numero: numero }
            });
        }

        // ✅ Send Lead event if orders found
        if (userData && orderCount > 0) {
            await sendFacebookCAPIEvent({
                eventName: "Lead",
                eventId: generateEventId(),
                userData,
                customData: {
                    content_name: "Order Found",
                    content_type: "order_status",
                    value: orders.length,
                    currency: "DZD"
                },
                eventSourceUrl: `https://${req.get("host")}/track-order`,
                testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
            });

            console.log(`✅ Lead event sent for ${orderCount} found orders`);
        }

        req.session.trackingUser = numero;
        res.render('event/track-order', { 
            orders,
            phoneNumber: numero,
            suggestAccountCreation: suggestAccountCreation, // Pass this to template
            success: req.flash('success')[0],
          orderCount: orderCount, // ✅ Make sure this is passed
            error: req.flash('error')[0],
            getStatusText,
            getReturnStatusText,
            getPaymentStatusText,
            getProgressWidth,
            getTimelineStatus,
            req,
            metaEventIdPageView: eventIdPageView,
            user: { numero: numero }
        });

    } catch (err) {
        console.error('Track order error:', err);
        req.flash('error', 'خطأ في النظام - يرجى المحاولة لاحقاً');
        res.redirect('/track-login');
    }
});

// Track Order Page
router.get('/track-order', async (req, res) => {
  if (!req.session.trackingUser) return res.redirect('/track-login');

  try {
    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // --------------------
    // PAGE VIEW (TRACK ORDER PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
      });

      console.log("✅ Track Order PageView sent");
      
      // ✅ Log test event code if used
      if (req.query.test_event_code) {
        console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
      }
    } else {
      console.log("🤖 Bot detected – Track Order PageView skipped");
    }

    const orders = await Order.find({ numero: req.session.trackingUser })
                            .sort({ createdAt: -1 })
                            .populate({
                              path: 'returnRequest',
                              options: { strictPopulate: false } // Bypass the check
                            });
    
    // Helper functions (you may need to define these or import them)
    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'En Attente',
        'confirmed': 'Confirmée',
        'processing': 'En Préparation',
        'ready_for_pickup': 'Prête à Expédier',
        'shipped': 'Expédiée',
        'out_for_delivery': 'En Livraison',
        'delivered': 'Livrée',
        'cancelled': 'Annulée',
        'refunded': 'Remboursée',
        'on_hold': 'En Attente'
      };
      return statusMap[status] || status;
    };

    const getReturnStatusText = (status) => {
      const statusMap = {
        'none': 'Aucun',
        'requested': 'Demandé',
        'approved': 'Approuvé',
        'rejected': 'Rejeté',
        'processing': 'En Cours',
        'completed': 'Terminé'
      };
      return statusMap[status] || status;
    };

    const getPaymentStatusText = (status) => {
      const statusMap = {
        'pending': 'En Attente',
        'paid': 'Payé',
        'failed': 'Échoué',
        'refunded': 'Remboursé',
        'partially_refunded': 'Partiellement Remboursé'
      };
      return statusMap[status] || 'En Attente';
    };

    const getProgressWidth = (status) => {
      const progressMap = {
        'pending': 10,
        'confirmed': 30,
        'processing': 50,
        'ready_for_pickup': 60,
        'shipped': 75,
        'out_for_delivery': 90,
        'delivered': 100,
        'cancelled': 100,
        'refunded': 100,
        'on_hold': 10
      };
      return progressMap[status] || 10;
    };

    const getTimelineStatus = (currentStatus, checkStatus) => {
      const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      const checkIndex = statusOrder.indexOf(checkStatus);
      
      if (checkIndex < currentIndex) return 'completed';
      if (checkIndex === currentIndex) return 'active';
      return '';
    };
    
    res.render('event/track-order', { 
      orders,
      phoneNumber: req.session.trackingUser, // Fixed variable reference
      success: req.flash('success')[0],
      error: req.flash('error')[0],
      getStatusText,
      getReturnStatusText,
      getPaymentStatusText,
      getProgressWidth,
      getTimelineStatus,
      req,
      metaEventIdPageView: eventIdPageView,
      user: { numero: req.session.trackingUser } // Provide minimal user object
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    req.flash('error', 'Error loading your orders');
    res.redirect('/track-login');
  }
});
router.post('/submit-return/:orderId', async (req, res) => {
  try {
    const { reason, details } = req.body;
    const orderId = req.params.orderId.replace(/\.\w+$/, '');
    
    const order = await Order.findById(orderId);
    if (!order) {
      req.flash('error', 'الطلب غير موجود');
      return res.redirect('/track-login');
    }

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);
    
    if (userData) {
      // ✅ Send CompleteRegistration event for return submission
      await sendFacebookCAPIEvent({
        eventName: "CompleteRegistration",
        eventId: generateEventId(),
        userData,
        customData: {
          content_name: "Return Request Submitted",
          content_type: "return",
          status: "submitted",
          value: order.totalAmount || 0,
          currency: "DZD"
        },
        eventSourceUrl: `https://${req.get("host")}/start-return/${orderId}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE
      });

      console.log("✅ CompleteRegistration (Return Submission) event sent");
    }

    // Process return request here...
    // Create return request in database, etc.
    
    req.flash('success', 'تم تقديم طلب الإرجاع بنجاح');
    res.redirect('/track-login');
    
  } catch (err) {
    console.error('Error submitting return:', err);
    req.flash('error', 'خطأ في النظام');
    res.redirect('/track-login');
  }
});

// Submit Return Request
router.post('/submit-return', async (req, res) => {
    try {
        console.log('=== SUBMIT RETURN REQUEST START ===');
        console.log('Request body:', req.body);
        
        const { orderId, reason, refundMethod, exchangeItem, ccpNumber, notes } = req.body;
        
        // Validate required fields
        if (!orderId || !reason || !refundMethod) {
            console.log('❌ Validation failed - missing required fields');
            req.flash('error', 'جميع الحقول المطلوبة يجب ملؤها');
            return res.redirect(`/start-return/${orderId}`);
        }

        // Validate refund method specific fields
        if (refundMethod === 'exchange' && !exchangeItem) {
            console.log('❌ Validation failed - missing exchange item');
            req.flash('error', 'يجب تحديد المنتج البديل');
            return res.redirect(`/start-return/${orderId}`);
        }

        if (refundMethod === 'ccp_refund' && !ccpNumber) {
            console.log('❌ Validation failed - missing CCP number');
            req.flash('error', 'يجب إدخال رقم الحساب البريدي');
            return res.redirect(`/start-return/${orderId}`);
        }

        console.log('✅ All validations passed');

        // Get the order to extract the phone number (numero)
        const order = await Order.findById(orderId);
        if (!order) {
            console.log('❌ Order not found');
            req.flash('error', 'الطلب غير موجود');
            return res.redirect('/track-login');
        }

        console.log('Found order:', order.numero);

        // Create return request with all required fields
        const returnRequest = new ReturnRequest({
            orderId,
            numero: order.numero, // Add the required numero field from the order
            reason,
            refundMethod,
            exchangeItem: refundMethod === 'exchange' ? exchangeItem : undefined,
            ccpNumber: refundMethod === 'ccp_refund' ? ccpNumber : undefined,
            notes,
            status: 'pending'
        });

        console.log('Return request object:', returnRequest);
        
        await returnRequest.save();
        console.log('✅ Return request saved with ID:', returnRequest._id);

        // Update the order with the return request reference
        await Order.findByIdAndUpdate(orderId, { 
            returnRequest: returnRequest._id,
          returnStatus: 'requested' // Add this line
        });
        console.log('✅ Order updated with return request');

        req.flash('success', 'تم إرسال طلب الإرجاع بنجاح');
        console.log('=== SUBMIT RETURN REQUEST SUCCESS ===');
        res.redirect('/track-login');

    } catch (err) {
        console.error('❌ Return submission error:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        // More specific error messages
        if (err.name === 'ValidationError') {
            req.flash('error', 'خطأ في البيانات المقدمة: ' + Object.values(err.errors).map(e => e.message).join(', '));
        } else if (err.name === 'CastError') {
            req.flash('error', 'خطأ في معرف الطلب');
        } else {
            req.flash('error', 'فشل في تقديم طلب الإرجاع');
        }
        
        res.redirect(`/start-return/${req.body.orderId}`);
    }
});

// UUID v4 generator function
function generateEventId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
router.get("/producthome/:id", async (req, res) => {
  try {
    // ✅ Clean the ID
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    // ✅ Fetch the main product
    const producthome = await Producthome.findById(cleanId);
    
    if (!producthome) {
      return res.status(404).send("Product not found");
    }
    
    // ✅ GET RELATED PRODUCTS BY TYPE (EXCLUDING CURRENT)
    let relatedProducts = [];
    if (producthome.type) {
      relatedProducts = await Producthome.find({
        
        type: producthome.type        // Only in-stock products
      })
      .sort({ createdAt: -1 })         // Newest first
      .limit(8);                       // Limit to 8 products
    }
    
    // ✅ If no same-type products, get alternative products
    if (relatedProducts.length < 4 && producthome.type) {
      // Try to get products with similar keywords
      const titleWords = producthome.title.split(' ').filter(word => word.length > 3);
      
      if (titleWords.length > 0) {
        const additionalProducts = await Producthome.find({
          _id: { $nin: [producthome._id, ...relatedProducts.map(p => p._id)] },
          disponible: true,
          $or: [
            { title: { $regex: titleWords[0], $options: 'i' } },
            { description: { $regex: titleWords[0], $options: 'i' } }
          ]
        })
        .limit(8 - relatedProducts.length);
        
        relatedProducts = [...relatedProducts, ...additionalProducts];
      }
    }
    
    // ✅ Keep your existing random products slider (optional)
    const randomProducts = await Producthome.find({
      _id: { $ne: producthome._id },
      disponible: true
    })
    .limit(12);
    
    // ✅ Rest of your existing code remains the same...
    const paintellos = await Paintello.find({}).limit(20);
    
    const eventIdPageView = generateEventId();
    const eventIdView = generateEventId();
    const eventIdCart = generateEventId();
    
    
    const userData = getCleanUserData(req);
    
    if (userData) {
      const eventSourceUrl = `https://${req.get("host")}${req.originalUrl}`;
      const testEventCode = req.query.test_event_code || process.env.FB_TEST_EVENT_CODE;
      
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl,
        testEventCode
      });
      
      await sendFacebookCAPIEvent({
        eventName: "ViewContent",
        eventId: eventIdView,
        userData,
        customData: {
          content_name: producthome.title,
          content_ids: [producthome.id],
          contents: [{
            id: producthome.id,
            quantity: 1,
            item_price: producthome.price
          }],
          content_type: "home_decor",
          value: producthome.price,
          currency: "DZD"
        },
        eventSourceUrl,
        testEventCode
      });
      
      console.log("✅ PageView + ViewContent sent");
      if (testEventCode) {
        console.log(`🔬 Facebook Test Event Code: ${testEventCode}`);
      }
    }
    
    req.session.preGeneratedEventIds = {
      cart: eventIdCart,
     
    };
    
    const has3DModel = !!producthome.stlFile;
    const defaultColor = producthome.model3D?.defaultColor?.startsWith("#")
      ? producthome.model3D.defaultColor
      : `#${producthome.model3D?.defaultColor || "8CAAE6"}`;
    
    res.render("event/producthome", {
      producthome,
      relatedProducts,  // 👈 This is your RELATED products by type
      randomProducts,   // 👈 Keep this for other sliders
      paintellos,
      req,
      metaEventIdView: eventIdView,
      metaEventIdCart: eventIdCart,
  
      metaEventIdPageView: eventIdPageView,
      has3DModel,
      model3DSettings: {
        enabled: has3DModel,
        stlFile: producthome.stlFile,
        autoRotate: producthome.model3D?.autoRotate ?? true,
        defaultColor
      },
      user: req.user,
      login: req.isAuthenticated()
    });
    
  } catch (error) {
    console.error("❌ Product page error:", error);
    res.status(500).send("Server Error");
  }
});
router.get("/add-to-cart-producthome/:id", async (req, res) => {
  try {
    // ✅ Clean the ID by removing any file extension
    const rawId = req.params.id;
    const cleanId = rawId.replace(/\.\w+$/, '');
    
    const producthomeId = cleanId;
    const quantity = parseInt(req.query.qty) || 1;
    const secondProductId = req.query.second; // ✅ Get second product ID
    const redirectTo = req.query.redirect;

    const cart = new Cart(req.session.cart || {});
    const producthome = await Producthome.findById(producthomeId);

    // ✅ Check if product exists
    if (!producthome) {
      return res.status(404).send("Product not found");
    }

    // ✅ Add main product (full price)
    for (let i = 0; i < quantity; i++) {
      cart.add(producthome, producthome.id);
    }

    // ✅ Add second product with 30% discount if selected
    let secondProduct = null;
    let secondProductDiscountedPrice = 0;
    
    // In your /add-to-cart-producthome/:id route
if (secondProductId) {
  secondProduct = await Producthome.findById(secondProductId);
  
  if (secondProduct) {
    // Check if second product is the same as main product
    const isSameProduct = secondProductId === producthomeId;
    
    if (isSameProduct) {
      // Add the same product again but with 30% discount
      // Link it to the main product
      const discountedId = `${secondProductId}-discounted`;
      cart.addDiscounted(secondProduct, discountedId, 0.1, producthomeId);
      secondProductDiscountedPrice = secondProduct.price * 0.9;
    } else {
      // Different product, add with 30% discount and link to main product
      cart.addDiscounted(secondProduct, secondProductId, 0.1, producthomeId);
      secondProductDiscountedPrice = secondProduct.price * 0.9;
    }
  }
}

    req.session.cart = cart;

    // ✅ Bot-safe user data
    const userData = getCleanUserData(req);

    if (!userData) {
      console.log("🤖 Bot detected – AddToCart skipped");
      return res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");
    }

    // ✅ Use pre-generated Event ID
    const eventIds = req.session.preGeneratedEventIds || {};
    const eventIdCart = eventIds.cart || generateEventId();
    
    // ✅ Get Facebook Test Event Code
    const testEventCode = req.query.test_event_code || process.env.FB_TEST_EVENT_CODE;

    // ✅ Prepare content data for Facebook CAPI
    const contents = [{
      id: producthome.id,
      quantity: quantity,
      item_price: producthome.price
    }];

    let totalValue = producthome.price * quantity;

    if (secondProduct) {
      contents.push({
        id: secondProduct.id,
        quantity: 1,
        item_price: secondProductDiscountedPrice
      });
      totalValue += secondProductDiscountedPrice;
    }

    await sendFacebookCAPIEvent({
      eventName: "AddToCart",
      eventId: eventIdCart,
      userData,
      customData: {
        content_name: producthome.title,
        content_ids: secondProduct 
          ? [producthome.id, secondProduct.id]
          : [producthome.id],
        contents: contents,
        content_type: "home_decor",
        value: totalValue,
        currency: "DZD"
      },
      eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
      testEventCode
    });

    console.log("✅ AddToCart sent with synced Event ID");
    
    // ✅ Log test event code if used
    if (testEventCode) {
      console.log(`🔬 Facebook Test Event Code Used: ${testEventCode}`);
    }

    // ✅ Clear used Event ID
    delete req.session.preGeneratedEventIds;

    res.redirect(redirectTo === "checkout" ? "/checkout" : "/shop");

  } catch (error) {
    console.error("❌ AddToCart error:", error);
    res.status(500).send("Server Error");
  }
});

router.get('/paintello', async (req, res) => {
  try {
    const paintellos = await Paintello.find({});
    
    // ✅ Generate PageView event ID
    const eventIdPageView = generateEventId();

    // ✅ Bot-safe user data (same helper everywhere)
    const userData = getCleanUserData(req);

    // --------------------
    // PAGE VIEW (PAINTELLO PAGE)
    // --------------------
    if (userData) {
      await sendFacebookCAPIEvent({
        eventName: "PageView",
        eventId: eventIdPageView,
        userData,
        eventSourceUrl: `https://${req.get("host")}${req.originalUrl}`,
        testEventCode: req.query.test_event_code || process.env.FB_TEST_EVENT_CODE // ✅ Facebook Test Event Code
      });

      console.log("✅ Paintello Home PageView sent");
      
      // ✅ Log test event code if used
      if (req.query.test_event_code) {
        console.log(`🔬 Facebook Test Event Code Used: ${req.query.test_event_code}`);
      }
    } else {
      console.log("🤖 Bot detected – Paintello Home PageView skipped");
    }

    // ✅ Render page
    res.render('event/paintellohome', { 
      paintellos, 
      req,
      metaEventIdPageView: eventIdPageView,
      user: req.user 
    });

  } catch (err) {
    console.error("❌ Error loading paintello page:", err);
    res.status(500).send('Error loading paintello products');
  }
});

// ✅ Must be included and correctly mounted
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "paintello_webhook_token"; // same token you entered

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});


const Incoming = require('../models/Incoming');


const fs = require('fs');
const path = require('path');

router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages?.[0];

    if (!messages) {
      return res.sendStatus(200); // ✅ pas de message, réponse immédiate
    }

    const from = messages.from; // ✅ numéro client (WhatsApp ID)
    const text = messages.text?.body?.trim(); // ✅ on ne transforme pas encore en uppercase ici

    // ✉️ Informations à transmettre
    const name = "Client WhatsApp";
    const numero = from.startsWith('213') ? '0' + from.slice(3) : from;
    const response = text || "[Message vide ou non texte]";

    // ✅ Send email in background (don't wait)
    sendClientReplyEmail({ name, numero, response }).catch(err => {
      console.error('❌ Background email error:', err.message);
    });

    // ✅ Immediately respond 200 to Meta
    return res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.sendStatus(500);
  }
});


// Add these helper functions to your route file
function getStatusText(status) {
  const statusMap = {
    'pending': 'En Attente',
    'confirmed': 'Confirmée',
    'processing': 'En Préparation',
    'ready_for_pickup': 'Prête à Expédier',
    'shipped': 'Expédiée',
    'out_for_delivery': 'En Livraison',
    'delivered': 'Livrée',
    'cancelled': 'Annulée',
    'refunded': 'Remboursée',
    'on_hold': 'En Attente'
  };
  return statusMap[status] || status;
}

function getReturnStatusText(status) {
  const statusMap = {
    'none': 'Aucun',
    'requested': 'Demandé',
    'approved': 'Approuvé',
    'rejected': 'Rejeté',
    'processing': 'En Cours',
    'completed': 'Terminé'
  };
  return statusMap[status] || status;
}

function getPaymentStatusText(status) {
  const statusMap = {
    'pending': 'En Attente',
    'paid': 'Payé',
    'failed': 'Échoué',
    'refunded': 'Remboursé',
    'partially_refunded': 'Partiellement Remboursé'
  };
  return statusMap[status] || 'En Attente';
}

// Subscribe to notification
router.post('/notify-me/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { email, phone } = req.body;  // ✅ Get phone from body

    console.log('📧 Notification request received:', { productId, email, phone });

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Format d\'email invalide' 
      });
    }

    // Check if product exists
    const product = await Producthome.findById(productId);
    if (!product) {
      console.log('❌ Product not found:', productId);
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé' 
      });
    }

    // Check if already subscribed
    const existing = await Notification.findOne({ productId, email });
    if (existing) {
      console.log('ℹ️ Already subscribed:', email);
      return res.json({ 
        success: true, 
        message: 'Vous êtes déjà inscrit aux notifications pour ce produit' 
      });
    }

    // Create new notification subscription
    const notification = new Notification({
      productId,
      email,
      phone: phone || null,  // ✅ Save phone if provided
      notified: false,
      createdAt: new Date()
    });

    await notification.save();
    
    console.log('✅ Notification saved to MongoDB:', {
      id: notification._id,
      productId: productId,
      email: email,
      phone: phone || 'none'
    });

    res.json({ 
      success: true, 
      message: 'Vous serez notifié lorsque ce produit sera de nouveau en stock!' 
    });
  } catch (error) {
    console.error('❌ Notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur. Veuillez réessayer.' 
    });
  }
});

    
module.exports = router
