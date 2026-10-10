export function groupByYear(pubs) {
  const map = new Map();
  for (const p of pubs) {
    if (!map.has(p.year)) map.set(p.year, []);
    map.get(p.year).push(p);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
