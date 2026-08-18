import React, { useState } from 'react'
import { Layout as AntLayout, theme, Switch, Space, Typography, Badge, Menu, Select } from 'antd'
import {
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  BankOutlined,
  SwapOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import KPICards from '../KPI/KPICards'
import NAVChart from '../Chart/NAVChart'
import HoldingsAnalysis from '../Holdings/HoldingsAnalysis'
import RiskAnalysis from '../Risk/RiskAnalysis'
import LiquidityMonitor from '../Liquidity/LiquidityMonitor'
import ProductCompare from '../Compare/ProductCompare'
import CompanyProfile from '../Company/CompanyProfile'
import StyleAnalysis from '../Style/StyleAnalysis'
import { etfProducts } from '../../data/mockData'

const { Header, Sider, Content } = AntLayout
const { Title, Text } = Typography

interface MainLayoutProps {
  isDark: boolean
  onThemeToggle: () => void
}

const MainLayout: React.FC<MainLayoutProps> = ({ isDark, onThemeToggle }) => {
  const { token } = theme.useToken()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [selectedProductCode, setSelectedProductCode] = useState<string>('510520')

  const selectedProduct = etfProducts.find(p => p.code === selectedProductCode)

  const menuItems = [
    { key: 'overview', icon: <DashboardOutlined />, label: '总览分析' },
    { key: 'compare', icon: <SwapOutlined />, label: '产品对比' },
    { key: 'company', icon: <BankOutlined />, label: '公司画像' },
    { key: 'style', icon: <RadarChartOutlined />, label: '风格分析' },
    { key: 'nav', icon: <BarChartOutlined />, label: '净值走势' },
    { key: 'holdings', icon: <PieChartOutlined />, label: '持仓透明度' },
    { key: 'risk', icon: <SafetyOutlined />, label: '风险归因' },
    { key: 'liquidity', icon: <ThunderboltOutlined />, label: '流动性监控' },
  ]

  // 渲染内容区域
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <KPICards />
            <NAVChart />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
              <HoldingsAnalysis />
              <RiskAnalysis />
            </div>
            <LiquidityMonitor />
          </>
        )
      case 'compare':
        return <ProductCompare />
      case 'company':
        return <CompanyProfile />
      case 'style':
        return <StyleAnalysis />
      case 'nav':
        return <NAVChart />
      case 'holdings':
        return <HoldingsAnalysis />
      case 'risk':
        return <RiskAnalysis />
      case 'liquidity':
        return <LiquidityMonitor />
      default:
        return <KPICards />
    }
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        width={260}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Title level={4} style={{ margin: 0, color: token.colorPrimary, fontSize: 16 }}>
            🐆 主动ETF Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 11 }}>
            中国首批18家试点产品专业分析平台
          </Text>
        </div>

        {/* 产品选择器 */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>选择产品</Text>
          <Select
            value={selectedProductCode}
            onChange={setSelectedProductCode}
            size="small"
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="label"
            options={etfProducts.map(p => ({
              value: p.code,
              label: `${p.name.replace('主动管理ETF', '').trim()} (${p.fundCompanyShort})`,
            }))}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={({ key }) => setActiveTab(key)}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 8 }}
        />

        {/* 底部信息 */}
        <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
          <Text type="secondary" style={{ fontSize: 10 }}>
            数据来源：公开申报信息 + 专业模拟<br/>
            上市后自动对接真实数据API
          </Text>
        </div>
      </Sider>

      {/* 主内容区 */}
      <AntLayout>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space size="large">
            <Text strong>
              当前产品：
              {selectedProduct ? (
                <span style={{ color: token.colorPrimary }}>{selectedProduct.name}</span>
              ) : (
                <span style={{ color: token.colorTextSecondary }}>未选择</span>
              )}
            </Text>
            {selectedProduct && (
              <>
                <Badge
                  status={selectedProduct.status === 'trading' ? 'success' : 'processing'}
                  text={
                    selectedProduct.status === 'trading'
                      ? '交易中'
                      : selectedProduct.status === 'pending'
                      ? '待上市'
                      : '停牌'
                  }
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  基准：{selectedProduct.benchmark}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  策略：{selectedProduct.strategy}
                </Text>
              </>
            )}
          </Space>

          <Space>
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={isDark}
              onChange={onThemeToggle}
            />
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content style={{ padding: 24, background: token.colorBgLayout, overflow: 'auto' }}>
          {renderContent()}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default MainLayout
