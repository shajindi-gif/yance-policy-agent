#!/usr/bin/env node
/**
 * api-server.js — YanCe Policy Agent REST API Server
 *
 * 零外部依赖 HTTP API，Node.js 内置 http 模块。
 * 任何平台都可以通过 HTTP 调用这些接口。
 *
 * 启动: node src/api-server.js
 * 默认端口: 3800 (YANC → 3800)
 *
 * Endpoints:
 *   POST /api/match        8维匹配分析
 *   POST /api/extract      6字段结构化提取
 *   GET  /api/policies     搜索/筛选政策
 *   GET  /api/policies/:id 获取单条政策
 *   POST /api/ticket       生成ParkOps工单
 *   POST /api/report       生成完整服务报告
 *   POST /api/policies     添加新政策
 *   GET  /api/stats        数据库统计
 *   GET  /api/health       健康检查
 */

import { createServer } from 'node:http';
import {
  matchPolicies,
  evaluateMatch,
  extractPolicyFields,
  generateTicket,
  ticketToParkOpsText,
  generateReport,
  SAMPLE_COMPANY,
  WEIGHT,
} from './policy-engine.js';
import { getDB } from './policy-db.js';

const PORT = parseInt(process.env.PORT || '3800', 10);
const HOST = process.env.HOST || '0.0.0.0';

// ============================================================
// Router
// ============================================================

const routes = {
  'POST /api/match': handleMatch,
  'POST /api/extract': handleExtract,
  'GET /api/policies': handleSearchPolicies,
  'POST /api/ticket': handleTicket,
  'POST /api/report': handleReport,
  'POST /api/policies': handleAddPolicy,
  'GET /api/stats': handleStats,
  'GET /api/health': handleHealth,
};

// ============================================================
// Handlers
// ============================================================

async function handleMatch(req, res) {
  const body = await readBody(req);
  const company = { ...SAMPLE_COMPANY, ...(body.company || {}) };
  const minScore = body.min_score ?? 0;
  const db = getDB();
  const policies = db.getAll();
  const results = matchPolicies(company, policies, minScore);

  json(res, 200, {
    company_name: company.name,
    total_policies: policies.length,
    matched: results.length,
    results: results.map(r => ({
      policy_id: r.policy.id,
      policy_name: r.policy.name,
      score: r.score,
      level: r.policy.level,
      region: r.policy.region,
      recommendation: r.recommendation,
      reasons: r.reasons,
      gaps: r.gaps,
      risks: r.risks,
      human_review_points: r.human_review_points,
      deadline: r.policy.deadline,
      subsidy: r.policy.subsidy_description,
    })),
  });
}

async function handleExtract(req, res) {
  const body = await readBody(req);
  if (!body.text) return json(res, 400, { error: '缺少 text 字段' });
  const result = extractPolicyFields(body.text);
  json(res, 200, result);
}

async function handleSearchPolicies(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const db = getDB();
  const query = url.searchParams.get('q') || url.searchParams.get('query');
  const region = url.searchParams.get('region');
  const industry = url.searchParams.get('industry');
  const level = url.searchParams.get('level');

  let results;
  if (query) {
    results = db.search(query);
  } else {
    results = db.filter({ region, industry, level });
  }

  json(res, 200, {
    total: results.length,
    policies: results.map(p => ({
      id: p.id,
      name: p.name,
      level: p.level,
      region: p.region,
      industries: p.industry_tags,
      subsidy: p.subsidy_description,
      deadline: p.deadline,
      issuing_authority: p.issuing_authority,
    })),
  });
}

async function handleGetPolicy(req, res, id) {
  const db = getDB();
  const policy = db.getById(id);
  if (!policy) return json(res, 404, { error: `政策未找到: ${id}` });
  json(res, 200, policy);
}

async function handleTicket(req, res) {
  const body = await readBody(req);
  if (!body.policy_id) return json(res, 400, { error: '缺少 policy_id' });
  const company = { ...SAMPLE_COMPANY, ...(body.company || {}) };
  const db = getDB();
  const policy = db.getById(body.policy_id);
  if (!policy) return json(res, 404, { error: `政策未找到: ${body.policy_id}` });

  const matched = evaluateMatch(company, policy);
  const ticket = generateTicket(company, matched);
  const parkOpsText = ticketToParkOpsText(ticket);

  json(res, 200, { ticket, parkops_clipboard: parkOpsText });
}

async function handleReport(req, res) {
  const body = await readBody(req);
  const company = { ...SAMPLE_COMPANY, ...(body.company || {}) };
  const minScore = body.min_score ?? 0;
  const db = getDB();
  const results = matchPolicies(company, db.getAll(), minScore);
  const report = generateReport(company, results);
  json(res, 200, { report, match_count: results.length });
}

async function handleAddPolicy(req, res) {
  const body = await readBody(req);
  if (!body.name) return json(res, 400, { error: '政策至少需要 name 字段' });
  try {
    const db = getDB();
    const added = db.addPolicy(body);
    json(res, 201, { message: '政策已添加', policy: added });
  } catch (err) {
    json(res, 409, { error: err.message });
  }
}

async function handleStats(_req, res) {
  const db = getDB();
  json(res, 200, db.getStats());
}

async function handleHealth(_req, res) {
  const db = getDB();
  json(res, 200, {
    status: 'ok',
    version: '2.0.0',
    engine: 'yance-policy-agent',
    policies_loaded: db.getAll().length,
    uptime_seconds: Math.floor(process.uptime()),
  });
}

// ============================================================
// HTTP Server
// ============================================================

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method.toUpperCase();

  // Dynamic route: GET /api/policies/:id
  const policyIdMatch = url.pathname.match(/^\/api\/policies\/([^/]+)$/);
  if (policyIdMatch && method === 'GET') {
    return handleGetPolicy(req, res, decodeURIComponent(policyIdMatch[1]));
  }

  const routeKey = `${method} ${url.pathname}`;
  const handler = routes[routeKey];

  if (handler) {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(`[YanCe] ${routeKey} error:`, err.message);
      json(res, 500, { error: 'Internal server error', detail: err.message });
    }
  } else {
    json(res, 404, {
      error: 'Not Found',
      message: `路由不存在: ${method} ${url.pathname}`,
      available_routes: Object.keys(routes),
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[YanCe] API Server v2.0 running at http://${HOST}:${PORT}`);
  console.log(`[YanCe] Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`[YanCe] Policies loaded: ${getDB().getAll().length}`);
});

// ============================================================
// Helpers
// ============================================================

function json(res, status, data) {
  res.writeHead(status);
  res.end(JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
  });
}
