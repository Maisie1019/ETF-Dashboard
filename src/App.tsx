import React, { useState } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Layout from './components/Layout/MainLayout'
import { ETFProvider } from './hooks/useETFContext'

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontSize: 14,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <ETFProvider>
        <Layout isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      </ETFProvider>
    </ConfigProvider>
  )
}

export default App
