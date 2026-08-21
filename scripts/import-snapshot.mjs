import fs from 'node:fs'
import process from 'node:process'
import * as XLSX from 'xlsx'

const [filePath] = process.argv.slice(2)
const apiBase = process.env.ETF_API_BASE_URL
const token = process.env.ETF_IMPORT_TOKEN
if (!filePath || !apiBase || !token) {
  console.error('Usage: set ETF_API_BASE_URL and ETF_IMPORT_TOKEN, then run: node scripts/import-snapshot.mjs <file.xlsx>')
  process.exit(1)
}
const book = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' })
const read = (name) => {
  const sheet = book.Sheets[name]
  if (!sheet) throw new Error(`Excel缺少工作表: ${name}`)
  return XLSX.utils.sheet_to_json(sheet, { raw: true })
}
const funds=read('funds'),nav=read('nav'),flows=read('flows'),holdings=read('holdings'),sectors=read('sectors'),factors=read('factors')
const totalAum=funds.reduce((s,x)=>s+Number(x.aum||0),0)
const dataset={schemaVersion:'2.0',asOf:new Date().toISOString().slice(0,10),funds,nav,flows,holdings,sectors,factors,market:{totalAum,totalShares:funds.reduce((s,x)=>s+Number(x.shares||0),0),netFlow20d:funds.reduce((s,x)=>s+Number(x.flow20d||0),0),weightedExcess:totalAum?funds.reduce((s,x)=>s+Number(x.excessReturn||0)*Number(x.aum||0),0)/totalAum:0}}
const response=await fetch(`${apiBase.replace(/\/$/,'')}/api/v2/import/snapshot`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({asOf:dataset.asOf,schemaVersion:'2.0',source:`excel:${filePath}`,dataset})})
const result=await response.json()
if(!response.ok){console.error(result);process.exit(1)}
console.log(`Imported ${funds.length} funds for ${dataset.asOf}`)
console.log(result)
