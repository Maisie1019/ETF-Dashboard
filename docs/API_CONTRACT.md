# Dashboard 数据接口契约（v2.0）

前端请求 `GET {VITE_API_BASE_URL}/v2/dashboard`。百分比使用百分点数值（`6.82` 表示 `6.82%`）；规模、资金流为亿元，份额为亿份，成交额为万元，价差为 bp。

| JSON / Excel 表 | 主键 | 用途 |
|---|---|---|
| `funds` | `code` | 产品主数据、主动业绩、持仓广度、换手、风格漂移、规模、份额及流动性快照 |
| `nav` | `code + date` | 基金和合同基准复权累计收益序列 |
| `flows` | `code + date` | 日度净申赎估算及份额序列 |
| `holdings` | `code + stockCode` | 每日PCF真实组合持仓、权重及相对上一交易日变化 |
| `sectors` | `code + sector` | 组合与基准行业权重 |
| `factors` | `code + factor` | 标准化风格因子暴露 |

Excel 导入必须包含以上六张同名工作表。API 返回同名数组，并增加：

```json
{"schemaVersion":"2.0","asOf":"2026-08-20","funds":[],"nav":[],"flows":[],"holdings":[],"sectors":[],"factors":[],"market":{"totalAum":0,"totalShares":0,"netFlow20d":0,"weightedExcess":0}}
```

生产环境每条记录应保存来源、来源时间、有效日期、入库时间和质量状态。净值、基准、行情与份额按交易日对齐；PCF以交易日开市前实际披露版本为准，保留更正版本。主动ETF不以指数复制为目标，接口不设置跟踪误差字段；基准仅用于主动收益、归因和风格稳定性评价。API 建议增加鉴权、缓存、分页、限流、监控和 schema 版本兼容策略。
