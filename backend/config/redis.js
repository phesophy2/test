const Redis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const farmingQueue = new Queue('farming', { connection: redis });
const postingQueue = new Queue('posting', { connection: redis });
const emailQueue = new Queue('email', { connection: redis });
module.exports = { redis, farmingQueue, postingQueue, emailQueue };
