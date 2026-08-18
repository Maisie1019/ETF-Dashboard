import React, { useState } from 'react'
import { Card, Typography, Table, Space, Select, Tag, Row, Col, Button } from 'antd'
import {
  PieChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { PieChart, BarChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { Holding, SectorAllocation, FactorExposure } from '../../types'

echarts.use([PieChart, BarChart, RadarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const { Title, Text } = Typography

// ============================================
// 模拟持仓数据（上市后替换为真实PCF数据）
// ============================================

const mockHoldings: Holding[] = [
  { rank: 1, code: '600519', name: '贵州茅台', shares: 125.5, marketValue: 156875, weight: 9.85, sector: '食品饮料', change: 0.25 },
  { rank: 2, code: '300750', name: '宁德时代', shares: 280.3, marketValue: 124520, weight: 7.82, sector: '电力设备', change: 0.52 },
  { rank: 3, code: '601318', name: '中国平安', shares: 850.0, marketValue: 98500, weight: 6.18, sector: '非银金融', change: -0.15 },
  { rank: 4, code: '000858', name: '五粮液', shares: 420.6, marketValue: 89230, weight: 5.60, sector: '食品饮料', change: 0.08 },
  { rank: 5, code: '002594', name: '比亚迪', shares: 320.1, marketValue: 78560, weight: 4.93, sector: '汽车', change: 0.35 },
  { rank: 6, code: '600036', name: '招商银行', shares: 1200.5, marketValue: 75230, weight: 4.72, sector: '银行', change: -0.22 },
  { rank: 7, code: '601888', name: '中国中免', shares: 180.2, marketValue: 68920, weight: 4.33, sector: '商贸零售', change: 0.18 },
  { rank: 8, code: '002475', name: '立讯精密', shares: 550.8, marketValue: 62450, weight: 3.92, sector: '电子', change: 0.42 },
  { rank: 9, code: '600900', name: '长江电力', shares: 380.4, marketValue: 58760, weight: 3.69, sector: '公用事业', change: -0.05 },
  { rank: 10, code: '000333', name: '美的集团', shares: 290.7, marketValue: 52340, weight: 3.28, sector: '家用电器', change: 0.12 },
]

const mockSectorAllocation: SectorAllocation[] = [
  { sector: '食品饮料', weight: 15.45, benchmarkWeight: 12.8, activeWeight: 2.65, count: 8 },
  { sector: '电力设备', weight: 12.35, benchmarkWeight: 14.2, activeWeight: -1.85, count: 12 },
  { sector: '非银金融', weight: 10.28, benchmarkWeight: 8.5, activeWeight: 1.78, count: 6 },
  { sector: '电子', weight: 9.56, benchmarkWeight: 11.0, activeWeight: -1.44, count: 18 },
  { sector: '银行', weight: 8.42, benchmarkWeight: 10.5, activeWeight: -2.08, count: 5 },
  { sector: '汽车', weight: 7.85, benchmarkWeight: 6.2, activeWeight: 1.65, count: 4 },
  { sector: '医药生物', weight: 7.23, benchmarkWeight: 9.8, activeWeight: -2.57, count: 15 },
  { sector: '计算机', weight: 6.54, benchmarkWeight: 7.5, activeWeight: -0.96, count: 10 },
  { sector: '家用电器', weight: 5.32, benchmarkWeight: 4.8, activeWeight: 0.52, count: 3 },
  { sector: '其他', weight: 17.0, benchmarkWeight: 14.7, activeWeight: 2.3, count: 45 },
]

const mockFactorExposure: FactorExposure[] = [
  { factor: '规模', exposure: 0.25, activeExposure: 0.08, contribution: 0.45, tStat: 1.85 },
  { factor: '价值', exposure: -0.15, activeExposure: -0.22, contribution: -0.62, tStat: -2.15 },
  { factor: '动量', exposure: 0.35, activeExposure: 0.18, contribution: 0.78, tStat: 2.45 },
  { factor: '质量', exposure: 0.55, activeExposure: 0.12, contribution: 0.95, tStat: 3.12 },
  { factor: '波动率', exposure: -0.20, activeExposure: -0.05, contribution: -0.18, tStat: -0.98 },
  { factor: '流动性', exposure: 0.10, activeExposure: 0.02, contribution: 0.08, tStat: 0.65 },
]

// ============================================
// 持仓分析组件
// ============================================

const HoldingsAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'holdings' | 'sector' | 'factor'>('holdings')

  // 前十大持仓表格列
  const holdingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      align: 'center' as const,
    },
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '持股数(万股)',
      dataIndex: 'shares',
      key: 'shares',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '市值(万元)',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 110,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '占净比',
      dataIndex: 'weight',
      key: 'weight',
      width: 90,
      align: 'right' as const,
      sorter: (a: Holding, b: Holding) => a.weight - b.weight,
      render: (val: number) => (
        <span style={{ fontWeight: 500 }}>{val.toFixed(2)}%</span>
      ),
    },
    {
      title: '变动',
      dataIndex: 'change',
      key: 'change',
      width: 80,
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#f5222d' : val < 0 ? '#52c41a' : '#999' }}>
          {val > 0 ? '+' : ''}{val.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '行业',
      dataIndex: 'sector',
      key: 'sector',
      width: 100,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
  ]

  // 行业配置表格列
  const sectorColumns = [
    {
      title: '行业',
      dataIndex: 'sector',
      key: 'sector',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '配置权重',
      dataIndex: 'weight',
      key: 'weight',
      align: 'right' as const,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      title: '基准权重',
      dataIndex: 'benchmarkWeight',
      key: 'benchmarkWeight',
      align: 'right' as const,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      title: '主动权重',
      dataIndex: 'activeWeight',
      key: 'activeWeight',
      align: 'right' as const,
      sorter: (a: SectorAllocation, b: SectorAllocation) => a.activeWeight - b.activeWeight,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
          {val > 0 ? '+' : ''}{val.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '个股数',
      dataIndex: 'count',
      key: 'count',
      align: 'center' as const,
    },
    {
      title: '超配/低配',
      dataIndex: 'activeWeight',
      key: 'allocation',
      align: 'center' as const,
      render: (val: number) =>
        val > 0.5 ? <Tag color="red">超配</Tag> :
        val < -0.5 ? <Tag color="green">低配</Tag> :
        <Tag color="default">中性</Tag>,
    },
  ]

  // 行业配置饼图
  const sectorPieOption = {
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c}% ({d}%)',
    },
    legend: {
      orient: 'vertical' as const,
      right: '5%',
      top: 'center',
      textStyle: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
    },
    series: [{
      type: 'pie' as const,
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#1f1f1f', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
      },
      data: mockSectorAllocation.map((s) => ({
        value: s.weight,
        name: s.sector,
        itemStyle: {
          color: s.activeWeight > 0
            ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#f5222d' },
                { offset: 1, color: '#ff7875' },
              ])
            : new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: '#52c41a' },
                { offset: 1, color: '#73d13d' },
              ]),
        },
      })),
    }],
  }

  // 风格因子雷达图
  const factorRadarOption = {
    tooltip: {},
    radar: {
      indicator: mockFactorExposure.map((f) => ({ name: f.factor, max: 1, min: -1 })),
      shape: 'polygon' as const,
      splitNumber: 4,
      axisName: { color: 'rgba(255,255,255,0.75)' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      splitArea: { areaStyle: { color: ['rgba(22,119,255,0.02)', 'rgba(22,119,255,0.06)'] } },
    },
    series: [{
      type: 'radar' as const,
      data: [
        {
          value: mockFactorExposure.map((f) => f.exposure),
          name: '因子暴露',
          lineStyle: { color: '#1677ff', width: 2 },
          areaStyle: { color: 'rgba(22,119,255,0.2)' },
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          value: mockFactorExposure.map((f) => f.activeExposure),
          name: '主动暴露',
          lineStyle: { color: '#faad14', width: 2, type: 'dashed' },
          areaStyle: { color: 'rgba(250,173,20,0.1)' },
          symbol: 'diamond',
          symbolSize: 5,
        },
      ],
    }],
    legend: {
      bottom: 10,
      textStyle: { color: 'rgba(255,255,255,0.75)' },
    },
  }

  return (
    <Card
      className="dashboard-card"
      styles={{ body: { padding: 20 } }}
      title={
        <Space>
          <PieChartOutlined />
          <Title level={5} style={{ margin: 0 }}>持仓分析</Title>
        </Space>
      }
      extra={
        <Space>
          <Select
            value={activeTab}
            onChange={setActiveTab}
            size="small"
            style={{ width: 120 }}
            options={[
              { value: 'holdings', label: '前十大持仓' },
              { value: 'sector', label: '行业配置' },
              { value: 'factor', label: '风格因子' },
            ]}
          />
          <Button icon={<DownloadOutlined />} size="small" type="text" />
        </Space>
      }
    >
      {/* 前十大持仓 */}
      {activeTab === 'holdings' && (
        <>
          {(() => {
            const totalWeight = mockHoldings.reduce((sum, h) => sum + h.weight, 0)
            return (
              <>
          <Table
            columns={holdingColumns}
            dataSource={mockHoldings}
            rowKey="code"
            size="small"
            pagination={false}
            scroll={{ y: 350 }}
            summary={() => {
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    <Text strong>前十大合计</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <Text strong style={{ color: totalWeight > 60 ? '#f5222d' : undefined }}>
                      {totalWeight.toFixed(2)}%
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} colSpan={2}>
                    {totalWeight > 60 && (
                      <Tag color="warning">集中度偏高</Tag>
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )
            }}
          />
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(250,173,20,0.08)', borderRadius: 6, borderLeft: '3px solid #faad14' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 <Text strong>主动ETF优势：</Text>
              每日披露PCF（投资组合文件），可实时监控持仓变动。当前CR10为{totalWeight.toFixed(2)}%
              {totalWeight > 60 ? '，超过60%警戒线，建议关注集中度风险' : '，处于合理区间'}。
            </Text>
          </div>
              </>
            )
          })()}
        </>
      )}

      {/* 行业配置 */}
      {activeTab === 'sector' && (
        <Row gutter={24}>
          <Col span={12}>
            <ReactEChartsCore
              echarts={echarts}
              option={sectorPieOption}
              style={{ height: 380 }}
            />
          </Col>
          <Col span={12}>
            <Table
              columns={sectorColumns}
              dataSource={mockSectorAllocation}
              rowKey="sector"
              size="small"
              pagination={false}
              scroll={{ y: 320 }}
            />
          </Col>
        </Row>
      )}

      {/* 风格因子 */}
      {activeTab === 'factor' && (
        <Row gutter={24}>
          <Col span={14}>
            <ReactEChartsCore
              echarts={echarts}
              option={factorRadarOption}
              style={{ height: 380 }}
            />
          </Col>
          <Col span={10}>
            <Table
              columns={[
                { title: '因子', dataIndex: 'factor', key: 'factor', render: (t: string) => <Text strong>{t}</Text> },
                { title: '暴露值', dataIndex: 'exposure', key: 'exposure', align: 'right', render: (v: number) => v.toFixed(2) },
                { title: '主动暴露', dataIndex: 'activeExposure', key: 'activeExposure', align: 'right', render: (v: number) => <span style={{ color: v > 0 ? '#f5222d' : v < 0 ? '#52c41a' : undefined }}>{v.toFixed(2)}</span> },
                { title: '贡献(%)', dataIndex: 'contribution', key: 'contribution', align: 'right', render: (v: number) => <span style={{ color: v > 0 ? '#f5222d' : v < 0 ? '#52c41a' : undefined }}>{v.toFixed(2)}</span> },
                { title: 't统计量', dataIndex: 'tStat', key: 'tStat', align: 'right', render: (v: number) => <span style={{ color: Math.abs(v) > 2 ? '#f5222d' : undefined }}>{v.toFixed(2)}</span> },
              ]}
              dataSource={mockFactorExposure}
              rowKey="factor"
              size="small"
              pagination={false}
              scroll={{ y: 320 }}
            />
          </Col>
        </Row>
      )}
    </Card>
  )
}

export default HoldingsAnalysis
