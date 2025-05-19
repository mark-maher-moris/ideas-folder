# My Folders - Project Management Application

## Deployment Instructions

### Prerequisites

- Firebase account with a project set up
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js and npm installed

### Steps to Deploy to Firebase Hosting

1. **Login to Firebase**

   ```bash
   firebase login
   ```

2. **Firebase Project ID**

   Your Firebase project ID is already configured in `.firebaserc` as `projects-hub-io`. If you need to use a different project, update the file:

   ```json
   {
     "projects": {
       "default": "projects-hub-io"
     }
   }
   ```

3. **Build and Deploy**

   Run the deploy script which will build the application and deploy it to Firebase:

   ```bash
   npm run deploy
   ```

   Alternatively, you can run the build and deploy steps separately:

   ```bash
   npm run export
   firebase deploy --only hosting
   ```

4. **Access Your Deployed Site**

   After successful deployment, Firebase will provide a URL where your site is hosted. You can also access it through the Firebase console.

### Troubleshooting

- If you encounter any issues with the Next.js export, make sure your application is compatible with static exports.
- For dynamic routes, ensure you're using `getStaticProps` and `getStaticPaths` appropriately.
- If you need to update the Firebase hosting configuration, edit the `firebase.json` file.

### Local Development

To run the application locally:

```bash
npm run dev
```

This will start the development server at http://localhost:3000.
