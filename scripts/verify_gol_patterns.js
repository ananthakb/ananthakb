const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('gol-patterns.js', 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);
const patterns = ctx.window.GOL_PATTERNS;

function step(cells) {
  const nbr = new Map();
  for (const key of cells) {
    const [x, y] = key.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const k = `${x + dx},${y + dy}`;
        nbr.set(k, (nbr.get(k) || 0) + 1);
      }
    }
  }
  const out = new Set();
  for (const [k, n] of nbr) {
    if (n === 3 || (n === 2 && cells.has(k))) out.add(k);
  }
  return out;
}

function signature(cells) {
  if (cells.size === 0) return { sig: 'EMPTY', minX: 0, minY: 0 };
  let minX = Infinity, minY = Infinity;
  const pts = [];
  for (const key of cells) {
    const [x, y] = key.split(',').map(Number);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    pts.push([x, y]);
  }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const norm = pts.map(([x, y]) => `${x - minX},${y - minY}`).join(';');
  return { sig: norm, minX, minY };
}

function classify(name, maxGen = 400) {
  let cells = new Set(patterns[name].map(([x, y]) => `${x},${y}`));
  const seen = new Map();

  for (let t = 0; t <= maxGen; t++) {
    const s = signature(cells);
    if (seen.has(s.sig)) {
      const prev = seen.get(s.sig);
      const period = t - prev.t;
      const dx = s.minX - prev.minX;
      const dy = s.minY - prev.minY;
      if (period === 1 && dx === 0 && dy === 0) return { type: 'still life', period, dx, dy };
      if (dx === 0 && dy === 0) return { type: 'oscillator', period, dx, dy };
      return { type: 'spaceship', period, dx, dy };
    }
    seen.set(s.sig, { t, minX: s.minX, minY: s.minY });
    cells = step(cells);
  }

  return { type: 'non-cyclic-within-limit', period: null, dx: null, dy: null };
}

for (const name of Object.keys(patterns)) {
  const unique = new Set(patterns[name].map(([x, y]) => `${x},${y}`));
  const duplicates = patterns[name].length - unique.size;
  const c = classify(name);
  console.log(`${name}\tunique=${unique.size}\tdups=${duplicates}\ttype=${c.type}\tperiod=${c.period ?? '-'}\tdelta=(${c.dx ?? '-'},${c.dy ?? '-'})`);
}
