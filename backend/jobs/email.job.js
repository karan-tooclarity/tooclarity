const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const logger = require('../config/logger');
const { sendPaymentSuccessEmail } = require('../services/otp.service');

const QUEUE_NAME = 'email-queue';

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || '',
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

exports.addPaymentSuccessEmailJob = async (emailData) => {
  await emailQueue.add('sendPaymentSuccessEmail', emailData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
  });
};

const createWorker = () => {
  new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info(`Processing email for order: ${job.data.orderId}`);
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