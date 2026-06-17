/**
 * policy-engine.js — YanCe Policy Agent Core Engine v2.0
 *
 * 8维加权匹配引擎 + 6字段政策提取 + ParkOps工单生成 + 服务报告
 * 同一套逻辑驱动: Chrome插件 / Safari插件 / MCP智能体 / REST API
 *
 * Brand: yance.ai
 */

// ============================================================
// 1. Scoring Weights (aligned with policy_matcher.py)
// ============================================================
export const WEIGHT = {
  INDUSTRY: 30,  // 行业匹配
  REGION:   20,  // 区域匹配
  STAGE:    15,  // 发展阶段
  SIZE:     10,  // 员工规模
  RD:       10,  // 研发占比
  IP:        5,  // 知识产权
  CERT:      5,  // 高企认定
  SME:       5,  // 中小企业
};

// ============================================================
// 2. Material-to-key mapping
// ============================================================
export const MATERIAL_KEY_MAP = {
  '知识产权证书': 'has_ip',
  '知识产权证明材料': 'has_ip',
  '高新技术企业认定证书': 'has_high_tech_cert',
  '中小企业认定证明': 'is_sme',
  '科技型中小企业评价入库': 'is_sme',
};

// ============================================================
// 3. Sample Company (default)
// ============================================================
export const SAMPLE_COMPANY = {
  id: 'sample-001',
  name: '衍策引擎（上海）科技有限公司',
  industry: '人工智能',
  stage: '成长期',
  region: '上海市徐汇区',
  park: '徐汇AI创新园区',
  employees: 45,
  rd_ratio_percent: 22,
  has_ip: true,
  ip_count: 6,
  has_high_tech_cert: false,
  is_sme: true,
  founded_year: 2021,
  business_scope: '人工智能技术研发、政策数据分析、企业服务平台开发',
};

// ============================================================
// 4. Policy Extraction (6-field structured extraction)
// ============================================================

/**
 * Extract 6 structured fields from policy text.
 * Pattern-based extraction; for higher accuracy, use LLM via MCP host.
 */
export function extractPolicyFields(text) {
  if (!text || typeof text !== 'string') {
    return emptyExtraction();
  }

  const clean = text.replace(/\s+/g, ' ').trim();

  return {
    policy_name: extractName(clean),
    issuing_authority: extractAuthority(clean),
    target_industry: extractIndustry(clean),
    subsidy_amount: extractSubsidy(clean),
    application_deadline: extractDeadline(clean),
    material_requirements: extractMaterials(clean),
  };
}

function emptyExtraction() {
  return {
    policy_name: '',
    issuing_authority: '',
    target_industry: '',
    subsidy_amount: '',
    application_deadline: '',
    material_requirements: [],
  };
}

function extractName(text) {
  // Look for "关于...的通知/意见/办法/方案"
  const titleMatch = text.match(/关于[^，。]{4,60}(?:通知|意见|办法|方案|细则|规定)/);
  if (titleMatch) return titleMatch[0];

  // Look for policy name patterns
  const namePatterns = [
    /(?:政策|项目|计划|工程)[名称：:]+\s*([^，。\n]{4,40})/,
    /([^\n]{4,50}(?:专项资金|扶持资金|补贴|奖励)[^\n]{0,20})/,
    /([^\n]{4,50}(?:产业|行业)[^\n]{0,20}(?:政策|扶持|支持))/,
  ];
  for (const pat of namePatterns) {
    const m = text.match(pat);
    if (m) return (m[1] || m[0]).trim();
  }
  return '';
}

function extractAuthority(text) {
  const authorityPatterns = [
    /(?:发文机关|发文单位|发布机构|主管部门)[：:]\s*([^，。\n]{2,30})/,
    /((?:国家|省|市|区|县)(?:人民)?政府[^，。\n]{0,15})/,
    /((?:工业和信息|科学技术|发展改革|商务|财政)[^，。\n]{0,10}(?:委员会|局|厅|部))/,
  ];
  for (const pat of authorityPatterns) {
    const m = text.match(pat);
    if (m) return (m[1] || m[0]).trim();
  }
  return '';
}

