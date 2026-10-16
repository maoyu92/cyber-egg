// 用法: node scripts/check.mjs [--today=YYYY-MM-DD]  有临期/过期条目时退出码 1
import fs from 'node:fs';
const offers = JSON.parse(fs.readFileSync(new URL('../data/offers.json', import.meta.url)));
const arg = process.argv.find(a => a.startsWith('--today='));
const today = arg ? new Date(arg.slice(8) + 'T00:00:00+08:00') : new Date();
let flagged = 0;
const CATS = ['api', 'app', 'discount', 'relay'];
for (const o of offers) if (!CATS.includes(o.category)) { console.log(`❌ 分类无效 ${o.name}（${o.category}），应为 ${CATS.join('/')}`); flagged++; }
for (const o of offers) {
  if (!o.end || o.status === 'ended') continue;
  const days = Math.floor((new Date(o.end + 'T23:59:59+08:00') - today) / 864e5);
  if (days < 0) { console.log(`⛔ 已过期 ${o.name}（${o.end}）`); flagged++; }
  else if (days <= 7) { console.log(`⚠️ ${days} 天内到期 ${o.name}（${o.end}）`); flagged++; }
}
const stale = offers.filter(o => (today - new Date(o.verified_at)) / 864e5 > 14);
stale.forEach(o => console.log(`🕒 超过 14 天未核实 ${o.name}（${o.verified_at}）`));
if (!flagged) console.log('✅ 没有 7 天内到期或已过期的条目');
process.exit(flagged ? 1 : 0);
