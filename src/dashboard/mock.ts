import type{DashboardDataset,Fund,NavPoint}from'./types'
const metrics=[
 {benchmark:'中证800全收益指数',aum:18.6,returnSinceLaunch:6.82,excessReturn:1.34,volatility:15.42,maxDrawdown:8.63,activeShare:71.2,trackingError:5.18,informationRatio:.52,top10Weight:42.8,adv:2680,spreadBps:8.6,premiumDiscount:.06,flow20d:1.28},
 {benchmark:'沪深300全收益指数',aum:14.2,returnSinceLaunch:5.91,excessReturn:.72,volatility:14.86,maxDrawdown:7.94,activeShare:66.4,trackingError:4.62,informationRatio:.31,top10Weight:38.6,adv:1920,spreadBps:10.2,premiumDiscount:-.04,flow20d:.82},
 {benchmark:'中证A500全收益指数',aum:11.8,returnSinceLaunch:7.44,excessReturn:1.91,volatility:16.03,maxDrawdown:9.12,activeShare:74.6,trackingError:5.84,informationRatio:.65,top10Weight:45.1,adv:1460,spreadBps:11.4,premiumDiscount:.09,flow20d:.56},
 {benchmark:'中证800全收益指数',aum:9.7,returnSinceLaunch:4.88,excessReturn:-.18,volatility:13.96,maxDrawdown:7.18,activeShare:62.8,trackingError:4.11,informationRatio:-.09,top10Weight:35.9,adv:980,spreadBps:13.2,premiumDiscount:-.07,flow20d:.21}]
const companies=['银华基金','易方达基金','华夏基金','永赢基金','摩根基金','华泰柏瑞基金','汇添富基金','华安基金','招商基金','南方基金','富国基金','大成基金','鹏华基金','工银瑞信基金','华宝基金','国泰基金','天弘基金','建信基金']
const strategies=['质量','价值','成长','均衡','红利','多因子']
const funds:Fund[]=companies.map((company,i)=>({code:String((i%2?159700:560500)+i).padStart(6,'0'),name:i===0?'价值甄选主动ETF':`申报产品占位 ${String(i+1).padStart(2,'0')}`,company,strategy:strategies[i%strategies.length],...metrics[i%metrics.length]}))
const nav:NavPoint[]=funds.flatMap((f,j)=>Array.from({length:80},(_,i)=>({code:f.code,date:`2026-${String(4+Math.floor(i/25)).padStart(2,'0')}-${String(i%25+1).padStart(2,'0')}`,fundIndex:100+i*.065+Math.sin(i/5+j)*1.35+j*.18,benchmarkIndex:100+i*.049+Math.sin(i/6+j)*1.05})))
export const createMockDataset=():DashboardDataset=>({schemaVersion:'1.0',asOf:'上市前情景模拟',funds,nav,market:{totalAum:funds.reduce((s,x)=>s+x.aum,0),netFlow20d:funds.reduce((s,x)=>s+x.flow20d,0),weightedExcess:funds.reduce((s,x)=>s+x.excessReturn*x.aum,0)/funds.reduce((s,x)=>s+x.aum,0)}})
