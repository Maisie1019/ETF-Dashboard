import React, { useState } from 'react'
import { Card, Typography, Space, Select, Button, DatePicker, Row, Col, Statistic } from 'antd'
import {
  LineChartOutlined,
  DownloadOutlined,
  ExpandOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import type { NAVData } from '../../types'

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
  CanvasRenderer,
])

const { Title } = Typography
const { RangePicker } = DatePicker

// ============================================
// 模拟净值数据（上市后替换为真实数据）
// ============================================

function generateMockNAVData(): NAVData[] {
  const data: NAVData[] = []
  const startDate = dayjs('2024-06-01')
  let nav = 1.0
  let benchmarkNav = 1.0

  for (let i = 0; i < 300; i++) {
    const date = startDate.add(i, 'day').format('YYYY-MM-DD')
    // 跳过周末
    if (dayjs(date).day() === 0 || dayjs(date).day() === 6) continue

    // 模拟收益率（带主动管理alpha）
    const dailyBenchmarkReturn = (Math.random() - 0.48) * 0.03 // 基准日收益
    const dailyAlpha = (Math.random() - 0.45) * 0.015 // 超额收益
    const dailyReturn = dailyBenchmarkReturn + dailyAlpha

    nav *= 1 + dailyReturn
    benchmarkNav *= 1 + dailyBenchmarkReturn

    data.push({
      date,
      nav: parseFloat(nav.toFixed(4)),
      accNav: parseFloat(nav.toFixed(4)),
      dailyReturn: parseFloat((dailyReturn * 100).toFixed(2)),
      benchmarkReturn: parseFloat((dailyBenchmarkReturn * 100).toFixed(2)),
      excessReturn: parseFloat((dailyAlpha * 100).toFixed(2)),
    })
  }

  return data
}

const mockNAVData = generateMockNAVData()

// ============================================
// 净值走势图组件
// ============================================

