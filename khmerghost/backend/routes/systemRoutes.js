// backend/routes/systemRoutes.js
const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

// Helper to run docker ps and format output
function getDockerContainers(callback) {
  exec('docker ps --format "{{json .}}"', (error, stdout, stderr) => {
    if (error) {
      console.warn('⚠️ Docker not available, returning mock data');
      // Mock data format similar to docker ps JSON
      const mock = [
        {
          ID: 'mocked1',
          Image: 'nginx:latest',
          Command: '"nginx -g daemon off;"',
          CreatedAt: '2 hours ago',
          Status: 'Up 2 hours',
          Ports: '80/tcp',
          Names: 'mock-nginx'
        },
        {
          ID: 'mocked2',
          Image: 'redis:alpine',
          Command: '"redis-server"',
          CreatedAt: '5 hours ago',
          Status: 'Up 5 hours',
          Ports: '6379/tcp',
          Names: 'mock-redis'
        }
      ];
      return callback(null, mock);
    }
    try {
      const lines = stdout.trim().split('\n').filter(Boolean);
      const containers = lines.map(line => JSON.parse(line));
      callback(null, containers);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

// GET /api/system/containers – list Docker containers (or mock)
router.get('/containers', (req, res) => {
  getDockerContainers((err, containers) => {
    if (err) {
      console.error('❌ Error fetching containers:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve containers' });
    }
    res.json({ success: true, containers });
  });
});

module.exports = router;
