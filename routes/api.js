// routes/api.js
const express = require('express');
const router = express.Router();

// Save fbclid from URL for iOS users
router.post('/api/save-fbclid', (req, res) => {
  try {
    const { fbclid } = req.body;
    
    if (fbclid) {
      // Store in session
      req.session.fbclid = fbclid;
      
      // Also set as cookie
      res.cookie('fbclid_backup', fbclid, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: false,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      console.log('✅ fbclid saved for iOS:', fbclid.substring(0, 20) + '...');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving fbclid:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
