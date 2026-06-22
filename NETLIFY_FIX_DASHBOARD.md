# Fix Dashboard Netlify Deployment

## Problem
Dashboard deployment fails because Netlify is looking for `package.json` at the repo root, but it's in `/dashboard` folder.

## Solution

Go to your dashboard Netlify site: https://app.netlify.com/sites/dashbord-get-mumm/settings

### Step 1: Update Build Settings
1. Go to **Site settings** → **Build & deploy** → **Continuous deployment**
2. Click on **Edit settings**
3. Update the following:

```
Base directory: dashboard
Build command: npm install --force && npm run build
Publish directory: dist/dashboard
Node version: 20.19.0
```

### Step 2: Add Environment Variables
Go to **Site settings** → **Build & deploy** → **Environment**

Add these variables:
```
NG_APP_API_URL = http://get-mumm.runasp.net
NG_APP_SUPABASE_URL = https://lhnlhnrtxzpeylvjcisk.supabase.co
NG_APP_SUPABASE_ANON_KEY = (your actual key from .env.local)
NODE_ENV = production
```

### Step 3: Trigger Deploy
1. Go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**

Or push a new commit to trigger auto-deploy.

---

## What Changed Locally

1. `dashboard/netlify.toml` - Updated base to "dashboard" folder
2. `netlify-dashboard.toml` - Reference config file with all settings
3. Build command now uses `--force` flag for npm to handle any peer dependency issues

---

## Verify After Deploy

1. Check build logs for success
2. Open https://dashbord-get-mumm.netlify.app
3. Check browser console for `[ENV] API URL: http://get-mumm.runasp.net`
4. Try loading a page (menu, orders, etc.) to verify API connection

---

## If Deploy Still Fails

1. Check Netlify build logs for exact error
2. Verify git branch is `main` (not `develop`)
3. Clear Netlify cache: **Deploys** → **Clear cache and retry**
4. Check that Node version is 20.19.0 (not auto)
