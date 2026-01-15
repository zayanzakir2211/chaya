# Netlify OAuth Setup for Cloudflare Pages

This guide shows you how to use Netlify's free OAuth service to authenticate with GitHub for your admin panel, while keeping your site hosted on Cloudflare Pages at **https://chayabd.pages.dev/**

## Why Netlify OAuth?

- **Free Forever**: Netlify's OAuth service is 100% free
- **No Hosting Required**: You don't need to host your site on Netlify
- **Easy Setup**: Takes ~5 minutes to configure
- **Secure**: Industry-standard OAuth 2.0 authentication

## Step 1: Create a Free Netlify Account

1. Go to https://app.netlify.com/signup
2. Click **"Sign up with GitHub"**
3. Authorize Netlify to access your GitHub account

## Step 2: Create a New Site on Netlify

1. After signing in, click **"Add new site"** → **"Import an existing project"**
2. Select **"GitHub"** as your Git provider
3. Choose your repository: **`zayanzakir2211/chaya`**
4. **Important**: Before clicking "Deploy", change these settings:
   - **Build command**: Leave blank or put `echo "OAuth only"`
   - **Publish directory**: Leave blank or put `public`
5. Click **"Deploy site"**

**Note**: The actual deployment will fail, but that's okay! We only need Netlify for OAuth authentication, not hosting.

## Step 3: Enable Netlify Identity & Git Gateway

1. In your new Netlify site dashboard, go to **"Site configuration"** → **"Identity"**
2. Click **"Enable Identity"**
3. Scroll down to **"Services"** section
4. Click **"Enable Git Gateway"**
5. In the Git Gateway settings:
   - Make sure **"Roles"** are disabled (default)
   - This allows any GitHub collaborator to access the admin

## Step 4: Configure Admin Panel

Your admin panel has already been updated to use Netlify Identity. The configuration in `admin/index.html` now uses:

```javascript
backend: {
  name: 'git-gateway',
  repo: 'zayanzakir2211/chaya',
  branch: 'main'
}
```

## Step 5: Access Your Admin Panel

1. Go to **https://chayabd.pages.dev/admin/** (your Cloudflare Pages site)
2. Click **"Login with Netlify Identity"**
3. The first time:
   - You'll be redirected to your Netlify site
   - Click **"Sign up"** (even though you have a Netlify account)
   - Enter the email you used for GitHub
   - Check your email and click the confirmation link
   - Set a password
4. After setup, you'll be able to login directly

## Step 6: Invite Other Admins (Optional)

To allow other GitHub collaborators to access the admin:

1. Go to your Netlify site → **"Site configuration"** → **"Identity"**
2. Click **"Invite users"**
3. Enter their email address
4. They'll receive an invitation email
5. Once they accept and set a password, they can access the admin

## Alternative: Skip Netlify Site Creation

If you don't want to create a fake deployment on Netlify:

1. Go to https://app.netlify.com/
2. Click your profile → **"User settings"** → **"Applications"**
3. Click **"New OAuth app"**
4. Fill in:
   - **Application name**: Chaya Admin
   - **Redirect URI**: `https://chayabd.pages.dev/admin/`
5. Copy the **Client ID**
6. Update your `admin/index.html` to use:

```javascript
backend: {
  name: 'github',
  repo: 'zayanzakir2211/chaya',
  branch: 'main',
  base_url: 'https://api.netlify.com',
  auth_endpoint: 'auth'
}
```

## How It Works

```
┌─────────────────┐
│ Cloudflare Pages│  ← Your site lives here (chayabd.pages.dev)
└────────┬────────┘
         │
         │ /admin
         │
         ▼
┌─────────────────┐
│  Admin Panel    │  ← Decap CMS interface
└────────┬────────┘
         │
         │ Login
         │
         ▼
┌─────────────────┐
│ Netlify OAuth   │  ← Handles GitHub authentication
│   (Free)        │     (only used for login)
└────────┬────────┘
         │
         │ Authenticated
         │
         ▼
┌─────────────────┐
│  GitHub API     │  ← Where your content is stored
└─────────────────┘
```

## Troubleshooting

### "Unable to access identity settings"
- Make sure you've enabled Identity on your Netlify site
- Check that Git Gateway is enabled

### "Failed to load entries"
- Verify your GitHub repo name is correct: `zayanzakir2211/chaya`
- Make sure your GitHub account has access to the repo

### "Repository not found"
- Go to GitHub → Settings → Applications → Netlify
- Make sure Netlify has access to your `chaya` repository

### Changes not appearing on Cloudflare
- After editing in admin, go to GitHub and verify the commit was made
- Cloudflare auto-deploys take 1-2 minutes
- Check Cloudflare Pages dashboard for deployment status

## Cost Breakdown

| Service | Purpose | Cost |
|---------|---------|------|
| Cloudflare Pages | Website hosting | **FREE** |
| Netlify Identity | OAuth authentication | **FREE** (up to 1,000 users) |
| GitHub | Code & content storage | **FREE** |
| Decap CMS | Admin interface | **FREE** (open source) |

**Total monthly cost: $0.00** 🎉

## Next Steps

1. Test the admin panel by creating a test job circular
2. Verify the changes appear on your live site
3. Invite other team members if needed
4. Start managing your content through the admin panel!

---

**Need help?** Check the commit history on GitHub to see if changes are being saved.
