const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => res.json({ connected: true }));
router.get('/profiles', (req, res) => res.json([{id:'profile1',name:'FB_Profile_1',status:'running'}]));
router.post('/profile/create', (req, res) => res.json({ success: true, profileId: 'new_profile_123' }));
router.post('/profile/start', (req, res) => res.json({ success: true, wsUrl: 'ws://localhost:1234' }));
router.post('/create-facebook', (req, res) => res.json({ success: true, email: 'newfb@gmail.com', profileId: 'fb_profile_456' }));

module.exports = router;
