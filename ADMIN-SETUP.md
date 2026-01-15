# Chaya NGO Website - Admin Panel Setup Guide

## Overview
This website uses **Decap CMS** (formerly Netlify CMS) for content management. Admin can edit job circulars, projects, and images through a visual interface.

## File Structure
```
chaya/
├── admin/
│   └── index.html          # Admin panel
├── _data/
│   ├── jobs/               # Job circular JSON files
│   ├── projects/           # Project JSON files
│   ├── jobs-manifest.json  # List of job files
│   ├── gallery.json        # Photo gallery data
│   ├── other-activities.json
│   └── settings.json       # Site settings
├── assets/                 # Images
├── index.html
├── projects.html
└── niyog.html              # Dynamic job page
```

## Setup Instructions

### Step 1: Create OAuth App on GitHub

1. Go to **GitHub Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name:** `Chaya CMS`
   - **Homepage URL:** `https://your-site.pages.dev`
   - **Authorization callback URL:** `https://your-site.pages.dev/api/auth/callback`
3. Click **Register application**
4. Copy the **Client ID** and generate a **Client Secret**

### Step 2: Create Auth Function on Cloudflare

Since Cloudflare Pages doesn't have built-in OAuth, you need to create a separate auth worker or use an external OAuth provider.

**Option A: Use Netlify for OAuth only (Easiest)**
1. Create a free Netlify account
2. Create a new site (can be empty)
3. Go to **Site settings** → **Identity** → Enable Identity
4. Go to **Site settings** → **Identity** → **External providers** → Add GitHub
5. Update your admin/index.html `base_url` to your Netlify site URL

**Option B: Deploy OAuth Worker to Cloudflare**
Create a Cloudflare Worker for OAuth handling.

### Step 3: Update Admin Config

Edit `admin/index.html` and update:
```javascript
backend: {
  name: 'github',
  repo: 'zayanzakir2211/chaya',  // Your repo
  branch: 'main',
  base_url: 'https://your-netlify-site.netlify.app'  // OAuth provider URL
}
```

### Step 4: Add Collaborators

1. Go to your GitHub repo **Settings** → **Collaborators**
2. Add GitHub users who should have admin access
3. They can now login at `https://your-site.pages.dev/admin`

---

## Admin Usage Guide

### Accessing Admin Panel
1. Go to: `https://your-site.pages.dev/admin`
2. Click "Login with GitHub"
3. Authorize the app (first time only)

### Managing Job Circulars

**Add New Job:**
1. Click "নিয়োগ বিজ্ঞপ্তি (Job Circulars)"
2. Click "New Job Circular"
3. Fill in all fields
4. Click "Publish"

**Edit Existing Job:**
1. Click on the job title
2. Make changes
3. Click "Publish"

**Deactivate Job (without deleting):**
1. Open the job
2. Uncheck "সক্রিয় (Active)"
3. Save - job won't show on website but data is preserved

**Delete Job:**
1. Open the job
2. Click "Delete"

### Managing Projects

Same process as jobs - add, edit, or delete projects.

### Managing Gallery

1. Click "ফটো গ্যালারি (Photo Gallery)"
2. Add/remove images from the list
3. Images are uploaded to `assets/` folder

---

## Important Notes

### When Adding New Jobs via Admin:
The CMS will create new JSON files in `_data/jobs/`. You need to update `_data/jobs-manifest.json` to include the new filename, OR modify the JavaScript to scan the folder.

### Alternative: Direct JSON Editing
Admins can also edit JSON files directly on GitHub:
1. Go to repo → `_data/jobs/` folder
2. Edit the JSON file
3. Commit changes
4. Site auto-deploys

### File Naming Convention
- Jobs: `position-name-year.json` (e.g., `rin-kormokhorta-2025.json`)
- Projects: `XX-name.json` where XX is order number

---

## Troubleshooting

### "Unable to login" Error
- Check OAuth callback URL matches exactly
- Ensure GitHub OAuth app credentials are correct
- Clear browser cache and try again

### Changes Not Appearing
- Wait 1-2 minutes for Cloudflare to rebuild
- Clear browser cache
- Check if `jobs-manifest.json` includes the new file

### Images Not Uploading
- Check file size (keep under 10MB)
- Use JPG/PNG format
- Check Cloudflare Pages asset limits

---

## Quick Reference

| Task | Location |
|------|----------|
| Add job | Admin → Job Circulars → New |
| Edit job | Admin → Job Circulars → Click title |
| Add project | Admin → Projects → New |
| Add gallery image | Admin → Photo Gallery → Add |
| Site settings | Admin → Site Settings |

---

## Support
For technical issues, contact the developer.
