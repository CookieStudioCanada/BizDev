# 🚀 React App Deployment to GitHub Pages - Complete Recipe

## Overview
This guide shows you how to deploy any React app to GitHub Pages using GitHub Actions for automatic deployment from the main branch.

## Prerequisites
- React app built with Vite (or Create React App)
- GitHub repository
- Node.js 18+ installed locally

## Step-by-Step Recipe

### 1. Configure Vite for GitHub Pages

**File: `vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/YOUR_REPO_NAME/', // 👈 Critical: Replace with your repo name
})
```

### 2. Configure React Router (if using routing)

**File: `src/App.tsx`**
```typescript
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router basename="/YOUR_REPO_NAME"> {/* 👈 Match your repo name */}
      {/* Your app content */}
    </Router>
  );
}
```

### 3. Add GitHub Pages Routing Support

**File: `public/404.html`**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Your App Name</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

**File: `index.html` (add to `<head>`)**
```html
<!-- Start Single Page Apps for GitHub Pages -->
<script type="text/javascript">
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
<!-- End Single Page Apps for GitHub Pages -->
```

### 4. Prevent Jekyll Processing

**File: `public/.nojekyll`**
```
(empty file - just create it)
```

### 5. Create GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Configure GitHub Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **"GitHub Actions"**
5. Save settings

### 7. Deploy

```bash
# Commit all changes
git add .
git commit -m "feat: Configure GitHub Pages deployment"
git push origin main

# GitHub Actions will automatically build and deploy!
```

## Your Site URL
Your app will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Troubleshooting

### Common Issues:

1. **Blank page**: Check that `base` in `vite.config.ts` matches your repo name
2. **Routing doesn't work**: Ensure `basename` in Router matches your repo name
3. **Build fails**: Check Node.js version in workflow (use 18+)
4. **Assets not loading**: Verify `.nojekyll` file exists in `public/`

### Debug Steps:

1. Check GitHub Actions logs in the **Actions** tab
2. Verify GitHub Pages is set to "GitHub Actions" source
3. Test build locally: `npm run build && npm run preview`
4. Check browser console for errors

## Alternative: Manual gh-pages Deployment

If you prefer manual deployment:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy manually
npm run deploy
```

## Key Differences for Different Bundlers

### Vite (Current)
- `base: '/repo-name/'` in `vite.config.ts`
- Build output: `dist/`

### Create React App
- `"homepage": "https://username.github.io/repo-name"` in `package.json`
- Build output: `build/`

### Next.js
- `basePath: '/repo-name'` in `next.config.js`
- `output: 'export'` for static export
- Build output: `out/`

## Success Checklist

- ✅ `vite.config.ts` has correct `base` path
- ✅ Router has correct `basename` (if using routing)
- ✅ `404.html` and routing script added
- ✅ `.nojekyll` file in `public/`
- ✅ GitHub Actions workflow created
- ✅ GitHub Pages source set to "GitHub Actions"
- ✅ All files committed and pushed

---

**🎉 That's it! Your React app should now be live on GitHub Pages with automatic deployment on every push to main!** 