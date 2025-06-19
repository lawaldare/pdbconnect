# 🧪 Performance Metrics in CI/CD

This document explains how we collect and track web performance metrics using [Lighthouse](https://github.com/GoogleChrome/lighthouse), integrated into our CI/CD pipeline, with optional export to Google Sheets.

---

## ✅ Purpose

We aim to ensure each deployment maintains acceptable performance standards by automatically measuring key metrics like:

- **Performance Score**
- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Total Blocking Time (TBT)**
- **Cumulative Layout Shift (CLS)**
- **Speed Index**

Metrics are logged during CI with each route is tested in both **desktop** and **mobile** modes, with results summarized and optionally sent to a Google Sheet.

---

## 📂 Folder Structure

All performance scripts are under:

```
/performance_scripts/
  ├── hello.js                 # Simple sanity-check script
  ├── perf-check.js            # Actual metrics collector
```

---

## 📜 How to Run Locally

1. Simple test in another terminal:

   ```bash
   node performance_scripts/hello.js
   ```

2. Start your app locally:

   ```bash
   npx nx serve connect
   ```

3. To actually run the performance collector in another terminal:

   ```bash
   node performance_scripts/perf-check.js
   ```

---

## 🧪 perf-check.js Overview

- Launches Lighthouse for each route
- Navigates through a list of pages (defined in `ROUTES_TO_TEST`)
- Collects metrics in both desktop and mobile presets
- Computes avg, min, max, and identifies minEntryId, maxEntryId per metric
- Outputs results to CI logs and/or Google Sheets

Metrics are collected per page and summarized (avg, min, max).

---

## 🛠️ CI/CD Integration

A job like this is added in `.gitlab-ci.yml`:

```yaml
performance-check:
  stage: build
  image: node:18
  extends: .distributed
  allow_failure: true
  script: ...
```

- ✅ `allow_failure: true` ensures this step won't block deployment
- ⚙️ wait-on ensures the server is ready before testing
- 🌐 Targets http://localhost:4200
- ✅ --sendToSheets flag sends metrics to your Google Sheet via webhook
- 📦 It runs after `build` but before `deploy`

---

## 📈 Output & Tracking

By default, logs are printed to CI console. You can extend it to:

- Send results to **Google Sheets** via webhook
- Track trends in **Looker Studio** (planned)

Each Google Sheets row includes:

- Timestamp
- Route group (e.g. pdb)
- Metric (e.g. FCP)
- Average / Min / Max values
- Entry ID for min/max

---

## 🧷 Configuration

Edit `ROUTES_TO_TEST` in `perf-check.js` to define which routes to test.

Grouped examples:

```js
const ROUTES_TO_TEST = {
  '/pdb/': ['1cbs', '2hhb', '3eml'],
  '/ligand/': ['ATP', 'HEM', 'GTP'],
};
```

---

## 🔐 Security Notes

- Keep webhooks or sheet keys secret (use CI/CD secrets)
- Avoid exposing internal URLs in public dashboards

---

## 🧪 Dev Dependencies

Installed using:

```bash
npm install --save-dev lighthouse wait-on
```

---

## ✨ Future Ideas

- Threshold alerts
- Looker Studio integration
