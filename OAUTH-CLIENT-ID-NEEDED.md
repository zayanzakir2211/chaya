# Quick OAuth Setup Guide

## What You Need to Do Right Now:

### Step 1: Create Netlify OAuth App (2 minutes)

1. Go to https://app.netlify.com/
2. Sign in or create account with GitHub
3. Click your profile picture (top right) → **"User settings"**
4. In left sidebar → **"Applications"**
5. Click **"New OAuth app"**
6. Fill in:
   - **Application name**: `Chaya Admin`
   - **Redirect URI**: `https://api.netlify.com/auth/done`
7. Click **"Register application"**
8. **COPY THE CLIENT ID** that appears

### Step 2: Tell Me Your Client ID

Once you have the Client ID, send it to me and I'll add it to your admin panel configuration.

### Step 3: Authorize the App

After I update the config:
1. Go to https://chayabd.pages.dev/admin/
2. Click "Login with GitHub"
3. Authorize the Chaya Admin app
4. You're in! Start managing content.

---

## Why This Error Happened

The previous setup tried to use Git Gateway, which requires creating a fake Netlify site. The OAuth app method is simpler and works directly with GitHub.

## What Changes

**Before (Git Gateway):**
- Required: Netlify site + Identity + Git Gateway setup
- Complex: Multiple steps on Netlify

**Now (OAuth App):**
- Required: Just create OAuth app + add Client ID
- Simple: 2 minutes total

---

**Next Step**: Create the OAuth app and send me the Client ID!
