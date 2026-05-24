/**
 * Generate SVG placeholder images for missing images.
 */
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.resolve(__dirname, '..', 'images');

const placeholders = [
  {
    file: 'about/factory-aerial.jpg',
    label: 'Factory',
    sublabel: '50,000 m² Facility',
    color1: '#1a1a2e',
    color2: '#16213e',
  },
  {
    file: 'products/hardware-suite.jpg',
    label: 'TS-Smart Hardware',
    sublabel: 'Premium Hardware Suite',
    color1: '#1a1a2e',
    color2: '#0f3460',
  },
  {
    file: 'products/smart-hardware.jpg',
    label: 'Smart Locks',
    sublabel: 'Digital Access Systems',
    color1: '#1a1a2e',
    color2: '#533483',
  },
  {
    file: 'projects/lagos-tower.jpg',
    label: 'Lagos Tower',
    sublabel: 'Commercial Project',
    color1: '#1a1a2e',
    color2: '#16213e',
  },
  {
    file: 'projects/dubai-residence.jpg',
    label: 'Dubai Villa',
    sublabel: 'Luxury Residence',
    color1: '#16213e',
    color2: '#0f3460',
  },
  {
    file: 'projects/accra-marriott.jpg',
    label: 'Accra Marriott',
    sublabel: 'Hotel Project',
    color1: '#0f3460',
    color2: '#1a1a2e',
  },
  {
    file: 'projects/luanda-tower.jpg',
    label: 'Luanda Tower',
    sublabel: 'Business Center',
    color1: '#16213e',
    color2: '#533483',
  },
  {
    file: 'projects/phnom-penh.jpg',
    label: 'Phnom Penh',
    sublabel: 'Villa Complex',
    color1: '#533483',
    color2: '#0f3460',
  },
  {
    file: 'projects/kigali-center.jpg',
    label: 'Kigali Park',
    sublabel: 'Business Park',
    color1: '#1a1a2e',
    color2: '#16213e',
  },
  {
    file: 'projects/victoria-residence.jpg',
    label: 'Victoria Island',
    sublabel: 'Lagos Residence',
    color1: '#0f3460',
    color2: '#533483',
  },
];

function generateSvg(label, sublabel, c1, c2) {
  // Generate a deterministic geometric pattern
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Grid pattern (building / window motif) -->
  <g stroke="rgba(200,168,96,0.15)" stroke-width="2" fill="none">
    <line x1="100" y1="100" x2="700" y2="100"/>
    <line x1="100" y1="200" x2="700" y2="200"/>
    <line x1="100" y1="300" x2="700" y2="300"/>
    <line x1="100" y1="400" x2="700" y2="400"/>
    <line x1="100" y1="500" x2="700" y2="500"/>
    <line x1="100" y1="100" x2="100" y2="500"/>
    <line x1="250" y1="100" x2="250" y2="500"/>
    <line x1="400" y1="100" x2="400" y2="500"/>
    <line x1="550" y1="100" x2="550" y2="500"/>
    <line x1="700" y1="100" x2="700" y2="500"/>
  </g>

  <!-- Windows / curtain wall accent -->
  <g fill="rgba(200,168,96,0.08)" stroke="rgba(200,168,96,0.2)" stroke-width="1">
    <rect x="120" y="120" width="110" height="80" rx="2"/>
    <rect x="270" y="120" width="110" height="80" rx="2"/>
    <rect x="420" y="120" width="110" height="80" rx="2"/>
    <rect x="570" y="120" width="110" height="80" rx="2"/>
    <rect x="120" y="230" width="110" height="80" rx="2"/>
    <rect x="270" y="230" width="110" height="80" rx="2"/>
    <rect x="420" y="230" width="110" height="80" rx="2"/>
    <rect x="570" y="230" width="110" height="80" rx="2"/>
  </g>

  <!-- Glass reflection effect -->
  <g fill="rgba(255,255,255,0.03)">
    <rect x="130" y="130" width="90" height="60"/>
    <rect x="280" y="130" width="90" height="60"/>
    <rect x="430" y="130" width="90" height="60"/>
    <rect x="580" y="130" width="90" height="60"/>
  </g>

  <!-- Door accent -->
  <rect x="340" y="350" width="120" height="150" fill="rgba(200,168,96,0.06)" stroke="rgba(200,168,96,0.3)" stroke-width="1" rx="1"/>

  <!-- Title -->
  <text x="400" y="380" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="sans-serif" font-size="36" font-weight="bold">TIANSHENG</text>

  <text x="400" y="540" text-anchor="middle" fill="#c8a860" font-family="sans-serif" font-size="22" font-weight="bold">${label}</text>
  <text x="400" y="565" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="14">${sublabel}</text>
  <text x="400" y="585" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="sans-serif" font-size="11">Aluminum Systems · Image Loading</text>
</svg>`;
}

let count = 0;
for (const p of placeholders) {
  const filePath = path.resolve(IMG_DIR, p.file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 20000) {
    console.log(`  • ${p.file} — already exists`);
    continue;
  }
  const svg = generateSvg(p.label, p.sublabel, p.color1, p.color2);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  // Save as SVG (rename to .svg, browsers will render it)
  fs.writeFileSync(filePath.replace('.jpg', '.svg'), svg);
  count++;
  console.log(`  ✓ ${p.file.replace('.jpg', '.svg')}`);
}

console.log(`\nCreated ${count} SVG placeholders`);
