const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const logger = require('../config/logger');
const { sendPaymentSuccessEmail } = require('../services/otp.service');

// --- Queue Name ---
const QUEUE_NAME = 'analytics-queue';

// --- Shared Redis Connection (reused by both Queue + Worker) ---
const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || '',
  maxRetriesPerRequest: null,
});

// --- QUEUE ---
const analyticsQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

// --- PRODUCER (Add Job) ---
exports.addAnalyticsJob = async (data) => {
  try {
    await analyticsQueue.add('updateAnalytics', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
    logger.info(`[Queue] Added analytics job for user: ${data.userId}, course: ${data.courseId}`);
  } catch (err) {
    logger.error('[Queue] Failed to add analytics job:', err);
  }
};

// --- WORKER (Process Job) ---
const createWorker = () => {
  new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info(`Processing analytics for order: ${job.data.orderId}`);
      await sendPaymentSuccessEmail(job.data);
    },
    {
      connection: redisConnection,
      concurrency: 5,
      limiter: { max: 10, duration: 1000 },
    }
  );
};

exports.createWorker = createWorker;
