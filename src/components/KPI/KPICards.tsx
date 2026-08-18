import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space, Tag, Tooltip } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { KPICardData } from '../../types'

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const { Text } = Typography

// ============================================
// 模拟KPI数据（上市后替换为真实数据）
// ============================================
const mockKPIData: KPICardData[] = [
  {
    title: '累计收益率',
    value: 12.58,
    unit: '%',
    change: 2.34,
    changePeriod: '近1月',
    trend: 'up',
    sparklineData: [10.0, 10.5, 11.2, 10.8, 11.5, 12.1, 12.3, 12.6],
    tooltip: '自成立以来的累计收益率',
  },
  {
    title: '年化收益',
    value: 15.82,
    unit: '%',
    change: -0.85,
    changePeriod: '近1月',
    trend: 'down',
    sparklineData: [16.2, 16.8, 17.1, 16.5, 16.9, 16.2, 15.9, 15.8],
    tooltip: '年化收益率（基于历史数据计算）',
  },
  {
    title: '夏普比率',
    value: 1.45,
    unit: '',
    change: 0.12,
    changePeriod: '近3月',
    trend: 'up',
    sparklineData: [1.25, 1.30, 1.35, 1.38, 1.42, 1.44, 1.46, 1.45],
    tooltip: '风险调整后收益，数值越高越好',
    status: 'normal',
  },
  {
    title: '最大回撤',
    value: -8.56,
    unit: '%',
    change: 1.23,
    changePeriod: '较上期改善',
    trend: 'up', // 回撤减小为正向
    sparklineData: [-5.2, -6.1, -7.5, -8.2, -9.1, -8.8, -8.6, -8.56],
    tooltip: '历史最大回撤幅度（负值表示亏损）',
    status: 'warning',
  },
  {
    title: '跟踪误差',
    value: 4.23,
    unit: '%',
    change: -0.35,
    changePeriod: '近1月',
    trend: 'down', // 误差降低为正向
    sparklineData: [4.8, 4.65, 4.55, 4.45, 4.38, 4.30, 4.25, 4.23],
    tooltip: '与基准指数的偏离程度，主动管理核心指标',
  },
  {
    title: '信息比率',
    value: 0.89,
    unit: '',
    change: 0.08,
    changePeriod: '近3月',
    trend: 'up',
    sparklineData: [0.72, 0.78, 0.81, 0.84, 0.86, 0.88, 0.89, 0.90],
    tooltip: '单位跟踪误差的超额收益，>0.5为良好',
    status: 'normal',
  },
]

// ============================================
// 单个KPI卡片组件
// ============================================

interface KPIItemProps {
  data: KPICardData
}

const KPIItem: React.FC<KPIItemProps> = ({ data }) => {
  const getTrendIcon = () => {
    if (data.trend === 'up') return <ArrowUpOutlined />
    if (data.trend === 'down') return <ArrowDownOutlined />
    return <MinusOutlined />
  }

  const getTrendColor = () => {
    // 特殊处理：回撤和跟踪误差的"下降"是好事
    const positiveIsGood = ['最大回撤', '跟踪误差'].includes(data.title)
    if (positiveIsGood) {
      return data.trend === 'down' ? '#52c41a' : data.trend === 'up' ? '#f5222d' : '#999'
    }
    return data.trend === 'up' ? '#f5222d' : data.trend === 'down' ? '#52c41a' : '#999'
  }

  const getStatusTag = () => {
    if (!data.status || data.status === 'normal') return null
    return (
      <Tag color={data.status === 'warning' ? 'warning' : 'error'} style={{ marginLeft: 8 }}>
        {data.status === 'warning' ? '关注' : '预警'}
      </Tag>
    )
  }

  const chartOption = {
    grid: { top: 5, right: 5, bottom: 5, left: 5 },
    xAxis: { type: 'category' as const, show: false, data: Array.from({ length: data.sparklineData?.length || 0 }, (_, i) => i) },
    yAxis: { type: 'value' as const, show: false },
    series: [{
      type: 'line' as const,
      data: data.sparklineData,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: getTrendColor() },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: `${getTrendColor()}20` },
          { offset: 1, color: `${getTrendColor()}05` },
        ]),
      },
    }],
    tooltip: { trigger: 'axis' as const, show: false },
  }

  return (
    <Card
      className="kpi-card"
      size="small"
      hoverable
      styles={{ body: { padding: '16px 20px' } }}
    >
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {/* 标题行 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {data.title}
            {data.tooltip && (
              <Tooltip title={data.tooltip}>
                <QuestionCircleOutlined style={{ marginLeft: 4, opacity: 0.5 }} />
              </Tooltip>
            )}
          </Text>
          {getStatusTag()}
        </div>

        {/* 数值行 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Statistic
            value={data.value}
            precision={typeof data.value === 'number' && Math.abs(data.value) < 10 ? 2 : 2}
            suffix={data.unit}
            valueStyle={{
              fontSize: 26,
              fontWeight: 700,
              color: typeof data.value === 'number' && data.value < 0 ? '#f5222d' : undefined,
            }}
          />

          {/* 迷你走势图 */}
          <div style={{ width: 80, height: 32 }}>
            <ReactEChartsCore
              echarts={echarts}
              option={chartOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* 变动行 */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
          <span style={{ color: getTrendColor(), marginRight: 4 }}>
            {getTrendIcon()}
          </span>
          <Text style={{ color: getTrendColor(), fontWeight: 500 }}>
            {Math.abs(data.change)}%
          </Text>
          <Text type="secondary" style={{ marginLeft: 6 }}>
            {data.changePeriod}
          </Text>
        </div>
      </Space>
    </Card>
  )
}

// ============================================
// KPI卡片容器组件
// ============================================

const KPICards: React.FC = () => {
  return (
    <div className="animate-fadeInUp">
      <Row gutter={[16, 16]}>
        {mockKPIData.map((kpi, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <KPIItem data={kpi} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default KPICards
