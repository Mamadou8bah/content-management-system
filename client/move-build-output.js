const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, 'dist', 'client', 'browser');
const targetDir = path.join(__dirname, 'dist', 'client');

if (fs.existsSync(browserDir)) {
  console.log(`Moving files from ${browserDir} to ${targetDir}...`);
  const files = fs.readdirSync(browserDir);
  files.forEach(file => {
    const src = path.join(browserDir, file);
    const dest = path.join(targetDir, file);
    // If destination exists (e.g. collision), we might want to overwrite or skip.
    // renameSync overwrites on POSIX, but might fail on Windows if locked.
    // For build artifacts, overwrite is usually desired.
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.renameSync(src, dest);
  });
  fs.rmdirSync(browserDir);
  console.log('Build output flattened successfully.');
} else {
  console.log(`Directory ${browserDir} not found. Skipping move.`);
}
