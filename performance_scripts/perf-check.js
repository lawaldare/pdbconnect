const fs = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');
const os = require('os');
const https = require('https');

const sendToSheets = process.argv.includes('--sendToSheets');
const branchArg = process.argv.find((arg) => arg.startsWith('--branch='));

const ROUTE_GROUPS = {
  pdb: ['1cbs', '4hhb', '2vta', '5xnl', '6lu7'],
};
const BASE_URL = 'http://localhost:4200';
const METRICS = ['performanceScore', 'first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'];
const WEBHOOK_ID = 'AKfycbzYdX0_hatrzs6hDTK3TF37mf97MtG56BqztsjPFmlcRbPUTDvPrlPQ0q9iH3OjHlQC';
const branchName = branchArg ? branchArg.split('=')[1] : 'unknown';

const sendPost = (data, url) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => resolve(responseData));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

const getLighthouseMetrics = (url, index, preset) => {
  const tmpFile = join(os.tmpdir(), `lh-${preset}-${index}.json`);
  try {
    // '--verbose',
    const command = [
      `npx lighthouse ${url}`,
      '--quiet',
      '--chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"',
      `--preset=${preset}`,
      '--throttling-method=provided',
      '--only-categories=performance',
      `--output=json --output-path="${tmpFile}"`,
    ].join(' ');

    execSync(command, { stdio: 'pipe' });
    const json = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    fs.unlinkSync(tmpFile);

    const audits = json.audits;
    const result = {
      performanceScore: (json.categories.performance.score ?? 0) * 100,
    };

    METRICS.slice(1).forEach((id) => {
      result[id] = audits[id]?.numericValue ?? 0;
    });

    return result;
  } catch (err) {
    console.error(`❌ Lighthouse (${preset}) failed for ${url}:`, err.message);
    return Object.fromEntries(METRICS.map((id) => [id, 0]));
  }
};

const summarize = (metricsArray, metricName, entryIds) => {
  const values = metricsArray.map((m, i) => ({ value: m[metricName], id: entryIds[i] })).filter((v) => v.value > 0);
  if (!values.length) return { avg: '-', min: '-', max: '-', minId: '-', maxId: '-' };

  const avg = values.reduce((a, b) => a + b.value, 0) / values.length;
  const minEntry = values.reduce((min, curr) => (curr.value < min.value ? curr : min));
  const maxEntry = values.reduce((max, curr) => (curr.value > max.value ? curr : max));

  return {
    avg: avg.toFixed(1),
    min: minEntry.value.toFixed(1),
    max: maxEntry.value.toFixed(1),
    minEntryId: minEntry.id,
    maxEntryId: maxEntry.id,
  };
};

const sendSummaryToSheets = async (mode, group, summary) => {
  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    mode,
    group,
    branch: branchName,
    ...Object.fromEntries(
      Object.entries(summary).flatMap(([metric, { avg, min, max, minEntryId, maxEntryId }]) => [
        [`${metric}_avg`, avg],
        [`${metric}_min`, min],
        [`${metric}_max`, max],
        [`${metric}_minEntryId`, minEntryId],
        [`${metric}_maxEntryId`, maxEntryId],
      ])
    ),
  };

  const json = JSON.stringify(payload);
  try {
    // execSync(`curl -s -X POST -H "Content-Type: application/json" -d '${json}' https://script.google.com/macros/s/${WEBHOOK_ID}/exec`);
    await sendPost(payload, `https://script.google.com/macros/s/${WEBHOOK_ID}/exec`);
    console.log('📤 Sent summary to Google Sheets');
  } catch (err) {
    console.error('❌ Failed to send to Google Sheets:', err.message);
  }
};

(async () => {
  const resultsByGroup = { desktop: {}, mobile: {} };
  let counter = 0;

  for (const [group, ids] of Object.entries(ROUTE_GROUPS)) {
    resultsByGroup.desktop[group] = [];
    resultsByGroup.mobile[group] = [];

    for (const id of ids) {
      const url = `${BASE_URL}/${group}/${id}`;
      console.log(`\n🌐 Testing: ${url}`);

      const desktopMetrics = getLighthouseMetrics(url, ++counter, 'desktop');
      console.log(`✅ Desktop Metrics:`, desktopMetrics);
      resultsByGroup.desktop[group].push(desktopMetrics);

      const mobileMetrics = getLighthouseMetrics(url, counter, 'perf');
      console.log(`📱 Mobile Metrics:`, mobileMetrics);
      resultsByGroup.mobile[group].push(mobileMetrics);
    }
  }

  for (const mode of ['desktop', 'mobile']) {
    console.log(`\n=== 📊 ${mode.toUpperCase()} SUMMARY ===`);
    for (const [group, runs] of Object.entries(resultsByGroup[mode])) {
      console.log(`\n🔹 Group: ${group}`);
      const ids = ROUTE_GROUPS[group];

      const summary = {};
      for (const metric of METRICS) {
        summary[metric] = summarize(runs, metric, ids);
      }
      console.table(summary);

      if (sendToSheets) {
        await sendSummaryToSheets(mode, group, summary);
      }
    }
  }
})();
