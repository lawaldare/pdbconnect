/**
 *
 * DEPRECATED because of web-vitals
 *
 * Requires npm install puppeteer and web-vitals
 *
 * Requires file web-vitals.ts with:
 *
 * import { onTTFB, onFCP, onLCP, onINP } from 'web-vitals';
 * (window as any).webVitalsResults = {};
 *
 * const captureMetric = (name: string) => (metric: any) => {
 *   (window as any).webVitalsResults[name] = metric;
 * };
 *
 * onTTFB(captureMetric('TTFB'));
 * onFCP(captureMetric('FCP'));
 * onLCP(captureMetric('LCP'));
 * onINP(captureMetric('INP'));
 *
 * Requires on main.ts:
 * import './web-vitals';
 * import { bootstrapApplication } from '@angular/platform-browser';
 *
 */

const puppeteer = require('puppeteer');

const ROUTE_GROUPS = {
  pdb: ['1cbs', '4hhb', '2vta', '5xnl', '6lu7'],
  // ligand: ['HEM', 'ATP', 'FAD', 'NAD', 'MG'],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const resultsByGroup = {};

  for (const [group, ids] of Object.entries(ROUTE_GROUPS)) {
    resultsByGroup[group] = [];

    for (const id of ids) {
      const url = group === 'pdb' ? `http://localhost:4200/pdb/${id}` : `http://localhost:4200/ligand/${id}`;

      await page.goto(url, { waitUntil: 'networkidle0' });
      console.log(`\n🌐 URL accessed: ${url}`);

      // Wait for the tab button and click to trigger interaction (helps INP/LCP)
      try {
        await page.waitForSelector('#mat-tab-group-0-label-1', { timeout: 5000 });
        await page.click('#mat-tab-group-0-label-1');
        console.log('✅ Simulated user interaction (tab click)');
      } catch (err) {
        console.warn('⚠️ Could not find tab to click, skipping interaction');
      }

      // Wait to allow LCP/INP to be measured
      await delay(1500); // wait to allow LCP/INP to settle

      // Extract the global window.webVitalsResults
      const metrics = await page.evaluate(() => {
        return window.webVitalsResults || {};
      });

      console.log(`✅ [${group}] ${url}`, metrics);
      resultsByGroup[group].push(metrics);
    }
  }

  await browser.close();

  // ✅ Summarize
  for (const [group, values] of Object.entries(resultsByGroup)) {
    const summary = {};

    for (const metric of ['TTFB', 'FCP', 'LCP', 'INP']) {
      const numbers = values.map((v) => v[metric]?.value ?? 0);
      const valid = numbers.filter((n) => n > 0);
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length || 0;
      summary[metric] = {
        avg: avg.toFixed(2),
        min: Math.min(...valid).toFixed(2),
        max: Math.max(...valid).toFixed(2),
      };
    }

    console.log(`\n📊 Group: ${group}`);
    console.table(summary);
  }
})();
