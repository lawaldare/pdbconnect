/* eslint-disable */
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { resolve, dirname } = require('path');

/** * CONFIGURATION
 * These must match your Angular routes exactly
 */
const routes = ['', '/about', '/partners', '/join-us', '/services', '/contact'];

// ✅ Updated to match your actual EBI sub-directory
const BASE_URL = 'https://www.ebi.ac.uk/pdbe/pdbe-kb';

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      return `
    <url>
      <loc>${BASE_URL}${route}/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  // ✅ Path relative to the workspace root
  const outputPath = resolve(process.cwd(), 'dist/apps/kb-corporate-page/browser/sitemap.xml');

  try {
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(outputPath, sitemap);
    console.log(`\x1b[32m✅ Sitemap successfully generated at: ${outputPath}\x1b[0m`);
  } catch (err) {
    console.error('\x1b[31m❌ Error generating sitemap:\x1b[0m', err);
  }
}

generateSitemap();
