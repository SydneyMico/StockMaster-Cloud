import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve('./');
const distDir = path.resolve('dist');

const files = ['icon-192.png', 'icon-512.png', 'browserconfig.xml'];

for (const file of files) {
  const src = path.join(repoRoot, file);
  const dest = path.join(distDir, file);
  try {
    if (fs.existsSync(src) && fs.existsSync(distDir)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> dist/`);
    }
  } catch (err) {
    console.error('Failed to copy', file, err);
  }
}
