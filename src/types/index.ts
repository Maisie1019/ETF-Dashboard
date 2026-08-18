/**
 * 中国主动ETF分析Dashboard - 类型定义
 * 符合国际一流量化基金数据标准
 */

// ============================================
// 基础类型
// ============================================

/** ETF产品基本信息 */
export interface ETFInfo {
  /** 产品代码 */
  code: string
  /** 产品名称 */
  name: string
  /** 基金公司全称 */
  fundCompany: string
  /** 基金公司简称 */
  fundCompanyShort: string
  /** 上市交易所 */
  exchange: 'SSE' | 'SZSE'
  /** 上市状态 */
  status: 'pending' | 'trading' | 'suspended'
  /** 成立日期 */
  inceptionDate: string
  /** 基金经理 */
  managers: Manager[]
  /** 投资策略/风格 */
  strategy: InvestmentStrategy
  /** 基准指数 */
  benchmark: string
  /** 产品类型 */
  category: ETFCategory
  /** 管理费率 (%) */
  managementFee: number
  /** 托管费率 (%) */
  custodyFee: number
  /** 公司类型 */
  companyType: CompanyType
}

/** 基金经理信息 */
export interface Manager {
  name: string
  experience: number // 从业年限
  style: InvestmentStyle
  background: string // 教育背景
  description: string
}

/** 投资策略 */
export type InvestmentStrategy =
  | 'value'           // 价值策略
  | 'growth'          // 成长策略
  | 'balanced'        // 均衡策略
  | 'dividend'        // 红利策略
  | 'quality'         // 品质策略
  | 'momentum'        // 动量策略
  | 'sector_rotation' // 行业轮动
  | 'multi_factor'    // 多因子

/** 投资风格 */
export type InvestmentStyle =
  | 'large_cap_growth'    // 大盘成长
  | 'large_cap_value'     // 大盘价值
  | 'large_cap_quality'   // 大盘品质
  | 'mid_cap_growth'      // 中盘成长
  | 'mid_cap_value'       // 中盘价值
  | 'small_cap'           // 小盘
  | 'deep_value'          // 深度价值
  | 'cyclical_growth'     // 周期成长
  | 'quality'             // 品质投资
  | 'balanced'            // 均衡配置
  | 'value'               // 价值风格
  | 'dividend'            // 红利策略
  | 'momentum'            // 动量策略
  | 'multi_factor'        // 多因子

/** ETF类别 */
export type ETFCategory =
  | 'equity_active'       // 主动股票ETF
  | 'bond_active'         // 主动债券ETF
  | 'commodity_active'    // 主动商品ETF
  | 'cross_border'        // 跨境ETF

/** 公司类型 */
export type CompanyType =
  | 'top_tier_head'       // 头部公募（管理规模>5000亿）
  | 'top_tier_medium'     // 中型公募（1000-5000亿）
  | 'foreign_joint_venture' // 外资合资
  | 'bank_affiliated'     // 银行系
  | 'insurance_affiliated' // 保险系
  | 'etf_specialist'      // ETF特色机构

// ============================================
// 净值与收益数据
// ============================================

/** 日度净值数据 */
export interface NAVData {
  date: string
  nav: number           // 单位净值
  accNav: number        // 累计净值
  dailyReturn: number   // 日收益率 (%)
  benchmarkReturn?: number // 基准收益率 (%)
  excessReturn?: number   // 超额收益 (%)
}

/** 区间收益统计 */
export interface ReturnStatistics {
  period: string        // 统计区间
  etfReturn: number     // ETF收益率 (%)
  benchmarkReturn: number // 基准收益率 (%)
  excessReturn: number  // 超额收益 (%)
  annualizedReturn: number // 年化收益 (%)
  volatility: number    // 波动率 (%)
  sharpeRatio: number   // 夏普比率
  sortinoRatio: number  // 索提诺比率
  calmarRatio: number   // 卡玛比率
  maxDrawdown: number   // 最大回撤 (%)
  maxDrawdownDuration: number // 最大回撤持续天数
  winRate: number       // 胜率 (%)
  profitLossRatio: number // 盈亏比
}

// ============================================
// 持仓数据
// ============================================

/** 持仓信息 */
export interface Holding {
  rank: number          // 持仓排名
  code: string          // 股票代码
  name: string          // 股票名称
  shares: number        // 持股数量（万股）
  marketValue: number   // 持仓市值（万元）
  weight: number        // 占净比 (%)
  sector: string        // 所属行业
  change: number        // 持仓变动（较上期，%）
}

/** 行业配置 */
export interface SectorAllocation {
  sector: string        // 行业名称
  weight: number        // 配置权重 (%)
  benchmarkWeight: number // 基准权重 (%)
  activeWeight: number  // 主动权重 (%)
  count: number         // 个股数量
}

