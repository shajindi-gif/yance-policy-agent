# YanCe Policy Agent — 智能体引擎

**YanCe Policy Agent v2.0** 提供标准化的 AI Agent 接口，可接入 WorkBuddy、CodeBuddy、Claude Desktop、Cursor、Windsurf 等任何支持 MCP (Model Context Protocol) 的智能体平台。

核心能力：8维加权政策匹配、6字段结构化提取、ParkOps 工单生成、完整服务报告。

---

## 快速开始

```bash
# 1. 安装依赖
cd agent
npm install

# 2. 启动 REST API（HTTP 接口，任意平台可调用）
npm start
# → http://localhost:3800/api/health

# 3. 启动 MCP Server（stdio 模式，供 Agent 平台接入）
npm run mcp
```

## 两种接入方式

### 方式 A：MCP Server（推荐）

MCP 是 AI Agent 平台的通用协议标准。在 Agent 平台的配置中添加：

```json
{
  "mcpServers": {
    "yance-policy-agent": {
      "command": "node",
      "args": ["/absolute/path/to/agent/src/mcp-server.js"],
      "cwd": "/absolute/path/to/agent"
    }
  }
}
```

**各平台配置方法：**

| 平台 | 配置文件位置 |
|------|-------------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) |
| Cursor | Settings → MCP → Add Server |
| Windsurf | Settings → MCP → Add |
| WorkBuddy | MCP 配置面板 → 新增 |
| CodeBuddy | MCP 配置面板 → 新增 |

### 方式 B：REST API（HTTP 接口）

```bash
npm start
# 默认监听 http://localhost:3800
```

任何能发 HTTP 请求的平台都可以调用这些接口。

---

## 可用工具（MCP Tools）

| 工具名 | 功能 | 输入 |
|--------|------|------|
| `match_policies` | 8维加权匹配分析 | company (企业画像), min_score |
| `extract_policy` | 6字段结构化提取 | text (政策原文) |
| `search_policies` | 搜索政策数据库 | query, region, industry, level |
| `get_policy` | 获取单条政策详情 | id (如 SH-HT-001) |
| `generate_ticket` | 生成 ParkOps 服务工单 | company, policy_id |
| `generate_report` | 生成完整 Markdown 报告 | company, min_score |
| `add_policy` | 添加新政策到数据库 | policy (政策对象) |
| `db_stats` | 数据库统计信息 | 无 |

## REST API 端点

| 方法 | 路径 | 功能 |
|------|------|------|
| POST | `/api/match` | 8维匹配分析 |
| POST | `/api/extract` | 6字段结构化提取 |
| GET | `/api/policies` | 搜索政策 (?q=关键词&region=&industry=) |
| GET | `/api/policies/:id` | 获取单条政策 |
| POST | `/api/ticket` | 生成 ParkOps 工单 |
| POST | `/api/report` | 生成完整报告 |
| POST | `/api/policies` | 添加新政策 |
| GET | `/api/stats` | 数据库统计 |
| GET | `/api/health` | 健康检查 |

## 使用示例

### 匹配分析
```bash
curl -X POST http://localhost:3800/api/match \
  -H "Content-Type: application/json" \
  -d '{
    "company": {
      "name": "衍策引擎（上海）科技有限公司",
      "industry": "人工智能",
      "stage": "成长期",
      "region": "上海市徐汇区",
      "employees": 45,
      "rd_ratio_percent": 22,
      "has_ip": true,
      "ip_count": 6,
      "has_high_tech_cert": false,
      "is_sme": true
    }
  }'
```

### 政策提取
```bash
curl -X POST http://localhost:3800/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "text": "关于上海市人工智能产业发展专项资金的通知，最高500万元，截止2026年12月15日..."
  }'
```

### 搜索政策
```bash
curl "http://localhost:3800/api/policies?q=人工智能&region=上海市"
```

### 生成工单
```bash
curl -X POST http://localhost:3800/api/ticket \
  -H "Content-Type: application/json" \
  -d '{ "policy_id": "SH-AI-001" }'
```

---

## 企业画像字段

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 企业名称 |
| industry | string | 行业（人工智能/大数据/生物医药...） |
| stage | string | 阶段（初创期/成长期/成熟期） |
| region | string | 区域（上海市徐汇区） |
| park | string | 园区名称 |
| employees | number | 员工人数 |
| rd_ratio_percent | number | 研发占比（22 = 22%） |
| has_ip | boolean | 是否有知识产权 |
| ip_count | number | 知识产权数量 |
| has_high_tech_cert | boolean | 是否高企认定 |
| is_sme | boolean | 是否中小企业 |
| founded_year | number | 成立年份 |

## 匹配引擎算法

8维加权评分，总分100：

| 维度 | 权重 | 说明 |
|------|------|------|
| 行业匹配 | 30% | 企业行业是否在政策标签中 |
| 区域匹配 | 20% | 企业注册地是否在政策区域内 |
| 阶段匹配 | 15% | 企业发展阶段是否符合要求 |
| 人员规模 | 10% | 员工数是否在政策范围内 |
| 研发占比 | 10% | 研发费用占比是否达标 |
| 知识产权 | 5% | 是否拥有必要知识产权 |
| 高企认定 | 5% | 是否获得高企认定 |
| 中小企业 | 5% | 是否符合中小企业标准 |

推荐等级：≥70且无缺口→推荐申请，≥50且≤2缺口→补充材料，≥30→进一步评估，<30→暂不推荐。

## 扩展政策数据库

当前数据库包含 10 条政策（国家级/市级/区级/园区级），覆盖上海主要AI/科技政策。

扩展方式：
1. 直接编辑 `db/policies.json`（添加新条目）
2. 通过 API 调用 `POST /api/policies`
3. 通过 MCP 工具 `add_policy`
4. 未来可接入外部数据库（PostgreSQL/MongoDB）

政策 ID 编码规范：`{区域}-{类型}-{序号}`，如 `SH-HT-001`（上海-高企-001）。

## 项目结构

```
agent/
├── package.json            # 项目配置
├── README.md               # 本文件
├── src/
│   ├── policy-engine.js    # 核心匹配引擎（与Chrome插件统一标准）
│   ├── policy-db.js        # 政策数据库管理器
│   ├── mcp-server.js       # MCP Server（Agent平台接入）
│   └── api-server.js       # REST API Server（HTTP接入）
└── db/
    └── policies.json       # 政策数据库（可扩展）
```

## 与其他交付物的关系

本智能体引擎是整个 YanCe Policy Agent 产品矩阵的**服务端核心**：

- **Chrome 插件** (`chrome-extension/`) — 浏览器端匹配引擎（同一套算法）
- **Safari 插件** (`safari-extension/`) — Safari 浏览器适配版
- **iOS App** (`ios-app/`) — 移动端，内嵌 WebView + Safari 扩展
- **网站** (`website/`) — Next.js 官网 + SaaS Demo
- **智能体引擎** (`agent/`) ← 你在这里 — 服务端 API，供 AI Agent 平台调用

所有模块共享同一套匹配引擎算法（8维加权评分）和 ParkOps 工单格式。
