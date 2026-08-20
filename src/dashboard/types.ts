export type DataMode = 'mock' | 'api' | 'excel'
export interface Fund { code:string; name:string; company:string; strategy:string; benchmark:string; aum:number; shares:number; sharesChange20d:number; returnSinceLaunch:number; excessReturn:number; volatility:number; maxDrawdown:number; activeShare:number; trackingError:number; informationRatio:number; top10Weight:number; adv:number; spreadBps:number; premiumDiscount:number; flow20d:number }
export interface NavPoint { code:string; date:string; fundIndex:number; benchmarkIndex:number }
export interface FlowPoint { code:string; date:string; netFlow:number; shares:number }
export interface Holding { code:string; stockCode:string; stockName:string; sector:string; weight:number; change:number }
export interface SectorExposure { code:string; sector:string; weight:number; benchmarkWeight:number }
export interface FactorExposure { code:string; factor:string; exposure:number }
export interface DashboardDataset { schemaVersion:'2.0'; asOf:string; funds:Fund[]; nav:NavPoint[]; flows:FlowPoint[]; holdings:Holding[]; sectors:SectorExposure[]; factors:FactorExposure[]; market:{totalAum:number;netFlow20d:number;weightedExcess:number;totalShares:number} }
