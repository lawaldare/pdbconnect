const { execSync } = require('child_process');

const url = 'https://example.com';

try {
  const result = execSync(`npx lighthouse ${url} --quiet --chrome-flags="--headless" --output=json --output-path=stdout`, {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const json = JSON.parse(result);
  console.log('✅ Lighthouse Performance Score:', json.categories.performance.score * 100);
} catch (err) {
  console.error('❌ Lighthouse failed:', err.message);
}
