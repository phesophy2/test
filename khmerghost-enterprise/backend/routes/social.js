const express = require('express');
const router = express.Router();
const db = require('../db');

// Post to platform
router.post('/post', async (req, res) => {
  const { accountIds, platform, type, content, hashtags, mediaUrl, scheduleTime } = req.body;
  
  for(const accountId of accountIds) {
    await db.run(`INSERT INTO posts(user_id, account_id, platform, type, content, hashtags, media_url, status, scheduled_for)
      VALUES(?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [1, accountId, platform, type, content, hashtags.join(','), mediaUrl, scheduleTime || null]);
  }
  
  res.json({ success: true, message: `Scheduled post to ${accountIds.length} accounts on ${platform}` });
});

// Get posts
router.get('/posts', async (req, res) => {
  const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100');
  res.json(posts);
});

// Get platforms status
router.get('/platforms', (req, res) => {
  res.json([
    { name: 'Facebook', status: 'connected', features: ['post', 'reel', 'story', 'like', 'comment'] },
    { name: 'TikTok', status: 'connected', features: ['upload', 'like', 'follow', 'comment'] },
    { name: 'Instagram', status: 'connected', features: ['post', 'story', 'reel', 'dm'] },
    { name: 'YouTube', status: 'coming_soon', features: ['upload', 'comment'] }
  ]);
});

module.exports = router;
