const functions = require('firebase-functions');
const { https } = require('firebase-functions');
const next = require('next');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set up Next.js app
const dev = process.env.NODE_ENV !== 'production';
const dir = path.join(__dirname, '..');
process.env.NODE_ENV = 'production';

// Create Next.js server
const app = next({
  dev,
  conf: {
    distDir: '.next',
  },
  dir
});

const handle = app.getRequestHandler();

// Create Firebase Function to handle all requests
exports.nextServer = functions.https.onRequest((req, res) => {
  console.log(`File requested: ${req.originalUrl}`);
  return app.prepare().then(() => handle(req, res));
});