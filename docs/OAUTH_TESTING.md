# OAuth Manual Verification Guide

This document describes the manual verification procedure for Google and GitHub OAuth providers in Dermo.

## Prerequisites

1. Set valid credentials in `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```
2. In Google Cloud Console / GitHub Developer Settings, ensure authorized callback URLs are set to:
   - `http://localhost:4000/api/auth/callback/google`
   - `http://localhost:4000/api/auth/callback/github`
3. Ensure PostgreSQL is running (`docker compose up -d`).

---

## 1. Google OAuth Flow

1. Open `http://localhost:3000/auth/login` in your browser.
2. Click the **Google** button.
3. Verify the browser redirects to Google's OAuth consent screen (`accounts.google.com`).
4. Select or enter Google credentials and approve consent.
5. Verify redirect back to `http://localhost:3000/dashboard`.
6. Verify a session cookie is set (`dermo.session_token` or `better-auth.session_token`).
7. Verify that the user profile and session exist in PostgreSQL:
   ```sql
   SELECT id, email, name FROM "user";
   SELECT * FROM "account" WHERE "providerId" = 'google';
   SELECT * FROM "session";
   ```

---

## 2. GitHub OAuth Flow

1. Open `http://localhost:3000/auth/login` in an incognito browser window.
2. Click the **GitHub** button.
3. Verify the browser redirects to GitHub's authorization page (`github.com/login/oauth/authorize`).
4. Approve authorization.
5. Verify redirect back to `http://localhost:3000/dashboard`.
6. Verify that the user record and GitHub account record exist in PostgreSQL:
   ```sql
   SELECT id, email, name FROM "user";
   SELECT * FROM "account" WHERE "providerId" = 'github';
   ```

---

## 3. Account Linking Verification

Better Auth automatically links social providers to existing accounts with matching verified emails.

1. Register an account via email and password with `doctor@dermacareclinic.in`.
2. Log out via the dashboard sidebar.
3. Sign in using Google OAuth with the same email (`doctor@dermacareclinic.in`).
4. Verify that:
   - Only ONE record exists in the `"user"` table with that email.
   - TWO records exist in the `"account"` table for that user ID:
     - `providerId = 'credential'`
     - `providerId = 'google'`
5. Verify you are logged into `/dashboard` successfully.
