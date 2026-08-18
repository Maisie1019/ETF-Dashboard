import React, { useState } from 'react'
import { Card, Typography, Space, Select, Row, Col, Statistic, Table, Tag, Progress } from 'antd'
import {
  SafetyOutlined,
  AlertOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { RiskMetrics, BrinsonAttribution } from '../../types'

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, VisualMapComponent, CanvasRenderer])

const { Title, Text } = Typography

// ============================================
// 模拟风险数据（上市后替换为真实数据）
// ============================================

function generateMockRiskMetrics(): RiskMetrics {
  // 生成滚动波动率数据
  const days = Array.from({ length: 90 }, (_, i) => `2024-08-${String(i + 1).padStart(2, '0')}`)
  const rolling30d = days.map(() => 12 + Math.random() * 6)
  const rolling60d = days.map(() => 14 + Math.random() * 5)
  const rolling90d = days.map(() => 15 + Math.random() * 4)

  // 生成回撤曲线
  let nav = 1.0
  let peak = 1.0
  const drawdownCurve = days.map((_, i) => {
    const dailyReturn = (Math.random() - 0.47) * 0.025
    nav *= 1 + dailyReturn
    if (nav > peak) peak = nav
    return parseFloat(((peak - nav) / peak * -100).toFixed(2))
  })

  return {
    volatility: {
      daily: 1.85,
      annualized: 28.5,
      rolling30d: rolling30d[rolling30d.length - 1],
      rolling60d: rolling60d[rolling60d.length - 1],
      rolling90d: rolling90d[rolling90d.length - 1],
    },
    drawdown: {
      current: drawdownCurve[drawdownCurve.length - 1],
      max: -8.56,
      maxDate: '2024-07-18',
      recoveryDate: '2024-08-05',
      avgRecoveryDays: 12,
    },
    downsideRisk: {
      semiVariance: 0.00028,
      downsideDeviation: 1.68,
      var95: -2.35,
      cvar95: -3.12,
      var99: -3.85,
    },
    correlation: {
      withBenchmark: 0.82,
      withMarket: 0.88,
      beta: 1.05,
      trackingError: 4.23,
      informationRatio: 0.89,
      rSquared: 0.67,
    },
  }
}

// Brinson归因模拟数据
const mockBrinsonAttribution: BrinsonAttribution = {
  period: '2024年Q3',
  totalExcessReturn: 2.85,
  allocationEffect: 0.65,
  selectionEffect: 1.92,
  interactionEffect: 0.28,
  sectorBreakdown: [
    { sector: '食品饮料', portfolioWeight: 15.45, benchmarkWeight: 12.8, portfolioReturn: 8.5, benchmarkReturn: 7.2, allocationEffect: 0.18, selectionEffect: 0.32 },
    { sector: '电力设备', portfolioWeight: 12.35, benchmarkWeight: 14.2, portfolioReturn: -2.1, benchmarkReturn: -1.8, allocationEffect: -0.15, selectionEffect: -0.04 },
    { sector: '非银金融', portfolioWeight: 10.28, benchmarkWeight: 8.5, portfolioReturn: 5.2, benchmarkReturn: 4.5, allocationEffect: 0.08, selectionEffect: 0.07 },
    { sector: '电子', portfolioWeight: 9.56, benchmarkWeight: 11.0, portfolioReturn: -3.5, benchmarkReturn: -4.2, allocationEffect: 0.12, selectionEffect: 0.08 },
    { sector: '银行', portfolioWeight: 8.42, benchmarkWeight: 10.5, portfolioReturn: 3.8, benchmarkReturn: 4.1, allocationEffect: -0.18, selectionEffect: -0.03 },
    { sector: '汽车', portfolioWeight: 7.85, benchmarkWeight: 6.2, portfolioReturn: 12.5, benchmarkReturn: 10.8, allocationEffect: 0.18, selectionEffect: 0.13 },
    { sector: '医药生物', portfolioWeight: 7.23, benchmarkWeight: 9.8, portfolioReturn: -5.2, benchmarkReturn: -6.5, allocationEffect: 0.22, selectionEffect: 0.13 },
    { sector: '计算机', portfolioWeight: 6.54, benchmarkWeight: 7.5, portfolioReturn: 2.1, benchmarkReturn: 1.8, allocationEffect: 0.02, selectionEffect: 0.02 },
    { sector: '家用电器', portfolioWeight: 5.32, benchmarkWeight: 4.8, portfolioReturn: 6.8, benchmarkReturn: 6.2, allocationEffect: 0.03, selectionEffect: 0.04 },
    { sector: '其他', portfolioWeight: 17.0, benchmarkWeight: 14.7, portfolioReturn: 1.5, benchmarkReturn: 1.2, allocationEffect: 0.07, selectionEffect: 0.02 },
  ],
}

const mockRiskData = generateMockRiskMetrics()

// ============================================
// 风险分析组件
// ============================================

const RiskAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drawdown' | 'attribution'>('overview')

  // 风险概览卡片
  const RiskOverviewCards = () => (
    <Row gutter={[12, 12]}>
      <Col span={8}>
        <Card size="small" className="kpi-card">
          <Statistic
            title="年化波动率"
            value={mockRiskData.volatility.annualized}
            suffix="%"
            prefix={<AlertOutlined />}
            valueStyle={{ color: mockRiskData.volatility.annualized > 25 ? '#faad14' : undefined }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              30日: {mockRiskData.volatility.rolling30d.toFixed(1)}% | 60日: {mockRiskData.volatility.rolling60d.toFixed(1)}%
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card size="small" className="kpi-card">
          <Statistic
            title="最大回撤"
            value={mockRiskData.drawdown.max}
            suffix="%"
            precision={2}
            valueStyle={{ color: '#f5222d' }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              发生日期: {mockRiskData.drawdown.maxDate} | 恢复天数: {mockRiskData.drawdown.avgRecoveryDays}天
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card size="small" className="kpi-card">
          <Statistic
            title="VaR (95%)"
            value={mockRiskData.downsideRisk.var95}
            suffix="%"
            precision={2}
            valueStyle={{ color: '#f5222d' }}
          />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              CVaR: {mockRiskData.downsideRisk.cvar95.toFixed(2)}% | VaR(99%): {mockRiskData.downsideRisk.var99.toFixed(2)}%
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  )

  // 回撤分析图表
  const DrawdownChart = () => {
    // 生成回撤曲线数据
    const dates = Array.from({ length: 180 }, (_, i) =>
      `2024-03-${String(Math.floor(i / 30) + 1).padStart(2, '0')}`
    )
    let nav = 1.0
    let peak = 1.0
    const navData = []
    const ddData = []

    for (let i = 0; i < 180; i++) {
      const ret = (Math.random() - 0.47) * 0.025
      nav *= 1 + ret
      if (nav > peak) peak = nav
      navData.push(parseFloat(nav.toFixed(4)))
      ddData.push(parseFloat(((nav - peak) / peak * 100).toFixed(2)))
    }

    const option = {
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: 'rgba(32,32,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        textStyle: { color: '#fff' },
        formatter: (params: any[]) => `
          <div>${params[0].axisValue}</div>
          净值: ${params[0]?.data}<br/>
          回撤: <span style="color:${params[1]?.data < 0 ? '#f5222d' : '#52c41a'}">${params[1]?.data}%</span>
        `,
      },
      legend: {
        data: ['净值', '回撤'],
        top: 10,
        textStyle: { color: 'rgba(255,255,255,0.75)' },
      },
      grid: [
        { left: 50, right: 50, top: 50, height: '45%' },
        { left: 50, right: 50, top: '62%', height: '28%' },
      ],
      xAxis: [
        { type: 'category', data: dates, gridIndex: 0, axisLabel: { show: false }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } } },
        { type: 'category', data: dates, gridIndex: 1, axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10 } },
      ],
      yAxis: [
        { type: 'value', scale: true, gridIndex: 0, position: 'right', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
        { type: 'value', gridIndex: 1, splitLine: { show: false }, axisLabel: { formatter: '{value}%' } },
      ],
      dataZoom: [{ type: 'inside', xAxisIndex: [0, 1] }],
      series: [
        {
          name: '净值',
          type: 'line',
          data: navData,
          smooth: true,
          xAxisIndex: 0,
          yAxisIndex: 0,
          lineStyle: { width: 2, color: '#1677ff' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(22,119,255,0.25)' }, { offset: 1, color: 'rgba(22,119,255,0.02)' }]) },
        },
        {
          name: '回撤',
          type: 'line',
          data: ddData,
          xAxisIndex: 1,
          yAxisIndex: 1,
          lineStyle: { width: 1.5, color: '#f5222d' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245,34,45,0.3)' },
              { offset: 1, color: 'rgba(245,34,45,0.02)' },
            ]),
          },
        },
      ],
    }

    return (
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: 350 }}
      />
    )
  }

  // Brinson归因图表
  const BrinsonChart = () => {
    const option = {
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const },
        backgroundColor: 'rgba(32,32,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        textStyle: { color: '#fff' },
      },
      legend: {
        data: ['配置贡献', '选股贡献'],
        top: 10,
        textStyle: { color: 'rgba(255,255,255,0.75)' },
      },
      grid: { left: 80, right: 30, top: 50, bottom: 80 },
      xAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}%', color: 'rgba(255,255,255,0.65)' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      yAxis: {
        type: 'category',
        data: mockBrinsonAttribution.sectorBreakdown.map((s) => s.sector),
        axisLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
        inverse: true,
      },
      series: [
        {
          name: '配置贡献',
          type: 'bar',
          stack: 'total',
          data: mockBrinsonAttribution.sectorBreakdown.map((s) => s.allocationEffect),
          itemStyle: { color: '#1677ff' },
          barWidth: 16,
          label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 10, color: '#fff' },
        },
        {
          name: '选股贡献',
          type: 'bar',
          stack: 'total',
          data: mockBrinsonAttribution.sectorBreakdown.map((s) => s.selectionEffect),
          itemStyle: { color: (params: any) => params.value >= 0 ? '#52c41a' : '#f5222d' },
          label: { show: true, position: 'insideRight', formatter: '{c}%', fontSize: 10 },
        },
      ],
    }

    return (
      <>
        {/* 归因汇总 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Statistic title="总超额收益" value={mockBrinsonAttribution.totalExcessReturn} suffix="%" valueStyle={{ fontSize: 20, color: '#f5222d' }} />
          </Col>
          <Col span={6}>
            <Statistic title="配置效应" value={mockBrinsonAttribution.allocationEffect} suffix="%" valueStyle={{ fontSize: 20 }} />
          </Col>
          <Col span={6}>
            <Statistic title="选股效应" value={mockBrinsonAttribution.selectionEffect} suffix="%" valueStyle={{ fontSize: 20, color: '#52c41a' }} />
          </Col>
          <Col span={6}>
            <Statistic title="交互效应" value={mockBrinsonAttribution.interactionEffect} suffix="%" valueStyle={{ fontSize: 20 }} />
          </Col>
        </Row>

        {/* 归因柱状图 */}
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 320 }}
        />

        {/* 解读 */}
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(22,119,255,0.06)', borderRadius: 6, borderLeft: '3px solid #1677ff' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            📊 <Text strong>Alpha来源解析：</Text>
            选股效应({mockBrinsonAttribution.selectionEffect.toFixed(2)}%)贡献了{(
              mockBrinsonAttribution.selectionEffect / mockBrinsonAttribution.totalExcessReturn * 100
            ).toFixed(0)}%的超额收益，表明基金经理在个股选择上具有显著的正向能力。
            配置效应为{mockBrinsonAttribution.allocationEffect.toFixed(2)}%，行业配置能力稳健。
          </Text>
        </div>
      </>
    )
  }

  return (
    <Card
      className="dashboard-card"
      styles={{ body: { padding: 20 } }}
      title={
        <Space>
          <SafetyOutlined />
          <Title level={5} style={{ margin: 0 }}>风险分析与归因</Title>
        </Space>
      }
      extra={
        <Select
          value={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ width: 120 }}
          options={[
            { value: 'overview', label: '风险概览' },
            { value: 'drawdown', label: '回撤分析' },
            { value: 'attribution', label: '绩效归因' },
          ]}
        />
      }
    >
      {activeTab === 'overview' && (
        <>
          <RiskOverviewCards />

          {/* 相关性指标 */}
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Table
                size="small"
                pagination={false}
                dataSource={[
                  { key: 'Beta', label: 'Beta系数', value: mockRiskData.correlation.beta, status: mockRiskData.correlation.beta > 1 ? 'warning' : 'normal' },
                  { key: 'TrackingError', label: '跟踪误差', value: `${mockRiskData.correlation.trackingError}%`, status: 'normal' },
                  { key: 'InfoRatio', label: '信息比率', value: mockRiskData.correlation.informationRatio, status: mockRiskData.correlation.informationRatio > 0.5 ? 'good' : 'warning' },
                  { key: 'RSquared', label: 'R²', value: mockRiskData.correlation.rSquared, status: 'normal' },
                  { key: 'CorrBenchmark', label: '与基准相关性', value: mockRiskData.correlation.withBenchmark, status: 'normal' },
                ]}
                columns={[
                  { title: '指标', dataIndex: 'label', key: 'label', render: (t: string) => <Text strong>{t}</Text> },
                  { title: '数值', dataIndex: 'value', key: 'value', align: 'right' as const },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    align: 'center' as const,
                    render: (status: string) =>
                      status === 'good' ? <Tag color="success">优秀</Tag> :
                      status === 'warning' ? <Tag color="warning">关注</Tag> :
                      <Tag color="default">正常</Tag>,
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 8, height: '100%' }}>
                <Title level={5}>风险评级</Title>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>整体风险等级</Text>
                      <Tag color="orange">中高风险</Tag>
                    </div>
                    <Progress percent={72} strokeColor="#faad14" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>波动率风险</Text>
                      <Text type="secondary">{mockRiskData.volatility.annualized.toFixed(1)}%</Text>
                    </div>
                    <Progress percent={(mockRiskData.volatility.annualized / 40) * 100} strokeColor="#1677ff" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>下行风险</Text>
                      <Text type="secondary">VaR: {mockRiskData.downsideRisk.var95.toFixed(2)}%</Text>
                    </div>
                    <Progress percent={Math.abs(mockRiskData.downsideRisk.var95 / 5) * 100} strokeColor="#f5222d" showInfo={false} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>跟踪误差</Text>
                      <Text type="secondary">{mockRiskData.correlation.trackingError}%</Text>
                    </div>
                    <Progress percent={(mockRiskData.correlation.trackingError / 10) * 100} strokeColor="#52c41a" showInfo={false} />
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </>
      )}

      {activeTab === 'drawdown' && <DrawdownChart />}

      {activeTab === 'attribution' && <BrinsonChart />}
    </Card>
  )
}

export default RiskAnalysis

// 补充导入Button（HoldingsAnalysis中使用了但未导入）
import { Button } from 'antd'
