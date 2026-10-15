// 访问统计：只存 SHA-256(salt+IP) 的哈希，从不存原始 IP。
// 人次 = (IP 哈希, 北京时间日期) 去重；浏览次数 = 每次 POST 计 1。
async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
async function stats(db, day) {
  const [a, b, c, d] = await db.batch([
    db.prepare('SELECT COUNT(*) n FROM daily_visitors'),
    db.prepare('SELECT COUNT(*) n FROM daily_visitors WHERE day=?').bind(day),
    db.prepare('SELECT COUNT(*) n FROM ips'),
    db.prepare("SELECT v n FROM counters WHERE k='views'"),
  ]);
  const n = r => r.results[0]?.n ?? 0;
  return { person_times: n(a), today: n(b), unique_ips: n(c), views: n(d) };
}
const json = o => new Response(JSON.stringify(o), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'no db' });
  return json(await stats(env.DB, today()));
}
export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'no db' });
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const h = await sha256((env.IP_SALT || 'cyber-egg') + '|' + ip);
  const day = today(), db = env.DB;
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO daily_visitors (day,h) VALUES (?,?)').bind(day, h),
    db.prepare('INSERT OR IGNORE INTO ips (h) VALUES (?)').bind(h),
    db.prepare("UPDATE counters SET v=v+1 WHERE k='views'"),
  ]);
  return json(await stats(db, day));
}
