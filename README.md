# 赛博鸡蛋 (cyber-egg)

持续更新的 **免费 AI API / 免费 AI 应用** 清单，带到期倒计时与额度说明。纯静态站，部署在 Cloudflare Pages。

## 结构
- `data/offers.json`：唯一数据源
- `src/index.html`：页面模板；`node scripts/build.mjs` 生成 `public/index.html`
- `scripts/check.mjs`：列出 7 天内到期 / 已过期 / 14 天未核实的条目（有临期或过期时退出码 1，可用于定时任务）

## 贡献
1. Fork 后修改 `data/offers.json`，**必须附官方来源链接**，写上 `verified_at`。
2. 不确定的字段写 `待核实`，不要猜数字。
3. 提 PR，维护者核实后合并，Pages 自动重新部署。
4. 收录标准：包月类只收明显高性价比的（如低价大额度、限时大折扣），普通会员/订阅不收。

## 数据字段
| 字段 | 说明 |
|---|---|
| id | 唯一短 ID |
| name / provider | 名称 / 提供方 |
| category | `api` 或 `app` |
| models | 模型 ID 列表 |
| free_type | `限时` / `永久额度` / `每日额度` |
| start / end | `YYYY-MM-DD`（北京时间），未知填 `null` |
| quota | 一句话额度说明（卡片概述） |
| summary / tags | 概述与标签 |
| how_to_get | 获取步骤数组 |
| urls | `{official, docs, signup, ...}` |
| base_url / compat | API 地址与兼容协议（应用类填 `null`） |
| limits / usage_notes | 限制 / 备注 |
| sources | 来源链接数组 |
| verified_at | 核实日期 |
| status | `active` / `ended` |

## v2 新增
- 分类：`api`（API 形式）/ `app`（应用类）/ `plan`（包月/不限量·高性价比，排在最后）。`plan` 的 `free_type` 为 `包月`。
- `model_released`：模型发布日期（`YYYY-MM-DD` 或 `null`），`model_released_note` 说明出处（如“百炼上架日期”）。
- 默认排序：按 `model_released` 从新到旧。**“比较老”规则**：发布日期距今超过 183 天（约 6 个月）的条目自动打“比较老”标签并排到同类后面；已过期的排最后。7 天内到期仍高亮。
- 主题：浅色 / 深色，默认跟随系统，手动切换后记在 localStorage。
