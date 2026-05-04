# The Sixth Element — Website

Specialty coffee by day, natural wine by night. Richmond-upon-Thames.

## Local Development

```bash
npm install
npm run dev        # starts dev server on http://localhost:3000
```

## Build for Production

```bash
npm run build      # outputs static files to dist/
npm run preview    # preview the production build locally
```

## Deploy

### Option A: Vercel (recommended — 2 minutes)

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy
vercel

# Follow the prompts — done. You'll get a live URL.
# For production: vercel --prod
```

### Option B: Netlify

```bash
npm run build
# Drag the dist/ folder onto https://app.netlify.com/drop
# Or: npm i -g netlify-cli && netlify deploy --prod --dir=dist
```

### Option C: GitHub Pages

```bash
npm run build

# Push dist/ to gh-pages branch:
npx gh-pages -d dist
```

Add this to `vite.config.js` if your repo name isn't the root:
```js
base: '/your-repo-name/',
```

### Option D: AWS EC2 Micro (free tier)

```bash
# On your instance:
sudo apt update && sudo apt install -y nginx
# Upload the dist/ folder contents to /var/www/html/
sudo systemctl restart nginx
```

## Project Structure

```
sixth-element/
├── index.html          # Root HTML with SEO meta tags & structured data
├── package.json
├── vite.config.js
├── api/
│   ├── book.js         # Booking serverless function (email + Google Sheet)
│   └── admin-auth.js   # Admin authentication (login + JWT tokens)
├── public/
│   └── favicon.svg     # Brand favicon
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Full application (all pages & components)
```

## Admin Panel Setup

The admin panel is accessed at `yoursite.com?admin=true` and requires authentication.

### 1. Set environment variables in Vercel

```bash
# Admin credentials
vercel env add ADMIN_USERNAME      # e.g. "owner"
vercel env add ADMIN_PASSWORD      # a strong passphrase

# Token signing secret (generate one with this command):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
vercel env add ADMIN_SECRET
```

### 2. Access the panel

1. Navigate to `https://yoursite.com?admin=true`
2. Enter the username and password you set above
3. Session lasts 12 hours (stored in browser sessionStorage)
4. Click "Sign Out" or close the browser to end the session

### 3. What the admin panel controls

- **Cocktails section** — toggle between "Coming Soon" teaser and full live menu
- **Instagram feed** — show/hide on homepage
- **Reservations** — enable/disable the booking system
- **Seating durations** — brunch and evening table time limits
- **Delivery platforms** — set status (Live/Coming Soon/Hidden), URLs, and taglines for Deliveroo, Uber Eats, and Just Eat

## Customisation Checklist

Before going live, replace these placeholders:

- [ ] `public/og-image.jpg` — add a 1200×630 social share image
- [ ] Update the address in the Contact page with the real address
- [ ] Update the phone number
- [ ] Set delivery platform URLs in admin panel once onboarded
- [ ] Add Google Maps embed API key for the map placeholder
- [ ] Connect the Instagram feed (set Elfsight or Curator.io widget ID in App.jsx)
- [ ] Configure booking emails (see BOOKING_SETUP.md)
- [ ] Wire up the contact form to an email service (e.g. Formspree, Resend)
- [ ] Set admin credentials (see Admin Panel Setup above)
- [ ] Add real food/drink photography
- [ ] Upload actual logo SVG files
