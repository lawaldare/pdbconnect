import fs from 'fs';
import path from 'path';

const distRoot = 'dist/apps';

// Utility: create directory recursively
const mkdirp = (dir) => fs.mkdirSync(dir, { recursive: true });

// Map of appName → baseHref(s)
// Extend this if you add other PDBe apps in the future
const baseHrefMap = {
  connect: ['/pdbe/entry/', '/pdbe/pdbe-kb/', '/pdbe/connect/'],
  // entry: ['/pdbe/entry/'], // example
};

// ✅ Step 1 — find built apps that contain an assets folder
if (!fs.existsSync(distRoot)) {
  console.warn('⚠️ No dist/apps directory found. Did you run Nx build?');
  process.exit(0);
}

const builtApps = fs.readdirSync(distRoot).filter((dir) => fs.existsSync(path.join(distRoot, dir, 'assets')));

if (builtApps.length === 0) {
  console.warn('⚠️ No built apps with assets found — skipping.');
  process.exit(0);
}

console.log('🧠 Built apps with assets:', builtApps.join(', '));

// ✅ Step 2 — copy assets into each configured baseHref
for (const appName of builtApps) {
  const appDist = path.join(distRoot, appName);
  const srcAssets = path.join(appDist, 'assets');
  const baseHrefs = baseHrefMap[appName] || ['/pdbe/entry/'];

  for (const href of baseHrefs) {
    // Normalize /pdbe/entry/ → pdbe/entry
    const cleanHref = href.replace(/^\/|\/$/g, '');
    const target = path.join(appDist, cleanHref, 'assets');

    mkdirp(target);
    fs.cpSync(srcAssets, target, { recursive: true });
    console.log(`✅ Copied assets for ${appName} → ${target}`);
  }
}

console.log('🎉 Asset duplication complete for PDBe environments.');
