/**
 * 中国首批18家主动ETF试点产品完整数据
 * ============================================
 * 数据来源：公开申报信息 + 专业模拟
 * 上市后替换为真实API数据
 * ============================================
 */

import type { ETFInfo, NAVData, Holding, SectorAllocation } from '../types'

// ============================================
// 18家基金公司产品基本信息
// ============================================

export const etfProducts: ETFInfo[] = [
  // ===== 上交所（9家）=====
  {
    code: '510520',
    name: '易方达品质未来主动管理ETF',
    fundCompany: '易方达基金管理有限公司',
    fundCompanyShort: '易方达基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '张坤', experience: 12, style: 'large_cap_quality', background: '清华大学经济学硕士', description: '消费/科技领域深度研究者，长期价值投资理念' },
    ],
    strategy: 'quality',
    benchmark: '中证800指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '510521',
    name: '华夏质量价值甄选主动管理ETF',
    fundCompany: '华夏基金管理有限公司',
    fundCompanyShort: '华夏基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '王君正', experience: 15, style: 'multi_factor', background: '北京大学金融学博士', description: '量化+基本面结合，多因子选股专家' },
    ],
    strategy: 'value',
    benchmark: '沪深300指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '510522',
    name: '永赢景气精选主动管理ETF',
    fundCompany: '永赢基金管理有限公司',
    fundCompanyShort: '永赢基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '许拓', experience: 8, style: 'cyclical_growth', background: '复旦大学金融工程硕士', description: '周期成长股专家，擅长中观行业配置' },
      { name: '蔡路平', experience: 10, style: 'large_cap_value', background: '上海交通大学MBA', description: '指数投资部负责人，ETF运营专家' },
    ],
    strategy: 'growth',
    benchmark: '中证500指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_medium',
  },
  {
    code: '510523',
    name: '摩根核心成长主动管理ETF',
    fundCompany: '摩根资产管理(中国)有限公司',
    fundCompanyShort: '摩根基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-15',
    managers: [
      { name: '李博', experience: 11, style: 'large_cap_growth', background: 'CFA，美国哥伦比亚大学MBA', description: '国际视野的大盘成长股投资者' },
    ],
    strategy: 'growth',
    benchmark: 'MSCI中国A股指数',
    category: 'equity_active',
    managementFee: 1.05,
    custodyFee: 0.15,
    companyType: 'foreign_joint_venture',
  },
  {
    code: '510524',
    name: '华泰柏瑞价值精选主动管理ETF',
    fundCompany: '华泰柏瑞基金管理有限公司',
    fundCompanyShort: '华泰柏瑞',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '杨景涵', experience: 14, style: 'deep_value', background: '上海财经大学经济学硕士', description: '深度价值派代表，专注低估值优质企业' },
    ],
    strategy: 'value',
    benchmark: '中证红利指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'etf_specialist',
  },
  {
    code: '510525',
    name: '汇添富均衡策略主动管理ETF',
    fundCompany: '汇添富基金管理股份有限公司',
    fundCompanyShort: '汇添富基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '劳杰男', experience: 13, style: 'balanced', background: '复旦大学金融学博士', description: '均衡配置大师，攻守兼备型选手' },
    ],
    strategy: 'balanced',
    benchmark: '中证800指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '510526',
    name: '华安品质严选主动管理ETF',
    fundCompany: '华安基金管理有限公司',
    fundCompanyShort: '华安基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '王春', experience: 12, style: 'quality', background: '中国人民大学经济学硕士', description: '品质投资践行者，ROIC为核心指标' },
    ],
    strategy: 'quality',
    benchmark: '中证1000指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_medium',
  },
  {
    code: '510527',
    name: '招商价值智选主动管理ETF',
    fundCompany: '招商基金管理有限公司',
    fundCompanyShort: '招商基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '贾仁栋', experience: 10, style: 'value', background: '厦门大学金融学硕士', description: '银行系价值投资代表' },
    ],
    strategy: 'value',
    benchmark: '上证50指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'bank_affiliated',
  },
  {
    code: '510528',
    name: '平安行业优选主动管理ETF',
    fundCompany: '平安基金管理有限公司',
    fundCompanyShort: '平安基金',
    exchange: 'SSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: {
      name: '神前前',
      experience: 9,
      style: 'sector_rotation',
      background: '清华大学计算机博士',
      description: '行业轮动策略专家，TMT研究背景深厚',
    } as any, // 单基金经理场景
    strategy: 'sector_rotation',
    benchmark: '中证全指指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'insurance_affiliated',
  },

  // ===== 深交所（9家）=====
  {
    code: '159940',
    name: '南方大盘风格配置主动管理ETF',
    fundCompany: '南方基金管理股份有限公司',
    fundCompanyShort: '南方基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '罗文杰', experience: 11, style: 'balanced', background: '香港科技大学金融学硕士', description: '大盘风格配置专家，ETF管理经验丰富' },
    ],
    strategy: 'balanced',
    benchmark: '深证100指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '159941',
    name: '富国价值优选主动管理ETF',
    fundCompany: '富国基金管理有限公司',
    fundCompanyShort: '富国基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '于洋', experience: 12, style: 'value', background: '复旦大学医学院硕士', description: '医药背景的价值投资者，跨行业研究能力强' },
    ],
    strategy: 'value',
    benchmark: '中证500指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '159942',
    name: '大成红利智选主动管理ETF',
    fundCompany: '大成基金管理有限公司',
    fundCompanyShort: '大成基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '苏秉毅', experience: 13, style: 'dividend', background: '清华大学工学硕士', description: '红利策略专家，高股息率标的筛选能力突出' },
    ],
    strategy: 'dividend',
    benchmark: '中证红利指数',
    category: 'equity_active',
    managementFee: 0.90,
    custodyFee: 0.15,
    companyType: 'top_tier_medium',
  },
  {
    code: '159943',
    name: '鹏华价值臻选主动管理ETF',
    fundCompany: '鹏华基金管理有限公司',
    fundCompanyShort: '鹏华基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '陈璇淼', experience: 10, style: 'value', background: '北京大学经济学硕士', description: '研究驱动型价值投资者' },
    ],
    strategy: 'value',
    benchmark: '沪深300指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'top_tier_medium',
  },
  {
    code: '159944',
    name: '工银瑞信红利主动管理ETF',
    fundCompany: '工银瑞信基金管理有限公司',
    fundCompanyShort: '工银瑞信',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '焦文龙', experience: 11, style: 'dividend', background: '中国人民大学金融学硕士', description: '红利策略资深从业者' },
      { name: '李锐敏', experience: 8, style: 'balanced', background: '中央财经大学硕士', description: '均衡配置新锐' },
    ],
    strategy: 'dividend',
    benchmark: 'CSI Dividend Index',
    category: 'equity_active',
    managementFee: 0.90,
    custodyFee: 0.15,
    companyType: 'bank_affiliated',
  },
  {
    code: '159945',
    name: '华宝优选稳健股票主动管理ETF',
    fundCompany: '华宝基金管理有限公司',
    fundCompanyShort: '华宝基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '闫旭', experience: 14, style: 'balanced', background: '复旦大学管理学硕士', description: '稳健投资代表，风控意识强' },
    ],
    strategy: 'balanced',
    benchmark: '中证800指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'etf_specialist',
  },
  {
    code: '159946',
    name: '国泰鑫汇均衡收益主动管理ETF',
    fundCompany: '国泰基金管理有限公司',
    fundCompanyShort: '国泰基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '程洲', experience: 16, style: 'balanced', background: '南开大学经济学硕士', description: '老将坐镇，均衡收益追求者' },
    ],
    strategy: 'balanced',
    benchmark: '中证1000指数',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_head',
  },
  {
    code: '159947',
    name: '天弘均衡优选主动管理ETF',
    fundCompany: '天弘基金管理有限公司',
    fundCompanyShort: '天弘基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '谷琦彬', experience: 9, style: 'quality', background: '清华大学工科硕士', description: '互联网基因的品质投资者' },
    ],
    strategy: 'balanced',
    benchmark: '创业板指',
    category: 'equity_active',
    managementFee: 1.0,
    custodyFee: 0.15,
    companyType: 'top_tier_medium',
  },
  {
    code: '159948',
    name: '建信竞争优势主动管理ETF',
    fundCompany: '建信基金管理有限责任公司',
    fundCompanyShort: '建信基金',
    exchange: 'SZSE',
    status: 'pending',
    inceptionDate: '2024-09-01',
    managers: [
      { name: '陶灿', experience: 13, style: 'momentum', background: '北京大学数学学士', description: '动量策略实践者，量化与基本面融合' },
    ],
    strategy: 'momentum',
    benchmark: '中证500指数',
    category: 'equity_active',
    managementFee: 0.95,
    custodyFee: 0.15,
    companyType: 'bank_affiliated',
  },
]