/** 风格因子暴露 */
export interface FactorExposure {
  factor: string        // 因子名称
  exposure: number      // 因子暴露值
  activeExposure: number // 主动暴露
  contribution: number  // 对超额收益贡献 (%)
  tStat: number         // t统计量
}

// ============================================
// 风险指标
// ============================================

/** 风险指标 */
export interface RiskMetrics {
  /** 波动率相关 */
  volatility: {
    daily: number       // 日波动率 (%)
    annualized: number  // 年化波动率 (%)
    rolling30d: number  // 30日滚动波动率
    rolling60d: number  // 60日滚动波动率
    rolling90d: number  // 90日滚动波动率
  }

  /** 回撤分析 */
  drawdown: {
    current: number     // 当前回撤 (%)
    max: number         // 最大回撤 (%)
    maxDate: string     // 最大回撤日期
    recoveryDate: string // 恢复日期
    avgRecoveryDays: number // 平均恢复天数
  }

  /** 下行风险 */
  downsideRisk: {
    semiVariance: number // 半方差
    downsideDeviation: number // 下行标准差
    var95: number       // VaR (95%, %)
    cvar95: number      // CVaR (95%, %)
    var99: number       // VaR (99%, %)
  }

  /** 相关性 */
  correlation: {
    withBenchmark: number // 与基准相关性
    withMarket: number   // 与市场相关性
    beta: number         // Beta系数
    trackingError: number // 跟踪误差 (%)
    informationRatio: number // 信息比率
    rSquared: number     // R平方
  }
}

/** Brinson归因结果 */
export interface BrinsonAttribution {
  period: string
  totalExcessReturn: number // 总超额收益 (%)
  allocationEffect: number  // 配置效应 (%)
  selectionEffect: number   // 选股效应 (%)
  interactionEffect: number // 交互效应 (%)
  currencyEffect?: number   // 汇率效应 (%) - 跨境适用
  sectorBreakdown: SectorAttribution[]
}

/** 行业归因明细 */
export interface SectorAttribution {
  sector: string
  portfolioWeight: number  // 组合权重
  benchmarkWeight: number  // 基准权重
  portfolioReturn: number  // 组合收益
  benchmarkReturn: number  // 基准收益
  allocationEffect: number // 配置贡献
  selectionEffect: number  // 选股贡献
}

// ============================================
// 流动性数据
// ============================================

/** 流动性指标 */
export interface LiquidityMetrics {
  /** 成交数据 */
  trading: {
    avgDailyVolume: number    // 日均成交额（万元）
    avgDailyShares: number    // 日均成交量（万手）
    turnoverRate: number      // 换手率 (%)
    bidAskSpread: number      // 买卖价差 (bp)
    impactCost: number        // 冲击成本 (bp)
  }

  /** IOPV相关 */
  iopv: {
    premiumDiscount: number   // 折溢价 (%)
    avgPremiumDiscount: number // 平均价差 (%)
    deviationCount: number    // 偏离次数
    maxDeviation: number      // 最大偏离 (%)
  }

  /** 规模变化 */
  scale: {
    totalNAV: number          // 总资产净值（亿元）
    sharesOutstanding: number // 流通份额（亿份）
    navChange5d: number       // 5日份额变动 (%)
    navChange20d: number      // 20日份额变动 (%)
    creationRedemption: number // 申赎情况（万份）
  }

  /** 持有人结构 */
  holderStructure: {
    institutionalPct: number  // 机构投资者占比 (%)
    retailPct: number        // 个人投资者占比 (%)
    top10HolderPct: number   // 前十大持有人占比 (%)
    concentrationRisk: number // 集中度风险评级 (1-5)
  }
}

// ============================================
// Dashboard状态
// ============================================

/** Dashboard配置 */
export interface DashboardConfig {
  selectedETF: string | null
  dateRange: [string, string]
  benchmark: string
  theme: 'dark' | 'light'
  refreshInterval: number // 自动刷新间隔（秒）
  displayMode: 'overview' | 'detail' | 'compare'
}

/** KPI卡片数据 */
export interface KPICardData {
  title: string
  value: number | string
  unit: string
  change: number // 变动 (%)
  changePeriod: string
  trend: 'up' | 'down' | 'flat'
  sparklineData?: number[]
  status?: 'normal' | 'warning' | 'danger'
  tooltip?: string
}

/** 预警信息 */
export interface AlertInfo {
  id: string
  level: 'info' | 'warning' | 'critical'
  type: 'risk' | 'liquidity' | 'compliance' | 'performance'
  title: string
  message: string
  timestamp: string
  resolved: boolean
}
