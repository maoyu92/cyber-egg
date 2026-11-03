import fs from 'node:fs';
const all = JSON.parse(fs.readFileSync(new URL('../data/offers.json', import.meta.url)));
// 隐藏已过期：end 早于今天（北京时间）或 status=ended；数据仍保留在 offers.json
const todayBJ = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
const isExpired = o => o.status === 'ended' || (o.end && o.end < todayBJ);
const hidden = all.filter(isExpired);
const offers = all.filter(o => !isExpired(o));
const tpl = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
fs.mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../public/index.html', import.meta.url),
  tpl.replace('/*__DATA__*/[]', JSON.stringify(offers).replace(/</g, '\\u003c')).replace('__BUILT__', new Date().toISOString().slice(0,10)));
console.log('built', offers.length, 'offers (BJ', todayBJ + '), hidden', hidden.length + ':', hidden.map(o => o.name).join(' | '));
