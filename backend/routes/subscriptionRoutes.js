const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

router.get('/plans', async (req, res) => {
  const { data: plans } = await supabase.from('subscription_plans').select('*').order('price');
  res.json(plans || [
    { tier: 'free', name: 'Free', price: 0, features: { accounts: 5, posts_per_day: 10 } },
    { tier: 'basic', name: 'Basic', price: 29, features: { accounts: 50, posts_per_day: 100, ai_content: true } },
    { tier: 'pro', name: 'Pro', price: 99, features: { accounts: 500, posts_per_day: 1000, ai_content: true, bulk_export: true } },
    { tier: 'enterprise', name: 'Enterprise', price: 499, features: { accounts: 5000, posts_per_day: 10000, white_label: true, api_access: true } }
  ]);
});

router.get('/current', verifyToken, async (req, res) => {
  const { data: user } = await supabase.from('users').select('subscription_tier, subscription_expires').eq('id', req.user.userId).single();
  res.json({ tier: user?.subscription_tier || 'free', expires: user?.subscription_expires, features: {} });
});

router.post('/upgrade', verifyToken, async (req, res) => {
  const { tier } = req.body;
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await supabase.from('users').update({ subscription_tier: tier, subscription_expires: expires }).eq('id', req.user.userId);
  res.json({ success: true, tier, expires });
});

module.exports = router;
