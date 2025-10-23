import fs from 'fs';
import path from 'path';

const distRoot = 'dist/apps';

// PDBe subpaths that each deployment uses
const baseHrefs = ['/pdbe/entry/', '/pdbe/pdbe-kb/', '/pdbe/connect/'];

// Helper: ensure parent directories exist
const mkdirp = (dir) => fs.mkdirSync(dir, { recursive: true });

// Helper: create a symbolic link safely (fallback to copy if symlink fails)
function createSymlinkOrCopy(source, target) {
  mkdirp(path.dirname(target));
  try {
    // Remove old file/dir if it exists
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
    fs.symlinkSync(source, target, 'dir');
    console.log(`🔗 Created symlink → ${target}`);
  } catch (err) {
    console.warn(`⚠️  Symlink failed for ${target}, falling back to copy: ${err.message}`);
    fs.cpSync(source, target, { recursive: true });
    console.log(`📦 Copied assets instead → ${target}`);
  }
}

// ✅ Step 1 — find built apps that contain an assets folder
if (!fs.existsSync(distRoot)) {
  console.warn('⚠️  No dist/apps directory found. Did you run Nx build?');
  process.exit(0);
}

const builtApps = fs.readdirSync(distRoot).filter((dir) => fs.existsSync(path.join(distRoot, dir, 'assets')));

if (builtApps.length === 0) {
  console.warn('⚠️  No built apps with assets found — skipping.');
  process.exit(0);
}

console.log('🧠 Built apps with assets:', builtApps.join(', '));
console.log('📦 Linking assets for base paths:', baseHrefs.join(', '));

// ✅ Step 2 — create symlinks for each app and baseHref
for (const appName of builtApps) {
  const appDist = path.join(distRoot, appName);
  const srcAssets = path.join(appDist, 'assets');

  for (const href of baseHrefs) {
    const cleanHref = href.replace(/^\/|\/$/g, ''); // /pdbe/entry/ → pdbe/entry
    const target = path.join(appDist, cleanHref, 'assets');
    createSymlinkOrCopy(srcAssets, target);
  }
}

console.log('🎉 Asset linking complete for PDBe environments.');
