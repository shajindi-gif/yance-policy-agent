#!/usr/bin/env node
/**
 * mcp-server.js — YanCe Policy Agent MCP Server
 *
 * Model Context Protocol 服务端，提供标准化工具接口。
 * 可接入: WorkBuddy, CodeBuddy, Claude Desktop, Cursor, Windsurf 等支持 MCP 的 AI Agent 平台。
 *
 * 协议: JSON-RPC 2.0 over stdio
 * 启动: node src/mcp-server.js
 *
 * 暴露工具:
 *   - match_policies     8维加权匹配分析
 *   - extract_policy     6字段结构化提取
 *   - search_policies    政策搜索
 *   - get_policy         按ID获取政策
 *   - generate_ticket    生成ParkOps服务工单
 *   - generate_report    生成完整服务报告
 *   - add_policy         添加新政策
 *   - db_stats           数据库统计
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import {
  matchPolicies,
  extractPolicyFields,
  generateTicket,
  generateReport,
  SAMPLE_COMPANY,
} from './policy-engine.js';
import { getDB } from './policy-db.js';

// ============================================================
// Tool Definitions
// ============================================================

const TOOLS = [
  {
    name: 'match_policies',
    description: '对企业进行8维加权政策匹配分析。输入企业画像（行业、区域、阶段、规模、研发占比、知识产权、高企认定、中小企业），返回匹配政策列表及评分、材料缺口、推荐动作。匹配引擎权重: 行业30%+区域20%+阶段15%+规模10%+研发10%+IP5%+高企5%+中小5%。',
    inputSchema: {
      type: 'object',
      properties: {
        company: {
          type: 'object',
          description: '企业画像，省略字段将使用默认值',
          properties: {
            name:              { type: 'string', description: '企业名称' },
            industry:          { type: 'string', description: '所属行业（如：人工智能、大数据、生物医药）' },
            stage:             { type: 'string', description: '发展阶段（初创期/成长期/成熟期）' },
            region:            { type: 'string', description: '所在区域（如：上海市徐汇区）' },
            park:              { type: 'string', description: '所在园区' },
            employees:         { type: 'number', description: '员工人数' },
            rd_ratio_percent:  { type: 'number', description: '研发费用占比（百分比，如22代表22%）' },
            has_ip:            { type: 'boolean', description: '是否拥有知识产权' },
            ip_count:          { type: 'number', description: '知识产权数量' },
            has_high_tech_cert:{ type: 'boolean', description: '是否获得高新技术企业认定' },
            is_sme:            { type: 'boolean', description: '是否为中小企业' },
            founded_year:      { type: 'number', description: '成立年份' },
            business_scope:    { type: 'string', description: '经营范围' },
          },
        },
        min_score: { type: 'number', description: '最低匹配分数阈值，默认0', default: 0 },
      },
    },
  },
  {
    name: 'extract_policy',
    description: '从政策原文中提取6个结构化字段：政策名称、发文机构、目标行业、补贴金额、申请截止日、材料要求。基于模式匹配的规则引擎，适合快速结构化。',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '政策原文或摘要文本' },
      },
      required: ['text'],
    },
  },
  {
    name: 'search_policies',
    description: '搜索政策数据库。支持按关键词、区域、行业、级别筛选。',
    inputSchema: {
      type: 'object',
      properties: {
        query:    { type: 'string', description: '搜索关键词' },
        region:   { type: 'string', description: '筛选区域' },
        industry: { type: 'string', description: '筛选行业' },
        level:    { type: 'string', description: '筛选级别（国家级/市级/区级/园区级）' },
      },
    },
  },
  {
    name: 'get_policy',
    description: '根据政策ID获取完整政策详情。',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: '政策ID（如 SH-HT-001）' },
      },
      required: ['id'],
    },
  },
  {
    name: 'generate_ticket',
    description: '根据企业画像和匹配结果生成ParkOps格式服务工单。工单包含政策信息、匹配度、材料缺口和风险提示。',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'object', description: '企业画像（同match_policies）' },
        policy_id: { type: 'string', description: '目标政策ID' },
      },
      required: ['policy_id'],
    },
  },
  {
    name: 'generate_report',
    description: '生成完整的政策匹配服务报告（Markdown格式），包含企业信息、匹配总览、逐项分析、材料缺口汇总、工单建议和算法说明6个章节。',
    inputSchema: {
      type: 'object',
      properties: {
        company: { type: 'object', description: '企业画像（同match_policies）' },
        min_score: { type: 'number', description: '最低匹配分数阈值', default: 0 },
      },
    },
  },
  {
    name: 'add_policy',
    description: '向政策数据库添加新政策。添加后立即可用于匹配分析。',
    inputSchema: {
      type: 'object',
      properties: {
        policy: {
          type: 'object',
          description: '政策数据',
          properties: {
            id:                  { type: 'string', description: '政策ID（可选，自动生成）' },
            name:                { type: 'string', description: '政策名称' },
            level:               { type: 'string', description: '级别' },
            region:              { type: 'string', description: '适用区域' },
            industry_tags:       { type: 'array', items: { type: 'string' }, description: '行业标签' },
            stage_tags:          { type: 'array', items: { type: 'string' }, description: '阶段标签' },
            min_employees:       { type: 'number', description: '最低员工数' },
            max_employees:       { type: 'number', description: '最高员工数' },
            min_rd_ratio:        { type: 'number', description: '最低研发占比' },
            require_ip:          { type: 'boolean', description: '是否需要知识产权' },
            require_high_tech:   { type: 'boolean', description: '是否需要高企认定' },
            require_sme:         { type: 'boolean', description: '是否需要中小企业认定' },
            required_materials:  { type: 'array', items: { type: 'string' }, description: '申请材料清单' },
            issuing_authority:   { type: 'string', description: '发文机构' },
            deadline:            { type: 'string', description: '截止日期' },
            subsidy_description: { type: 'string', description: '补贴说明' },
            source_url:          { type: 'string', description: '政策来源链接' },
          },
          required: ['name', 'level', 'region'],
        },
      },
      required: ['policy'],
    },
  },
  {
    name: 'db_stats',
    description: '获取政策数据库统计信息：政策总数、级别分布、覆盖行业、覆盖区域。',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ============================================================
// Server Setup
// ============================================================

const server = new Server(
  { name: 'yance-policy-agent', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const db = getDB();

  try {
    switch (name) {

      case 'match_policies': {
        const company = { ...SAMPLE_COMPANY, ...(args?.company || {}) };
        const minScore = args?.min_score ?? 0;
        const policies = db.getAll();
        const results = matchPolicies(company, policies, minScore);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results.map(r => ({
              policy_name: r.policy.name,
              policy_id: r.policy.id,
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
            })), null, 2),
          }],
        };
      }

      case 'extract_policy': {
        const result = extractPolicyFields(args?.text || '');
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'search_policies': {
        const { query, region, industry, level } = args || {};
        let results;
        if (query) {
          results = db.search(query);
        } else {
          results = db.filter({ region, industry, level });
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(results.map(p => ({
              id: p.id,
              name: p.name,
              level: p.level,
              region: p.region,
              industries: p.industry_tags,
              subsidy: p.subsidy_description,
              deadline: p.deadline,
            })), null, 2),
          }],
        };
      }

      case 'get_policy': {
        const policy = db.getById(args?.id);
        if (!policy) {
          return {
            content: [{ type: 'text', text: `未找到政策: ${args?.id}` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(policy, null, 2) }],
        };
      }

      case 'generate_ticket': {
        const company = { ...SAMPLE_COMPANY, ...(args?.company || {}) };
        const policy = db.getById(args?.policy_id);
        if (!policy) {
          return {
            content: [{ type: 'text', text: `未找到政策: ${args?.policy_id}` }],
            isError: true,
          };
        }
        // Import evaluateMatch for single-policy matching
        const { evaluateMatch } = await import('./policy-engine.js');
        const matched = evaluateMatch(company, policy);
        const ticket = generateTicket(company, matched);
        const { ticketToParkOpsText } = await import('./policy-engine.js');
        const parkOpsText = ticketToParkOpsText(ticket);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ ticket, parkops_clipboard: parkOpsText }, null, 2),
          }],
        };
      }

      case 'generate_report': {
        const company = { ...SAMPLE_COMPANY, ...(args?.company || {}) };
        const minScore = args?.min_score ?? 0;
        const policies = db.getAll();
        const results = matchPolicies(company, policies, minScore);
        const report = generateReport(company, results);
        return {
          content: [{ type: 'text', text: report }],
        };
      }

      case 'add_policy': {
        const policy = args?.policy;
        if (!policy) {
          return { content: [{ type: 'text', text: '缺少政策数据' }], isError: true };
        }
        const added = db.addPolicy(policy);
        return {
          content: [{ type: 'text', text: `政策已添加: ${added.name} (ID: ${added.id})` }],
        };
      }

      case 'db_stats': {
        const stats = db.getStats();
        return {
          content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `未知工具: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `工具执行错误: ${err.message}` }],
      isError: true,
    };
  }
});

// ============================================================
// Start Server
// ============================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[YanCe] MCP Server v2.0 running on stdio');
}

main().catch(err => {
  console.error('[YanCe] Fatal error:', err);
  process.exit(1);
});
