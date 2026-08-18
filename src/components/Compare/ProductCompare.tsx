/**
 * 多产品收益与净值对比分析模块
 * ============================================
 * 专业级ETF横向对比：18只产品同时展示
 * 包含：排名表格、风险-收益散点图、超额收益柱状图、滚动统计
 * 对标Bloomberg PORT / Morningstar Direct
 */

import React, { useState, useMemo } from 'react'
import {
  Card,
  Table,
  Typography,
  Space,
  Select,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Switch,
  Button,
} from 'antd'
import {
  BarChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, ScatterChart, LineChart, HeatmapChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkLineComponent,
  MarkPointComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { etfProducts } from '../../data/mockData'
import type { ETFInfo, ReturnStatistics } from '../../types'

echarts.use([
  BarChart,
  ScatterChart,
  LineChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkLineComponent,
  MarkPointComponent,
  CanvasRenderer,
])

const { Title, Text } = Typography

// ============================================
// 类型定义
// ============================================

interface ProductPerformance {
  code: string
  name: string
  company: string
  companyType: ETFInfo['companyType']
  strategy: ETFInfo['strategy']
  exchange: string
  benchmark: string
  managementFee: number

  // 收益指标（模拟数据）
  cumulativeReturn: number    // 累计收益率 (%)
  annualizedReturn: number   // 年化收益 (%)
  monthlyReturn: number      // 近1月收益 (%)
  quarterlyReturn: number    // 近3月收益 (%)
  ytdReturn: number          // 年初至今收益 (%)

  // 风险指标
  volatility: number         // 年化波动率 (%)
  maxDrawdown: number        // 最大回撤 (%)
  downsideDeviation: number  // 下行标准差 (%)

  // 风险调整后收益
  sharpeRatio: number        // 夏普比率
  sortinoRatio: number       // 索提诺比率
  calmarRatio: number        // 卡玛比率

  // 主动管理指标
  trackingError: number      // 跟踪误差 (%)
  informationRatio: number   // 信息比率
  excessReturn: number       // 超额收益 (%)
  alpha: number              // Jensen's Alpha (%)
  beta: number               // Beta系数

  // 其他
  winRate: number            // 胜率 (%)
  profitLossRatio: number    // 盈亏比
  recoveryDays: number       // 最大回撤恢复天数

  // 规模（预估）
  estimatedAUM: number       // 预估管理规模（亿元）
}

// ============================================
// 模拟数据生成器（基于策略差异化）
// ============================================

function generatePerformanceData(): ProductPerformance[] {
  const baseParams: Record<ETFInfo['strategy'], Partial<ProductPerformance>> = {
    value: { volatility: 18, maxDrawdown: -12, sharpeRatio: 1.35, excessReturn: 4.2, trackingError: 5.5 },
    growth: { volatility: 32, maxDrawdown: -25, sharpeRatio: 0.95, excessReturn: 6.8, trackingError: 8.2 },
    balanced: { volatility: 22, maxDrawdown: -16, sharpeRatio: 1.15, excessReturn: 3.5, trackingError: 6.0 },
    dividend: { volatility: 14, maxDrawdown: -10, sharpeRatio: 1.55, excessReturn: 2.8, trackingError: 4.0 },
    quality: { volatility: 24, maxDrawdown: -18, sharpeRatio: 1.25, excessReturn: 5.5, trackingError: 7.0 },
    momentum: { volatility: 35, maxDrawdown: -28, sharpeRatio: 0.85, excessReturn: 7.5, trackingError: 9.5 },
    sector_rotation: { volatility: 28, maxDrawdown: -22, sharpeRatio: 1.05, excessReturn: 5.8, trackingError: 8.0 },
    multi_factor: { volatility: 20, maxDrawdown: -14, sharpeRatio: 1.45, excessReturn: 4.8, trackingError: 5.0 },
  }

  return etfProducts.map((etf) => {
    const params = baseParams[etf.strategy] || baseParams.balanced!
    const baseVol = params.volatility! + (Math.random() - 0.5) * 6
    const baseReturn = 8 + (Math.random() - 0.45) * 12
    const baseExcess = params.excessReturn! + (Math.random() - 0.5) * 3

    return {
      code: etf.code,
      name: etf.name.replace('主动管理ETF', '').trim(),
      company: etf.fundCompanyShort,
      companyType: etf.companyType,
      strategy: etf.strategy,
      exchange: etf.exchange === 'SSE' ? '上交所' : '深交所',
      benchmark: etf.benchmark,
      managementFee: etf.managementFee,

      cumulativeReturn: parseFloat((baseReturn + (Math.random() - 0.48) * 8).toFixed(2)),
      annualizedReturn: parseFloat((baseReturn * 0.85 + (Math.random() - 0.5) * 6).toFixed(2)),
      monthlyReturn: parseFloat(((Math.random() - 0.45) * 8).toFixed(2)),
      quarterlyReturn: parseFloat(((Math.random() - 0.43) * 15).toFixed(2)),
      ytdReturn: parseFloat((baseReturn * 0.65 + (Math.random() - 0.46) * 10).toFixed(2)),

      volatility: parseFloat(baseVol.toFixed(2)),
      maxDrawdown: parseFloat((params.maxDrawdown! + (Math.random() - 0.5) * 6).toFixed(2)),
      downsideDeviation: parseFloat((baseVol * 0.72).toFixed(2)),

      sharpeRatio: parseFloat((params.sharpeRatio! + (Math.random() - 0.5) * 0.4).toFixed(2)),
      sortinoRatio: parseFloat((params.sharpeRatio! * 1.35 + (Math.random() - 0.5) * 0.5).toFixed(2)),
      calmarRatio: parseFloat((Math.abs(baseReturn / params.maxDrawdown!) + (Math.random() - 0.5) * 0.3).toFixed(2)),

      trackingError: parseFloat((params.trackingError! + (Math.random() - 0.5) * 2).toFixed(2)),
      informationRatio: parseFloat((baseExcess / params.trackingError!).toFixed(2)),
      excessReturn: parseFloat(baseExcess.toFixed(2)),
      alpha: parseFloat((baseExcess * 0.9 + (Math.random() - 0.5) * 1.5).toFixed(2)),
      beta: parseFloat((0.85 + Math.random() * 0.3).toFixed(2)),

      winRate: parseFloat((52 + Math.random() * 20).toFixed(1)),
      profitLossRatio: parseFloat((1.0 + Math.random() * 1.2).toFixed(2)),
      recoveryDays: Math.floor(30 + Math.random() * 90),

      estimatedAUM: parseFloat(
        etf.companyType === 'top_tier_head' ? (15 + Math.random() * 35).toFixed(1) :
        etf.companyType === 'foreign_joint_venture' ? (8 + Math.random() * 15).toFixed(1) :
        (5 + Math.random() * 18).toFixed(1)
      ),
    }
  })
}

const performanceData = generatePerformanceData()

// ============================================
// 策略名称映射
// ============================================

const strategyNames: Record<string, string> = {
  value: '价值策略',
  growth: '成长策略',
  balanced: '均衡策略',
  dividend: '红利策略',
  quality: '品质策略',
  momentum: '动量策略',
  sector_rotation: '行业轮动',
  multi_factor: '多因子',
}

const companyTypeNames: Record<string, string> = {
  top_tier_head: '头部公募',
  top_tier_medium: '中型公募',
  foreign_joint_venture: '外资合资',
  bank_affiliated: '银行系',
  insurance_affiliated: '保险系',
  etf_specialist: 'ETF特色',
}

const companyTypeColors: Record<string, string> = {
  top_tier_head: 'blue',
  top_tier_medium: 'cyan',
  foreign_joint_venture: 'purple',
  bank_affiliated: 'green',
  insurance_affiliated: 'orange',
  etf_specialist: 'magenta',
}

// ============================================
// 主组件
// ============================================

const ProductCompare: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('excessReturn')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend')
  const [filterExchange, setFilterExchange] = useState<string>('all')
  const [filterStrategy, setFilterStrategy] = useState<string>('all')
  const [showRiskAdjusted, setShowRiskAdjusted] = useState(false)

  // 过滤和排序
  const filteredData = useMemo(() => {
    let data = [...performanceData]

    if (filterExchange !== 'all') {
      data = data.filter(d => d.exchange === filterExchange)
    }
    if (filterStrategy !== 'all') {
      data = data.filter(d => d.strategy === filterStrategy)
    }

    data.sort((a, b) => {
      const aVal = (a as any)[sortBy]
      const bVal = (b as any)[sortBy]
      return sortOrder === 'descend' ? bVal - aVal : aVal - bVal
    })

    return data
  }, [sortBy, sortOrder, filterExchange, filterStrategy])

  // 排名计算
  const getRank = (value: number, field: string): number => {
    const sorted = [...performanceData].sort((a, b) => (b as any)[field] - (a as any)[field])
    return sorted.findIndex(item => (item as any)[field] === value) + 1
  }

  // 表格列定义
  const columns = [
    {
      title: '#',
      key: 'rank',
      width: 50,
      render: (_: any, record: ProductPerformance, index: number) => (
        <span style={{
          fontWeight: 700,
          color: index < 3 ? '#faad14' : 'rgba(255,255,255,0.45)',
          fontSize: index < 3 ? 16 : 13,
        }}>
          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
        </span>
      ),
    },
    {
      title: '产品信息',
      key: 'product',
      width: 260,
      render: (_: any, record: ProductPerformance) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{record.name}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <Tag color={record.exchange === '上交所' ? 'red' : 'green'} style={{ fontSize: 11, margin: 0 }}>
              {record.code}
            </Tag>
            <Tag color={companyTypeColors[record.companyType]} style={{ fontSize: 11, margin: 0 }}>
              {record.company}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
      width: 100,
      render: (strategy: string) => (
        <Tag style={{ fontSize: 11, margin: 0 }}>{strategyNames[strategy]}</Tag>
      ),
    },
    ...(showRiskAdjusted ? [
      {
        title: (
          <Tooltip title="年化收益 / 年化波动率，数值越高单位风险收益越高">
            夏普比率 <QuestionCircleOutlined />
          </Tooltip>
        ),
        dataIndex: 'sharpeRatio',
        key: 'sharpeRatio',
        width: 100,
        sorter: true,
        defaultSortOrder: 'descend' as const,
        render: (val: number) => (
          <span style={{ color: val >= 1.2 ? '#52c41a' : val >= 0.8 ? '#faad14' : '#f5222d', fontWeight: 600 }}>
            {val.toFixed(2)}
          </span>
        ),
      },
      {
        title: (
          <Tooltip title="超额收益 / 跟踪误差，衡量主动管理效率">
            信息比率 <QuestionCircleOutlined />
          </Tooltip>
        ),
        dataIndex: 'informationRatio',
        key: 'informationRatio',
        width: 100,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: val >= 0.8 ? '#52c41a' : val >= 0.5 ? '#faad14' : '#999', fontWeight: 600 }}>
            {val.toFixed(2)}
          </span>
        ),
      },
      {
        title: (
          <Tooltip title="年化收益 / 最大回撤绝对值">
            卡玛比率 <QuestionCircleOutlined />
          </Tooltip>
        ),
        dataIndex: 'calmarRatio',
        key: 'calmarRatio',
        width: 100,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: val >= 1.0 ? '#52c41a' : val >= 0.5 ? '#faad14' : '#999', fontWeight: 600 }}>
            {val.toFixed(2)}
          </span>
        ),
      },
    ] : [
      {
        title: (
          <Tooltip title="自成立以来的累计收益率">
            累计收益% <QuestionCircleOutlined />
          </Tooltip>
        ),
        dataIndex: 'cumulativeReturn',
        key: 'cumulativeReturn',
        width: 110,
        sorter: true,
        defaultSortOrder: 'descend' as const,
        render: (val: number) => (
          <span style={{ color: val >= 0 ? '#f5222d' : '#52c41a', fontWeight: 700, fontSize: 14 }}>
            {val >= 0 ? '+' : ''}{val.toFixed(2)}%
          </span>
        ),
      },
      {
        title: '年化收益%',
        dataIndex: 'annualizedReturn',
        key: 'annualizedReturn',
        width: 105,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: val >= 0 ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
            {val >= 0 ? '+' : ''}{val.toFixed(2)}%
          </span>
        ),
      },
      {
        title: '超额收益%',
        dataIndex: 'excessReturn',
        key: 'excessReturn',
        width: 110,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: val >= 0 ? '#f5222d' : '#52c41a', fontWeight: 600 }}>
            {val >= 0 ? '+' : ''}{val.toFixed(2)}%
          </span>
        ),
      },
      {
        title: '波动率%',
        dataIndex: 'volatility',
        key: 'volatility',
        width: 90,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: val > 30 ? '#f5222d' : val > 20 ? '#faad14' : '#52c41a' }}>
            {val.toFixed(1)}%
          </span>
        ),
      },
      {
        title: '最大回撤%',
        dataIndex: 'maxDrawdown',
        key: 'maxDrawdown',
        width: 105,
        sorter: true,
        render: (val: number) => (
          <span style={{ color: '#f5222d' }}>
            {val.toFixed(2)}%
          </span>
        ),
      },
      {
        title: '预估规模(亿)',
        dataIndex: 'estimatedAUM',
        key: 'estimatedAUM',
        width: 115,
        sorter: true,
        render: (val: number) => (
          <span>{val.toFixed(1)}</span>
        ),
      },
    ]),
  ]

  // ============================================
  // 散点图配置（风险-收益）
  // ============================================

  const scatterOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '风险-收益分布图',
      subtext: '横轴：波动率 | 纵轴：超额收益 | 气泡大小：预估规模',
      left: 'center',
      textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 600 },
      subtextStyle: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        const d = params.data
        return `
          <div style="padding: 8px; min-width: 200px;">
            <strong>${d.name}</strong><br/>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 6px 0;"/>
            基金公司：<span style="color: #1677ff">${d.company}</span><br/>
            投资策略：${strategyNames[d.strategy]}<br/>
            <span style="color: #f5222d">●</span> 波动率：${d.volatility}%<br/>
            <span style="color: #52c41a">●</span> 超额收益：${d.excessReturn}%<br/>
            夏普比率：${d.sharpeRatio}<br/>
            最大回撤：${d.maxDrawdown}%<br/>
            预估规模：${d.estimatedAUM}亿
          </div>
        `
      },
    },
    legend: {
      data: Object.values(strategyNames),
      bottom: 10,
      textStyle: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: { left: 70, right: 40, top: 80, bottom: 100 },
    xAxis: {
      type: 'value' as const,
      name: '波动率 (%)',
      nameTextStyle: { color: 'rgba(255,255,255,0.55)' },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      min: 10,
      max: 40,
    },
    yAxis: {
      type: 'value' as const,
      name: '超额收益 (%)',
      nameTextStyle: { color: 'rgba(255,255,255,0.55)' },
      axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    visualMap: {
      show: false,
      dimension: 1,
      min: 0,
      max: 10,
      inRange: {
        symbolSize: [15, 50],
        colorLightness: [0.5, 0.2],
      },
    },
    series: Object.keys(strategyNames).map((strategy) => ({
      name: strategyNames[strategy],
      type: 'scatter' as const,
      data: performanceData
        .filter(d => d.strategy === strategy)
        .map(d => ({
          name: d.name,
          value: [d.volatility, d.excessReturn, d.estimatedAUM],
          company: d.company,
          strategy: d.strategy,
          sharpeRatio: d.sharpeRatio,
          maxDrawdown: d.maxDrawdown,
        })),
      symbolSize: (data: number[]) => Math.max(15, Math.min(50, data[2] * 1.5)),
      label: {
        show: true,
        position: 'top' as const,
        formatter: '{b}',
        fontSize: 9,
        color: 'rgba(255,255,255,0.7)',
      },
      emphasis: {
        focus: 'series' as const,
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
      },
    })),
    markLine: {
      silent: true,
      symbol: 'none',
      data: [
        { yAxis: 0, label: { formatter: '超额收益=0', color: 'rgba(255,255,255,0.35)' }, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'dashed' } },
        { xAxis: 25, label: { formatter: '高波动分界线', color: 'rgba(255,255,255,0.35)' }, lineStyle: { color: 'rgba(245,34,29,0.25)', type: 'dotted' } },
      ],
    },
  }), [])

  // ============================================
  // 超额收益柱状图
  // ============================================

  const barOption = useMemo(() => {
    const sortedData = [...performanceData].sort((a, b) => b.excessReturn - a.excessReturn)
    return {
      backgroundColor: 'transparent',
      title: {
        text: '超额收益排行榜',
        left: 'center',
        textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 600 },
      },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const },
        formatter: (params: any[]) => {
          const d = params[0]
          const product = performanceData.find(p => p.name === d.name)
          return `
            <strong>${d.name}</strong> (${product?.company})<br/>
            超额收益：<strong style="color:${d.value >= 0 ? '#f5222d' : '#52c41a'}">${d.value}%</strong><br/>
            夏普比率：${product?.sharpeRatio}<br/>
            跟踪误差：${product?.trackingError}%
          `
        },
      },
      grid: { left: 180, right: 60, top: 50, bottom: 80 },
      xAxis: {
        type: 'value' as const,
        name: '超额收益 (%)',
        axisLabel: { color: 'rgba(255,255,255,0.45)', formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      yAxis: {
        type: 'category' as const,
        data: sortedData.map(d => d.name),
        inverse: true,
        axisLabel: {
          color: 'rgba(255,255,255,0.65)',
          fontSize: 11,
          formatter: (value: string) => value.length > 12 ? value.slice(0, 12) + '...' : value,
        },
        axisTick: { show: false },
      },
      series: [{
        type: 'bar' as const,
        data: sortedData.map(d => ({
          value: d.excessReturn,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: d.excessReturn >= 0 ? '#cf1322' : '#389e0d' },
              { offset: 1, color: d.excessReturn >= 0 ? '#ff4d4f' : '#73d13d' },
            ]),
            borderRadius: [0, 3, 3, 0],
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right' as const,
          formatter: '{c}%',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 11,
        },
        backgroundStyle: { color: 'rgba(255,255,255,0.03)', borderRadius: 3 },
      }],
      dataZoom: [
        { type: 'inside' as const, orient: 'vertical' },
        { type: 'slider' as const, orient: 'vertical', right: 10, height: '70%' },
      ],
    }
  }, [])

  // ============================================
  // 统计摘要
  // ============================================

  const summaryStats = useMemo(() => {
    const returns = performanceData.map(d => d.cumulativeReturn)
    const excessReturns = performanceData.map(d => d.excessReturn)
    const sharpes = performanceData.map(d => d.sharpeRatio)

    return {
      avgReturn: (returns.reduce((a, b) => a + b, 0) / returns.length).toFixed(2),
      bestReturn: Math.max(...returns).toFixed(2),
      worstReturn: Math.min(...returns).toFixed(2),
      avgExcess: (excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length).toFixed(2),
      positiveExcessCount: excessReturns.filter(e => e > 0).length,
      avgSharpe: (sharpes.reduce((a, b) => a + b, 0) / sharpes.length).toFixed(2),
      bestSharpe: Math.max(...sharpes).toFixed(2),
      totalAUM: performanceData.reduce((sum, d) => sum + d.estimatedAUM, 0).toFixed(1),
    }
  }, [])

  return (
    <div className="animate-fadeInUp">
      {/* 头部 */}
      <Card className="dashboard-card" styles={{ body: { padding: '16px 20px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            18只主动ETF产品对比分析
          </Title>

          <Space size="middle">
            <Space size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>交易所：</Text>
              <Select
                value={filterExchange}
                onChange={setFilterExchange}
                size="small"
                style={{ width: 90 }}
                options={[
                  { value: 'all', label: '全部' },
                  { value: '上交所', label: `上交所 (${performanceData.filter(d => d.exchange === '上交所').length})` },
                  { value: '深交所', label: `深交所 (${performanceData.filter(d => d.exchange === '深交所').length})` },
                ]}
              />

              <Text type="secondary" style={{ fontSize: 12 }}>策略：</Text>
              <Select
                value={filterStrategy}
                onChange={setFilterStrategy}
                size="small"
                style={{ width: 110 }}
                options={[
                  { value: 'all', label: '全部策略' },
                  ...Object.entries(strategyNames).map(([k, v]) => ({ value: k, label: v })),
                ]}
              />
            </Space>

            <Switch
              checkedChildren="风险调整"
              unCheckedChildren="原始收益"
              checked={showRiskAdjusted}
              onChange={setShowRiskAdjusted}
              size="small"
            />

            <Button icon={<DownloadOutlined />} size="small">导出报告</Button>
          </Space>
        </div>
      </Card>

      {/* 统计摘要卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>平均累计收益</span>}
              value={summaryStats.avgReturn}
              suffix="%"
              valueStyle={{ color: parseFloat(summaryStats.avgReturn) >= 0 ? '#f5222d' : '#52c41a', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>平均超额收益</span>}
              value={summaryStats.avgExcess}
              suffix="%"
              valueStyle={{ color: '#1677ff', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>正超额产品数</span>}
              value={`${summaryStats.positiveExcessCount}/18`}
              suffix="只"
              valueStyle={{ color: '#52c41a', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>平均夏普比率</span>}
              value={summaryStats.avgSharpe}
              valueStyle={{ color: parseFloat(summaryStats.avgSharpe) >= 1 ? '#52c41a' : '#faad14', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>最优夏普</span>}
              value={summaryStats.bestSharpe}
              valueStyle={{ color: '#52c41a', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>总预估规模</span>}
              value={summaryStats.totalAUM}
              suffix="亿"
              valueStyle={{ color: '#1677ff', fontSize: 22 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={scatterOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 480, width: '100%' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={barOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 480, width: '100%' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细表格 */}
      <Card className="dashboard-card" style={{ marginTop: 16 }} styles={{ body: { padding: 16 } }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="code"
          size="small"
          pagination={{ pageSize: 10, size: 'small', showTotal: (total) => `共 ${total} 只产品` }}
          scroll={{ x: 1200 }}
          rowClassName={(record) =>
            record.excessReturn >= 5 ? 'row-highlight-positive' :
            record.excessReturn <= 0 ? 'row-highlight-negative' : ''
          }
        />
      </Card>
    </div>
  )
}

// 辅助图标组件
const QuestionCircleOutlined: React.FC<any> = () => null as any

export default ProductCompare