// ============================================
// 工具函数：生成模拟净值数据
// ============================================

/**
 * 为指定ETF生成模拟日度净值数据
 * @param days 模拟天数（默认300个交易日）
 * @param params 收益率参数
 */
export function generateMockNAVData(
  days: number = 300,
  params?: {
    annualReturn?: number     // 年化收益率目标 (%)
    volatility?: number       // 年化波动率 (%)
    alpha?: number            // 年化超额收益 (%)
    trackingError?: number    // 跟踪误差 (%)
  }
): NAVData[] {
  const {
    volatility = 25,
    alpha = 3,
    trackingError = 5,
  } = params || {}

  const data: NAVData[] = []
  const startDate = new Date('2024-06-01')
  let nav = 1.0

  const dailyVol = volatility / Math.sqrt(252)
  const dailyAlpha = alpha / 252

  for (let i = 0; i < days; i++) {
    // 跳过周末
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // 生成收益率（带alpha的随机游走）
    const marketReturn = (Math.random() - 0.48) * dailyVol * 2
    const idiosyncratic = (Math.random() - 0.5) * dailyVol
    const dailyAlphaValue = dailyAlpha / 252 + (Math.random() - 0.5) * (trackingError / Math.sqrt(252))
    const totalReturn = marketReturn + idiosyncratic + dailyAlphaValue

    nav *= 1 + totalReturn

    data.push({
      date: date.toISOString().split('T')[0],
      nav: parseFloat(nav.toFixed(4)),
      accNav: parseFloat(nav.toFixed(4)),
      dailyReturn: parseFloat((totalReturn * 100).toFixed(2)),
      benchmarkReturn: parseFloat(((marketReturn + idiosyncratic) * 100).toFixed(2)),
      excessReturn: parseFloat(((totalReturn - marketReturn - idiosyncratic) * 100).toFixed(2)),
    })
  }

  return data
}

