ALTER TABLE fund_master ADD COLUMN manager_name TEXT;
ALTER TABLE fund_master ADD COLUMN manager_tenure REAL;
ALTER TABLE fund_master ADD COLUMN expense_ratio REAL;

CREATE TABLE IF NOT EXISTS portfolio_characteristic_daily (
  fund_code TEXT NOT NULL,
  trade_date TEXT NOT NULL,
  portfolio_pe REAL,
  benchmark_pe REAL,
  portfolio_roe REAL,
  benchmark_roe REAL,
  earnings_growth REAL,
  benchmark_growth REAL,
  cash_weight REAL,
  data_coverage REAL,
  model_version TEXT NOT NULL,
  PRIMARY KEY(fund_code,trade_date,model_version),
  FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE INDEX IF NOT EXISTS idx_characteristic_fund_date
ON portfolio_characteristic_daily(fund_code,trade_date DESC);
PRAGMA optimize;
