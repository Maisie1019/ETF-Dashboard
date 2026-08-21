PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS fund_master (
  code TEXT PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL,
  strategy TEXT NOT NULL, benchmark TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
  exchange TEXT, inception_date TEXT, management_fee REAL, custody_fee REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pcf_snapshot (
  id INTEGER PRIMARY KEY AUTOINCREMENT, fund_code TEXT NOT NULL, trade_date TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'initial', disclosed_at TEXT NOT NULL, source TEXT NOT NULL,
  r2_key TEXT, checksum TEXT, quality_status TEXT NOT NULL DEFAULT 'pending', ingested_at TEXT NOT NULL,
  UNIQUE(fund_code,trade_date,version), FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE TABLE IF NOT EXISTS holding_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, stock_code TEXT NOT NULL,
  stock_name TEXT, sector TEXT, shares REAL, market_value REAL, weight REAL NOT NULL,
  weight_change REAL, liquidity_percentile REAL, source_available_at TEXT NOT NULL,
  quality_status TEXT NOT NULL DEFAULT 'validated', PRIMARY KEY(fund_code,trade_date,stock_code),
  FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE TABLE IF NOT EXISTS fund_nav_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, nav REAL NOT NULL, accumulated_nav REAL,
  daily_return REAL, shares REAL, aum REAL, source_available_at TEXT NOT NULL,
  quality_status TEXT NOT NULL DEFAULT 'validated', PRIMARY KEY(fund_code,trade_date),
  FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE TABLE IF NOT EXISTS benchmark_daily (
  benchmark_code TEXT NOT NULL, trade_date TEXT NOT NULL, close_value REAL,
  total_return_index REAL, daily_return REAL, source_available_at TEXT NOT NULL,
  PRIMARY KEY(benchmark_code,trade_date)
);

CREATE TABLE IF NOT EXISTS fund_flow_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, shares REAL NOT NULL,
  shares_change REAL, estimated_net_flow REAL, creation_units REAL, redemption_units REAL,
  PRIMARY KEY(fund_code,trade_date), FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE TABLE IF NOT EXISTS etf_market_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, close_price REAL, volume REAL,
  turnover_value REAL, bid_ask_spread_bps REAL, premium_discount REAL, iopv_deviation REAL,
  PRIMARY KEY(fund_code,trade_date), FOREIGN KEY(fund_code) REFERENCES fund_master(code)
);

CREATE TABLE IF NOT EXISTS factor_exposure_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, factor TEXT NOT NULL,
  exposure REAL NOT NULL, benchmark_exposure REAL, active_exposure REAL,
  model_version TEXT NOT NULL, PRIMARY KEY(fund_code,trade_date,factor,model_version)
);

CREATE TABLE IF NOT EXISTS sector_exposure_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, sector TEXT NOT NULL,
  weight REAL NOT NULL, benchmark_weight REAL, active_weight REAL,
  PRIMARY KEY(fund_code,trade_date,sector)
);

CREATE TABLE IF NOT EXISTS performance_metric_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, window TEXT NOT NULL,
  total_return REAL, benchmark_return REAL, active_return REAL, volatility REAL,
  max_drawdown REAL, downside_capture REAL, selection_hit_rate REAL,
  active_share REAL, holdings_count INTEGER, top10_weight REAL, turnover REAL,
  style_drift REAL, liquidity_coverage REAL, calculated_at TEXT NOT NULL,
  model_version TEXT NOT NULL, quality_status TEXT NOT NULL DEFAULT 'validated',
  PRIMARY KEY(fund_code,trade_date,window,model_version)
);

CREATE TABLE IF NOT EXISTS attribution_daily (
  fund_code TEXT NOT NULL, trade_date TEXT NOT NULL, dimension TEXT NOT NULL,
  bucket TEXT NOT NULL, allocation_effect REAL, selection_effect REAL,
  interaction_effect REAL, total_contribution REAL, model_version TEXT NOT NULL,
  PRIMARY KEY(fund_code,trade_date,dimension,bucket,model_version)
);

CREATE TABLE IF NOT EXISTS dashboard_snapshots (
  as_of TEXT PRIMARY KEY, schema_version TEXT NOT NULL, payload TEXT NOT NULL,
  quality_status TEXT NOT NULL, source TEXT NOT NULL, calculated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ingestion_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, dataset_name TEXT NOT NULL, effective_date TEXT,
  source TEXT NOT NULL, status TEXT NOT NULL, row_count INTEGER, started_at TEXT NOT NULL,
  completed_at TEXT, message TEXT
);

CREATE TABLE IF NOT EXISTS calculation_run (
  id INTEGER PRIMARY KEY AUTOINCREMENT, model_name TEXT NOT NULL, model_version TEXT NOT NULL,
  status TEXT NOT NULL, started_at TEXT NOT NULL, completed_at TEXT, message TEXT
);

CREATE INDEX IF NOT EXISTS idx_holding_daily_date ON holding_daily(trade_date,fund_code);
CREATE INDEX IF NOT EXISTS idx_metric_fund_date ON performance_metric_daily(fund_code,trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_factor_fund_date ON factor_exposure_daily(fund_code,trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_ingestion_status ON ingestion_log(status,started_at DESC);
PRAGMA optimize;
