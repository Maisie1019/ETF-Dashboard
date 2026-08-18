/**
 * ETF投资风格专业分析模块
 * ============================================
 * 深度风格分析工具：
 * - Morningstar风格箱（9宫格定位）
 * - Barra因子暴露热力图
 * - 风格漂移监测时间线
 * - 风格相关性矩阵
 * - 因子贡献归因分解
 *
 * 对标：Bloomberg PORT / MSCI Barra / Axioma
 */

import React, { useState, useMemo } from 'react'
import {
  Card,
  Typography,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Select,
} from 'antd'
import {
  RadarChartOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import {
  ScatterChart,
  HeatmapChart,
  LineChart,
  RadarChart,
  EffectScatterChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { etfProducts } from '../../data/mockData'

echarts.use([
  ScatterChart, HeatmapChart, LineChart, RadarChart, EffectScatterChart,
  GridComponent, TooltipComponent, LegendComponent,
  VisualMapComponent, MarkLineComponent, MarkPointComponent,
  DataZoomComponent, CanvasRenderer,
])

const { Title, Text } = Typography

// ============================================
// 类型定义
// ============================================

interface StylePosition {
  code: string
  name: string
  company: string
  strategy: string

  // 风格坐标（类似Morningstar风格箱）
  sizeExposure: number      // 规模因子暴露 (-3到+3，负=小盘，正=大盘)
  valueExposure: number     // 价值因子暴露 (-3到+3，负=成长，正=价值)

  // Barra风格因子暴露
  factors: FactorExposure[]

  // 风格标签
  styleLabel: string       // 如"大盘成长"、"中盘价值"
  styleBox: string         // 9宫格位置标识
}

interface FactorExposure {
  name: string             // 因子名称
  exposure: number         // 暴露值（标准化z-score）
  activeExposure: number   // 主动暴露（相对基准的超配/低配）
  tStat: number            // t统计量（显著性检验）
  contribution: number     // 对收益的贡献 (%)
  category: 'size' | 'value' | 'quality' | 'momentum' | 'volatility' | 'other'
}

interface StyleDriftPoint {
  date: string
  sizeExposure: number
  valueExposure: number
  momentumExposure: number
  qualityExposure: number
  event: string            // 可选的漂移事件描述
}

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

// ============================================
// 18只产品的风格定位数据
// ============================================

const stylePositions: StylePosition[] = [
  // 易方达品质未来 → 大盘品质（偏价值侧的大盘成长）
  {
    code: '510520', name: '易方达品质未来', company: '易方达基金', strategy: 'quality',
    sizeExposure: 1.8, valueExposure: 0.6,
    styleLabel: '大盘品质', styleBox: 'LG-CG',
    factors: [
      { name: '规模', exposure: 1.82, activeExposure: 0.45, tStat: 4.2, contribution: 1.85, category: 'size' },
      { name: 'Beta', exposure: 1.05, activeExposure: 0.12, tStat: 2.1, contribution: 0.52, category: 'other' },
      { name: '动量', exposure: 0.35, activeExposure: 0.18, tStat: 1.8, contribution: 0.28, category: 'momentum' },
      { name: '波动率', exposure: -0.42, activeExposure: -0.28, tStat: -2.5, contribution: -0.38, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.55, activeExposure: 0.72, tStat: 5.8, contribution: 1.42, category: 'quality' },
      { name: '质量(成长)', exposure: 0.88, activeExposure: 0.35, tStat: 3.2, contribution: 0.65, category: 'quality' },
      { name: '价值(BP)', exposure: -0.25, activeExposure: -0.15, tStat: -1.2, contribution: -0.18, category: 'value' },
      { name: '流动性', exposure: 0.65, activeExposure: 0.22, tStat: 2.4, contribution: 0.32, category: 'other' },
      { name: '杠杆', exposure: -0.18, activeExposure: -0.08, tStat: -0.9, contribution: -0.08, category: 'other' },
      { name: '非线性市值', exposure: 0.12, activeExposure: 0.05, tStat: 0.6, contribution: 0.04, category: 'size' },
    ],
  },
  // 华夏质量价值甄选 → 大盘价值
  {
    code: '510521', name: '华夏质量价值甄选', company: '华夏基金', strategy: 'value',
    sizeExposure: 1.5, valueExposure: 1.8,
    styleLabel: '大盘价值', styleBox: 'LG-LV',
    factors: [
      { name: '规模', exposure: 1.48, activeExposure: 0.32, tStat: 3.8, contribution: 1.52, category: 'size' },
      { name: 'Beta', exposure: 0.82, activeExposure: -0.08, tStat: 1.5, contribution: 0.38, category: 'other' },
      { name: '动量', exposure: -0.22, activeExposure: -0.18, tStat: -1.8, contribution: -0.15, category: 'momentum' },
      { name: '波动率', exposure: -0.85, activeExposure: -0.58, tStat: -4.8, contribution: -0.72, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.25, activeExposure: 0.55, tStat: 4.5, contribution: 1.15, category: 'quality' },
      { name: '质量(成长)', exposure: -0.15, activeExposure: -0.28, tStat: -2.2, contribution: -0.22, category: 'quality' },
      { name: '价值(BP)', exposure: 1.92, activeExposure: 0.88, tStat: 6.2, contribution: 1.78, category: 'value' },
      { name: '流动性', exposure: 0.72, activeExposure: 0.28, tStat: 2.6, contribution: 0.35, category: 'other' },
      { name: '杠杆', exposure: -0.35, activeExposure: -0.18, tStat: -1.8, contribution: -0.16, category: 'other' },
      { name: '非线性市值', exposure: 0.08, activeExposure: 0.02, tStat: 0.4, contribution: 0.02, category: 'size' },
    ],
  },
  // 永赢景气精选 → 中盘成长
  {
    code: '510522', name: '永赢景气精选', company: '永赢基金', strategy: 'growth',
    sizeExposure: -0.2, valueExposure: -1.2,
    styleLabel: '中盘成长', styleBox: 'MC-CG',
    factors: [
      { name: '规模', exposure: -0.22, activeExposure: -0.35, tStat: -2.2, contribution: -0.28, category: 'size' },
      { name: 'Beta', exposure: 1.25, activeExposure: 0.32, tStat: 3.5, contribution: 0.68, category: 'other' },
      { name: '动量', exposure: 1.15, activeExposure: 0.62, tStat: 5.2, contribution: 0.95, category: 'momentum' },
      { name: '波动率', exposure: 0.75, activeExposure: 0.48, tStat: 3.8, contribution: 0.58, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.45, activeExposure: 0.12, tStat: 1.5, contribution: 0.22, category: 'quality' },
      { name: '质量(成长)', exposure: 1.35, activeExposure: 0.72, tStat: 5.5, contribution: 1.05, category: 'quality' },
      { name: '价值(BP)', exposure: -1.45, activeExposure: -0.82, tStat: -5.8, contribution: -1.25, category: 'value' },
      { name: '流动性', exposure: -0.28, activeExposure: -0.18, tStat: -1.8, contribution: -0.18, category: 'other' },
      { name: '杠杆', exposure: 0.42, activeExposure: 0.22, tStat: 2.2, contribution: 0.24, category: 'other' },
      { name: '非线性市值', exposure: -0.15, activeExposure: -0.08, tStat: -1.0, contribution: -0.06, category: 'size' },
    ],
  },
  // 摩根核心成长 → 大盘成长
  {
    code: '510523', name: '摩根核心成长', company: '摩根基金', strategy: 'growth',
    sizeExposure: 1.2, valueExposure: -1.5,
    styleLabel: '大盘成长', styleBox: 'LG-CG',
    factors: [
      { name: '规模', exposure: 1.18, activeExposure: 0.28, tStat: 3.2, contribution: 1.18, category: 'size' },
      { name: 'Beta', exposure: 1.35, activeExposure: 0.42, tStat: 4.5, contribution: 0.78, category: 'other' },
      { name: '动量', exposure: 1.28, activeExposure: 0.72, tStat: 5.8, contribution: 1.08, category: 'momentum' },
      { name: '波动率', exposure: 0.88, activeExposure: 0.55, tStat: 4.2, contribution: 0.68, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.62, activeExposure: 0.22, tStat: 2.0, contribution: 0.32, category: 'quality' },
      { name: '质量(成长)', exposure: 1.55, activeExposure: 0.85, tStat: 6.2, contribution: 1.22, category: 'quality' },
      { name: '价值(BP)', exposure: -1.68, activeExposure: -0.95, tStat: -6.5, contribution: -1.48, category: 'value' },
      { name: '流动性', exposure: -0.15, activeExposure: -0.08, tStat: -0.8, contribution: -0.06, category: 'other' },
      { name: '杠杆', exposure: 0.55, activeExposure: 0.28, tStat: 2.8, contribution: 0.32, category: 'other' },
      { name: '非线性市值', exposure: 0.05, activeExposure: 0.02, tStat: 0.3, contribution: 0.02, category: 'size' },
    ],
  },
  // 华泰柏瑞价值精选 → 大盘深度价值
  {
    code: '510524', name: '华泰柏瑞价值精选', company: '华泰柏瑞', strategy: 'value',
    sizeExposure: 1.6, valueExposure: 2.2,
    styleLabel: '大盘深度价值', styleBox: 'LG-LV',
    factors: [
      { name: '规模', exposure: 1.58, activeExposure: 0.38, tStat: 4.0, contribution: 1.62, category: 'size' },
      { name: 'Beta', exposure: 0.65, activeExposure: -0.18, tStat: 1.2, contribution: 0.28, category: 'other' },
      { name: '动量', exposure: -0.55, activeExposure: -0.42, tStat: -3.5, contribution: -0.38, category: 'momentum' },
      { name: '波动率', exposure: -1.05, activeExposure: -0.72, tStat: -5.5, contribution: -0.88, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.15, activeExposure: 0.48, tStat: 4.0, contribution: 1.05, category: 'quality' },
      { name: '质量(成长)', exposure: -0.45, activeExposure: -0.52, tStat: -3.8, contribution: -0.38, category: 'quality' },
      { name: '价值(BP)', exposure: 2.28, activeExposure: 1.05, tStat: 7.2, contribution: 2.12, category: 'value' },
      { name: '流动性', exposure: 0.82, activeExposure: 0.35, tStat: 3.0, contribution: 0.42, category: 'other' },
      { name: '杠杆', exposure: -0.48, activeExposure: -0.25, tStat: -2.5, contribution: -0.22, category: 'other' },
      { name: '非线性市值', exposure: 0.10, activeExposure: 0.04, tStat: 0.5, contribution: 0.04, category: 'size' },
    ],
  },
  // 汇添富均衡策略 → 核心均衡
  {
    code: '510525', name: '汇添富均衡策略', company: '汇添富基金', strategy: 'balanced',
    sizeExposure: 0.3, valueExposure: 0.2,
    styleLabel: '核心均衡', styleBox: 'MC-Core',
    factors: [
      { name: '规模', exposure: 0.28, activeExposure: -0.08, tStat: 1.0, contribution: 0.18, category: 'size' },
      { name: 'Beta', exposure: 0.95, activeExposure: 0.05, tStat: 1.8, contribution: 0.48, category: 'other' },
      { name: '动量', exposure: 0.25, activeExposure: 0.12, tStat: 1.5, contribution: 0.18, category: 'momentum' },
      { name: '波动率', exposure: -0.25, activeExposure: -0.15, tStat: -1.5, contribution: -0.18, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.95, activeExposure: 0.38, tStat: 3.8, contribution: 0.88, category: 'quality' },
      { name: '质量(成长)', exposure: 0.42, activeExposure: 0.15, tStat: 2.0, contribution: 0.32, category: 'quality' },
      { name: '价值(BP)', exposure: 0.28, activeExposure: 0.12, tStat: 1.2, contribution: 0.22, category: 'value' },
      { name: '流动性', exposure: 0.35, activeExposure: 0.12, tStat: 1.5, contribution: 0.18, category: 'other' },
      { name: '杠杆', exposure: -0.12, activeExposure: -0.05, tStat: -0.6, contribution: -0.04, category: 'other' },
      { name: '非线性市值', exposure: 0.02, activeExposure: -0.02, tStat: 0.2, contribution: 0.01, category: 'size' },
    ],
  },
  // 华安品质严选 → 中盘品质
  {
    code: '510526', name: '华安品质严选', company: '华安基金', strategy: 'quality',
    sizeExposure: -0.3, valueExposure: 0.5,
    styleLabel: '中盘品质', styleBox: 'MC-Core',
    factors: [
      { name: '规模', exposure: -0.32, activeExposure: -0.38, tStat: -2.5, contribution: -0.25, category: 'size' },
      { name: 'Beta', exposure: 1.02, activeExposure: 0.12, tStat: 2.0, contribution: 0.52, category: 'other' },
      { name: '动量', exposure: 0.45, activeExposure: 0.25, tStat: 2.8, contribution: 0.35, category: 'momentum' },
      { name: '波动率', exposure: -0.15, activeExposure: -0.08, tStat: -0.9, contribution: -0.10, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.45, activeExposure: 0.65, tStat: 5.5, contribution: 1.32, category: 'quality' },
      { name: '质量(成长)', exposure: 0.72, activeExposure: 0.35, tStat: 3.2, contribution: 0.55, category: 'quality' },
      { name: '价值(BP)', exposure: 0.55, activeExposure: 0.28, tStat: 2.5, contribution: 0.42, category: 'value' },
      { name: '流动性', exposure: 0.12, activeExposure: 0.02, tStat: 0.6, contribution: 0.06, category: 'other' },
      { name: '杠杆', exposure: -0.08, activeExposure: -0.03, tStat: -0.4, contribution: -0.02, category: 'other' },
      { name: '非线性市值', exposure: -0.12, activeExposure: -0.06, tStat: -0.8, contribution: -0.05, category: 'size' },
    ],
  },
  // 招商价值智选 → 大盘价值
  {
    code: '510527', name: '招商价值智选', company: '招商基金', strategy: 'value',
    sizeExposure: 1.7, valueExposure: 1.6,
    styleLabel: '大盘价值', styleBox: 'LG-LV',
    factors: [
      { name: '规模', exposure: 1.68, activeExposure: 0.35, tStat: 4.2, contribution: 1.72, category: 'size' },
      { name: 'Beta', exposure: 0.72, activeExposure: -0.12, tStat: 1.3, contribution: 0.34, category: 'other' },
      { name: '动量', exposure: -0.35, activeExposure: -0.28, tStat: -2.2, contribution: -0.24, category: 'momentum' },
      { name: '波动率', exposure: -0.92, activeExposure: -0.62, tStat: -5.0, contribution: -0.76, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.18, activeExposure: 0.50, tStat: 4.2, contribution: 1.08, category: 'quality' },
      { name: '质量(成长)', exposure: -0.22, activeExposure: -0.35, tStat: -2.5, contribution: -0.18, category: 'quality' },
      { name: '价值(BP)', exposure: 1.72, activeExposure: 0.82, tStat: 5.8, contribution: 1.62, category: 'value' },
      { name: '流动性', exposure: 0.78, activeExposure: 0.32, tStat: 2.8, contribution: 0.40, category: 'other' },
      { name: '杠杆', exposure: -0.40, activeExposure: -0.22, tStat: -2.2, contribution: -0.18, category: 'other' },
      { name: '非线性市值', exposure: 0.08, activeExposure: 0.03, tStat: 0.4, contribution: 0.03, category: 'size' },
    ],
  },
  // 平安行业优选 → 行业轮动（动态风格）
  {
    code: '510528', name: '平安行业优选', company: '平安基金', strategy: 'sector_rotation',
    sizeExposure: -0.1, valueExposure: -0.8,
    styleLabel: '行业轮动', styleBox: 'MC-CG',
    factors: [
      { name: '规模', exposure: -0.12, activeExposure: -0.28, tStat: -1.8, contribution: -0.18, category: 'size' },
      { name: 'Beta', exposure: 1.18, activeExposure: 0.28, tStat: 3.8, contribution: 0.62, category: 'other' },
      { name: '动量', exposure: 0.95, activeExposure: 0.55, tStat: 4.5, contribution: 0.78, category: 'momentum' },
      { name: '波动率', exposure: 0.55, activeExposure: 0.35, tStat: 2.8, contribution: 0.42, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.55, activeExposure: 0.18, tStat: 2.0, contribution: 0.38, category: 'quality' },
      { name: '质量(成长)', exposure: 1.15, activeExposure: 0.62, tStat: 4.8, contribution: 0.88, category: 'quality' },
      { name: '价值(BP)', exposure: -0.95, activeExposure: -0.55, tStat: -4.2, contribution: -0.82, category: 'value' },
      { name: '流动性', exposure: -0.22, activeExposure: -0.15, tStat: -1.5, contribution: -0.14, category: 'other' },
      { name: '杠杆', exposure: 0.35, activeExposure: 0.18, tStat: 2.0, contribution: 0.20, category: 'other' },
      { name: '非线性市值', exposure: -0.08, activeExposure: -0.04, tStat: -0.5, contribution: -0.03, category: 'size' },
    ],
  },
  // 南方大盘风格配置 → 大盘均衡
  {
    code: '159940', name: '南方大盘风格配置', company: '南方基金', strategy: 'balanced',
    sizeExposure: 1.4, valueExposure: 0.1,
    styleLabel: '大盘均衡', styleBox: 'LG-Core',
    factors: [
      { name: '规模', exposure: 1.38, activeExposure: 0.30, tStat: 3.6, contribution: 1.42, category: 'size' },
      { name: 'Beta', exposure: 0.98, activeExposure: 0.05, tStat: 1.8, contribution: 0.49, category: 'other' },
      { name: '动量', exposure: 0.18, activeExposure: 0.08, tStat: 1.0, contribution: 0.12, category: 'momentum' },
      { name: '波动率', exposure: -0.32, activeExposure: -0.20, tStat: -2.0, contribution: -0.24, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.88, activeExposure: 0.35, tStat: 3.5, contribution: 0.82, category: 'quality' },
      { name: '质量(成长)', exposure: 0.35, activeExposure: 0.12, tStat: 1.8, contribution: 0.26, category: 'quality' },
      { name: '价值(BP)', exposure: 0.15, activeExposure: 0.06, tStat: 0.7, contribution: 0.12, category: 'value' },
      { name: '流动性', exposure: 0.55, activeExposure: 0.22, tStat: 2.2, contribution: 0.28, category: 'other' },
      { name: '杠杆', exposure: -0.15, activeExposure: -0.07, tStat: -0.8, contribution: -0.06, category: 'other' },
      { name: '非线性市值', exposure: 0.05, activeExposure: 0.01, tStat: 0.3, contribution: 0.02, category: 'size' },
    ],
  },
  // 富国价值优选 → 中盘价值
  {
    code: '159941', name: '富国价值优选', company: '富国基金', strategy: 'value',
    sizeExposure: -0.1, valueExposure: 1.5,
    styleLabel: '中盘价值', styleBox: 'MC-LV',
    factors: [
      { name: '规模', exposure: -0.12, activeExposure: -0.28, tStat: -1.8, contribution: -0.18, category: 'size' },
      { name: 'Beta', exposure: 0.78, activeExposure: -0.12, tStat: 1.5, contribution: 0.36, category: 'other' },
      { name: '动量', exposure: -0.42, activeExposure: -0.32, tStat: -2.8, contribution: -0.28, category: 'momentum' },
      { name: '波动率', exposure: -0.78, activeExposure: -0.52, tStat: -4.5, contribution: -0.64, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.28, activeExposure: 0.55, tStat: 4.8, contribution: 1.18, category: 'quality' },
      { name: '质量(成长)', exposure: -0.28, activeExposure: -0.38, tStat: -2.8, contribution: -0.22, category: 'quality' },
      { name: '价值(BP)', exposure: 1.62, activeExposure: 0.78, tStat: 5.8, contribution: 1.52, category: 'value' },
      { name: '流动性', exposure: 0.62, activeExposure: 0.26, tStat: 2.4, contribution: 0.32, category: 'other' },
      { name: '杠杆', exposure: -0.38, activeExposure: -0.20, tStat: -2.0, contribution: -0.17, category: 'other' },
      { name: '非线性市值', exposure: -0.05, activeExposure: -0.03, tStat: -0.3, contribution: -0.02, category: 'size' },
    ],
  },
  // 大成红利智选 → 大盘红利价值
  {
    code: '159942', name: '大成红利智选', company: '大成基金', strategy: 'dividend',
    sizeExposure: 1.2, valueExposure: 2.0,
    styleLabel: '大盘红利价值', styleBox: 'LG-LV',
    factors: [
      { name: '规模', exposure: 1.18, activeExposure: 0.28, tStat: 3.2, contribution: 1.22, category: 'size' },
      { name: 'Beta', exposure: 0.55, activeExposure: -0.22, tStat: 1.0, contribution: 0.24, category: 'other' },
      { name: '动量', exposure: -0.62, activeExposure: -0.45, tStat: -3.8, contribution: -0.42, category: 'momentum' },
      { name: '波动率', exposure: -1.15, activeExposure: -0.78, tStat: -6.2, contribution: -0.95, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.05, activeExposure: 0.42, tStat: 3.8, contribution: 0.98, category: 'quality' },
      { name: '质量(成长)', exposure: -0.55, activeExposure: -0.42, tStat: -3.5, contribution: -0.38, category: 'quality' },
      { name: '价值(BP)', exposure: 2.05, activeExposure: 0.95, tStat: 6.8, contribution: 1.92, category: 'value' },
      { name: '流动性', exposure: 0.88, activeExposure: 0.38, tStat: 3.2, contribution: 0.45, category: 'other' },
      { name: '杠杆', exposure: -0.52, activeExposure: -0.28, tStat: -2.8, contribution: -0.24, category: 'other' },
      { name: '非线性市值', exposure: 0.12, activeExposure: 0.05, tStat: 0.6, contribution: 0.04, category: 'size' },
    ],
  },
  // 鹏华价值臻选 → 中盘价值
  {
    code: '159943', name: '鹏华价值臻选', company: '鹏华基金', strategy: 'value',
    sizeExposure: -0.2, valueExposure: 1.4,
    styleLabel: '中盘价值', styleBox: 'MC-LV',
    factors: [
      { name: '规模', exposure: -0.22, activeExposure: -0.32, tStat: -2.0, contribution: -0.20, category: 'size' },
      { name: 'Beta', exposure: 0.82, activeExposure: -0.08, tStat: 1.6, contribution: 0.38, category: 'other' },
      { name: '动量', exposure: -0.38, activeExposure: -0.28, tStat: -2.5, contribution: -0.26, category: 'momentum' },
      { name: '波动率', exposure: -0.72, activeExposure: -0.48, tStat: -4.2, contribution: -0.58, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.22, activeExposure: 0.52, tStat: 4.5, contribution: 1.12, category: 'quality' },
      { name: '质量(成长)', exposure: -0.32, activeExposure: -0.38, tStat: -2.8, contribution: -0.25, category: 'quality' },
      { name: '价值(BP)', exposure: 1.52, activeExposure: 0.72, tStat: 5.5, contribution: 1.42, category: 'value' },
      { name: '流动性', exposure: 0.55, activeExposure: 0.22, tStat: 2.2, contribution: 0.28, category: 'other' },
      { name: '杠杆', exposure: -0.35, activeExposure: -0.18, tStat: -1.8, contribution: -0.15, category: 'other' },
      { name: '非线性市值', exposure: -0.08, activeExposure: -0.04, tStat: -0.5, contribution: -0.03, category: 'size' },
    ],
  },
  // 工银瑞信红利 → 大盘红利
  {
    code: '159944', name: '工银瑞信红利', company: '工银瑞信', strategy: 'dividend',
    sizeExposure: 1.3, valueExposure: 1.9,
    styleLabel: '大盘红利', styleBox: 'LG-LV',
    factors: [
      { name: '规模', exposure: 1.28, activeExposure: 0.30, tStat: 3.5, contribution: 1.32, category: 'size' },
      { name: 'Beta', exposure: 0.58, activeExposure: -0.18, tStat: 1.1, contribution: 0.26, category: 'other' },
      { name: '动量', exposure: -0.55, activeExposure: -0.40, tStat: -3.5, contribution: -0.38, category: 'momentum' },
      { name: '波动率', exposure: -1.08, activeExposure: -0.72, tStat: -5.8, contribution: -0.88, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.12, activeExposure: 0.48, tStat: 4.0, contribution: 1.05, category: 'quality' },
      { name: '质量(成长)', exposure: -0.48, activeExposure: -0.38, tStat: -3.2, contribution: -0.33, category: 'quality' },
      { name: '价值(BP)', exposure: 1.98, activeExposure: 0.92, tStat: 6.5, contribution: 1.85, category: 'value' },
      { name: '流动性', exposure: 0.82, activeExposure: 0.35, tStat: 3.0, contribution: 0.42, category: 'other' },
      { name: '杠杆', exposure: -0.48, activeExposure: -0.25, tStat: -2.5, contribution: -0.21, category: 'other' },
      { name: '非线性市值', exposure: 0.10, activeExposure: 0.04, tStat: 0.5, contribution: 0.03, category: 'size' },
    ],
  },
  // 华宝优选稳健 → 核心均衡
  {
    code: '159945', name: '华宝优选稳健', company: '华宝基金', strategy: 'balanced',
    sizeExposure: 0.2, valueExposure: 0.3,
    styleLabel: '核心均衡', styleBox: 'MC-Core',
    factors: [
      { name: '规模', exposure: 0.18, activeExposure: -0.10, tStat: 0.8, contribution: 0.12, category: 'size' },
      { name: 'Beta', exposure: 0.88, activeExposure: -0.02, tStat: 1.6, contribution: 0.44, category: 'other' },
      { name: '动量', exposure: 0.15, activeExposure: 0.05, tStat: 0.8, contribution: 0.10, category: 'momentum' },
      { name: '波动率', exposure: -0.35, activeExposure: -0.22, tStat: -2.2, contribution: -0.26, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.92, activeExposure: 0.36, tStat: 3.6, contribution: 0.85, category: 'quality' },
      { name: '质量(成长)', exposure: 0.32, activeExposure: 0.10, tStat: 1.6, contribution: 0.24, category: 'quality' },
      { name: '价值(BP)', exposure: 0.35, activeExposure: 0.15, tStat: 1.5, contribution: 0.26, category: 'value' },
      { name: '流动性', exposure: 0.38, activeExposure: 0.14, tStat: 1.8, contribution: 0.20, category: 'other' },
      { name: '杠杆', exposure: -0.12, activeExposure: -0.05, tStat: -0.6, contribution: -0.04, category: 'other' },
      { name: '非线性市值', exposure: 0.00, activeExposure: -0.02, tStat: 0.0, contribution: 0.00, category: 'size' },
    ],
  },
  // 国泰鑫汇均衡收益 → 中小盘均衡
  {
    code: '159946', name: '国泰鑫汇均衡收益', company: '国泰基金', strategy: 'balanced',
    sizeExposure: -0.5, valueExposure: 0.15,
    styleLabel: '中小盘均衡', styleBox: 'SC-Core',
    factors: [
      { name: '规模', exposure: -0.52, activeExposure: -0.48, tStat: -3.5, contribution: -0.35, category: 'size' },
      { name: 'Beta', exposure: 1.05, activeExposure: 0.12, tStat: 2.0, contribution: 0.53, category: 'other' },
      { name: '动量', exposure: 0.28, activeExposure: 0.15, tStat: 1.8, contribution: 0.22, category: 'momentum' },
      { name: '波动率', exposure: -0.18, activeExposure: -0.10, tStat: -1.1, contribution: -0.12, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.85, activeExposure: 0.32, tStat: 3.2, contribution: 0.78, category: 'quality' },
      { name: '质量(成长)', exposure: 0.48, activeExposure: 0.20, tStat: 2.4, contribution: 0.36, category: 'quality' },
      { name: '价值(BP)', exposure: 0.22, activeExposure: 0.08, tStat: 1.0, contribution: 0.16, category: 'value' },
      { name: '流动性', exposure: -0.08, activeExposure: -0.05, tStat: -0.5, contribution: -0.04, category: 'other' },
      { name: '杠杆', exposure: 0.05, activeExposure: 0.02, tStat: 0.3, contribution: 0.02, category: 'other' },
      { name: '非线性市值', exposure: -0.18, activeExposure: -0.10, tStat: -1.2, contribution: -0.08, category: 'size' },
    ],
  },
  // 天弘均衡优选 → 中盘均衡
  {
    code: '159947', name: '天弘均衡优选', company: '天弘基金', strategy: 'balanced',
    sizeExposure: -0.3, valueExposure: 0.2,
    styleLabel: '中盘均衡', styleBox: 'MC-Core',
    factors: [
      { name: '规模', exposure: -0.32, activeExposure: -0.35, tStat: -2.2, contribution: -0.24, category: 'size' },
      { name: 'Beta', exposure: 0.98, activeExposure: 0.08, tStat: 1.8, contribution: 0.49, category: 'other' },
      { name: '动量', exposure: 0.22, activeExposure: 0.10, tStat: 1.4, contribution: 0.16, category: 'momentum' },
      { name: '波动率', exposure: -0.22, activeExposure: -0.14, tStat: -1.4, contribution: -0.15, category: 'volatility' },
      { name: '质量(盈利)', exposure: 1.05, activeExposure: 0.42, tStat: 4.0, contribution: 0.97, category: 'quality' },
      { name: '质量(成长)', exposure: 0.45, activeExposure: 0.18, tStat: 2.4, contribution: 0.33, category: 'quality' },
      { name: '价值(BP)', exposure: 0.28, activeExposure: 0.12, tStat: 1.3, contribution: 0.21, category: 'value' },
      { name: '流动性', exposure: 0.18, activeExposure: 0.05, tStat: 0.8, contribution: 0.10, category: 'other' },
      { name: '杠杆', exposure: -0.08, activeExposure: -0.03, tStat: -0.4, contribution: -0.03, category: 'other' },
      { name: '非线性市值', exposure: -0.10, activeExposure: -0.05, tStat: -0.6, contribution: -0.04, category: 'size' },
    ],
  },
  // 建信竞争优势 → 动量成长
  {
    code: '159948', name: '建信竞争优势', company: '建信基金', strategy: 'momentum',
    sizeExposure: 0.0, valueExposure: -1.3,
    styleLabel: '动量成长', styleBox: 'MC-CG',
    factors: [
      { name: '规模', exposure: -0.02, activeExposure: -0.22, tStat: -0.2, contribution: -0.02, category: 'size' },
      { name: 'Beta', exposure: 1.28, activeExposure: 0.35, tStat: 4.2, contribution: 0.66, category: 'other' },
      { name: '动量', exposure: 1.35, activeExposure: 0.78, tStat: 6.2, contribution: 1.12, category: 'momentum' },
      { name: '波动率', exposure: 0.68, activeExposure: 0.45, tStat: 3.5, contribution: 0.52, category: 'volatility' },
      { name: '质量(盈利)', exposure: 0.52, activeExposure: 0.18, tStat: 1.8, contribution: 0.35, category: 'quality' },
      { name: '质量(成长)', exposure: 1.25, activeExposure: 0.68, tStat: 5.2, contribution: 0.98, category: 'quality' },
      { name: '价值(BP)', exposure: -1.35, activeExposure: -0.78, tStat: -5.5, contribution: -1.18, category: 'value' },
      { name: '流动性', exposure: -0.18, activeExposure: -0.12, tStat: -1.2, contribution: -0.12, category: 'other' },
      { name: '杠杆', exposure: 0.45, activeExposure: 0.24, tStat: 2.5, contribution: 0.26, category: 'other' },
      { name: '非线性市值', exposure: -0.05, activeExposure: -0.02, tStat: -0.3, contribution: -0.01, category: 'size' },
    ],
  },
]

// ============================================
// 主组件
// ============================================

const StyleAnalysis: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('510520')
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const currentProduct = useMemo(
    () => stylePositions.find(p => p.code === selectedProduct) || stylePositions[0],
    [selectedProduct]
  )

  // ============================================
  // 9宫格风格箱配置
  // ============================================
  const styleBoxOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: 'Morningstar风格箱 (Style Box)',
      subtext: '横轴：价值↔成长 | 纵轴：小盘↔大盘',
      left: 'center',
      textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 600 },
      subtextStyle: { color: 'rgba(255,255,255,0.45)', fontSize: 11 },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        const d = params.data
        return `
          <div style="padding: 8px; min-width: 180px;">
            <strong>${d.name}</strong><br/>
            <span style="color: #1677ff">${d.company}</span><br/>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 6px 0;"/>
            风格定位：<strong>${d.styleLabel}</strong><br/>
            规模暴露：${d.sizeExposure.toFixed(2)}<br/>
            价值暴露：${d.valueExposure.toFixed(2)}
          </div>
        `
      },
    },
    grid: { left: 80, right: 40, top: 80, bottom: 60 },
    xAxis: {
      type: 'value' as const,
      min: -3, max: 3,
      name: '价值 ← → 成长',
      nameLocation: 'center' as const,
      nameTextStyle: { color: 'rgba(255,255,255,0.65)' },
      axisLabel: { color: 'rgba(255,255,255,0.45)', formatter: (v: number) => ({ '-3': '深度成长', '-1.5': '成长', '0': '', '1.5': '价值', '3': '深度价值' }[String(v)] || '') },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.15)', type: 'dashed' as const } },
    },
    yAxis: {
      type: 'value' as const,
      min: -3, max: 3,
      name: '小盘 ↑ ↓ 大盘',
      nameLocation: 'center' as const,
      nameTextStyle: { color: 'rgba(255,255,255,0.65)' },
      nameGap: 30,
      axisLabel: { color: 'rgba(255,255,255,0.45)', formatter: (v: number) => ({ '-3': '小盘', '-1.5': '中盘', '0': '', '1.5': '大盘', '3': '超大盘' }[String(v)] || '') },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.15)', type: 'dashed' as const } },
    },
    series: [{
      type: 'scatter' as const,
      data: stylePositions.map(d => ({
        name: d.name,
        value: [d.valueExposure, d.sizeExposure],
        company: d.company,
        styleLabel: d.styleLabel,
        sizeExposure: d.sizeExposure,
        valueExposure: d.valueExposure,
        symbolSize: currentProduct?.code === d.code ? 18 : 12,
        itemStyle: {
          color: currentProduct?.code === d.code ? '#faad14' : new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
            { offset: 0, color: '#1677ff' },
            { offset: 1, color: '#0958d9' },
          ]),
          shadowBlur: currentProduct?.code === d.code ? 15 : 5,
          shadowColor: currentProduct?.code === d.code ? 'rgba(250,173,20,0.5)' : 'rgba(0,0,0,0.3)',
          borderColor: currentProduct?.code === d.code ? '#faad14' : 'transparent',
          borderWidth: currentProduct?.code === d.code ? 2 : 0,
        },
      })),
      label: {
        show: true,
        position: 'top' as const,
        formatter: '{b}',
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: currentProduct ? (params: any) => params.data.name === currentProduct.name ? 'bold' : 'normal' : 'normal',
      },
      emphasis: { focus: 'self' as const },
    }],
    markLine: {
      silent: true,
      symbol: 'none',
      data: [
        { xAxis: -1.5, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'solid' as const } },
        { xAxis: 1.5, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'solid' as const } },
        { yAxis: -1.5, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'solid' as const } },
        { yAxis: 1.5, lineStyle: { color: 'rgba(255,255,255,0.2)', type: 'solid' as const } },
      ],
    },
  }), [currentProduct])

  // ============================================
  // 因子暴露热力图配置
  // ============================================
  const factorHeatmapOption = useMemo(() => {
    if (!currentProduct) return {}

    const factors = currentProduct.factors
    const maxAbsValue = Math.max(...factors.map(f => Math.abs(f.exposure)))

    return {
      backgroundColor: 'transparent',
      title: {
        text: `${currentProduct.name} - Barra因子暴露矩阵`,
        left: 'center',
        textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
      },
      tooltip: {
        position: 'top' as const,
        formatter: (params: any) => {
          const f = factors.find((_, i) => i === params.data[1])
          return f ? `
            <strong>${f.name}</strong><br/>
            暴露值：<b>${f.exposure.toFixed(2)}</b><br/>
            主动暴露：<b style="color:${f.activeExposure >= 0 ? '#f5222d' : '#52c41a'}">${f.activeExposure >= 0 ? '+' : ''}${f.activeExposure.toFixed(2)}</b><br/>
            t统计量：<b>${f.tStat.toFixed(2)}</b><br/>
            收益贡献：<b style="color:${f.contribution >= 0 ? '#f5222d' : '#52c41a'}">${f.contribution >= 0 ? '+' : ''}${f.contribution.toFixed(2)}%</b>
          ` : ''
        },
      },
      grid: { left: 120, right: 120, top: 60, bottom: 80 },
      xAxis: {
        type: 'category' as const,
        data: ['总暴露', '主动暴露', 't统计量', '收益贡献%'],
        axisLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, interval: 0 },
        splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      },
      yAxis: {
        type: 'category' as const,
        data: factors.map(f => f.name),
        axisLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
        splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      },
      visualMap: {
        min: -maxAbsValue,
        max: maxAbsValue,
        calculable: true,
        orient: 'horizontal' as const,
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['#52c41a', '#fafafa', '#f5222d'],
        },
        textStyle: { color: 'rgba(255,255,255,0.55)' },
      },
      series: [{
        type: 'heatmap' as const,
        data: factors.flatMap((f, fi) => [
          [0, fi, f.exposure],
          [1, fi, f.activeExposure],
          [2, fi, f.tStat],
          [3, fi, f.contribution],
        ]),
        label: { show: true, formatter: (p: any) => p.value?.toFixed(1), color: '#fff', fontSize: 10 },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
        },
        itemStyle: {
          borderRadius: 3,
          borderColor: 'rgba(0,0,0,0.2)',
          borderWidth: 1,
        },
      }],
    }
  }, [currentProduct])

  // ============================================
  // 风格漂移时间线配置
  // ============================================
  const driftTimelineOption = useMemo(() => {
    if (!currentProduct) return {}

    // 生成模拟的12个月风格漂移数据
    const months = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
    }

    let baseSize = currentProduct.sizeExposure
    let baseValue = currentProduct.valueExposure
    let baseMomentum = currentProduct.factors.find(f => f.name === '动量')?.exposure || 0
    let baseQuality = currentProduct.factors.find(f => f.name === '质量(盈利)')?.exposure || 0

    const sizeData = months.map((m, i) => {
      baseSize += (Math.random() - 0.5) * 0.3
      return [m, parseFloat(baseSize.toFixed(2))]
    })
    const valueData = months.map((m, i) => {
      baseValue += (Math.random() - 0.5) * 0.3
      return [m, parseFloat(baseValue.toFixed(2))]
    })

    return {
      backgroundColor: 'transparent',
      title: {
        text: `${currentProduct.name} - 风格漂移监测`,
        left: 'center',
        textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
      },
      tooltip: { trigger: 'axis' as const },
      legend: {
        data: ['规模暴露', '价值暴露'],
        bottom: 10,
        textStyle: { color: 'rgba(255,255,255,0.55)' },
      },
      grid: { left: 60, right: 60, top: 50, bottom: 50 },
      xAxis: {
        type: 'category' as const,
        data: months,
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, rotate: 30 },
      },
      yAxis: {
        type: 'value' as const,
        min: -3, max: 3,
        axisLabel: { color: 'rgba(255,255,255,0.45)' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      series: [
        {
          name: '规模暴露',
          type: 'line' as const,
          data: sizeData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2.5, color: '#1677ff' },
          itemStyle: { color: '#1677ff' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(22,119,255,0.25)' }, { offset: 1, color: 'rgba(22,119,255,0.02)' }]) },
          markLine: {
            silent: true,
            data: [{ yAxis: currentProduct.sizeExposure, label: { formatter: '当前值', color: 'rgba(255,255,255,0.45)' }, lineStyle: { color: '#1677ff', type: 'dashed' } }],
          },
        },
        {
          name: '价值暴露',
          type: 'line' as const,
          data: valueData,
          smooth: true,
          symbol: 'diamond',
          symbolSize: 6,
          lineStyle: { width: 2.5, color: '#eb2f96' },
          itemStyle: { color: '#eb2f96' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(235,47,150,0.25)' }, { offset: 1, color: 'rgba(235,47,150,0.02)' }]) },
          markLine: {
            silent: true,
            data: [{ yAxis: currentProduct.valueExposure, label: { formatter: '当前值', color: 'rgba(255,255,255,0.45)' }, lineStyle: { color: '#eb2f96', type: 'dashed' } }],
          },
        },
      ],
    }
  }, [currentProduct])

  // ============================================
  // 因子贡献柱状图
  // ============================================
  const factorContributionOption = useMemo(() => {
    if (!currentProduct) return {}

    const sortedFactors = [...currentProduct.factors].sort((a, b) => b.contribution - a.contribution)

    return {
      backgroundColor: 'transparent',
      title: {
        text: `因子收益贡献归因 (${currentProduct.name})`,
        left: 'center',
        textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
      },
      tooltip: { trigger: 'axis' as const, axisPointer: { type: 'shadow' as const } },
      grid: { left: 140, right: 40, top: 50, bottom: 30 },
      xAxis: {
        type: 'value' as const,
        axisLabel: { color: 'rgba(255,255,255,0.45)', formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      yAxis: {
        type: 'category' as const,
        data: sortedFactors.map(f => f.name),
        inverse: true,
        axisLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
      },
      series: [{
        type: 'bar' as const,
        data: sortedFactors.map(f => ({
          value: f.contribution,
          itemStyle: {
            color: f.contribution >= 0
              ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#cf1322' }, { offset: 1, color: '#ff4d4f' }])
              : new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#389e0d' }, { offset: 1, color: '#73d13d' }]),
            borderRadius: [0, 3, 3, 0],
          },
        })),
        barWidth: '60%',
        label: { show: true, position: 'right' as const, formatter: '{c}%', color: 'rgba(255,255,255,0.7)', fontSize: 11 },
        backgroundStyle: { color: 'rgba(255,255,255,0.03)', borderRadius: 3 },
      }],
    }
  }, [currentProduct])

  return (
    <div className="animate-fadeInUp">
      {/* 头部 */}
      <Card className="dashboard-card" styles={{ body: { padding: '16px 20px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <RadarChartOutlined style={{ marginRight: 8 }} />
            ETF投资风格专业分析
          </Title>

          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>选择产品：</Text>
            <Select
              value={selectedProduct}
              onChange={setSelectedProduct}
              size="small"
              style={{ width: 220 }}
              showSearch
              optionFilterProp="label"
              options={stylePositions.map(p => ({
                value: p.code,
                label: `${p.name} (${p.company})`,
              }))}
            />
          </Space>
        </div>

        {/* 当前产品概览 */}
        {currentProduct && (
          <Row gutter={[16, 8]} style={{ marginTop: 12 }}>
            <Col>
              <Tag color="blue" style={{ fontSize: 13, padding: '2px 12px' }}>{currentProduct.styleLabel}</Tag>
            </Col>
            <Col>
              <Text type="secondary">规模暴露：</Text>
              <Text strong style={{ color: currentProduct.sizeExposure > 0 ? '#1677ff' : '#eb2f96' }}>
                {currentProduct.sizeExposure > 0 ? '偏大盘' : '偏小盘'} ({currentProduct.sizeExposure.toFixed(2)})
              </Text>
            </Col>
            <Col>
              <Text type="secondary">价值暴露：</Text>
              <Text strong style={{ color: currentProduct.valueExposure > 0 ? '#52c41a' : '#f5222d' }}>
                {currentProduct.valueExposure > 0 ? '偏价值' : '偏成长'} ({currentProduct.valueExposure.toFixed(2)})
              </Text>
            </Col>
            <Col>
              <Text type="secondary">投资策略：</Text>
              <Tag>{strategyNames[currentProduct.strategy]}</Tag>
            </Col>
          </Row>
        )}
      </Card>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 9宫格风格箱 */}
        <Col xs={24} lg={12}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={styleBoxOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 450, width: '100%' }}
            />
          </Card>
        </Col>

        {/* 因子暴露热力图 */}
        <Col xs={24} lg={12}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={factorHeatmapOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 450, width: '100%' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 风格漂移监测 */}
        <Col xs={24} lg={14}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={driftTimelineOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 350, width: '100%' }}
            />
          </Card>
        </Col>

        {/* 因子贡献归因 */}
        <Col xs={24} lg={10}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore
              echarts={echarts}
              option={factorContributionOption}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 350, width: '100%' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 因子详细表格 */}
      {currentProduct && (
        <Card className="dashboard-card" style={{ marginTop: 16 }} styles={{ body: { padding: 16 } }}>
          <div>
            <Title level={5}>
              <RadarChartOutlined style={{ marginRight: 8 }} />
              {currentProduct.name} - 完整因子暴露明细
            </Title>
          <Table
            dataSource={currentProduct.factors.map((f, i) => ({
              ...f,
              key: i,
              significance: Math.abs(f.tStat) > 2 ? '显著' : Math.abs(f.tStat) > 1.5 ? '边际显著' : '不显著',
            }))}
            columns={[
              { title: '因子名称', dataIndex: 'name', key: 'name', width: 120 },
              {
                title: '总暴露',
                dataIndex: 'exposure',
                key: 'exposure',
                width: 90,
                render: (v: number) => <span style={{ fontWeight: 600 }}>{v.toFixed(2)}</span>,
              },
              {
                title: '主动暴露',
                dataIndex: 'activeExposure',
                key: 'activeExposure',
                width: 100,
                render: (v: number) => (
                  <span style={{ color: v > 0 ? '#f5222d' : v < 0 ? '#52c41a' : undefined, fontWeight: 600 }}>
                    {v > 0 ? '+' : ''}{v.toFixed(2)}
                  </span>
                ),
              },
              {
                title: 't统计量',
                dataIndex: 'tStat',
                key: 'tStat',
                width: 90,
                render: (v: number) => (
                  <span style={{
                    color: Math.abs(v) > 2 ? '#52c41a' : Math.abs(v) > 1.5 ? '#faad14' : 'rgba(255,255,255,0.45)',
                    fontWeight: 600,
                  }}>
                    {v.toFixed(2)}
                  </span>
                ),
              },
              {
                title: '显著性',
                dataIndex: 'significance',
                key: 'significance',
                width: 90,
                render: (v: string) => {
                  const colors: Record<string, string> = { '显著': 'green', '边际显著': 'orange', '不显著': 'default' }
                  return <Tag color={colors[v]}>{v}</Tag>
                },
              },
              {
                title: '收益贡献%',
                dataIndex: 'contribution',
                key: 'contribution',
                width: 110,
                render: (v: number) => (
                  <span style={{ color: v >= 0 ? '#f5222d' : '#52c41a', fontWeight: 700, fontSize: 14 }}>
                    {v >= 0 ? '+' : ''}{v.toFixed(2)}
                  </span>
                ),
              },
              { title: '因子类别', dataIndex: 'category', key: 'category', width: 100 },
            ]}
            size="small"
            pagination={false}
          />
          </div>
        </Card>
      )}
    </div>
  )
}

export default StyleAnalysis
