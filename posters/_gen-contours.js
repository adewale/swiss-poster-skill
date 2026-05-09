// Generate topo contours via marching squares from a sum-of-Gaussians field.
// Real topographic contours never cross — they merge into saddles. The only
// reliable way to produce that is to define a smooth scalar field and extract
// its level sets, rather than stacking nested ring shapes per peak.
//
// Output: <path d="..."/> SVG elements, one per elevation level.

const W = 1800, H = 1260;
const NX = 480;                 // grid samples horizontally (~3.75 px/cell)
const NY = Math.round(NX * H / W);

// Peaks: { cx, cy, sigmaX, sigmaY, theta_deg, amplitude }
// Hero peak dominates; secondaries share saddles with the hero where their
// fields overlap. Elongated sigmas give ridge-like contours.
const peaks = [
  { cx: 1120, cy: 600, sigmaX: 460, sigmaY: 290, theta: 22,  amp: 1.00 }, // hero
  { cx:  470, cy: 880, sigmaX: 240, sigmaY: 175, theta: -32, amp: 0.62 }, // secondary, saddle w/ hero
  { cx: 1540, cy: 230, sigmaX: 200, sigmaY: 150, theta: 18,  amp: 0.42 }, // upper-right
  { cx: 1660, cy:1090, sigmaX: 145, sigmaY: 115, theta: -8,  amp: 0.28 }, // lower-right
  { cx:  220, cy: 290, sigmaX: 130, sigmaY: 100, theta: 40,  amp: 0.22 }, // upper-left
];

function field(x, y) {
  let sum = 0;
  for (const p of peaks) {
    const dx = x - p.cx, dy = y - p.cy;
    const t = p.theta * Math.PI / 180;
    const c = Math.cos(t), s = Math.sin(t);
    const xr =  c * dx + s * dy;
    const yr = -s * dx + c * dy;
    sum += p.amp * Math.exp(-(xr*xr/(2*p.sigmaX*p.sigmaX) + yr*yr/(2*p.sigmaY*p.sigmaY)));
  }
  return sum;
}

// Sample
const grid = new Array(NY);
for (let j = 0; j < NY; j++) {
  const row = new Float32Array(NX);
  const y = j * H / (NY - 1);
  for (let i = 0; i < NX; i++) {
    row[i] = field(i * W / (NX - 1), y);
  }
  grid[j] = row;
}

function contourSegments(level) {
  const segs = [];
  for (let j = 0; j < NY - 1; j++) {
    for (let i = 0; i < NX - 1; i++) {
      const tl = grid[j][i], tr = grid[j][i+1];
      const bl = grid[j+1][i], br = grid[j+1][i+1];
      const mask =
        (tl > level ? 1 : 0) |
        (tr > level ? 2 : 0) |
        (br > level ? 4 : 0) |
        (bl > level ? 8 : 0);
      if (mask === 0 || mask === 15) continue;

      const x0 = i * W / (NX - 1);
      const x1 = (i + 1) * W / (NX - 1);
      const y0 = j * H / (NY - 1);
      const y1 = (j + 1) * H / (NY - 1);

      const tT = (level - tl) / (tr - tl);
      const tR = (level - tr) / (br - tr);
      const tB = (level - bl) / (br - bl);
      const tL = (level - tl) / (bl - tl);

      const T = () => [x0 + (x1 - x0) * tT, y0];
      const R = () => [x1, y0 + (y1 - y0) * tR];
      const B = () => [x0 + (x1 - x0) * tB, y1];
      const L = () => [x0, y0 + (y1 - y0) * tL];

      switch (mask) {
        case 1: case 14: segs.push([L(), T()]); break;
        case 2: case 13: segs.push([T(), R()]); break;
        case 3: case 12: segs.push([L(), R()]); break;
        case 4: case 11: segs.push([R(), B()]); break;
        case 6: case 9:  segs.push([T(), B()]); break;
        case 7: case 8:  segs.push([L(), B()]); break;
        // ambiguous saddle cases — pick one resolution
        case 5:  segs.push([L(), T()]); segs.push([R(), B()]); break;
        case 10: segs.push([T(), R()]); segs.push([L(), B()]); break;
      }
    }
  }
  return segs;
}

// Levels: log-ish spacing so inner rings (steep summit) pack tighter.
const N = 24;
let lines = '';
for (let k = 0; k < N; k++) {
  // Quadratic spacing in [0.03, 0.94] — denser near 0 (gentle outer apron)
  const u = k / (N - 1);
  const level = 0.03 + (0.94 - 0.03) * (u * u * 0.5 + u * 0.5);
  const segs = contourSegments(level);
  if (!segs.length) continue;
  let d = '';
  for (const [a, b] of segs) {
    d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  lines += `      <path d="${d}"/>\n`;
}

process.stdout.write(lines);