function extractIndustry(text) {
  const INDUSTRIES = [
    '人工智能', '大数据', '云计算', '物联网', '区块链', '集成电路', '半导体',
    '芯片', '生物医药', '新材料', '新能源', '智能制造', '先进制造', '航空航天',
    '自动驾驶', '智能机器人', '智能医疗', '文化创意', '数字经济', '金融科技',
  ];
  const found = INDUSTRIES.filter(ind => text.includes(ind));
  return found.length > 0 ? found.join('、') : '';
}

function extractSubsidy(text) {
  const subsidyPatterns = [
    /(?:最高|不超过|上限)[^\n]{0,10}(\d[\d,.]*\s*(?:万|亿)\s*元)/,
    /(?:资助|补贴|奖励|扶持|支持)[^\n]{0,15}(\d[\d,.]*\s*(?:万|亿)\s*元)/,
    /(\d[\d,.]*\s*(?:万|亿)\s*元)[^\n]{0,10}(?:资金|补贴|奖励|资助)/,
    /(专项资金[^\n]{0,20})/,
  ];
  for (const pat of subsidyPatterns) {
    const m = text.match(pat);
    if (m) return (m[1] || m[0]).trim();
  }
  return '';
}

function extractDeadline(text) {
  // ISO date patterns
  const isoMatch = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?)/);
  if (isoMatch) return isoMatch[1];

  // Relative dates
  const relPatterns = [
    /(?:截止|申报截止|申请截止)[^\n]{0,10}(\d{4}年\d{1,2}月\d{1,2}日)/,
    /(?:截止|申报截止|申请截止)[^\n]{0,10}(\d{1,2}月\d{1,2}日)/,
    /(\d{4}年\d{1,2}月\d{1,2}日)[^\n]{0,5}(?:前|截止|到期)/,
  ];
  for (const pat of relPatterns) {
    const m = text.match(pat);
    if (m) return m[1];
  }
  return '';
}

function extractMaterials(text) {
  const MATERIALS = [
    '营业执照', '高新技术企业认定证书', '知识产权证书', '知识产权证明材料',
    '中小企业认定证明', '科技型中小企业评价入库',
    '审计报告', '财务报表', '近三年审计报告', '近三年财务报表', '近三年财务报告',
    '企业所得税纳税申报表', '近一年企业所得税纳税申报表',
    '项目计划书', '项目可行性研究报告', '项目实施方案',
    '租赁合同', '租赁合同复印件', '租金发票',
    'AI产品或服务说明文档', 'AI产品/服务说明',
    '近一年营收证明', '企业职工和科技人员情况说明',
    '高新技术企业认定申请书', '知识产权证明材料',
  ];
  return MATERIALS.filter(m => text.includes(m));
}

// ============================================================
// 5. Matching Engine (8-dimension weighted scoring)
// ============================================================

/**
 * Evaluate a single company-policy pair.
 * Returns: { policy, score, reasons, gaps, risks, recommendation, human_review_points }
 */
