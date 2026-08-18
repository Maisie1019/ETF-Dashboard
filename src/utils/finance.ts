/**
 * 金融计算工具函数
 * 符合国际一流量化基金标准
 */

/**
 * 计算年化收益率
 */
export function annualizedReturn(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (years <= 0 || startValue <= 0) return 0
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
}

/**
 * 计算波动率（年化）
 */
export function calculateVolatility(returns: number[]): number {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    (returns.length - 1)
  return Math.sqrt(variance) * Math.sqrt(252) * 100 // 年化，转百分比
}

/**
 * 计算夏普比率
 */
export function sharpeRatio(
  returns: number[],
  riskFreeRate: number = 2.5 // 默认无风险利率2.5%
): number {
  const volatility = calculateVolatility(returns)
  if (volatility === 0) return 0
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  return ((avgReturn * 252 - riskFreeRate) / volatility) * 100
}

/**
 * 计算最大回撤及恢复时间
 */
export function maxDrawdown(navData: { date: string; nav: number }[]) {
  let maxDrawdown = 0
  let peak = navData[0]?.nav || 1
  let maxDrawdownDate = ''
  let recoveryDate = ''

  for (const point of navData) {
    if (point.nav > peak) {
      peak = point.nav
    }
    const drawdown = (peak - point.nav) / peak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
      maxDrawdownDate = point.date
    }
  }

  return {
    maxDrawdown: parseFloat((maxDrawdown * 100).toFixed(2)),
    maxDrawdownDate,
    recoveryDate,
  }
}

/**
 * 计算 VaR (Value at Risk) - 历史模拟法
 */
export function calculateVaR(
  returns: number[],
  confidenceLevel: number = 0.95
): number {
  const sortedReturns = [...returns].sort((a, b) => a - b)
  const index = Math.floor(sortedReturns.length * (1 - confidenceLevel))
  return sortedReturns[index] * 100 // 转百分比
}

/**
 * 计算 CVaR (Conditional VaR) / Expected Shortfall
 */
export function calculateCVaR(
  returns: number[],
  confidenceLevel: number = 0.95
): number {
  const varValue = calculateVaR(returns, confidenceLevel)
  const tailReturns = returns.filter((r) => r <= varValue / 100)
  if (tailReturns.length === 0) return varValue
  return (
    tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length
  ) * 100
}

/**
 * 计算 Beta 系数
 */
export function calculateBeta(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  if (portfolioReturns.length !== benchmarkReturns.length) return 0

  const portMean =
    portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length
  const benchMean =
    benchmarkReturns.reduce((a, b) => a + b, 0) / benchmarkReturns.length

  let covariance = 0
  let benchmarkVariance = 0

  for (let i = 0; i < portfolioReturns.length; i++) {
    covariance +=
      (portfolioReturns[i] - portMean) * (benchmarkReturns[i] - benchMean)
    benchmarkVariance += Math.pow(benchmarkReturns[i] - benchMean, 2)
  }

  return covariance / benchmarkVariance
}

/**
 * 计算跟踪误差（Tracking Error）
 */
export function trackingError(
  excessReturns: number[]
): number {
  const mean =
    excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length
  const variance =
    excessReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
    (excessReturns.length - 1)
  return Math.sqrt(variance) * Math.sqrt(252) * 100 // 年化跟踪误差
}

/**
 * 计算信息比率（Information Ratio）
 */
export function informationRatio(
  excessReturns: number[]
): number {
  const te = trackingError(excessReturns)
  if (te === 0) return 0
  const avgExcess =
    excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length
  return (avgExcess * 252 / te) * 100
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(
  num: number | string,
  decimals: number = 2
): string {
  const value = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(value)) return '-'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * 获取涨跌颜色（A股惯例：红涨绿跌）
 */
export function getChangeColor(value: number): string {
  if (value > 0) return '#f5222d' // 红色-涨
  if (value < 0) return '#52c41a' // 绿色-跌
  return '#999999' // 灰色-平
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