// ============================================
// 工具函数：生成模拟持仓数据
// ============================================

/**
 * 根据投资策略生成模拟持仓
 */
export function generateMockHoldings(strategy: ETFInfo['strategy']): Holding[] {
  const baseHoldings: Record<string, Holding[]> = {
    value: [
      { rank: 1, code: '601398', name: '工商银行', shares: 2000, marketValue: 98000, weight: 6.15, sector: '银行', change: 0.05 },
      { rank: 2, code: '600036', name: '招商银行', shares: 1200, marketValue: 75230, weight: 4.72, sector: '银行', change: -0.12 },
      { rank: 3, code: '601318', name: '中国平安', shares: 850, marketValue: 98500, weight: 6.18, sector: '非银金融', change: 0.08 },
      { rank: 4, code: '600519', name: '贵州茅台', shares: 120, marketValue: 150000, weight: 9.42, sector: '食品饮料', change: 0.22 },
      { rank: 5, code: '000858', name: '五粮液', shares: 380, marketValue: 80750, weight: 5.07, sector: '食品饮料', change: 0.15 },
      { rank: 6, code: '601088', name: '中国神华', shares: 650, marketValue: 68250, weight: 4.28, sector: '煤炭', change: -0.05 },
      { rank: 7, code: '600900', name: '长江电力', shares: 400, marketValue: 61800, weight: 3.88, sector: '公用事业', change: 0.02 },
      { rank: 8, code: '601668', name: '中国建筑', shares: 1800, marketValue: 55800, weight: 3.50, sector: '建筑装饰', change: -0.08 },
      { rank: 9, code: '000333', name: '美的集团', shares: 250, marketValue: 45000, weight: 2.83, sector: '家用电器', change: 0.18 },
      { rank: 10, code: '002352', name: '顺丰控股', shares: 280, marketValue: 42000, weight: 2.64, sector: '交通运输', change: 0.11 },
    ],
    growth: [
      { rank: 1, code: '300750', name: '宁德时代', shares: 320, marketValue: 142400, weight: 8.94, sector: '电力设备', change: 0.45 },
      { rank: 2, code: '002594', name: '比亚迪', shares: 350, marketValue: 85750, weight: 5.38, sector: '汽车', change: 0.52 },
      { rank: 3, code: '688981', name: '中芯国际', shares: 1500, marketValue: 78500, weight: 4.93, sector: '电子', change: 0.28 },
      { rank: 4, code: '300124', name: '汇川技术', shares: 450, marketValue: 58500, weight: 3.67, sector: '机械设备', change: 0.35 },
      { rank: 5, code: '002475', name: '立讯精密', shares: 550, marketValue: 62450, weight: 3.92, sector: '电子', change: 0.42 },
      { rank: 6, code: '300274', name: '阳光电源', shares: 380, marketValue: 55100, weight: 3.46, sector: '电力设备', change: 0.38 },
      { rank: 7, code: '688036', name: '传音控股', shares: 220, marketValue: 48400, weight: 3.04, sector: '电子', change: 0.25 },
      { rank: 8, code: '002230', name: '科大讯飞', shares: 500, marketValue: 46500, weight: 2.92, sector: '计算机', change: 0.32 },
      { rank: 9, code: '300059', name: '东方财富', shares: 700, marketValue: 44100, weight: 2.77, sector: '非银金融', change: 0.19 },
      { rank: 10, code: '688256', name: '寒武纪', shares: 180, marketValue: 41400, weight: 2.60, sector: '计算机', change: 0.55 },
    ],
    balanced: [
      { rank: 1, code: '600519', name: '贵州茅台', shares: 110, marketValue: 137500, weight: 8.63, sector: '食品饮料', change: 0.20 },
      { rank: 2, code: '300750', name: '宁德时代', shares: 260, marketValue: 115700, weight: 7.26, sector: '电力设备', change: 0.38 },
      { rank: 3, code: '601318', name: '中国平安', shares: 750, marketValue: 86900, weight: 5.45, sector: '非银金融', change: 0.05 },
      { rank: 4, code: '600036', name: '招商银行', shares: 1050, marketValue: 65800, weight: 4.13, sector: '银行', change: -0.10 },
      { rank: 5, code: '000858', name: '五粮液', shares: 350, marketValue: 74300, weight: 4.66, sector: '食品饮料', change: 0.12 },
      { rank: 6, code: '002594', name: '比亚迪', shares: 280, marketValue: 68600, weight: 4.31, sector: '汽车', change: 0.28 },
      { rank: 7, code: '600900', name: '长江电力', shares: 350, marketValue: 54100, weight: 3.40, sector: '公用事业', change: 0.02 },
      { rank: 8, code: '002475', name: '立讯精密', shares: 480, marketValue: 54500, weight: 3.42, sector: '电子', change: 0.32 },
      { rank: 9, code: '000333', name: '美的集团', shares: 270, marketValue: 48600, weight: 3.05, sector: '家用电器', change: 0.15 },
      { rank: 10, code: '601888', name: '中国中免', shares: 160, marketValue: 61200, weight: 3.84, sector: '商贸零售', change: 0.18 },
    ],
    dividend: [
      { rank: 1, code: '600900', name: '长江电力', shares: 900, marketValue: 139000, weight: 8.73, sector: '公用事业', change: 0.02 },
      { rank: 2, code: '601398', name: '工商银行', shares: 2500, marketValue: 122500, weight: 7.69, sector: '银行', change: 0.03 },
      { rank: 3, code: '601088', name: '中国神华', shares: 1100, marketValue: 115500, weight: 7.25, sector: '煤炭', change: -0.02 },
      { rank: 4, code: '601318', name: '中国平安', shares: 900, marketValue: 104300, weight: 6.55, sector: '非银金融', change: 0.06 },
      { rank: 5, code: '600036', name: '招商银行', shares: 1400, marketValue: 87700, weight: 5.51, sector: '银行', change: -0.08 },
      { rank: 6, code: '601088', name: '大秦铁路', shares: 1800, marketValue: 72000, weight: 4.52, sector: '交通运输', change: 0.01 },
      { rank: 7, code: '600519', name: '贵州茅台', shares: 80, marketValue: 100000, weight: 6.28, sector: '食品饮料', change: 0.18 },
      { rank: 8, code: '000333', name: '美的集团', shares: 320, marketValue: 57600, weight: 3.62, sector: '家用电器', change: 0.12 },
      { rank: 9, code: '601668', name: '中国建筑', shares: 2100, marketValue: 65100, weight: 4.09, sector: '建筑装饰', change: -0.05 },
      { rank: 10, code: '601288', name: '农业银行', shares: 2200, marketValue: 59400, weight: 3.73, sector: '银行', change: 0.02 },
    ],
    quality: [
      { rank: 1, code: '600519', name: '贵州茅台', shares: 130, marketValue: 162500, weight: 10.20, sector: '食品饮料', change: 0.22 },
      { rank: 2, code: '300750', name: '宁德时代', shares: 290, marketValue: 128900, weight: 8.09, sector: '电力设备', change: 0.42 },
      { rank: 3, code: '000858', name: '五粮液', shares: 400, marketValue: 85000, weight: 5.34, sector: '食品饮料', change: 0.16 },
      { rank: 4, code: '002594', name: '比亚迪', shares: 310, marketValue: 76100, weight: 4.78, sector: '汽车', change: 0.48 },
      { rank: 5, code: '601318', name: '中国平安', shares: 800, marketValue: 92700, weight: 5.82, sector: '非银金融', change: 0.08 },
      { rank: 6, code: '000333', name: '美的集团', shares: 300, marketValue: 54000, weight: 3.39, sector: '家用电器', change: 0.16 },
      { rank: 7, code: '002475', name: '立讯精密', shares: 520, marketValue: 59000, weight: 3.70, sector: '电子', change: 0.38 },
      { rank: 8, code: '600900', name: '长江电力', shares: 380, marketValue: 58700, weight: 3.68, sector: '公用事业', change: 0.02 },
      { rank: 9, code: '601888', name: '中国中免', shares: 170, marketValue: 65000, weight: 4.08, sector: '商贸零售', change: 0.20 },
      { rank: 10, code: '300760', name: '迈瑞医疗', shares: 180, marketValue: 56700, weight: 3.56, sector: '医药生物', change: 0.25 },
    ],
    momentum: [
      { rank: 1, code: '300750', name: '宁德时代', shares: 340, marketValue: 151300, weight: 9.50, sector: '电力设备', change: 0.52 },
      { rank: 2, code: '002594', name: '比亚迪', shares: 380, marketValue: 93100, weight: 5.84, sector: '汽车', change: 0.58 },
      { rank: 3, code: '688256', name: '寒武纪', shares: 200, marketValue: 46000, weight: 2.89, sector: '计算机', change: 0.62 },
      { rank: 4, code: '300059', name: '东方财富', shares: 750, marketValue: 47300, weight: 2.97, sector: '非银金融', change: 0.25 },
      { rank: 5, code: '002230', name: '科大讯飞', shares: 550, marketValue: 51200, weight: 3.21, sector: '计算机', change: 0.36 },
      { rank: 6, code: '300274', name: '阳光电源', shares: 420, marketValue: 60900, weight: 3.82, sector: '电力设备', change: 0.42 },
      { rank: 7, code: '002415', name: '海康威视', shares: 480, marketValue: 52800, weight: 3.31, sector: '计算机', change: 0.28 },
      { rank: 8, code: '688981', name: '中芯国际', shares: 1600, marketValue: 83700, weight: 5.26, sector: '电子', change: 0.32 },
      { rank: 9, code: '300124', name: '汇川技术', shares: 480, marketValue: 62400, weight: 3.92, sector: '机械设备', change: 0.38 },
      { rank: 10, code: '002352', name: '顺丰控股', shares: 300, marketValue: 45000, weight: 2.83, sector: '交通运输', change: 0.15 },
    ],
    sector_rotation: [
      { rank: 1, code: '300750', name: '宁德时代', shares: 300, marketValue: 133500, weight: 8.38, sector: '电力设备', change: 0.48 },
      { rank: 2, code: '688981', name: '中芯国际', shares: 1400, marketValue: 73300, weight: 4.60, sector: '电子', change: 0.30 },
      { rank: 3, code: '002230', name: '科大讯飞', shares: 600, marketValue: 55800, weight: 3.50, sector: '计算机', change: 0.35 },
      { rank: 4, code: '300274', name: '阳光电源', shares: 360, marketValue: 52200, weight: 3.28, sector: '电力设备', change: 0.40 },
      { rank: 5, code: '002415', name: '海康威视', shares: 450, marketValue: 49500, weight: 3.11, sector: '计算机', change: 0.28 },
      { rank: 6, code: '300059', name: '东方财富', shares: 650, marketValue: 41000, weight: 2.57, sector: '非银金融', change: 0.22 },
      { rank: 7, code: '688036', name: '传音控股', shares: 240, marketValue: 52800, weight: 3.31, sector: '电子', change: 0.26 },
      { rank: 8, code: '300124', name: '汇川技术', shares: 420, marketValue: 54600, weight: 3.43, sector: '机械设备', change: 0.36 },
      { rank: 9, code: '002371', name: '北方华创', shares: 180, marketValue: 48600, weight: 3.05, sector: '机械设备', change: 0.44 },
      { rank: 10, code: '688012', name: '中微公司', shares: 150, marketValue: 43500, weight: 2.73, sector: '机械设备', change: 0.38 },
    ],
    multi_factor: [
      { rank: 1, code: '600519', name: '贵州茅台', shares: 115, marketValue: 143750, weight: 9.03, sector: '食品饮料', change: 0.21 },
      { rank: 2, code: '300750', name: '宁德时代', shares: 275, marketValue: 122400, weight: 7.68, sector: '电力设备', change: 0.40 },
      { rank: 3, code: '601318', name: '中国平安', shares: 780, marketValue: 89800, weight: 5.64, sector: '非银金融', change: 0.06 },
      { rank: 4, code: '000858', name: '五粮液', shares: 365, marketValue: 77400, weight: 4.86, sector: '食品饮料', change: 0.14 },
      { rank: 5, code: '600036', name: '招商银行', shares: 1100, marketValue: 68900, weight: 4.33, sector: '银行', change: -0.09 },
      { rank: 6, code: '002594', name: '比亚迪', shares: 295, marketValue: 72300, weight: 4.54, sector: '汽车', change: 0.32 },
      { rank: 7, code: '600900', name: '长江电力', shares: 365, marketValue: 56400, weight: 3.54, sector: '公用事业', change: 0.02 },
      { rank: 8, code: '002475', name: '立讯精密', shares: 500, marketValue: 56800, weight: 3.57, sector: '电子', change: 0.35 },
      { rank: 9, code: '000333', name: '美的集团', shares: 280, marketValue: 50400, weight: 3.16, sector: '家用电器', change: 0.14 },
      { rank: 10, code: '601888', name: '中国中免', shares: 165, marketValue: 63100, weight: 3.96, sector: '商贸零售', change: 0.19 },
    ],
  }

  return baseHoldings[strategy] || baseHoldings.balanced
}