const NAVChart: React.FC = () => {
  const [chartType, setChartType] = useState<'area' | 'line' | 'candlestick'>('area')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(6, 'month'),
    dayjs(),
  ])

  // 筛选日期范围数据
  const filteredData = mockNAVData.filter((d) => {
    const date = dayjs(d.date)
    return date.isAfter(dateRange[0]) && date.isBefore(dateRange[1])
  })

  // 计算区间统计
  const calculateStats = () => {
    if (filteredData.length < 2) return null

    const first = filteredData[0]
    const last = filteredData[filteredData.length - 1]

    const etfReturn = ((last.nav / first.nav - 1) * 100).toFixed(2)
    const benchmarkReturn = first.benchmarkReturn && last.benchmarkReturn
      ? (((1 + last.benchmarkReturn / 100) / (1 + first.benchmarkReturn / 100) - 1) * 100).toFixed(2)
      : '0.00'
    const excessReturn = (parseFloat(etfReturn) - parseFloat(benchmarkReturn)).toFixed(2)

    const returns = filteredData.map((d) => d.dailyReturn)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length)

    // 最大回撤
    let maxDrawdown = 0
    let peak = filteredData[0].nav
    for (const d of filteredData) {
      if (d.nav > peak) peak = d.nav
      const drawdown = (peak - d.nav) / peak
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    return {
      etfReturn,
      benchmarkReturn,
      excessReturn,
      volatility: (volatility * Math.sqrt(252)).toFixed(2), // 年化波动率
      maxDrawdown: (maxDrawdown * 100).toFixed(2),
      sharpe: (avgReturn / volatility * Math.sqrt(252)).toFixed(2),
    }
  }

  const stats = calculateStats()

  // ECharts配置
  const chartOption = {
    backgroundColor: 'transparent',
    animation: true,
    legend: {
      data: ['ETF净值', '基准指数', '超额收益'],
      top: 10,
      textStyle: { color: 'rgba(255,255,255,0.75)' },
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(32, 32, 32, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#fff', fontSize: 13 },
      formatter: (params: any[]) => {
        const data = params[0]
        const navPoint = mockNAVData.find((d) => d.date === data.axisValue)
        if (!navPoint) return ''
        return `
          <div style="padding: 8px;">
            <strong>${data.axisValue}</strong><br/>
            ETF净值: <span style="color:#1677ff">${navPoint.nav}</span><br/>
            日收益: <span style="color:${navPoint.dailyReturn >= 0 ? '#f5222d' : '#52c41a'}">${navPoint.dailyReturn}%</span><br/>
            基准收益: ${navPoint.benchmarkReturn?.toFixed(2)}%<br/>
            超额收益: <span style="color:${navPoint.excessReturn && navPoint.excessReturn >= 0 ? '#f5222d' : '#52c41a'}">${navPoint.excessReturn?.toFixed(2)}%</span>
          </div>
        `
      },
    },
    grid: [
      { left: 60, right: 60, top: 50, height: '55%' }, // 主图（净值）
      { left: 60, right: 60, top: '70%', height: '20%' }, // 副图（超额收益）
    ],
    xAxis: [
      {
        type: 'category' as const,
        data: filteredData.map((d) => d.date),
        gridIndex: 0,
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      },
      {
        type: 'category' as const,
        data: filteredData.map((d) => d.date),
        gridIndex: 1,
        axisLabel: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value' as const,
        scale: true,
        gridIndex: 0,
        position: 'right',
        axisLabel: {
          color: 'rgba(255,255,255,0.45)',
          formatter: '{value}',
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      {
        type: 'value' as const,
        gridIndex: 1,
        axisLabel: {
          color: 'rgba(255,255,255,0.45)',
          formatter: '{value}%',
        },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: 'inside' as const,
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
      },
      {
        type: 'slider' as const,
        xAxisIndex: [0, 1],
        bottom: 20,
        height: 20,
        borderColor: 'rgba(255,255,255,0.12)',
        textStyle: { color: 'rgba(255,255,255,0.45)' },
      },
    ],
    series: [
      {
        name: 'ETF净值',
        type: chartType === 'area' ? 'line' : 'line',
        data: filteredData.map((d) => d.nav),
        smooth: true,
        symbol: 'none',
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 2.5, color: '#1677ff' },
        itemStyle: { color: '#1677ff' },
        areaStyle: chartType === 'area' ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22,119,255,0.35)' },
            { offset: 1, color: 'rgba(22,119,255,0.02)' },
          ]),
        } : undefined,
        markLine: {
          silent: true,
          symbol: 'none',
          data: [{ yAxis: 1.0, label: { formatter: '面值', color: 'rgba(255,255,255,0.45)' } }],
          lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'dashed' },
        },
      },
      {
        name: '基准指数',
        type: 'line',
        data: filteredData.map((d) => {
          // 模拟基准净值（基于累计收益反推）
          const base = filteredData[0]?.nav || 1
          return base * (1 + (d.benchmarkReturn || 0) / 100)
        }),
        smooth: true,
        symbol: 'none',
        xAxisIndex: 0,
        yAxisIndex: 0,
        lineStyle: { width: 1.5, color: '#faad14', type: 'dashed' },
        itemStyle: { color: '#faad14' },
      },
      {
        name: '超额收益',
        type: 'bar',
        data: filteredData.map((d) => d.excessReturn || 0),
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: {
          color: (params: any) => (params.value >= 0 ? '#f5222d99' : '#52c41a99'),
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: { title: '保存图片', pixelRatio: 2 },
        dataZoom: { title: { zoom: '区域缩放', back: '还原' } },
      },
      right: 20,
      top: 10,
      iconStyle: { borderColor: 'rgba(255,255,255,0.5)' },
    },
  }

  return (
    <Card
      className="dashboard-card"
      style={{ marginTop: 24 }}
      styles={{ body: { padding: 20 } }}
    >
      {/* 头部：标题 + 工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          <LineChartOutlined style={{ marginRight: 8 }} />
          净值走势与超额收益分析
        </Title>

        <Space>
          {/* 图表类型切换 */}
          <Select
            value={chartType}
            onChange={setChartType}
            size="small"
            style={{ width: 100 }}
            options={[
              { value: 'area', label: '面积图' },
              { value: 'line', label: '折线图' },
            ]}
          />

          {/* 日期选择 */}
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange([dates[0]!, dates[1]!])}
            size="small"
            allowClear={false}
          />

          <Button icon={<DownloadOutlined />} size="small">
            导出
          </Button>
          <Button icon={<ExpandOutlined />} size="small">
            全屏
          </Button>
        </Space>
      </div>

      {/* 区间统计 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <Col>
            <Statistic title="区间收益" value={stats.etfReturn} suffix="%" valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col>
            <Statistic title="基准收益" value={stats.benchmarkReturn} suffix="%" valueStyle={{ fontSize: 18, color: 'rgba(255,255,255,0.65)' }} />
          </Col>
          <Col>
            <Statistic
              title="超额收益"
              value={stats.excessReturn}
              suffix="%"
              valueStyle={{
                fontSize: 18,
                color: parseFloat(stats.excessReturn) >= 0 ? '#f5222d' : '#52c41a',
              }}
            />
          </Col>
          <Col>
            <Statistic title="年化波动" value={stats.volatility} suffix="%" valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col>
            <Statistic title="最大回撤" value={stats.maxDrawdown} suffix="%" valueStyle={{ fontSize: 18, color: '#f5222d' }} />
          </Col>
          <Col>
            <Statistic title="夏普比率" value={stats.sharpe} valueStyle={{ fontSize: 18 }} />
          </Col>
        </Row>
      )}

      {/* 图表 */}
      <ReactEChartsCore
        echarts={echarts}
        option={chartOption}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: 500, width: '100%' }}
      />
    </Card>
  )
}

export default NAVChart
