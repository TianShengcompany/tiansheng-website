/**
 * Image Download Utility for TianSheng Website
 * 
 * Downloads high-resolution architecture/building images from Unsplash CDN.
 * No API key required. Uses known photo IDs for architectural photography.
 *
 * Usage: node download-images.js <task-name>
 *   Tasks: products | projects | all
 *
 * Examples:
 *   node download-images.js products   # download product images
 *   node download-images.js projects   # download project images
 *   node download-images.js all        # download everything
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PRODUCTS_DIR = path.join(ROOT, 'images', 'products');
const PROJECTS_DIR = path.join(ROOT, 'images', 'projects');

// Photo IDs organized by file output
const TASKS = {
  'casement-window.jpg': {
    dir: PRODUCTS_DIR,
    label: 'Casement Window (TS-70)',
    ids: [
      '1487958449943-2429e8be8625', // modern building architecture
      '1518005020951-eccb494ad742', // glass window architecture
      '1618220179428-22790b461013', // modern interior large windows
      '1506905925346-21bda4d32df4', // modern architecture glass
      '1512917774080-9991f1c4c750', // house exterior
      '1600147500108-2b62aa531efc', // building facade
    ],
  },
  'curtain-wall.jpg': {
    dir: PRODUCTS_DIR,
    label: 'Curtain Wall (TS-CW)',
    ids: [
      '1541888946425-d81bb01f9cb0', // building construction glass
      '1600585154340-be6161a56a0c', // modern house facade
      '1558618666-2f0f9f5a97f2',   // tall building glass
      '1564013799919-ab600027ffc6', // modern architecture
      '1494526581551-77b25b05fc87', // modern glass building
    ],
  },
  'folding-door.jpg': {
    dir: PRODUCTS_DIR,
    label: 'Folding Door (TS-130)',
    ids: [
      '1600607687939-ce8aadc251b1', // luxury house architecture
      '1600585154526-9902e6fa8093', // modern villa
      '1560448204-603b11f7355e',   // modern window
      '1502005097294-24e11fae5ada', // luxury modern home
      '1600585154340-be6161a56a0c', // modern house facade
    ],
  },
  'lift-slide.jpg': {
    dir: PRODUCTS_DIR,
    label: 'Lift & Slide (TS-160)',
    ids: [
      '1518005020951-eccb494ad742', // glass window architecture
      '1618220179428-22790b461013', // modern interior large windows
      '1560448204-603b11f7355e',   // modern window
      '1502005097294-24e11fae5ada', // luxury modern home
      '1564013799919-ab600027ffc6', // modern architecture
    ],
  },
  'sliding-window.jpg': {
    dir: PRODUCTS_DIR,
    label: 'Sliding Window (TS-80)',
    ids: [
      '1487958449943-2429e8be8625', // modern building architecture
      '1512917774080-9991f1c4c750', // house exterior
      '1600147500108-2b62aa531efc', // building facade
      '1502005097294-24e11fae5ada', // luxury modern home
    ],
  },
};

/**
 * Download a single image from URL, following redirects.
 */
function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

/**
 * Download best image for a given task (tries all photo IDs, keeps largest).
 */
async function downloadTask(taskFile, task) {
  const destPath = path.join(task.dir, taskFile);
  fs.mkdirSync(task.dir, { recursive: true });
  let bestBuf = null;

  process.stdout.write(`  ${task.label}: `);
  for (const id of task.ids) {
    const url = `https://images.unsplash.com/photo-${id}?w=1400&h=900&fit=crop`;
    try {
      const buf = await download(url);
      if (!buf || buf.length < 5000) continue;
      if (!bestBuf || buf.length > bestBuf.length) {
        bestBuf = buf;
        process.stdout.write('.');
      }
    } catch (e) { /* skip */ }
  }
  if (bestBuf) {
    fs.writeFileSync(destPath, bestBuf);
    console.log(` ✓ ${Math.round(bestBuf.length/1024)}KB`);
  } else {
    console.log(' ✗ FAILED');
  }
}

async function run() {
  const arg = (process.argv[2] || 'all').toLowerCase();

  const allTasks = Object.entries(TASKS);

  let tasks;
  if (arg === 'products') {
    tasks = allTasks;
  } else if (arg === 'all') {
    tasks = allTasks;
  } else if (TASKS[arg]) {
    tasks = [[arg, TASKS[arg]]];
  } else {
    console.log(`Unknown task: ${arg}`);
    console.log('Usage: node download-images.js [products | projects | all]');
    process.exit(1);
  }

  console.log(`\n=== Downloading Images (${tasks.length} tasks) ===\n`);
  for (const [file, task] of tasks) {
    await downloadTask(file, task);
  }
  console.log('\nDone.');
}

run().catch(console.error);