export function evaluateMatch(company, policy) {
  let score = 0;
  const reasons = [];
  const gaps = [];
  const risks = [...(policy.risk_notes || [])];
  const humanReview = [];

  // 1. Industry (30%)
  const industry = company.industry || '';
  if (policy.industry_tags && policy.industry_tags.includes(industry)) {
    score += WEIGHT.INDUSTRY;
    reasons.push(`行业匹配: ${industry}`);
  } else {
    reasons.push(`行业不匹配: 企业=${industry}, 政策要求=${(policy.industry_tags || []).join('/')}`);
  }

  // 2. Region (20%)
  const region = company.region || '';
  if (policy.region && (region.includes(policy.region) || policy.region.includes(region) || policy.region === '全国')) {
    score += WEIGHT.REGION;
    reasons.push(`区域匹配: ${region} ↔ ${policy.region}`);
  } else {
    reasons.push(`区域不匹配: 企业=${region}, 政策区域=${policy.region}`);
  }

  // 3. Stage (15%)
  const stage = company.stage || '';
  if (policy.stage_tags && policy.stage_tags.includes(stage)) {
    score += WEIGHT.STAGE;
    reasons.push(`阶段匹配: ${stage}`);
  } else {
    reasons.push(`阶段不匹配: 企业=${stage}, 政策要求=${(policy.stage_tags || []).join('/')}`);
  }

  // 4. Employee count (10%)
  const employees = company.employees || 0;
  if (employees >= (policy.min_employees || 0) && employees <= (policy.max_employees || 100000)) {
    score += WEIGHT.SIZE;
    reasons.push(`人员规模匹配: ${employees}人`);
  } else {
    reasons.push(`人员规模不匹配: ${employees}人, 政策要求${policy.min_employees}-${policy.max_employees}`);
  }

  // 5. R&D ratio (10%)
  const rdRatio = company.rd_ratio_percent || 0;
  if (rdRatio >= (policy.min_rd_ratio || 0)) {
    score += WEIGHT.RD;
    reasons.push(`研发占比达标: ${rdRatio}% >= ${policy.min_rd_ratio}%`);
  } else {
    reasons.push(`研发占比不足: ${rdRatio}% < ${policy.min_rd_ratio}%`);
  }

  // 6. IP (5%)
  const hasIp = company.has_ip || false;
  if (policy.require_ip && !hasIp) {
    gaps.push('需要具备知识产权证书');
    risks.push('缺少知识产权，可能影响申请资格');
  } else if (policy.require_ip && hasIp) {
    score += WEIGHT.IP;
    reasons.push(`知识产权达标: ${company.ip_count || 0}项`);
  } else if (hasIp) {
    reasons.push(`企业拥有知识产权 (${company.ip_count || 0}项)`);
  }

  // 7. High-tech cert (5%)
  const hasHighTech = company.has_high_tech_cert || false;
  if (policy.require_high_tech && !hasHighTech) {
    gaps.push('需要高新技术企业认定');
    risks.push('尚未获得高企认定，需先完成认定流程');
    humanReview.push('高企认定申请需财务与法务部门协同准备');
  } else if (policy.require_high_tech && hasHighTech) {
    score += WEIGHT.CERT;
    reasons.push('已获得高新技术企业认定');
  }

  // 8. SME status (5%)
  const isSme = company.is_sme || false;
  if (policy.require_sme && !isSme) {
    gaps.push('需要中小企业认定');
  } else if (policy.require_sme && isSme) {
    score += WEIGHT.SME;
    reasons.push('符合中小企业认定标准');
  }

  // Material gap analysis (dedup against dimension-level flags)
  const flaggedKeys = new Set();
  if (policy.require_ip && !hasIp) flaggedKeys.add('has_ip');
  if (policy.require_high_tech && !hasHighTech) flaggedKeys.add('has_high_tech_cert');
  if (policy.require_sme && !isSme) flaggedKeys.add('is_sme');

  for (const material of (policy.required_materials || [])) {
    const key = MATERIAL_KEY_MAP[material];
    if (key && flaggedKeys.has(key)) continue;
    if (key && !company[key]) {
      gaps.push(`缺少材料: ${material}`);
    } else if (!key) {
      humanReview.push(`需人工确认: ${material}`);
    }
  }

  // Deadline risk
  if (policy.deadline) {
    risks.push(`申请截止日期: ${policy.deadline}，请尽快准备`);
  }

  const recommendation = makeRecommendation(score, gaps);

  return { policy, score, reasons, gaps, risks, recommendation, human_review_points: humanReview };
}

/**
 * Match company against multiple policies. Returns sorted results.
 */
