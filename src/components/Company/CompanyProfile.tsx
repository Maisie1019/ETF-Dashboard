/**
 * 基金公司管理规模与画像分析模块
 * ============================================
 * 18家试点基金公司深度画像：
 * - 管理规模梯队分布
 * - 费率结构对比
 * - 主动权益能力评分
 * - 渠道优势与资源禀赋
 * - ETF运营经验评估
 * 对标Morningstar Fund Analyst / Wind金融终端
 */

import React, { useState, useMemo } from 'react'
import {
  Card,
  Typography,
  Row,
  Col,
  Table,
  Tag,
  Progress,
  Space,
  Statistic,
  Tooltip,
  Select,
} from 'antd'
import {
  BankOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { etfProducts } from '../../data/mockData'

echarts.use([
  BarChart, PieChart, RadarChart, ScatterChart,
  GridComponent, TooltipComponent, LegendComponent,
  VisualMapComponent, CanvasRenderer,
])

const { Title, Text } = Typography

// ============================================
// 类型定义
// ============================================

interface CompanyProfile {
  name: string
  fullName: string
  type: string
  typeLabel: string
  typeColor: string

  // 规模数据（截至2024Q2，单位：亿元）
  totalAUM: number           // 总管理规模
  equityAUM: number          // 权益类规模
  activeEquityAUM: number    // 主动权益规模
  etfAUM: number             // ETF规模
  ranking: number            // 行业排名

  // 费率结构
  avgManagementFee: number   // 平均管理费率
  avgCustodyFee: number      // 平均托管费率
  feeCompetitiveness: string // 费率竞争力评级

  // 能力评分（1-10分）
  researchScore: number      // 研究能力
  riskControlScore: number   // 风控能力
  etfOperationScore: number  // ETF运营能力
  channelScore: number       // 渠道能力
  innovationScore: number    // 创新能力
  overallScore: number       // 综合评分

  // 特色标签
  tags: string[]

  // 核心优势描述
  strengths: string[]

  // 旗下主动ETF产品数
  etfProductCount: number
  productCodes: string[]
}

// ============================================
// 18家公司完整画像数据
// ============================================

const companyProfiles: CompanyProfile[] = [
  {
    name: '易方达基金',
    fullName: '易方达基金管理有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 26800, equityAUM: 8500, activeEquityAUM: 4200, etfAUM: 3800, ranking: 1,
    avgManagementFee: 1.02, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 9.8, riskControlScore: 9.5, etfOperationScore: 9.7, channelScore: 9.6, innovationScore: 9.5, overallScore: 9.62,
    tags: ['综合资管巨头', '长期业绩优异', 'ETF规模第一'],
    strengths: ['全品类产品线覆盖', '顶尖投研团队', '强大的零售渠道', '科技赋能投资'],
    etfProductCount: 1, productCodes: ['510520'],
  },
  {
    name: '华夏基金',
    fullName: '华夏基金管理有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 21500, equityAUM: 7200, activeEquityAUM: 3800, etfAUM: 3200, ranking: 2,
    avgManagementFee: 0.98, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 9.6, riskControlScore: 9.4, etfOperationScore: 9.5, channelScore: 9.4, innovationScore: 9.3, overallScore: 9.44,
    tags: ['老牌劲旅', '指数投资专家', '权益实力强劲'],
    strengths: ['深厚的主动权益底蕴', '完善的指数产品线', '机构客户资源丰富'],
    etfProductCount: 1, productCodes: ['510521'],
  },
  {
    name: '南方基金',
    fullName: '南方基金管理股份有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 18500, equityAUM: 6200, activeEquityAUM: 3100, etfAUM: 2600, ranking: 3,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 9.2, riskControlScore: 9.1, etfOperationScore: 9.0, channelScore: 9.2, innovationScore: 8.8, overallScore: 9.06,
    tags: ['稳健经营', '资产配置能力强', '科技投入大'],
    strengths: ['均衡的投资风格', '较强的固收+能力', '持续的产品创新'],
    etfProductCount: 1, productCodes: ['159940'],
  },
  {
    name: '富国基金',
    fullName: '富国基金管理有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 16800, equityAUM: 6800, activeEquityAUM: 3600, etfAUM: 1800, ranking: 4,
    avgManagementFee: 0.97, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 9.4, riskControlScore: 9.2, etfOperationScore: 8.5, channelScore: 9.0, innovationScore: 9.0, overallScore: 9.02,
    tags: ['主动权益强', '量化投资领先', '行业主题专家'],
    strengths: ['出色的主动管理能力', '成熟的量化平台', '深度行业研究'],
    etfProductCount: 1, productCodes: ['159941'],
  },
  {
    name: '汇添富基金',
    fullName: '汇添富基金管理股份有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 15200, equityAUM: 5800, activeEquityAUM: 3200, etfAUM: 1200, ranking: 5,
    avgManagementFee: 1.02, avgCustodyFee: 0.15, feeCompetitiveness: 'A-',
    researchScore: 9.0, riskControlScore: 8.9, etfOperationScore: 8.2, channelScore: 9.5, innovationScore: 8.7, overallScore: 8.86,
    tags: ['消费投资见长', '互联网营销强', '均衡配置专家'],
    strengths: ['消费/医药领域深耕', '优秀的电商渠道运营', '明星基金经理效应'],
    etfProductCount: 1, productCodes: ['510525'],
  },
  {
    name: '国泰基金',
    fullName: '国泰基金管理有限公司',
    type: 'top_tier_head', typeLabel: '头部公募', typeColor: '#1677ff',
    totalAUM: 12800, equityAUM: 4800, activeEquityAUM: 2500, etfAUM: 1500, ranking: 8,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 8.7, riskControlScore: 8.8, etfOperationScore: 8.8, channelScore: 8.5, innovationScore: 8.5, overallScore: 8.66,
    tags: ['老牌公募', '固收+特色', 'ETF运营成熟'],
    strengths: ['丰富的产品运作经验', '稳健的风控体系', '良好的持有人体验'],
    etfProductCount: 1, productCodes: ['159946'],
  },
  {
    name: '华泰柏瑞',
    fullName: '华泰柏瑞基金管理有限公司',
    type: 'etf_specialist', typeLabel: 'ETF特色', typeColor: '#722ed1',
    totalAUM: 5200, equityAUM: 2800, activeEquityAUM: 1200, etfAUM: 3500, ranking: 15,
    avgManagementFee: 0.96, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 8.2, riskControlScore: 8.5, etfOperationScore: 9.8, channelScore: 7.8, innovationScore: 9.0, overallScore: 8.66,
    tags: ['沪深300ETF霸主', '宽基ETF专家', '流动性服务商'],
    strengths: ['旗舰ETF产品规模领先', '专业的做市商网络', '高效的ETF运营体系'],
    etfProductCount: 1, productCodes: ['510524'],
  },
  {
    name: '华宝基金',
    fullName: '华宝基金管理有限公司',
    type: 'etf_specialist', typeLabel: 'ETF特色', typeColor: '#722ed1',
    totalAUM: 4800, equityAUM: 2200, activeEquityAUM: 1000, etfAUM: 2200, ranking: 18,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 8.0, riskControlScore: 8.3, etfOperationScore: 9.2, channelScore: 7.5, innovationScore: 8.8, overallScore: 8.36,
    tags: ['行业ETF专家', 'Smart Beta先行者', '跨境ETF丰富'],
    strengths: ['细分赛道ETF布局完善', '创新的因子策略产品', '较好的流动性管理'],
    etfProductCount: 1, productCodes: ['159945'],
  },
  {
    name: '永赢基金',
    fullName: '永赢基金管理有限公司',
    type: 'top_tier_medium', typeLabel: '中型公募', typeColor: '#13c2c2',
    totalAUM: 4200, equityAUM: 1800, activeEquityAUM: 1100, etfAUM: 800, ranking: 22,
    avgManagementFee: 1.02, avgCustodyFee: 0.15, feeCompetitiveness: 'B+',
    researchScore: 8.3, riskControlScore: 8.4, etfOperationScore: 8.6, channelScore: 8.8, innovationScore: 8.9, overallScore: 8.60,
    tags: ['银行系背景', '成长迅速', '双基金经理制'],
    strengths: ['宁波银行股东支持', '灵活的决策机制', '主动+ETF融合创新'],
    etfProductCount: 1, productCodes: ['510522'],
  },
  {
    name: '摩根基金',
    fullName: '摩根资产管理(中国)有限公司',
    type: 'foreign_joint_venture', typeLabel: '外资合资', typeColor: '#eb2f96',
    totalAUM: 3800, equityAUM: 1500, activeEquityAUM: 900, etfAUM: 600, ranking: 25,
    avgManagementFee: 1.07, avgCustodyFee: 0.15, feeCompetitiveness: 'B',
    researchScore: 9.0, riskControlScore: 9.2, etfOperationScore: 8.4, channelScore: 7.8, innovationScore: 9.2, overallScore: 8.72,
    tags: ['国际视野', '全球研究资源', '唯一外资试点'],
    strengths: ['J.P. Morgan全球投研支持', '成熟的海外主动ETF经验', '国际化人才团队'],
    etfProductCount: 1, productCodes: ['510523'],
  },
  {
    name: '华安基金',
    fullName: '华安基金管理有限公司',
    type: 'top_tier_medium', typeLabel: '中型公募', typeColor: '#13c2c2',
    totalAUM: 6500, equityAUM: 2800, activeEquityAUM: 1500, etfAUM: 1400, ranking: 12,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 8.5, riskControlScore: 8.6, etfOperationScore: 8.5, channelScore: 8.2, innovationScore: 8.4, overallScore: 8.44,
    tags: ['老牌基金公司', '指数投资先驱', '创新意识强'],
    strengths: ['国内首只开放式基金管理人', '丰富的产品创新经验', '完善的风控流程'],
    etfProductCount: 1, productCodes: ['510526'],
  },
  {
    name: '招商基金',
    fullName: '招商基金管理有限公司',
    type: 'bank_affiliated', typeLabel: '银行系', typeColor: '#52c41a',
    totalAUM: 9800, equityAUM: 3800, activeEquityAUM: 1900, etfAUM: 1600, ranking: 9,
    avgManagementFee: 0.97, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 8.6, riskControlScore: 8.9, etfOperationScore: 8.4, channelScore: 9.6, innovationScore: 8.3, overallScore: 8.76,
    tags: ['招行渠道优势', '银行系风控严谨', '固收+能力强'],
    strengths: ['招商银行强大渠道', '严格的风险管理体系', '机构客户资源优质'],
    etfProductCount: 1, productCodes: ['510527'],
  },
  {
    name: '平安基金',
    fullName: '平安基金管理有限公司',
    type: 'insurance_affiliated', typeLabel: '保险系', typeColor: '#fa8c16',
    totalAUM: 7200, equityAUM: 3000, activeEquityAUM: 1600, etfAUM: 1200, ranking: 11,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 8.4, riskControlScore: 9.0, etfOperationScore: 8.3, channelScore: 8.8, innovationScore: 8.6, overallScore: 8.62,
    tags: ['保险资金管理经验', '科技赋能', 'FOF/MOM特色'],
    strengths: ['平安集团生态协同', '险资运作出身', '大数据投研应用'],
    etfProductCount: 1, productCodes: ['510528'],
  },
  {
    name: '大成基金',
    fullName: '大成基金管理有限公司',
    type: 'top_tier_medium', typeLabel: '中型公募', typeColor: '#13c2c2',
    totalAUM: 5500, equityAUM: 2400, activeEquityAUM: 1300, etfAUM: 700, ranking: 14,
    avgManagementFee: 0.92, avgCustodyFee: 0.15, feeCompetitiveness: 'A++',
    researchScore: 8.3, riskControlScore: 8.5, etfOperationScore: 8.0, channelScore: 8.0, innovationScore: 8.2, overallScore: 8.40,
    tags: ['费率优势明显', '红利策略专长', '价值投资传统'],
    strengths: ['具有竞争力的费率水平', '深度的价值挖掘能力', '长期稳健的业绩记录'],
    etfProductCount: 1, productCodes: ['159942'],
  },
  {
    name: '鹏华基金',
    fullName: '鹏华基金管理有限公司',
    type: 'top_tier_medium', typeLabel: '中型公募', typeColor: '#13c2c2',
    totalAUM: 6200, equityAUM: 2600, activeEquityAUM: 1400, etfAUM: 900, ranking: 13,
    avgManagementFee: 0.97, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 8.4, riskControlScore: 8.5, etfOperationScore: 8.2, channelScore: 8.3, innovationScore: 8.4, overallScore: 8.36,
    tags: ['基本面投资专家', '研究驱动', '稳中求进'],
    strengths: ['扎实的基本面研究', '均衡的投资风格', '良好的风险调整收益'],
    etfProductCount: 1, productCodes: ['159943'],
  },
  {
    name: '工银瑞信',
    fullName: '工银瑞信基金管理有限公司',
    type: 'bank_affiliated', typeLabel: '银行系', typeColor: '#52c41a',
    totalAUM: 8200, equityAUM: 3400, activeEquityAUM: 1700, etfAUM: 1800, ranking: 10,
    avgManagementFee: 0.92, avgCustodyFee: 0.15, feeCompetitiveness: 'A++',
    researchScore: 8.7, riskControlScore: 9.1, etfOperationScore: 8.6, channelScore: 9.4, innovationScore: 8.5, overallScore: 8.86,
    tags: ['工行渠道王牌', '银行系风控标杆', '红利策略深耕'],
    strengths: ['工商银行强力渠道支持', '系统化的风险管理', '极具竞争力的费率'],
    etfProductCount: 1, productCodes: ['159944'],
  },
  {
    name: '天弘基金',
    fullName: '天弘基金管理有限公司',
    type: 'top_tier_medium', typeLabel: '中型公募', typeColor: '#13c2c2',
    totalAUM: 11500, equityAUM: 3200, activeEquityAUM: 1500, etfAUM: 800, ranking: 7,
    avgManagementFee: 1.0, avgCustodyFee: 0.15, feeCompetitiveness: 'A',
    researchScore: 8.2, riskControlScore: 8.4, etfOperationScore: 8.0, channelScore: 9.8, innovationScore: 8.8, overallScore: 8.64,
    tags: ['互联网基因', '蚂蚁生态', '零售之王'],
    strengths: ['支付宝/蚂蚁财富流量入口', '极强的互联网运营能力', '普惠金融理念'],
    etfProductCount: 1, productCodes: ['159947'],
  },
  {
    name: '建信基金',
    fullName: '建信基金管理有限责任公司',
    type: 'bank_affiliated', typeLabel: '银行系', typeColor: '#52c41a',
    totalAUM: 6800, equityAUM: 2800, activeEquityAUM: 1300, etfAUM: 1000, ranking: 12,
    avgManagementFee: 0.97, avgCustodyFee: 0.15, feeCompetitiveness: 'A+',
    researchScore: 8.3, riskControlScore: 8.7, etfOperationScore: 8.2, channelScore: 9.2, innovationScore: 8.3, overallScore: 8.54,
    tags: ['建行渠道支持', '动量策略探索', '量化能力提升'],
    strengths: ['建设银行渠道优势', '逐步增强的量化能力', '稳健的经营风格'],
    etfProductCount: 1, productCodes: ['159948'],
  },
]

// ============================================
// 主组件
// ============================================

const CompanyProfileAnalysis: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'detail' | 'radar'>('overview')
  const [sortBy, setSortBy] = useState<string>('overallScore')

  // 排序后的数据
  const sortedData = useMemo(() => {
    return [...companyProfiles].sort((a, b) => (b as any)[sortBy] - (a as any)[sortBy])
  }, [sortBy])

  // 梯队统计
  const tierStats = useMemo(() => ({
    top_tier_head: companyProfiles.filter(c => c.type === 'top_tier_head'),
    top_tier_medium: companyProfiles.filter(c => c.type === 'top_tier_medium'),
    foreign_joint_venture: companyProfiles.filter(c => c.type === 'foreign_joint_venture'),
    bank_affiliated: companyProfiles.filter(c => c.type === 'bank_affiliated'),
    insurance_affiliated: companyProfiles.filter(c => c.type === 'insurance_affiliated'),
    etf_specialist: companyProfiles.filter(c => c.type === 'etf_specialist'),
  }), [])

  // 规模分布饼图配置
  const aumPieOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '管理规模梯队分布',
      left: 'center',
      textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c}亿 ({d}%)',
    },
    legend: {
      bottom: 10,
      textStyle: { color: 'rgba(255,255,255,0.55)', fontSize: 11 },
    },
    series: [{
      type: 'pie' as const,
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: 'rgba(0,0,0,0.3)', borderWidth: 2 },
      label: {
        show: true,
        formatter: '{b}\n{c}亿',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 11,
      },
      data: [
        { value: tierStats.top_tier_head.reduce((s, c) => s + c.totalAUM, 0), name: '头部公募', itemStyle: { color: '#1677ff' } },
        { value: tierStats.top_tier_medium.reduce((s, c) => s + c.totalAUM, 0), name: '中型公募', itemStyle: { color: '#13c2c2' } },
        { value: tierStats.bank_affiliated.reduce((s, c) => s + c.totalAUM, 0), name: '银行系', itemStyle: { color: '#52c41a' } },
        { value: tierStats.foreign_joint_venture.reduce((s, c) => s + c.totalAUM, 0), name: '外资合资', itemStyle: { color: '#eb2f96' } },
        { value: tierStats.insurance_affiliated.reduce((s, c) => s + c.totalAUM, 0), name: '保险系', itemStyle: { color: '#fa8c16' } },
        { value: tierStats.etf_specialist.reduce((s, c) => s + c.totalAUM, 0), name: 'ETF特色', itemStyle: { color: '#722ed1' } },
      ],
    }],
  }), [])

  // 综合评分雷达图（Top 6）
  const radarOption = useMemo(() => {
    const top6 = sortedData.slice(0, 6)
    return {
      backgroundColor: 'transparent',
      title: {
        text: 'Top 6 公司能力雷达图',
        left: 'center',
        textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
      },
      tooltip: {},
      legend: {
        data: top6.map(c => c.name),
        bottom: 10,
        textStyle: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8,
      },
      radar: {
        indicator: [
          { name: '研究能力', max: 10 },
          { name: '风控能力', max: 10 },
          { name: 'ETF运营', max: 10 },
          { name: '渠道能力', max: 10 },
          { name: '创新能力', max: 10 },
        ],
        shape: 'polygon' as const,
        splitNumber: 5,
        axisName: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        splitArea: { areaStyle: { color: ['rgba(22,119,255,0.02)', 'rgba(22,119,255,0.04)'] } },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      },
      series: [{
        type: 'radar' as const,
        data: top6.map(company => ({
          value: [company.researchScore, company.riskControlScore, company.etfOperationScore, company.channelScore, company.innovationScore],
          name: company.name,
          symbol: 'circle' as const,
          symbolSize: 6,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.15 },
        })),
      }],
    }
  }, [sortedData])

  // 费率对比柱状图
  const feeBarOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '管理费率对比（%）',
      left: 'center',
      textStyle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: 'axis' as const },
    grid: { left: 150, right: 40, top: 50, bottom: 30 },
    xAxis: {
      type: 'value' as const,
      axisLabel: { color: 'rgba(255,255,255,0.45)', formatter: '{value}%' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'category' as const,
      data: [...companyProfiles].sort((a, b) => a.avgManagementFee - b.avgManagementFee).map(c => c.name),
      inverse: true,
      axisLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
    },
    series: [{
      type: 'bar' as const,
      data: [...companyProfiles].sort((a, b) => a.avgManagementFee - b.avgManagementFee).map(c => ({
        value: c.avgManagementFee,
        itemStyle: {
          color: c.avgManagementFee <= 0.95 ? '#52c41a' : c.avgManagementFee <= 1.0 ? '#faad14' : '#f5222d',
          borderRadius: [0, 3, 3, 0],
        },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right' as const, formatter: '{c}%', color: 'rgba(255,255,255,0.65)', fontSize: 10 },
    }],
  }), [])

  // 表格列定义
  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 55,
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 700, color: index < 3 ? '#faad14' : 'rgba(255,255,255,0.45)', fontSize: 14 }}>
          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
        </span>
      ),
    },
    {
      title: '基金公司',
      key: 'name',
      width: 140,
      render: (_: any, record: CompanyProfile) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <Tag color={record.typeColor} style={{ fontSize: 10, marginTop: 2, margin: 0 }}>
            {record.typeLabel}
          </Tag>
        </div>
      ),
    },
    {
      title: '总规模(亿)',
      dataIndex: 'totalAUM',
      key: 'totalAUM',
      width: 95,
      sorter: true,
      render: (val: number) => <span style={{ fontWeight: 500 }}>{val.toLocaleString()}</span>,
    },
    {
      title: '主动权益(亿)',
      dataIndex: 'activeEquityAUM',
      key: 'activeEquityAUM',
      width: 105,
      sorter: true,
      render: (val: number) => <span>{val.toLocaleString()}</span>,
    },
    {
      title: 'ETF规模(亿)',
      dataIndex: 'etfAUM',
      key: 'etfAUM',
      width: 90,
      sorter: true,
      render: (val: number) => <span>{val.toLocaleString()}</span>,
    },
    {
      title: '综合评分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      width: 90,
      sorter: true,
      defaultSortOrder: 'descend' as const,
      render: (val: number) => (
        <span style={{
          color: val >= 9.0 ? '#52c41a' : val >= 8.5 ? '#faad14' : '#1677ff',
          fontWeight: 700,
          fontSize: 15,
        }}>
          {val.toFixed(2)}
        </span>
      ),
    },
    {
      title: '研究/风控/ETF/渠道/创新',
      key: 'scores',
      width: 220,
      render: (_: any, record: CompanyProfile) => (
        <Space size={2}>
          {[
            { v: record.researchScore, l: '研' },
            { v: record.riskControlScore, l: '风' },
            { v: record.etfOperationScore, l: 'E' },
            { v: record.channelScore, l: '渠' },
            { v: record.innovationScore, l: '创' },
          ].map(s => (
            <Tooltip key={s.l} title={`${s.l}: ${s.v}/10`}>
              <Progress
                type="circle"
                percent={s.v * 10}
                size={32}
                format={() => s.l}
                strokeColor={s.v >= 9 ? '#52c41a' : s.v >= 8 ? '#faad14' : '#1677ff'}
                style={{ margin: 0 }}
              />
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: '费率竞争力',
      dataIndex: 'feeCompetitiveness',
      key: 'feeCompetitiveness',
      width: 100,
      render: (val: string) => {
        const colors: Record<string, string> = { 'A++': '#52c41a', 'A+': '#73d13d', 'A': '#faad14', 'B+': '#ffa940', 'B': '#ff7a45' }
        return <Tag color={colors[val]} style={{ fontWeight: 600 }}>{val}</Tag>
      },
    },
    {
      title: '核心优势',
      key: 'strengths',
      width: 200,
      render: (_: any, record: CompanyProfile) => (
        <div>
          {record.strengths.slice(0, 2).map((s, i) => (
            <Tag key={i} color="blue" style={{ fontSize: 10, marginBottom: 2 }}>{s}</Tag>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="animate-fadeInUp">
      {/* 头部 */}
      <Card className="dashboard-card" styles={{ body: { padding: '16px 20px' } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            <BankOutlined style={{ marginRight: 8 }} />
            基金公司管理规模与画像分析
          </Title>

          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>排序：</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              size="small"
              style={{ width: 120 }}
              options={[
                { value: 'overallScore', label: '综合评分' },
                { value: 'totalAUM', label: '总管理规模' },
                { value: 'activeEquityAUM', label: '主动权益规模' },
                { value: 'researchScore', label: '研究能力' },
                { value: 'etfOperationScore', label: 'ETF运营能力' },
              ]}
            />
          </Space>
        </div>
      </Card>

      {/* 汇总统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>参与试点的公司总数</span>}
              value={18}
              suffix="家"
              valueStyle={{ color: '#1677ff', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>合计管理规模</span>}
              value={(companyProfiles.reduce((s, c) => s + c.totalAUM, 0) / 10000).toFixed(1)}
              suffix="万亿"
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>平均综合评分</span>}
              value={(companyProfiles.reduce((s, c) => s + c.overallScore, 0) / 18).toFixed(2)}
              valueStyle={{ color: '#faad14', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>最高评分</span>}
              value={Math.max(...companyProfiles.map(c => c.overallScore)).toFixed(2)}
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>平均管理费</span>}
              value={(companyProfiles.reduce((s, c) => s + c.avgManagementFee, 0) / 18).toFixed(2)}
              suffix="%"
              valueStyle={{ color: '#1677ff', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card size="small" hoverable className="stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, opacity: 0.7 }}>最低费率</span>}
              value={Math.min(...companyProfiles.map(c => c.avgManagementFee)).toFixed(2)}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore echarts={echarts} option={aumPieOption} style={{ height: 400 }} lazyUpdate />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore echarts={echarts} option={radarOption} style={{ height: 400 }} lazyUpdate />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="dashboard-card" styles={{ body: { padding: 16 } }}>
            <ReactEChartsCore echarts={echarts} option={feeBarOption} style={{ height: 400 }} lazyUpdate />
          </Card>
        </Col>
      </Row>

      {/* 详细表格 */}
      <Card className="dashboard-card" style={{ marginTop: 16 }} styles={{ body: { padding: 16 } }}>
        <Table
          columns={columns}
          dataSource={sortedData}
          rowKey="name"
          size="small"
          pagination={{ pageSize: 10, size: 'small' }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  )
}

export default CompanyProfileAnalysis
