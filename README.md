# 🐆 中国主动ETF专业分析Dashboard

<div align="center">

**符合国际一流量化基金标准的主动管理ETF分析平台**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![ECharts](https://img.shields.io/badge/ECharts-5.x-AA344D?logo=apache-echarts)](https://echarts.apache.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev)

</div>

---

## 📋 项目概述

本Dashboard专为**中国首批18家主动管理ETF试点产品**设计，提供专业的产品分析、持仓监控、风险归因和流动性管理功能。系统设计对标**Bloomberg Terminal、Mantarisk、Stock Rover**等国际一流量化基金平台。

### 核心特性

| 模块 | 功能 | 国际对标 |
|------|------|----------|
| **KPI仪表盘** | 累计收益、夏普比率、最大回撤、跟踪误差 | Bloomberg PORT |
| **净值表现** | 双轴净值曲线、回撤面积图、区间统计 | Stock Rover |
| **持仓透明度** | Top10列表、行业配置、风格因子雷达图 | Sharesight Look-through |
| **风险归因** | Brinson分解、滚动风险指标、VaR/CVaR | Mantarisk Attribution |
| **流动性监控** | IOPV偏离度、买卖价差、换手率、成交额 | bicon.co Liquidity |

### 主动ETF特色功能

- ✅ **Alpha来源追踪**：Brinson归因（选股能力 vs 配置能力）
- ✅ **每日PCF清单利用**：实时持仓变动监控（全球独有优势）
- ✅ **风格漂移预警系统**：因子暴露变化监测
- ✅ **IOPV折溢价实时监控**：套利机会识别
- ✅ **集中度合规检查**：CR10 < 60%警戒线

---

## 🏦 覆盖产品（18家试点）

### 上交所（9家）

| 基金公司 | 产品名称 | 投资策略 |
|----------|----------|----------|
| 易方达基金 | 品质未来主动管理ETF | 品质策略 |
| 华夏基金 | 质量价值甄选主动管理ETF | 价值策略 |
| 永赢基金 | 景气精选主动管理ETF | 成长策略 |
| 摩根基金 | 核心成长主动管理ETF | 大盘成长 |
| 华泰柏瑞 | 价值精选主动管理ETF | 深度价值 |
| 汇添富基金 | 均衡策略主动管理ETF | 均衡策略 |
| 华安基金 | 品质严选主动管理ETF | 品质策略 |
| 招商基金 | 价值智选主动管理ETF | 价值策略 |
| 平安基金 | 行业优选主动管理ETF | 行业轮动 |

### 深交所（9家）

| 基金公司 | 产品名称 | 投资策略 |
|----------|----------|----------|
| 南方基金 | 大盘风格配置主动管理ETF | 均衡策略 |
| 富国基金 | 价值优选主动管理ETF | 价值策略 |
| 大成基金 | 红利智选主动管理ETF | 红利策略 |
| 鹏华基金 | 价值臻选主动管理ETF | 价值策略 |
| 工银瑞信 | 红利主动管理ETF | 红利策略 |
| 华宝基金 | 优选稳健股票主动管理ETF | 稳健策略 |
| 国泰基金 | 鑫汇均衡收益主动管理ETF | 均衡策略 |
| 天弘基金 | 均衡优选主动管理ETF | 均衡策略 |
| 建信基金 | 竞争优势主动管理ETF | 动量策略 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0 或 pnpm >= 8.0
- Git

### 安装与运行

```bash
# 克隆仓库
git clone <repository-url>
cd 中国主动ETF\ Dashboard

# 安装依赖
npm install
# 或使用 pnpm（推荐）
pnpm install

# 启动开发服务器
npm run dev
# 或
pnpm dev

# 构建生产版本
npm run build
# 或
pnpm build

# 预览生产构建
npm run preview
```

访问 `http://localhost:3000` 即可查看Dashboard。

---

## 📁 项目结构

```
中国主动ETF Dashboard/
├── src/
│   ├── components/          # React组件
│   │   ├── KPI/            # KPI仪表盘卡片
│   │   │   └── KPICards.tsx
│   │   ├── Chart/          # 图表组件
│   │   │   └── NAVChart.tsx # 净值走势图
│   │   ├── Holdings/       # 持仓分析
│   │   │   └── HoldingsAnalysis.tsx
│   │   ├── Risk/           # 风险归因
│   │   │   └── RiskAnalysis.tsx
│   │   ├── Liquidity/      # 流动性监控
│   │   │   └── LiquidityMonitor.tsx
│   │   └── Layout/         # 布局组件
│   │       └── MainLayout.tsx
│   ├── data/               # 数据层
│   │   └── mockData.ts     # 模拟数据生成器
│   ├── hooks/              # 自定义Hooks
│   │   └── useETFContext.tsx # 全局状态管理
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── styles/             # 全局样式
│   │   └── global.css
│   ├── utils/              # 工具函数
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── public/                 # 静态资源
├── tests/                  # 测试文件
├── docs/                   # 文档
├── index.html              # HTML模板
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite构建配置
└── README.md               # 项目说明
```

---

## 🛠️ 技术栈

| 层次 | 技术选型 | 版本 | 说明 |
|------|---------|------|------|
| **前端框架** | React | 18.x | 组件化开发，生态成熟 |
| **类型系统** | TypeScript | 5.x | 类型安全，IDE友好 |
| **构建工具** | Vite | 5.x | 极速HMR，优化构建 |
| **可视化库** | ECharts | 5.x | 金融图表支持丰富 |
| **UI组件库** | Ant Design | 5.x | 企业级UI组件 |
| **状态管理** | Context + useReducer | - | 轻量级全局状态 |
| **日期处理** | day.js | 1.x | 轻量级日期库 |
| **工具函数** | Lodash | 4.x | 高性能工具集 |

---

## 📊 数据架构

### 数据流

```
API / Mock Data → Context (useReducer) → Components → ECharts Render
```

### 核心数据模型

- `ETFInfo`: 产品基本信息（代码、基金经理、策略等）
- `NAVData`: 日度净值数据（净值、收益、超额收益）
- `Holding`: 持仓信息（股票、权重、行业）
- `SectorAllocation`: 行业配置（权重、超配/低配）
- `RiskMetrics`: 风险指标（波动率、回撤、VaR）
- `LiquidityMetrics`: 流动性指标（成交额、IOPV、价差）

### 当前数据状态

⚠️ **注意**: 由于18家主动ETF尚未上市，当前使用**专业模拟数据**。

模拟数据特点：
- 基于各产品申报的投资策略生成差异化持仓
- 收益率参数参考同类主动基金历史表现
- 风险指标基于策略特征合理假设
- **上市后可无缝切换至真实数据源**

---

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件：

```env
# API基础地址（上市后配置）
VITE_API_BASE_URL=http://localhost:8080/api

# NeoData金融数据服务凭证
VITE_NEODATA_TOKEN=your_token_here

# 自动刷新间隔（秒）
VITE_REFRESH_INTERVAL=30
```

### 主题配置

支持深色/浅色主题切换，默认深色模式（符合金融终端惯例）。

---

## 📈 开发路线图

### Phase 1: MVP版本 ✅（当前）

- [x] KPI仪表盘（6大核心指标）
- [x] 净值走势图（双轴+回撤+统计）
- [x] 持仓分析（Top10+行业+因子）
- [x] 风险归因（Brinson+VaR+评级）
- [x] 流动性监控（IOPV+成交+持有人）
- [x] 深色/浅色主题切换
- [x] 响应式布局

### Phase 2: 专业版（计划中）

- [ ] 多产品对比视图
- [ ] PDF报告导出
- [ ] 自定义指标面板
- [ ] 数据导出（Excel/CSV）
- [ ] 移动端适配优化

### Phase 3: 高级版（规划中）

- [ ] 实时WebSocket数据推送
- [ ] 新闻关联与事件驱动
- [ ] AI智能问答接口
- [ ] 预测性分析模块
- [ ] 用户权限管理

### Phase 4: 智能化（远期）

- [ ] 自然语言查询（"这只ETF最近3个月alpha来源是什么？"）
- [ ] 机器学习预测模型
- [ ] 个性化推荐引擎
- [ ] 多因子模型可视化编辑器

---

## 🧪 测试

```bash
# 运行测试
npm test

# 交互式测试UI
npm run test:ui

# 代码规范检查
npm run lint
```

---

## 📝 API接口设计（待实现）

### 产品列表
```
GET /api/v1/etf/products
Response: ETFInfo[]
```

### 净值数据
```
GET /api/v1/etf/:code/nav?start_date=&end_date=
Response: NAVData[]
```

### 持仓数据
```
GET /api/v1/etf/:code/holdings?date=
Response: Holding[]
```

### 风险指标
```
GET /api/v1/etf/:code/risk?period=
Response: RiskMetrics
```

### 流动性数据
```
GET /api/v1/etf/:code/liquidity?date=
Response: LiquidityMetrics
```

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
    - 推送到分支 (`git push origin feature/amazing-feature`)
    - 开启 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 组件采用函数式 + Hooks
- 遵循 ESLint + Prettier 规范
- 提交信息遵循 Conventional Commits

---

## 📄 许可证

MIT License © 2024 银华基金量化研究团队

---

## 📞 联系方式

- **团队**: 银华基金量化研究部
- **项目维护**: @quant-research-team
- **问题反馈**: 请通过 Git Issues 提交

---

<div align="center">

**🐆 严谨 · 专业 · 高效 · 务实**

*Built with ❤️ for China's Active ETF Market*

</div>