export function matchPolicies(company, policies, minScore = 0) {
  return policies
    .map(p => evaluateMatch(company, p))
    .filter(m => m.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

/**
 * Generate recommendation string.
 */
export function makeRecommendation(score, gaps) {
  if (score >= 70 && gaps.length === 0) return '推荐申请';
  if (score >= 50 && gaps.length <= 2) return '建议补充材料后申请';
  if (score >= 30) return '建议进一步评估';
  return '暂不推荐';
}

// ============================================================
// 6. Ticket Generation
// ============================================================

export function generateTicket(company, matched) {
  const now = new Date();
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const tm = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const ticketId = `SVC-${ts}-${tm}`;
  const p = matched.policy;

  return {
    ticket_id: ticketId,
    created_at: now.toLocaleString('zh-CN'),
    company_name: company.name,
    policy_name: p.name,
    policy_level: p.level,
    issuing_authority: p.issuing_authority,
    match_score: matched.score,
    priority: matched.score >= 80 ? '紧急' : matched.score >= 50 ? '一般' : '常规',
    recommendation: matched.recommendation,
    subsidy: p.subsidy_description || '详见政策原文',
    deadline: p.deadline || '详见政策原文',
    gaps: matched.gaps,
    materials: p.required_materials || [],
    risks: matched.risks,
    source_url: p.source_url,
  };
}

export function ticketToParkOpsText(ticket) {
  const lines = [
    '═══════════════════════════════════════',
    '  ParkOps 服务工单  |  yance.ai',
    '═══════════════════════════════════════',
    '',
    `工单编号：${ticket.ticket_id}`,
    `创建时间：${ticket.created_at}`,
    `来源工具：YanCe Policy Agent v2.0`,
    '',
    '── 企业信息 ──',
    `企业名称：${ticket.company_name}`,
    '',
    '── 政策信息 ──',
    `政策名称：${ticket.policy_name}`,
    `政策级别：${ticket.policy_level}`,
    `发文机构：${ticket.issuing_authority}`,
    `补贴内容：${ticket.subsidy}`,
    `截止日期：${ticket.deadline}`,
    `来源链接：${ticket.source_url}`,
    '',
    '── 匹配结果 ──',
    `匹配度：${ticket.match_score}/100`,
    `优先级：${ticket.priority}`,
    `推荐动作：${ticket.recommendation}`,
    '',
    '── 材料要求 ──',
    ...ticket.materials.map((m, i) => `  ${i + 1}. ${m}`),
    '',
    '── 材料差距 ──',
    ...(ticket.gaps.length > 0 ? ticket.gaps.map(g => `  ⚠ ${g}`) : ['  无重大材料缺失']),
    '',
    '── 风险提示 ──',
    ...(ticket.risks.length > 0 ? ticket.risks.map(r => `  ⚡ ${r}`) : ['  无重大风险']),
    '',
    '═══════════════════════════════════════',
    '  Generated by yance.ai | YanCe Policy Agent v2.0',
    '═══════════════════════════════════════',
  ];
  return lines.join('\n');
}

// ============================================================
// 7. Report Generation
// ============================================================

export function generateReport(company, results) {
  const now = new Date();
  const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`;
  const reportId = `YC-${ts}`;

  const lines = [
    '# 政策匹配服务报告',
    '',
    `> 生成时间: ${now.toLocaleString('zh-CN')}`,
    `> 生成引擎: YanCe Policy Agent v2.0`,
    `> 报告编号: ${reportId}`,
    '',
    '---',
    '',
    '## 1. 企业基本信息',
    '',
    '| 字段 | 内容 |',
    '|------|------|',
    `| 企业名称 | ${company.name} |`,
    `| 所属行业 | ${company.industry} |`,
    `| 发展阶段 | ${company.stage} |`,
    `| 所在区域 | ${company.region} |`,
    `| 所在园区 | ${company.park || 'N/A'} |`,
    `| 员工人数 | ${company.employees}人 |`,
    `| 研发占比 | ${company.rd_ratio_percent}% |`,
    `| 知识产权 | ${company.ip_count || 0}项 |`,
    `| 高企认定 | ${company.has_high_tech_cert ? '是' : '否'} |`,
    `| 中小企业 | ${company.is_sme ? '是' : '否'} |`,
    '',
    '## 2. 匹配政策总览',
    '',
    '| # | 政策名称 | 匹配度 | 级别 | 推荐动作 |',
    '|---|---------|--------|------|---------|',
  ];

  results.forEach((m, i) => {
    lines.push(`| ${i + 1} | ${m.policy.name} | ${m.score}/100 | ${m.policy.level} | ${m.recommendation} |`);
  });

  const recCounts = {};
  results.forEach(m => { recCounts[m.recommendation] = (recCounts[m.recommendation] || 0) + 1; });
  const summaryParts = Object.entries(recCounts).map(([k, v]) => `${k} ${v} 项`);
  lines.push('');
  lines.push(`**匹配统计:** 共匹配 ${results.length} 项政策，${summaryParts.join('，')}。`);

  lines.push('', '## 3. 政策详细分析');
  results.forEach((m, i) => {
    const p = m.policy;
    lines.push('');
    lines.push(`### 3.${i + 1} ${p.name}`);
    lines.push(`- **匹配度:** ${m.score}/100`);
    lines.push(`- **级别:** ${p.level} | **发布机构:** ${p.issuing_authority}`);
    lines.push(`- **截止日期:** ${p.deadline || 'N/A'}`);
    lines.push(`- **扶持内容:** ${p.subsidy_description || 'N/A'}`);
    lines.push('', '**匹配原因:**');
    m.reasons.forEach(r => lines.push(`- ${r}`));
    lines.push('', '**材料差距:**');
    if (m.gaps.length > 0) m.gaps.forEach(g => lines.push(`- [ ] ${g}`));
    else lines.push('- 无重大材料缺失');
    lines.push('', '**风险提示:**');
    if (m.risks.length > 0) m.risks.forEach(r => lines.push(`- ${r}`));
    else lines.push('- 无重大风险');
    if (m.human_review_points.length > 0) {
      lines.push('', '**人工复核点:**');
      m.human_review_points.forEach(h => lines.push(`- ${h}`));
    }
  });

  // Material gap summary
  lines.push('', '## 4. 材料差距汇总');
  const allGaps = {};
  results.forEach(m => m.gaps.forEach(g => {
    if (!allGaps[g]) allGaps[g] = [];
    allGaps[g].push(m.policy.name);
  }));
  if (Object.keys(allGaps).length > 0) {
    lines.push('| 材料名称 | 关联政策数 | 紧急程度 |', '|---------|-----------|---------|');
    Object.entries(allGaps).forEach(([gap, policies]) => {
      lines.push(`| ${gap} | ${policies.length}项政策 | ${policies.length > 1 ? '高' : '中'} |`);
    });
  } else {
    lines.push('无材料差距。');
  }

  // Service tickets
  lines.push('', '## 5. 服务工单建议');
  results.slice(0, 4).forEach((m, i) => {
    const priority = m.score >= 80 ? '紧急' : m.score >= 50 ? '一般' : '常规';
    lines.push(`### 工单 ${i + 1}: ${m.policy.name} [${priority}]`);
    lines.push(`- 匹配度: ${m.score}/100 | 推荐: ${m.recommendation}`);
    if (m.gaps.length > 0) m.gaps.slice(0, 3).forEach(g => lines.push(`- [ ] 准备: ${g}`));
    lines.push('');
  });

  // Algorithm
  lines.push('## 6. 匹配算法说明',
    '| 维度 | 权重 |', '|------|------|',
    '| 行业匹配 | 30% |', '| 区域匹配 | 20% |', '| 阶段匹配 | 15% |',
    '| 人员规模 | 10% |', '| 研发占比 | 10% |',
    '| 知识产权 | 5% |', '| 高企认定 | 5% |', '| 中小企业 | 5% |',
    '', '---',
    '本报告由 YanCe Policy Agent v2.0 匹配引擎自动生成，结果**仅供参考**。所有推荐需**人工复核**后方可执行。',
    '*Generated by yance.ai*');

  return lines.join('\n');
}

// ============================================================
// Helpers
// ============================================================
function pad(n) { return String(n).padStart(2, '0'); }

// ============================================================
// Browser globals (for Chrome/Safari extension compatibility)
// ============================================================
if (typeof window !== 'undefined') {
  window.WEIGHT = WEIGHT;
  window.MATERIAL_KEY_MAP = MATERIAL_KEY_MAP;
  window.SAMPLE_COMPANY = SAMPLE_COMPANY;
  window.extractPolicyFields = extractPolicyFields;
  window.evaluateMatch = evaluateMatch;
  window.matchPolicies = matchPolicies;
  window.makeRecommendation = makeRecommendation;
  window.generateTicket = generateTicket;
  window.ticketToParkOpsText = ticketToParkOpsText;
  window.generateReport = generateReport;
}
