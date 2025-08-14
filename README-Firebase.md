# Firebase Hosting for HealthHub

This repo is configured to deploy the React frontend (`frontend/`) to Firebase Hosting.

## Prereqs
- Node 18+
- Firebase CLI: `npm i -g firebase-tools`
- A Firebase project (get its Project ID)

## One-time local setup
1. Login and set default project
   ```bash
   firebase login
   firebase use REPLACE_WITH_YOUR_PROJECT_ID
   ```
   Or edit `.firebaserc` to set your project id.

2. Build the app
   ```bash
   npm --prefix frontend ci
   npm --prefix frontend run build
   ```

3. Deploy
   ```bash
   firebase deploy --only hosting
   ```

## CI/CD (GitHub Actions)
- Add repo secrets:
  - `FIREBASE_PROJECT_ID` = your project id
  - `FIREBASE_TOKEN` = output of `firebase login:ci`
- Push to `main`/`master` to deploy.

## Notes
- Hosting serves `frontend/build` with SPA rewrites to `/index.html`.
- Adjust cache headers in `firebase.json` as needed.

# HealthHub – Firebase + Stripe + JWT

## Secrets & Params
- STRIPE_SECRET_KEY (secret)
- STRIPE_WEBHOOK_SECRET (secret)
- JWT_SIGNING_KEY (secret)
- PLATFORM_FEE_PERCENT (string param, e.g., 0.15)
- APP_BASE_URL (string param, e.g., https://<your-site>.web.app)

## Local
- Install deps:
  - cd functions && npm install && npm run build
  - cd ../frontend && npm install && npm run build
- Emulators:
  - firebase emulators:start
- Stripe webhook forwarding:
  - stripe listen --forward-to http://127.0.0.1:5001/<YOUR_PROJECT_ID>/us-central1/stripeWebhook
- REST examples in .vscode/rest.http (set YOUR_PROJECT_ID)

## Deploy
- firebase deploy --only functions,hosting

## Endpoints
- POST /api/experts/connect
- POST /api/payments/checkout
- POST /api/access/grant
- POST /webhooks/stripe

## Firestore Collections
- experts/{id}: stripeConnectId, displayName, status
- jobs/{id}: userId, expertId, title, amountCents, currency, status
- payments/{id}: jobId, userId, expertId, stripeSessionId, paymentIntentId, amountCents, feeCents, status

## Notes
- CORS is permissive for development; lock down origins for production.
- success.html and cancel.html are static pages in frontend/public/.
