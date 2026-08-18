import React from 'react'
import { Layout as AntLayout, theme, Switch, Space, Typography, Badge } from 'antd'
import {
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import KPICards from '../KPI/KPICards'
import NAVChart from '../Chart/NAVChart'
import HoldingsAnalysis from '../Holdings/HoldingsAnalysis'
import RiskAnalysis from '../Risk/RiskAnalysis'
import LiquidityMonitor from '../Liquidity/LiquidityMonitor'
import { useETFContext } from '../../hooks/useETFContext'

const { Header, Sider, Content } = AntLayout
const { Title, Text } = Typography

interface MainLayoutProps {
  isDark: boolean
  onThemeToggle: () => void
}

const MainLayout: React.FC<MainLayoutProps> = ({ isDark, onThemeToggle }) => {
  const { state } = useETFContext()
  const { token } = theme.useToken()

  const menuItems = [
    { key: 'overview', icon: <DashboardOutlined />, label: '总览' },
    { key: 'nav', icon: <BarChartOutlined />, label: '净值分析' },
    { key: 'holdings', icon: <PieChartOutlined />, label: '持仓分析' },
    { key: 'risk', icon: <SafetyOutlined />, label: '风险归因' },
    { key: 'liquidity', icon: <ThunderboltOutlined />, label: '流动性监控' },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        width={240}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div style={{ padding: '24px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
            🐆 主动ETF Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            中国首批18家试点产品分析平台
          </Text>
        </div>

        <AntLayout.Menu
          mode="inline"
          defaultSelectedKeys={['overview']}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 8 }}
        />
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
              {state.selectedETF ? (
                <span style={{ color: token.colorPrimary }}>{state.selectedETF.name}</span>
              ) : (
                <span style={{ color: token.colorTextSecondary }}>未选择</span>
              )}
            </Text>
            {state.selectedETF && (
              <Badge
                status={state.selectedETF.status === 'trading' ? 'success' : 'processing'}
                text={
                  state.selectedETF.status === 'trading'
                    ? '交易中'
                    : state.selectedETF.status === 'pending'
                    ? '待上市'
                    : '停牌'
                }
              />
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
          {/* KPI仪表盘 */}
          <KPICards />

          {/* 净值走势图 */}
          <NAVChart />

          {/* 持仓与风险分析（并排） */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            <HoldingsAnalysis />
            <RiskAnalysis />
          </div>

          {/* 流动性监控（全宽） */}
          <LiquidityMonitor />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default MainLayout
