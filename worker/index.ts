interface D1Result<T=unknown>{results?:T[];success:boolean;meta?:Record<string,unknown>}
interface D1Statement{bind(...values:unknown[]):D1Statement;first<T=unknown>(column?:string):Promise<T|null>;all<T=unknown>():Promise<D1Result<T>>;run():Promise<D1Result>}
interface D1Database{prepare(sql:string):D1Statement;batch(statements:D1Statement[]):Promise<D1Result[]>}
interface R2Bucket{put(key:string,value:string|ArrayBuffer|ReadableStream,options?:Record<string,unknown>):Promise<unknown>}
interface AssetsBinding{fetch(request:Request):Promise<Response>}
interface Env{DB?:D1Database;RAW_DATA?:R2Bucket;ASSETS:AssetsBinding;IMPORT_TOKEN?:string;DEPLOYMENT_TARGET?:string}

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}})
const error=(code:string,message:string,status=400)=>json({error:{code,message}},status)
const authorized=(request:Request,env:Env)=>Boolean(env.IMPORT_TOKEN)&&request.headers.get('authorization')===`Bearer ${env.IMPORT_TOKEN}`

async function dashboard(env:Env){
 if(!env.DB)return error('DATABASE_NOT_CONFIGURED','数据库尚未绑定；当前网站继续使用上市前模拟数据。',503)
 const row=await env.DB.prepare('SELECT payload, as_of, quality_status, calculated_at FROM dashboard_snapshots ORDER BY as_of DESC LIMIT 1').first<{payload:string;as_of:string;quality_status:string;calculated_at:string}>()
 if(!row)return error('NO_PUBLISHED_DATA','数据库已连接，但尚无已发布的Dashboard快照。',404)
 return json({...JSON.parse(row.payload),asOf:row.as_of,dataQuality:row.quality_status,calculatedAt:row.calculated_at})
}

async function funds(env:Env){
 if(!env.DB)return error('DATABASE_NOT_CONFIGURED','数据库尚未绑定。',503)
 const rows=await env.DB.prepare(`SELECT code,name,company,strategy,benchmark,status,inception_date AS inceptionDate FROM fund_master WHERE status!='archived' ORDER BY company,code`).all()
 return json({asOf:new Date().toISOString(),funds:rows.results??[]})
}

async function fundDetail(code:string,env:Env){
 if(!env.DB)return error('DATABASE_NOT_CONFIGURED','数据库尚未绑定。',503)
 const fund=await env.DB.prepare('SELECT * FROM fund_master WHERE code=?').bind(code).first()
 if(!fund)return error('FUND_NOT_FOUND','未找到该产品。',404)
 const [metrics,holdings,factors,flows]=await Promise.all([
  env.DB.prepare('SELECT * FROM performance_metric_daily WHERE fund_code=? ORDER BY trade_date DESC LIMIT 120').bind(code).all(),
  env.DB.prepare('SELECT * FROM holding_daily WHERE fund_code=? AND trade_date=(SELECT MAX(trade_date) FROM holding_daily WHERE fund_code=?) ORDER BY weight DESC').bind(code,code).all(),
  env.DB.prepare('SELECT * FROM factor_exposure_daily WHERE fund_code=? ORDER BY trade_date DESC,factor').bind(code).all(),
  env.DB.prepare('SELECT * FROM fund_flow_daily WHERE fund_code=? ORDER BY trade_date DESC LIMIT 120').bind(code).all()
 ])
 return json({fund,metrics:metrics.results??[],holdings:holdings.results??[],factors:factors.results??[],flows:flows.results??[]})
}

async function importSnapshot(request:Request,env:Env){
 if(!authorized(request,env))return error('UNAUTHORIZED','导入接口需要后台令牌。',401)
 if(!env.DB)return error('DATABASE_NOT_CONFIGURED','数据库尚未绑定。',503)
 const body=await request.json() as {asOf?:string;schemaVersion?:string;dataset?:unknown;source?:string}
 if(!body.asOf||!body.dataset)return error('INVALID_PAYLOAD','必须提供asOf和dataset。')
 const payload=JSON.stringify(body.dataset),now=new Date().toISOString()
 await env.DB.batch([
  env.DB.prepare(`INSERT INTO dashboard_snapshots(as_of,schema_version,payload,quality_status,source,calculated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(as_of) DO UPDATE SET schema_version=excluded.schema_version,payload=excluded.payload,quality_status='validated',source=excluded.source,calculated_at=excluded.calculated_at`).bind(body.asOf,body.schemaVersion??'2.0',payload,'validated',body.source??'manual-import',now),
  env.DB.prepare(`INSERT INTO ingestion_log(dataset_name,effective_date,source,status,row_count,started_at,completed_at,message) VALUES('dashboard_snapshot',?,?, 'success',1,?,?,?)`).bind(body.asOf,body.source??'manual-import',now,now,'Snapshot imported through protected API')
 ])
 if(env.RAW_DATA)await env.RAW_DATA.put(`validated/dashboard/${body.asOf}/${Date.now()}.json`,payload,{httpMetadata:{contentType:'application/json'}})
 return json({ok:true,asOf:body.asOf,calculatedAt:now},201)
}

async function health(env:Env){
 let database='unconfigured',latestData:string|null=null
 if(env.DB){try{latestData=await env.DB.prepare('SELECT MAX(as_of) FROM dashboard_snapshots').first<string>('MAX(as_of)');database='available'}catch{database='migration-required'}}
 return json({status:'ok',service:'active-etf-dashboard',deploymentTarget:env.DEPLOYMENT_TARGET??'cloudflare',database,objectStorage:env.RAW_DATA?'available':'unconfigured',latestData,time:new Date().toISOString()})
}

async function api(request:Request,env:Env){
 const url=new URL(request.url),path=url.pathname
 if(path==='/api/v2/health')return health(env)
 if(path==='/api/v2/dashboard'&&request.method==='GET')return dashboard(env)
 if(path==='/api/v2/funds'&&request.method==='GET')return funds(env)
 const match=path.match(/^\/api\/v2\/funds\/([^/]+)$/)
 if(match&&request.method==='GET')return fundDetail(decodeURIComponent(match[1]),env)
 if(path==='/api/v2/import/snapshot'&&request.method==='POST')return importSnapshot(request,env)
 return error('NOT_FOUND','API路由不存在。',404)
}

async function recompute(env:Env){
 if(!env.DB)return
 const now=new Date().toISOString()
 await env.DB.prepare(`INSERT INTO calculation_run(model_name,model_version,status,started_at,completed_at,message) VALUES('daily-active-etf','1.0','skipped',?,?,?)`).bind(now,now,'Calculation scaffold is ready; connect licensed PCF, NAV and market feeds before enabling production calculations.').run()
}

export default{
 async fetch(request:Request,env:Env){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request,env);return env.ASSETS.fetch(request)},
 async scheduled(_controller:unknown,env:Env,ctx:{waitUntil(promise:Promise<unknown>):void}){ctx.waitUntil(recompute(env))}
}
