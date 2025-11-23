# 📊 Google Sheets Auto-Sync Setup Guide

## Overview

This system automatically syncs your PDF catalog from Presented Sheet to `docs/catalog.json`, eliminating manual file editing!

## 🎯 How It Works

```
Google Sheet → GitHub Actions → catalog.json → Your App
```

**Benefits:**
- ✅ Edit PDFs in friendly spreadsheet interface
- ✅ Auto-syncs every hour (or on-demand)
- ✅ No more manual JSON editing
- ✅ Version controlled (Git commits)
- ✅ Works with your existing app

---

## 📋 Step 1: Create Your Google Sheet

### Sheet Structure

Create a Google Sheet with these columns (Case-insensitive):

| Title | Section | Link | Image | Updated | Authors | Year | Tags |
|-------|---------|------|-------|---------|---------|------|------|
| Introduction to Deep Learning | Foundational_ML_Deep_Learning | https://... | https://... | 2025-11-23 | John Doe | 2024 | ML, DL |

**Column Descriptions:**
- **Title** (required) - PDF title
- **Section** (required) - Category (e.g., `NLP_Transformers`, `Computer_Vision`)
- **Link** (required) - PDF download URL
- **Image** (optional) - Preview image URL
- **Updated** (optional) - Last update date (ISO format)
- **Authors** (optional) - Author names
- **Year** (optional) - Publication year
- **Tags** (optional) - Comma-separated tags

### Template

**📝 [Copy this Google Sheet template](https://docs.google.com/spreadsheets/d/your-template-id)**

Or create your own with the columns above.

### Make Sheet Public

1. Click **Share** button
2. Change to **"Anyone with the link can view"**
3. Click **Done**

---

## 🔑 Step 2: Get Google Sheets API Key

### Enable API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Library**
4. Search for **"Google Sheets API"**
5. Click **Enable**

### Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **API Key**
4. **Copy the API key** (save it securely!)
5. (Optional) Click **Edit API Key** → **Restrict Key**:
   - Application restrictions: **HTTP referrers**
   - API restrictions: **Google Sheets API**

---

## 🔧 Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add two secrets:

**Secret 1: GOOGLE_SHEETS_ID**
- Name: `GOOGLE_SHEETS_ID`
- Value: The ID from your sheet URL
  - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
  - Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

**Secret 2: GOOGLE_API_KEY**
- Name: `GOOGLE_API_KEY`
- Value: Your API key from Step 2

---

## ▶️ Step 4: Run the Sync

### Automatic Sync (GitHub Actions)

The workflow runs **automatically every hour**. No action needed!

**Check sync status:**
1. Go to **Actions** tab in GitHub
2. Look for "Sync Catalog from Google Sheets" workflow
3. View run history and logs

### Manual Sync (GitHub)

1. Go to **Actions** tab
2. Select "Sync Catalog from Google Sheets"
3. Click **Run workflow**
4. Select branch → **Run workflow**

### Local Sync (Your Computer)

**Run locally for immediate updates:**

```bash
# Set environment variables
export GOOGLE_SHEETS_ID="your-sheet-id"
export GOOGLE_API_KEY="your-api-key"

# Run sync
npm run sync-catalog
```

**Windows PowerShell:**
```powershell
$env:GOOGLE_SHEETS_ID="your-sheet-id"
$env:GOOGLE_API_KEY="your-api-key"
npm run sync-catalog
```

---

## 📊 Example Sheet Data

```
Title                          | Section                       | Link                | Image               | Updated
Introduction to Deep Learning  | Foundational_ML_Deep_Learning | https://example.pdf | https://img.png     | 2025-11-23
Transformers for NLP           | NLP_Transformers             | https://example2.pdf| https://img2.png    | 2025-11-22
```

---

## ✅ Verification

After syncing:

1. **Check commit history** - Look for auto-commit: "🔄 Auto-sync catalog from Google Sheets"
2. **Verify catalog.json** - Check that `docs/catalog.json` updated
3. **Test the app** - Refresh your app to see new PDFs

---

## 🔄 Workflow

### Adding New PDFs

1. Open your Google Sheet
2. Add a new row with PDF details
3. Wait for auto-sync (within 1 hour)
4. OR manually trigger sync in GitHub Actions
5. Done! PDF appears in your app

### Editing PDFs

1. Edit the row in Google Sheet
2. Sync runs automatically
3. Changes appear in app

### Removing PDFs

1. Delete the row in Google Sheet
2. Sync updates catalog
3. PDF removed from app

---

## 🛠️ Troubleshooting

### Sync Failed

**Check GitHub Actions logs:**
1. Go to **Actions** → Latest workflow run
2. Click on failed job
3. Check error messages

**Common issues:**
- Invalid API key → Re-check secrets
- Sheet not public → Update sharing settings
- Wrong Sheet ID → Verify URL
- Missing headers → Check column names

### No Changes Detected

- Workflow shows "Catalog is already up to date" ✅
- This is normal if sheet hasn't changed!

### API Quota Exceeded

- Google Sheets API has usage limits
- Hourly sync should be well within limits
- If exceeded, reduce sync frequency

---

## 🎨 Sheet Formatting Tips

- **Use Data Validation** for Section column (dropdown list)
- **Freeze first row** for easier scrolling
- **Add filters** to find PDFs quickly
- **Use conditional formatting** to highlight incomplete rows
- **Protect header row** from accidental edits

---

## 🔐 Security Notes

- ✅ API key is stored as GitHub secret (encrypted)
- ✅ Sheet is read-only (view permissions)
- ✅ No sensitive data is exposed
- ✅ All changes are version controlled

---

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Cron Syntax Reference](https://crontab.guru/)

---

## 💡 Pro Tips

1. **Test locally first** before relying on GitHub Actions
2. **Keep sheet organized** with clear section names
3. **Use ISO dates** for Updated column (YYYY-MM-DD)
4. **Add notes column** for internal tracking (won't sync)
5. **Backup your sheet** regularly (File → Download)

---

**You're all set! 🎉** 

Just edit your Google Sheet and watch your app update automatically!
