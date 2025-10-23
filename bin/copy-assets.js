import fs from 'fs';
import path from 'path';

const distRoot = 'dist/apps';
const nxJson = JSON.parse(fs.readFileSync('workspace.json', 'utf8'));

// Utility: make dir recursively
const mkdirp = (dir) => fs.mkdirSync(dir, { recursive: true });

// Map of appName → baseHref
// You can extend this if some apps use special paths
const baseHrefMap = {
  connect: ['/pdbe/entry/', '/pdbe/pdbe-kb/', '/pdbe/connect/'],
  // entry: ["/pdbe/entry/"], // Example of individual mapping if needed
};

for (const [appName, app] of Object.entries(nxJson.projects)) {
  const outDir = path.join(distRoot, appName);
  const srcAssets = path.join(outDir, 'assets');
  if (!fs.existsSync(srcAssets)) continue;

  const baseHrefs = baseHrefMap[appName] || ['/pdbe/entry/'];
  for (const href of baseHrefs) {
    const target = path.join(outDir, href, 'assets');
    mkdirp(target);
    fs.cpSync(srcAssets, target, { recursive: true });
    console.log(`✅ Copied assets for ${appName} → ${href}`);
  }
}
