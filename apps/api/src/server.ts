import { createApp } from './app';
import { config } from './config';

// Validate DATABASE_URL
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.error('❌ FATAL: DATABASE_URL is not configured. Exiting.');
  process.exit(1);
}

// Validate Better Auth secret
if (!process.env.BETTER_AUTH_SECRET) {
  console.warn('⚠️ BETTER_AUTH_SECRET not set. Using insecure default for development.');
}

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
  ✨ Dermo Clinic API Server is running!
  📡 URL: ${config.appUrl}
  🩺 Health: ${config.appUrl}/health
  📲 WhatsApp Webhook: ${config.appUrl}/api/v1/webhooks/whatsapp
  💳 Environment: ${config.nodeEnv}
  ⚡ LangChain & Gemini AI Engine: Active
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
