// Add siblings + annualFamilyIncome to customers.json (idempotent)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, 'customers.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const SIBLINGS = ['1 brother', '1 sister', '2 brothers', '1 brother 1 sister', 'No siblings', '2 sisters', '1 sister', 'No siblings', '1 brother', '2 brothers'];
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };

data.customers = data.customers.map((c, i) => {
  const seed = hash(c.id || `c${i}`);
  const inc = parseFloat(String(c.income || c.annualIncome || '0').replace(/[^\d.]/g, '')) || 0;
  const famMult = 1.8 + (Math.abs(seed >> 3) % 12) / 10;
  return {
    ...c,
    siblings: c.siblings || SIBLINGS[Math.abs(seed) % SIBLINGS.length],
    annualFamilyIncome: c.annualFamilyIncome || `${Math.round(inc * famMult)}LPA`
  };
});

fs.writeFileSync(p, JSON.stringify(data, null, 2));
console.log(`Updated ${data.customers.length} customers.`);
