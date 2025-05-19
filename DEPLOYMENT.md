# Next.js Firebase Deployment Guide

## Overview

This guide explains how to deploy your Next.js application with Firebase hosting using the `standalone` output mode. The configuration has been updated to fix the issue where the server code was being displayed instead of the actual application.

## What Was Fixed

The issue was that Firebase hosting was incorrectly configured to serve the `server.js` file directly as a static file, rather than executing it as a Node.js application. The updated configuration:

1. Uses Firebase Functions to run the Next.js server
2. Properly routes all requests to the Next.js application
3. Configures the correct runtime environment (Node.js 18)

## Deployment Steps

1. **Build your Next.js application**

   ```bash
   npm run build
   ```

2. **Deploy to Firebase**

   ```bash
   firebase deploy
   ```

   Or to deploy only hosting:

   ```bash
   firebase deploy --only hosting:myfolders-io,functions
   ```

## Configuration Files Updated

- **firebase.json**: Updated to use Firebase Functions instead of directly serving server.js
- **index.js**: Created in the .next/standalone directory to handle Firebase Functions integration
- **package.json**: Updated with Firebase Functions dependencies

## Troubleshooting

If you encounter any issues:

1. Make sure you have the Firebase CLI installed and are logged in

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. Verify your Firebase project is correctly set up

   ```bash
   firebase projects:list
   ```

3. Check Firebase logs if the deployment succeeds but the site doesn't work

   ```bash
   firebase functions:log
   ```

4. For local testing before deployment:
   ```bash
   firebase emulators:start
   ```
