import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { ETFInfo, DashboardConfig, NAVData, Holding, RiskMetrics, LiquidityMetrics } from '../types'

// ============================================
// State类型定义
// ============================================

interface ETFState {
  /** 所有ETF产品列表 */
  etfList: ETFInfo[]
  /** 当前选中的ETF */
  selectedETF: ETFInfo | null
  /** Dashboard配置 */
  config: DashboardConfig
  /** 当前ETF的净值数据 */
  navData: NAVData[]
  /** 当前ETF的持仓数据 */
  holdings: Holding[]
  /** 当前ETF的风险指标 */
  riskMetrics: RiskMetrics | null
  /** 当前ETF的流动性指标 */
  liquidityMetrics: LiquidityMetrics | null
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

// ============================================
// Action类型
// ============================================

type ETFAction =
  | { type: 'SET_ETF_LIST'; payload: ETFInfo[] }
  | { type: 'SELECT_ETF'; payload: ETFInfo }
  | { type: 'UPDATE_CONFIG'; payload: Partial<DashboardConfig> }
  | { type: 'SET_NAV_DATA'; payload: NAVData[] }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_RISK_METRICS'; payload: RiskMetrics }
  | { type: 'SET_LIQUIDITY_METRICS'; payload: LiquidityMetrics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// ============================================
// 初始状态
// ============================================

const initialState: ETFState = {
  etfList: [],
  selectedETF: null,
  config: {
    selectedETF: null,
    dateRange: ['2024-01-01', new Date().toISOString().split('T')[0]],
    benchmark: 'CSI800',
    theme: 'dark',
    refreshInterval: 30,
    displayMode: 'overview',
  },
  navData: [],
  holdings: [],
  riskMetrics: null,
  liquidityMetrics: null,
  loading: false,
  error: null,
}

// ============================================
// Reducer
// ============================================

function etfReducer(state: ETFState, action: ETFAction): ETFState {
  switch (action.type) {
    case 'SET_ETF_LIST':
      return { ...state, etfList: action.payload }
    case 'SELECT_ETF':
      return {
        ...state,
        selectedETF: action.payload,
        config: { ...state.config, selectedETF: action.payload.code },
        loading: true,
      }
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } }
    case 'SET_NAV_DATA':
      return { ...state, navData: action.payload, loading: false }
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload }
    case 'SET_RISK_METRICS':
      return { ...state, riskMetrics: action.payload }
    case 'SET_LIQUIDITY_METRICS':
      return { ...state, liquidityMetrics: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

// ============================================
// Context
// ============================================

interface ETFContextType {
  state: ETFState
  dispatch: React.Dispatch<ETFAction>
  // 便捷方法
  selectETF: (etf: ETFInfo) => void
  updateConfig: (config: Partial<DashboardConfig>) => void
}

const ETFContext = createContext<ETFContextType | undefined>(undefined)

// ============================================
// Provider组件
// ============================================

export function ETFProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(etfReducer, initialState)

  const selectETF = (etf: ETFInfo) => {
    dispatch({ type: 'SELECT_ETF', payload: etf })
  }

  const updateConfig = (config: Partial<DashboardConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config })
  }

  return (
    <ETFContext.Provider value={{ state, dispatch, selectETF, updateConfig }}>
      {children}
    </ETFContext.Provider>
  )
}

// ============================================
// 自定义Hook
// ============================================

export function useETFContext() {
  const context = useContext(ETFContext)
  if (context === undefined) {
    throw new Error('useETFContext must be used within an ETFProvider')
  }
  return context
}

export default ETFContext
