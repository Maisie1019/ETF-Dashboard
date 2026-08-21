# 公司内网接入方案

## 推荐：同一前端，两套后端

公开Cloudflare站用于模拟展示或允许公开的数据；公司内网部署生产后台和授权数据。两端实现相同 `/api/v2` 契约，前端无需重写。

### 内网构建

设置构建变量：

```text
VITE_API_BASE_URL=https://active-etf-api.company.internal
VITE_DEPLOYMENT_TARGET=intranet
```

运行 `npm run build`，将 `dist/` 发布到公司IIS、Nginx或内部门户。内网API可使用Node/FastAPI + PostgreSQL实现，但返回结构必须符合 `docs/API_CONTRACT.md`。

### 三种网络模式

1. **完全内网（最适合敏感数据）**：前端、API、数据库全部在公司网络；Cloudflare仅保留公开模拟站。
2. **混合模式**：Cloudflare托管前端，浏览器在公司网络内访问内网API。需要公司DNS、TLS、CORS和安全部门批准；外网访问者无法调用内网API。
3. **Cloudflare私网接入**：使用公司批准的Cloudflare Zero Trust/Tunnel连接私网，并实施身份和设备策略。需要法务、合规、信息安全和数据跨境/地域评估后才能采用。

## 不建议

- 把未公开PCF、内部持仓、授权行情直接存入公开R2或公开D1接口。
- 在前端代码或Git仓库写数据库密码、供应商Token或导入令牌。
- 让浏览器直接连接数据库。
- 用公开URL承担公司内部权限控制。

## 上线验收

- 内外网数据边界和字段白名单已书面确认。
- API采用公司SSO或网关认证，写接口按角色授权。
- 数据库备份、恢复、审计和告警通过演练。
- 行情和指数数据的展示许可证得到确认。
- Cloudflare不可用时，内网Dashboard仍可由内网静态站和API提供服务。
