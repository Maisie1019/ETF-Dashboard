export type DataMode='mock'|'api'|'excel'
export interface Fund{code:string;name:string;company:string;strategy:string;benchmark:string;aum:number;returnSinceLaunch:number;excessReturn:number;volatility:number;maxDrawdown:number;activeShare:number;trackingError:number;informationRatio:number;top10Weight:number;adv:number;spreadBps:number;premiumDiscount:number;flow20d:number}
export interface NavPoint{code:string;date:string;fundIndex:number;benchmarkIndex:number}
export interface DashboardDataset{schemaVersion:'1.0';asOf:string;funds:Fund[];nav:NavPoint[];market:{totalAum:number;netFlow20d:number;weightedExcess:number}}
