---
name: Alpha Bit Shop stack
description: Key architecture decisions for the Alpha Bit Gadget Shop rebuild on Replit.
---

**Stack:** React+Vite frontend (artifact: alphabit-shop, preview path `/`), Express/Node backend (artifact: api-server, port 8080), MongoDB Atlas.

**DB name:** `alphabit_shop_replit` — intentionally separate from user's other project on the same Atlas cluster.

**Payment:** AlphaBitPay at `https://alphabitpay.com/api` (no www). Redirect URLs hardcoded to `https://alphabit.sbs`.

**Auth:** JWT in localStorage. `setAuthTokenGetter` called in main.tsx to attach Bearer token to all API requests. Admin override via ADMIN_EMAIL/ADMIN_PASSWORD env secrets.

**Why routing was blank:** Wouter v3 `/:rest*` catch-all didn't match `/`. Fixed by splitting admin vs store with `useLocation().startsWith('/admin')`.

**Products:** 500 products from Emergent backup ZIP. Import script at `scripts/import-backup.mjs`. Run: `node scripts/import-backup.mjs <path-to-zip>`.

**Secrets configured:** MONGO_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, ALPHABITPAY_*, SMTP_*, FRONTEND_URL.
