# Dashboard 数据接口契约（v1.0）

前端请求 `GET {VITE_API_BASE_URL}/v1/dashboard`，返回 JSON。百分数统一使用“百分点数值”，例如 `6.82` 表示 `6.82%`；金额统一为亿元，成交额 `adv` 为万元，价差为 bp。

```json
{
  "schemaVersion": "1.0",
  "asOf": "2026-08-19",
  "funds": [{
    "code": "510520", "name": "质量精选主动ETF", "company": "银华基金",
    "strategy": "质量", "benchmark": "中证800全收益指数", "aum": 18.6,
    "returnSinceLaunch": 6.82, "excessReturn": 1.34, "volatility": 15.42,
    "maxDrawdown": 8.63, "activeShare": 71.2, "trackingError": 5.18,
    "informationRatio": 0.52, "top10Weight": 42.8, "adv": 2680,
    "spreadBps": 8.6, "premiumDiscount": 0.06, "flow20d": 1.28
  }],
  "nav": [{"code":"510520","date":"2026-08-19","fundIndex":106.82,"benchmarkIndex":105.48}],
  "market": {"totalAum":54.3,"netFlow20d":2.87,"weightedExcess":1.01}
}
```

Excel 文件使用同名字段，并包含两个工作表：`funds`（产品）和 `nav`（净值）。前端会校验必填字段；正式环境建议后端继续校验唯一键、日期连续性、权重合计与数据时点。
