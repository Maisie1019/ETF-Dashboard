import React, { useState } from 'react'
import { Card, Typography, Space, Row, Col, Statistic, Tag, Progress, Timeline, Alert } from 'antd'
import {
  ThunderboltOutlined,
  SwapOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { LiquidityMetrics } from '../../types'

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer])

const { Title, Text } = Typography

// ============================================
// 模拟流动性数据（上市后替换为真实数据）
// ============================================

function generateMockLiquidityData(): LiquidityMetrics {
  // 生成成交额时间序列
  const dates = Array.from({ length: 60 }, (_, i) => `2024-07-${String(i + 1).padStart(2, '0')}`)
  const volumes = dates.map(() => 2000 + Math.random() * 5000)
  const turnovers = dates.map(() => 2 + Math.random() * 8)
  const spreads = dates.map(() => 5 + Math.random() * 20)

  // IOPV偏离度
  const iopvDeviations = dates.map(() => (Math.random() - 0.5) * 0.5)

  return {
    trading: {
      avgDailyVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      avgDailyShares: 150 + Math.random() * 350,
      turnoverRate: turnovers[turnovers.length - 1],
      bidAskSpread: spreads[spreads.length - 1],
      impactCost: 8 + Math.random() * 15,
    },
    iopv: {
      premiumDiscount: iopvDeviations[iopvDeviations.length - 1],
      avgPremiumDiscount: iopvDeviations.reduce((a, b) => a + b, 0) / iopvDeviations.length,
      deviationCount: iopvDeviations.filter((d) => Math.abs(d) > 0.3).length,
      maxDeviation: Math.max(...iopvDeviations.map(Math.abs)),
    },
    scale: {
      totalNAV: 15.8 + Math.random() * 10,
      sharesOutstanding: 12 + Math.random() * 8,
      navChange5d: (Math.random() - 0.5) * 5,
      navChange20d: (Math.random() - 0.45) * 10,
      creationRedemption: Math.round((Math.random() - 0.5) * 5000),
    },
    holderStructure: {
      institutionalPct: 65 + Math.random() * 20,
      retailPct: 15 + Math.random() * 15,
      top10HolderPct: 35 + Math.random() * 25,
      concentrationRisk: 2,
    },
  }
}

const mockLiquidityData = generateMockLiquidityData()

// 流动性预警事件
const liquidityAlerts = [
  { time: '14:32', type: 'info' as const, message: 'IOPV折溢价+0.28%，处于正常区间', resolved: true },
  { time: '11:15', type: 'warning' as const, message: '买卖价差扩大至18bp，高于均值', resolved: true },
  { time: '10:05', type: 'info' as const, message: '开盘成交量活跃，预估全天成交8000万+', resolved: true },
  { time: '09:35', type: 'success' as const, message: '集合竞价完成，开盘价与IOPV偏差0.08%', resolved: true },
]

// ============================================
// 流动性监控组件
// ============================================

const LiquidityMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trading' | 'iopv' | 'alerts'>('overview')

  // 成交量/价差图表
  const TradingChart = () => {
    const dates = Array.from({ length: 60 }, (_, i) =>
      `${7 + Math.floor(i / 30)}月${(i % 30) + 1}日`
    )
    const volumes = dates.map(() => Math.round(2000 + Math.random() * 5000))
    const spreads = dates.map(() => parseFloat((5 + Math.random() * 20).toFixed(1)))

    const option = {
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: 'rgba(32,32,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        textStyle: { color: '#fff' },
      },
      legend: {
        data: ['成交额(万)', '买卖价差(bp)'],
        top: 10,
        textStyle: { color: 'rgba(255,255,255,0.75)' },
      },
      grid: [{ left: 60, right: 60, top: 50, height: '55%' }, { left: 60, right: 60, top: '68%', height: '22%' }],
      xAxis: [
        { type: 'category', data: dates, gridIndex: 0, axisLabel: { show: false }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } } },
        { type: 'category', data: dates, gridIndex: 1, axisLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10 } },
      ],
      yAxis: [
        { type: 'value', name: '成交额(万)', gridIndex: 0, position: 'right', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
        { type: 'value', name: '价差(bp)', gridIndex: 1, splitLine: { show: false } },
      ],
      dataZoom: [{ type: 'inside', xAxisIndex: [0, 1] }],
      series: [
        {
          name: '成交额(万)',
          type: 'bar',
          data: volumes,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1677ff' },
              { offset: 1, color: 'rgba(22,119,255,0.3)' },
            ]),
            borderRadius: [2, 2, 0, 0],
          },
        },
        {
          name: '买卖价差(bp)',
          type: 'line',
          data: spreads,
          smooth: true,
          xAxisIndex: 1,
          yAxisIndex: 1,
          lineStyle: { width: 2, color: '#faad14' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(250,173,20,0.25)' }, { offset: 1, color: 'rgba(250,173,20,0.02)' }]) },
          markLine: {
            silent: true,
            data: [
              { yAxis: 15, label: { formatter: '警戒线', color: 'rgba(255,255,255,0.45)' }, lineStyle: { color: '#f5222d', type: 'dashed' } },
            ],
          },
        },
      ],
    }

    return <ReactEChartsCore echarts={echarts} option={option} style={{ height: 380 }} />
  }

  // IOPV监控图表
  const IOPVChart = () => {
    const dates = Array.from({ length: 60 }, (_, i) =>
      `${String(9 + Math.floor(i / 12)).padStart(2, '0')}:${String((i % 12) * 5).padStart(2, '0')}`
    )
    const deviations = dates.map(() => parseFloat(((Math.random() - 0.5) * 0.6).toFixed(3)))

    const option = {
      tooltip: {
        trigger: 'axis' as const,
        backgroundColor: 'rgba(32,32,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        textStyle: { color: '#fff' },
        formatter: (params: any[]) => `
          <div>${params[0].axisValue}</div>
          折溢价: <span style="color:${params[0]?.data > 0 ? '#f5222d' : '#52c41a'}">${params[0]?.data}%</span>
        `,
      },
      grid: { left: 50, right: 30, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, rotate: 45 },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}%', color: 'rgba(255,255,255,0.65)' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      series: [{
        type: 'line',
        data: deviations,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2 },
        itemStyle: {
          color: (params: any) => params.value > 0 ? '#f5222d' : '#52c41a',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82,196,26,0.15)' },
            { offset: 0.5, color: 'rgba(255,255,255,0.02)' },
            { offset: 1, color: 'rgba(245,34,45,0.15)' },
          ]),
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            { yAxis: 0.3, label: { formatter: '+0.3%上限', color: 'rgba(255,255,255,0.4)' }, lineStyle: { color: '#f5222d99', type: 'dashed' } },
            { yAxis: -0.3, label: { formatter: '-0.3%下限', color: 'rgba(255,255,255,0.4)' }, lineStyle: { color: '#52c41a99', type: 'dashed' } },
          ],
        },
        markArea: {
          silent: true,
          data: [
            [{ yAxis: 0.3, itemStyle: { color: 'rgba(245,34,45,0.06)' } }, { yAxis: Infinity }],
            [{ yAxis: -Infinity, itemStyle: { color: 'rgba(82,196,26,0.06)' } }, { yAxis: -0.3 }],
          ],
        },
      }],
    }

    return (
      <>
        <ReactEChartsCore echarts={echarts} option={option} style={{ height: 300 }} />

        {/* IOPV统计 */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Statistic title="当前折溢价" value={mockLiquidityData.iopv.premiumDiscount} suffix="%" precision={3}
              valueStyle={{
                color: mockLiquidityData.iopv.premiumDiscount > 0 ? '#f5222d' :
                       mockLiquidityData.iopv.premiumDiscount < 0 ? '#52c41a' : undefined,
                fontSize: 18,
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="平均偏离" value={mockLiquidityData.iopv.avgPremiumDiscount} suffix="%" precision={3} valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col span={6}>
            <Statistic title="偏离次数" value={mockLiquidityData.iopv.deviationCount} suffix="次" valueStyle={{ fontSize: 18 }} />
          </Col>
          <Col span={6}>
            <Statistic title="最大偏离" value={mockLiquidityData.iopv.maxDeviation} suffix="%" precision={2}
              valueStyle={{ fontSize: 18, color: '#faad14' }}
            />
          </Col>
        </Row>

        <Alert
          style={{ marginTop: 16 }}
          message="IOPV（Indicative Optimized Portfolio Value）是ETF的参考单位净值，由交易所每15秒发布一次。主动ETF的IOPV基于每日披露的PCF计算，是套利和流动性管理的重要参考指标。"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />
      </>
    )
  }

  // 预警时间线
  const AlertsTimeline = () => (
    <Timeline
      items={liquidityAlerts.map((alert) => ({
        color: alert.type === 'warning' ? 'orange' : alert.type === 'success' ? 'green' : 'blue',
        children: (
          <Space direction="vertical" size={4}>
            <Text strong>{alert.time}</Text>
            <Text>{alert.message}</Text>
            {alert.resolved && <Tag color="success">已处理</Tag>}
          </Space>
        ),
      }))}
    />
  )

  // InfoCircleOutlined 需要从 ant-design/icons 导入
  const InfoCircleOutlined = () => null

  return (
    <Card
      className="dashboard-card"
      style={{ marginTop: 24 }}
      styles={{ body: { padding: 20 } }}
      title={
        <Space>
          <ThunderboltOutlined />
          <Title level={5} style={{ margin: 0 }}>流动性监控</Title>
        </Space>
      }
      extra={
        <Space>
          <Tag color={mockLiquidityData.iopv.deviationCount > 5 ? 'warning' : 'success'}>
            {mockLiquidityData.iopv.deviationCount > 5 ? '需关注' : '正常'}
          </Tag>
        </Space>
      }
    >
      {/* 概览模式 */}
      {activeTab === 'overview' && (
        <>
          <Row gutter={[16, 16]}>
            {/* 核心流动性指标 */}
            <Col span={18}>
              <Row gutter={[12, 12]}>
                <Col span={6}>
                  <Card size="small" className="kpi-card">
                    <Statistic
                      title="日均成交额"
                      value={parseFloat(mockLiquidityData.trading.avgDailyVolume.toFixed(0))}
                      suffix="万元"
                      prefix={<DollarOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="kpi-card">
                    <Statistic
                      title="换手率"
                      value={mockLiquidityData.trading.turnoverRate.toFixed(2)}
                      suffix="%"
                      prefix={<SwapOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="kpi-card">
                    <Statistic
                      title="买卖价差"
                      value={mockLiquidityData.trading.bidAskSpread.toFixed(1)}
                      suffix="bp"
                      valueStyle={{
                        color: mockLiquidityData.trading.bidAskSpread > 15 ? '#faad14' : undefined,
                      }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" className="kpi-card">
                    <Statistic
                      title="冲击成本"
                      value={mockLiquidityData.trading.impactCost.toFixed(1)}
                      suffix="bp"
                    />
                  </Card>
                </Col>
              </Row>

              {/* 规模变化 */}
              <Card size="small" style={{ marginTop: 12 }}>
                <Title level={5}>规模与份额变化</Title>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="总净值" value={mockLiquidityData.scale.totalNAV.toFixed(1)} suffix="亿元" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="流通份额" value={mockLiquidityData.scale.sharesOutstanding.toFixed(1)} suffix="亿份" />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="5日变动"
                      value={mockLiquidityData.scale.navChange5d}
                      suffix="%"
                      precision={2}
                      valueStyle={{
                        color: mockLiquidityData.scale.navChange5d > 0 ? '#f5222d' :
                               mockLiquidityData.scale.navChange5d < 0 ? '#52c41a' : undefined,
                      }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="申赎情况"
                      value={mockLiquidityData.scale.creationRedemption > 0 ? '+' : ''}
                      suffix={`万份${Math.abs(mockLiquidityData.scale.creationRedemption)}`}
                      valueStyle={{
                        color: mockLiquidityData.scale.creationRedemption > 0 ? '#52c41a' :
                               mockLiquidityData.scale.creationRedemption < 0 ? '#f5222d' : undefined,
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 持有人结构 */}
            <Col span={6}>
              <Card size="small" style={{ height: '100%' }} title="持有人结构">
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>机构投资者</Text>
                      <Text strong>{mockLiquidityData.holderStructure.institutionalPct.toFixed(0)}%</Text>
                    </div>
                    <Progress percent={mockLiquidityData.holderStructure.institutionalPct} strokeColor="#1677ff" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>个人投资者</Text>
                      <Text strong>{mockLiquidityData.holderStructure.retailPct.toFixed(0)}%</Text>
                    </div>
                    <Progress percent={mockLiquidityData.holderStructure.retailPct} strokeColor="#52c41a" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>前十大持有人</Text>
                      <Text strong>{mockLiquidityData.holderStructure.top10HolderPct.toFixed(0)}%</Text>
                    </div>
                    <Progress percent={mockLiquidityData.holderStructure.top10HolderPct} strokeColor="#faad14" />
                  </div>
                  <div style={{ marginTop: 12, padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      集中度风险评级：
                      <Tag color={
                        mockLiquidityData.holderStructure.concentrationRisk <= 2 ? 'success' :
                        mockLiquidityData.holderStructure.concentrationRisk <= 3 ? 'warning' : 'error'
                      }>
                        {['低', '较低', '中等', '较高', '高'][mockLiquidityData.holderStructure.concentrationRisk - 1]}
                      </Tag>
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* 交易数据 */}
      {activeTab === 'trading' && <TradingChart />}

      {/* IOPV监控 */}
      {activeTab === 'iopv' && <IOPVChart />}

      {/* 预警信息 */}
      {activeTab === 'alerts' && (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Alert
            message="实时流动性预警"
            description="以下为近期触发的流动性相关事件，包括IOPV异常偏离、价差扩大、大额申赎等"
            type="info"
            showIcon
            icon={<ClockCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
          <AlertsTimeline />
        </div>
      )}

      {/* 底部切换栏 */}
      <div style={{ marginTop: 16, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <Space>
          {(['overview', 'trading', 'iopv', 'alerts'] as const).map((tab) => (
            <Tag
              key={tab}
              color={activeTab === tab ? 'blue' : undefined}
              style={{ cursor: 'pointer', padding: '4px 16px' }}
              onClick={() => setActiveTab(tab)}
            >
              {{
                overview: '📊 综合概览',
                trading: '💹 交易分析',
                iopv: '📈 IOPV监控',
                alerts: '⚠️ 预警中心',
              }[tab]}
            </Tag>
          ))}
        </Space>
      </div>
    </Card>
  )
}

export default LiquidityMonitor

// 补充导入缺失的图标
import { InfoCircleOutlined as _InfoCircleOutlined } from '@ant-design/icons'