// ============================================
// 工具函数：生成行业配置数据
// ============================================

export function generateMockSectorAllocation(
  strategy: ETFInfo['strategy']
): SectorAllocation[] {
  const baseAllocations: Record<string, SectorAllocation[]> = {
    value: [
      { sector: '银行', weight: 18.5, benchmarkWeight: 12.0, activeWeight: 6.5, count: 6 },
      { sector: '食品饮料', weight: 16.2, benchmarkWeight: 10.5, activeWeight: 5.7, count: 4 },
      { sector: '非银金融', weight: 12.8, benchmarkWeight: 8.5, activeWeight: 4.3, count: 3 },
      { sector: '煤炭', weight: 8.5, benchmarkWeight: 4.2, activeWeight: 4.3, count: 2 },
      { sector: '公用事业', weight: 7.8, benchmarkWeight: 5.0, activeWeight: 2.8, count: 2 },
      { sector: '交通运输', weight: 6.5, benchmarkWeight: 4.8, activeWeight: 1.7, count: 3 },
      { sector: '建筑装饰', weight: 5.2, benchmarkWeight: 5.5, activeWeight: -0.3, count: 2 },
      { sector: '家用电器', weight: 4.8, benchmarkWeight: 5.2, activeWeight: -0.4, count: 1 },
      { sector: '石油石化', weight: 4.5, benchmarkWeight: 6.0, activeWeight: -1.5, count: 2 },
      { sector: '其他', weight: 15.2, benchmarkWeight: 38.3, activeWeight: -23.1, count: 25 },
    ],
    growth: [
      { sector: '电力设备', weight: 24.5, benchmarkWeight: 14.2, activeWeight: 10.3, count: 15 },
      { sector: '电子', weight: 18.2, benchmarkWeight: 11.0, activeWeight: 7.2, count: 22 },
      { sector: '汽车', weight: 12.5, benchmarkWeight: 6.2, activeWeight: 6.3, count: 5 },
      { sector: '计算机', weight: 10.8, benchmarkWeight: 7.5, activeWeight: 3.3, count: 12 },
      { sector: '机械设备', weight: 9.5, benchmarkWeight: 8.0, activeWeight: 1.5, count: 10 },
      { sector: '通信', weight: 6.2, benchmarkWeight: 4.5, activeWeight: 1.7, count: 5 },
      { sector: '国防军工', weight: 5.8, benchmarkWeight: 3.5, activeWeight: 2.3, count: 4 },
      { sector: '医药生物', weight: 5.2, benchmarkWeight: 9.8, activeWeight: -4.6, count: 8 },
      { sector: '传媒', weight: 3.5, benchmarkWeight: 4.2, activeWeight: -0.7, count: 4 },
      { sector: '其他', weight: 3.8, benchmarkWeight: 31.1, activeWeight: -27.3, count: 15 },
    ],
    balanced: [
      { sector: '食品饮料', weight: 14.5, benchmarkWeight: 10.5, activeWeight: 4.0, count: 5 },
      { sector: '电力设备', weight: 12.8, benchmarkWeight: 14.2, activeWeight: -1.4, count: 10 },
      { sector: '非银金融', weight: 10.2, benchmarkWeight: 8.5, activeWeight: 1.7, count: 3 },
      { sector: '银行', weight: 9.5, benchmarkWeight: 12.0, activeWeight: -2.5, count: 4 },
      { sector: '汽车', weight: 8.5, benchmarkWeight: 6.2, activeWeight: 2.3, count: 3 },
      { sector: '电子', weight: 7.8, benchmarkWeight: 11.0, activeWeight: -3.2, count: 12 },
      { sector: '公用事业', weight: 6.5, benchmarkWeight: 5.0, activeWeight: 1.5, count: 2 },
      { sector: '家用电器', weight: 5.8, benchmarkWeight: 5.2, activeWeight: 0.6, count: 2 },
      { sector: '商贸零售', weight: 5.2, benchmarkWeight: 3.8, activeWeight: 1.4, count: 2 },
      { sector: '其他', weight: 19.2, benchmarkWeight: 23.6, activeWeight: -4.4, count: 37 },
    ],
    dividend: [
      { sector: '公用事业', weight: 16.5, benchmarkWeight: 5.0, activeWeight: 11.5, count: 3 },
      { sector: '银行', weight: 22.5, benchmarkWeight: 12.0, activeWeight: 10.5, count: 6 },
      { sector: '煤炭', weight: 12.8, benchmarkWeight: 4.2, activeWeight: 8.6, count: 2 },
      { sector: '非银金融', weight: 10.5, benchmarkWeight: 8.5, activeWeight: 2.0, count: 2 },
      { sector: '交通运输', weight: 8.5, benchmarkWeight: 4.8, activeWeight: 3.7, count: 3 },
      { sector: '食品饮料', weight: 10.2, benchmarkWeight: 10.5, activeWeight: -0.3, count: 2 },
      { sector: '建筑装饰', weight: 6.5, benchmarkWeight: 5.5, activeWeight: 1.0, count: 2 },
      { sector: '家用电器', weight: 4.8, benchmarkWeight: 5.2, activeWeight: -0.4, count: 1 },
      { sector: '石油石化', weight: 3.5, benchmarkWeight: 6.0, activeWeight: -2.5, count: 1 },
      { sector: '其他', weight: 4.2, benchmarkWeight: 38.3, activeWeight: -34.1, count: 16 },
    ],
    quality: [
      { sector: '食品饮料', weight: 17.8, benchmarkWeight: 10.5, activeWeight: 7.3, count: 4 },
      { sector: '电力设备', weight: 13.5, benchmarkWeight: 14.2, activeWeight: -0.7, count: 8 },
      { sector: '非银金融', weight: 11.2, benchmarkWeight: 8.5, activeWeight: 2.7, count: 2 },
      { sector: '汽车', weight: 9.5, benchmarkWeight: 6.2, activeWeight: 3.3, count: 2 },
      { sector: '电子', weight: 8.8, benchmarkWeight: 11.0, activeWeight: -2.2, count: 8 },
      { sector: '家用电器', weight: 6.5, benchmarkWeight: 5.2, activeWeight: 1.3, count: 2 },
      { sector: '公用事业', weight: 5.8, benchmarkWeight: 5.0, activeWeight: 0.8, count: 1 },
      { sector: '商贸零售', weight: 5.5, benchmarkWeight: 3.8, activeWeight: 1.7, count: 1 },
      { sector: '医药生物', weight: 5.2, benchmarkWeight: 9.8, activeWeight: -4.6, count: 3 },
      { sector: '其他', weight: 16.2, benchmarkWeight: 25.8, activeWeight: -9.6, count: 29 },
    ],
    momentum: [
      { sector: '电力设备', weight: 22.5, benchmarkWeight: 14.2, activeWeight: 8.3, count: 12 },
      { sector: '电子', weight: 15.8, benchmarkWeight: 11.0, activeWeight: 4.8, count: 18 },
      { sector: '计算机', weight: 12.5, benchmarkWeight: 7.5, activeWeight: 5.0, count: 10 },
      { sector: '汽车', weight: 10.2, benchmarkWeight: 6.2, activeWeight: 4.0, count: 3 },
      { sector: '机械设备', weight: 10.5, benchmarkWeight: 8.0, activeWeight: 2.5, count: 8 },
      { sector: '非银金融', weight: 6.5, benchmarkWeight: 8.5, activeWeight: -2.0, count: 1 },
      { sector: '通信', weight: 5.8, benchmarkWeight: 4.5, activeWeight: 1.3, count: 4 },
      { sector: '国防军工', weight: 4.5, benchmarkWeight: 3.5, activeWeight: 1.0, count: 3 },
      { sector: '传媒', weight: 4.2, benchmarkWeight: 4.2, activeWeight: 0.0, count: 3 },
      { sector: '其他', weight: 7.5, benchmarkWeight: 22.4, activeWeight: -14.9, count: 18 },
    ],
    sector_rotation: [
      { sector: '电力设备', weight: 18.5, benchmarkWeight: 14.2, activeWeight: 4.3, count: 10 },
      { sector: '电子', weight: 16.2, benchmarkWeight: 11.0, activeWeight: 5.2, count: 15 },
      { sector: '计算机', weight: 14.5, benchmarkWeight: 7.5, activeWeight: 7.0, count: 12 },
      { sector: '机械设备', weight: 12.8, benchmarkWeight: 8.0, activeWeight: 4.8, count: 10 },
      { sector: '汽车', weight: 8.5, benchmarkWeight: 6.2, activeWeight: 2.3, count: 2 },
      { sector: '通信', weight: 6.5, benchmarkWeight: 4.5, activeWeight: 2.0, count: 4 },
      { sector: '国防军工', weight: 5.2, benchmarkWeight: 3.5, activeWeight: 1.7, count: 3 },
      { sector: '非银金融', weight: 5.5, benchmarkWeight: 8.5, activeWeight: -3.0, count: 1 },
      { sector: '医药生物', weight: 4.8, benchmarkWeight: 9.8, activeWeight: -5.0, count: 5 },
      { sector: '其他', weight: 7.5, benchmarkWeight: 26.6, activeWeight: -19.1, count: 18 },
    ],
    multi_factor: [
      { sector: '食品饮料', weight: 15.2, benchmarkWeight: 10.5, activeWeight: 4.7, count: 4 },
      { sector: '电力设备', weight: 13.8, benchmarkWeight: 14.2, activeWeight: -0.4, count: 9 },
      { sector: '非银金融', weight: 10.5, benchmarkWeight: 8.5, activeWeight: 2.0, count: 2 },
      { sector: '银行', weight: 8.8, benchmarkWeight: 12.0, activeWeight: -3.2, count: 3 },
      { sector: '汽车', weight: 8.2, benchmarkWeight: 6.2, activeWeight: 2.0, count: 2 },
      { sector: '电子', weight: 7.5, benchmarkWeight: 11.0, activeWeight: -3.5, count: 10 },
      { sector: '公用事业', weight: 6.2, benchmarkWeight: 5.0, activeWeight: 1.2, count: 1 },
      { sector: '家用电器', weight: 5.5, benchmarkWeight: 5.2, activeWeight: 0.3, count: 1 },
      { sector: '商贸零售', weight: 5.2, benchmarkWeight: 3.8, activeWeight: 1.4, count: 1 },
      { sector: '其他', weight: 19.1, benchmarkWeight: 23.6, activeWeight: -4.5, count: 35 },
    ],
  }

  return baseAllocations[strategy] || baseAllocations.balanced
}
