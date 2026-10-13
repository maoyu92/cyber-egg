import fs from 'node:fs';
const offers = JSON.parse(fs.readFileSync(new URL('../data/offers.json', import.meta.url)));
const tpl = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
fs.mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../public/index.html', import.meta.url),
  tpl.replace('/*__DATA__*/[]', JSON.stringify(offers).replace(/</g, '\\u003c')).replace('__BUILT__', new Date().toISOString().slice(0,10)));
console.log('built', offers.length, 'offers');
