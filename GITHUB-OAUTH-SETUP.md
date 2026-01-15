# GitHub OAuth Setup with Cloudflare Workers

## Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Chaya Admin`
   - **Homepage URL**: `https://chayabd.pages.dev`
   - **Authorization callback URL**: `https://chaya-oauth.YOUR_SUBDOMAIN.workers.dev/callback`
   
   (Replace YOUR_SUBDOMAIN with your Cloudflare Workers subdomain)
   
4. Click **"Register application"**
5. **Copy the Client ID**
6. Click **"Generate a new client secret"**
7. **Copy the Client Secret** (save it securely!)

## Step 2: Deploy OAuth Worker to Cloudflare

### Option A: Using Cloudflare Dashboard (Easiest)

1. Go to: https://dash.cloudflare.com/
2. Click **"Workers & Pages"** in left sidebar
3. Click **"Create"** → **"Create Worker"**
4. Name it: `chaya-oauth`
5. Click **"Deploy"**
6. Click **"Edit code"**
7. Replace all code with the contents of `oauth-worker.js` from your repo
8. **Update these lines** with your GitHub OAuth credentials:
   ```javascript
   const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
   const CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET';
   ```
9. Click **"Deploy"**

### Option B: Using Wrangler CLI

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Create `wrangler.toml`:
   ```toml
   name = "chaya-oauth"
   main = "oauth-worker.js"
   compatibility_date = "2024-01-01"
   
   [vars]
   CLIENT_ID = "your_github_client_id"
   CLIENT_SECRET = "your_github_client_secret"
   ```
4. Deploy: `wrangler deploy`

## Step 3: Update GitHub OAuth Callback URL

After deploying, your worker URL will be:
`https://chaya-oauth.YOUR_SUBDOMAIN.workers.dev`

Go back to GitHub OAuth App settings and update:
- **Authorization callback URL**: `https://chaya-oauth.YOUR_SUBDOMAIN.workers.dev/callback`

## Step 4: Update Admin Config

In `admin/index.html`, update the `base_url`:

```javascript
backend: {
  name: 'github',
  repo: 'zayanzakir2211/chaya',
  branch: 'main',
  base_url: 'https://chaya-oauth.YOUR_SUBDOMAIN.workers.dev',
  auth_endpoint: 'auth'
}
```

## Step 5: Test

1. Push changes to GitHub
2. Wait for Cloudflare Pages to deploy
3. Go to: https://chayabd.pages.dev/admin/
4. Click "Login with GitHub"
5. Authorize the app
6. You're in! 🎉

## How It Works

```
┌────────────────────────┐
│ chayabd.pages.dev      │
│ /admin                 │
└───────────┬────────────┘
            │ Login clicked
            ▼
┌────────────────────────┐
│ Cloudflare Worker      │
│ /auth                  │
│ (Redirects to GitHub)  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ GitHub OAuth           │
│ (User authorizes)      │
└───────────┬────────────┘
            │ Code returned
            ▼
┌────────────────────────┐
│ Cloudflare Worker      │
│ /callback              │
│ (Exchanges code)       │
│ (Returns token)        │
└───────────┬────────────┘
            │ Token received
            ▼
┌────────────────────────┐
│ Admin Panel            │
│ (Authenticated!)       │
│ (Can edit content)     │
└───────────┬────────────┘
            │ Save changes
            ▼
┌────────────────────────┐
│ GitHub API             │
│ (Commits to repo)      │
└───────────┬────────────┘
            │ Auto-deploy
            ▼
┌────────────────────────┐
│ Cloudflare Pages       │
│ (Site updated!)        │
└────────────────────────┘
```

## Security Notes

- Keep your Client Secret secure
- Use Cloudflare Worker secrets/environment variables in production
- The Worker only handles OAuth, all content goes directly to GitHub

## Cost

- **GitHub OAuth**: FREE
- **Cloudflare Workers**: FREE (100,000 requests/day)
- **Cloudflare Pages**: FREE
- **Total**: $0.00/month

## Troubleshooting

### "Invalid redirect_uri"
- Make sure the callback URL in GitHub OAuth settings matches your worker URL exactly
- Format: `https://chaya-oauth.YOURSUBDOMAIN.workers.dev/callback`

### "Bad credentials"
- Double-check CLIENT_ID and CLIENT_SECRET in the worker code
- Make sure there are no extra spaces or line breaks

### Worker not responding
- Check Cloudflare Workers dashboard for errors
- View real-time logs in the dashboard
