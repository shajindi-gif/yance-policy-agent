/**
 * matching.js — YanCe Policy Matching Engine
 * Ported from policy_matcher.py (8-dimension weighted scoring)
 * Brand: yance.ai
 */

// ============================================
// Scoring Weights (aligned with policy_matcher.py)
// ============================================
const WEIGHT = {
  INDUSTRY: 30,  // 行业匹配
  REGION:   20,  // 区域匹配
  STAGE:    15,  // 发展阶段
  SIZE:     10,  // 员工规模
  RD:       10,  // 研发占比
  IP:        5,  // 知识产权
  CERT:      5,  // 高企认定
  SME:       5,  // 中小企业
};

// ============================================
// Sample Policies (aligned with main.py SAMPLE_POLICIES)
// ============================================
const SAMPLE_POLICIES = [
  {
    name: '上海市高新技术企业认定',
    level: '市级', region: '上海市',
    industry_tags: ['人工智能', '大数据', '集成电路', '生物医药', '新材料'],
    stage_tags: ['初创期', '成长期', '成熟期'],
    min_employees: 10, max_employees: 5000,
    min_rd_ratio: 15.0,
    require_ip: true, require_high_tech: false, require_sme: false,
    required_materials: ['高新技术企业认定申请书', '近三年审计报告', '近一年企业所得税纳税申报表', '企业职工和科技人员情况说明', '知识产权证书'],
    source_url: 'https://stcsm.sh.gov.cn/high-tech-enterprise',
    publish_date: '2024-03-01',
    issuing_authority: '上海市科学技术委员会',
    deadline: '2025-09-30',
    subsidy_description: '企业所得税减按15%征收，研发费用加计扣除，市区两级奖励',
    risk_notes: ['近三年审计报告需包含完整年度'],
  },
  {
    name: '徐汇区人工智能产业专项扶持',
    level: '区级', region: '徐汇区',
    industry_tags: ['人工智能', '智能机器人', '自动驾驶'],
    stage_tags: ['初创期', '成长期'],
    min_employees: 5, max_employees: 500,
    min_rd_ratio: 10.0,
    require_ip: true, require_high_tech: false, require_sme: false,
    required_materials: ['AI产品或服务说明文档', '近一年营收证明', '知识产权证明材料', '知识产权证书'],
    source_url: 'https://www.xh.sh.cn/ai-policy-2024',
    publish_date: '2024-06-15',
    issuing_authority: '徐汇区商务委员会',
    deadline: '2025-10-15',
    subsidy_description: '最高200万元专项资金支持，办公场地租金补贴',
    risk_notes: [],
  },
  {
    name: '上海市科技型中小企业技术创新资金',
    level: '市级', region: '上海市',
    industry_tags: ['人工智能', '大数据', '生物医药', '新材料', '新能源'],
    stage_tags: ['初创期', '成长期'],
    min_employees: 5, max_employees: 500,
    min_rd_ratio: 5.0,
    require_ip: false, require_high_tech: false, require_sme: true,
    required_materials: ['科技型中小企业评价入库', '项目计划书', '近三年财务报表'],
    source_url: 'https://stcsm.sh.gov.cn/sme-innovation-fund',
    publish_date: '2024-04-10',
    issuing_authority: '上海市科学技术委员会',
    deadline: '2025-08-31',
    subsidy_description: '最高50万元创新资金支持',
    risk_notes: ['需先完成科技型中小企业评价入库'],
  },
  {
    name: '徐汇区科技创新企业租金补贴',
    level: '区级', region: '徐汇区',
    industry_tags: ['人工智能', '大数据', '集成电路', '生物医药', '文化创意'],
    stage_tags: ['初创期', '成长期', '成熟期'],
    min_employees: 5, max_employees: 1000,
    min_rd_ratio: 0.0,
    require_ip: false, require_high_tech: false, require_sme: true,
    required_materials: ['租赁合同复印件', '租金发票'],
    source_url: 'https://www.xh.sh.cn/rent-subsidy-2024',
    publish_date: '2024-01-20',
    issuing_authority: '徐汇区科学技术委员会',
    deadline: '2025-12-31',
    subsidy_description: '最高30%租金补贴，最长补贴3年',
    risk_notes: [],
  },
  {
    name: '国家中小企业发展专项资金',
    level: '国家级', region: '全国',
    industry_tags: ['人工智能', '大数据', '先进制造', '新材料', '新能源'],
    stage_tags: ['成长期', '成熟期'],
    min_employees: 20, max_employees: 5000,
    min_rd_ratio: 8.0,
    require_ip: true, require_high_tech: false, require_sme: true,
    required_materials: ['中小企业认定证明', '知识产权证书', '近三年审计报告', '项目可行性研究报告'],
    source_url: 'https://www.miit.gov.cn/sme-development-fund',
    publish_date: '2024-02-01',
    issuing_authority: '工业和信息化部',
    deadline: '2025-11-30',
    subsidy_description: '最高100万元专项资金支持',
    risk_notes: [],
  },
  {
    name: '上海市人工智能产业发展专项资金',
    level: '市级', region: '上海市',
    industry_tags: ['人工智能', '智能机器人', '自动驾驶', '智能医疗'],
    stage_tags: ['成长期', '成熟期'],
    min_employees: 30, max_employees: 10000,
    min_rd_ratio: 15.0,
    require_ip: true, require_high_tech: true, require_sme: false,
    required_materials: ['高新技术企业认定证书', '知识产权证书', 'AI产品/服务说明', '近一年营收证明', '项目实施方案'],
    source_url: 'https://stcsm.sh.gov.cn/ai-industry-fund',
    publish_date: '2024-05-20',
    issuing_authority: '上海市科学技术委员会',
    deadline: '2025-12-15',
    subsidy_description: '最高500万元专项资金，配套融资支持',
    risk_notes: ['需要已获得高新技术企业认定'],
  },
];

// ============================================
// Default Sample Company (aligned with main.py SAMPLE_COMPANY)
// ============================================
const SAMPLE_COMPANY = {
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

// ============================================
// Material-to-key mapping
// ============================================
const MATERIAL_KEY_MAP = {
  '知识产权证书': 'has_ip',
  '知识产权证明材料': 'has_ip',
  '高新技术企业认定证书': 'has_high_tech_cert',
  '中小企业认定证明': 'is_sme',
  '科技型中小企业评价入库': 'is_sme',
};

// ============================================
// Matching Engine
// ============================================

/**
 * Evaluate a single company-policy pair.
 * Returns a MatchedPolicy object.
 */
function evaluateMatch(company, policy) {
  let score = 0;
  const reasons = [];
  const gaps = [];
  const risks = [...(policy.risk_notes || [])];
  const humanReview = [];

  // 1. Industry (30)
  const industry = company.industry || '';
  if (policy.industry_tags && policy.industry_tags.includes(industry)) {
    score += WEIGHT.INDUSTRY;
    reasons.push(`行业匹配: ${industry}`);
  } else {
    reasons.push(`行业不匹配: 企业=${industry}, 政策要求=${(policy.industry_tags || []).join('/')}`);
  }

  // 2. Region (20)
  const region = company.region || '';
  if (policy.region && (region.includes(policy.region) || policy.region.includes(region) || policy.region === '全国')) {
    score += WEIGHT.REGION;
    reasons.push(`区域匹配: ${region} ↔ ${policy.region}`);
  } else {
    reasons.push(`区域不匹配: 企业=${region}, 政策区域=${policy.region}`);
  }

  // 3. Stage (15)
  const stage = company.stage || '';
  if (policy.stage_tags && policy.stage_tags.includes(stage)) {
    score += WEIGHT.STAGE;
    reasons.push(`阶段匹配: ${stage}`);
  } else {
    reasons.push(`阶段不匹配: 企业=${stage}, 政策要求=${(policy.stage_tags || []).join('/')}`);
  }

  // 4. Employee count (10)
  const employees = company.employees || 0;
  if (employees >= (policy.min_employees || 0) && employees <= (policy.max_employees || 100000)) {
    score += WEIGHT.SIZE;
    reasons.push(`人员规模匹配: ${employees}人`);
  } else {
    reasons.push(`人员规模不匹配: ${employees}人, 政策要求${policy.min_employees}-${policy.max_employees}`);
  }

  // 5. R&D ratio (10)
  const rdRatio = company.rd_ratio_percent || 0;
  if (rdRatio >= (policy.min_rd_ratio || 0)) {
    score += WEIGHT.RD;
    reasons.push(`研发占比达标: ${rdRatio}% >= ${policy.min_rd_ratio}%`);
  } else {
    reasons.push(`研发占比不足: ${rdRatio}% < ${policy.min_rd_ratio}%`);
  }

  // 6. IP (5)
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

  // 7. High-tech cert (5)
  const hasHighTech = company.has_high_tech_cert || false;
  if (policy.require_high_tech && !hasHighTech) {
    gaps.push('需要高新技术企业认定');
    risks.push('尚未获得高企认定，需先完成认定流程');
    humanReview.push('高企认定申请需财务与法务部门协同准备');
  } else if (policy.require_high_tech && hasHighTech) {
    score += WEIGHT.CERT;
    reasons.push('已获得高新技术企业认定');
  }

  // 8. SME status (5)
  const isSme = company.is_sme || false;
  if (policy.require_sme && !isSme) {
    gaps.push('需要中小企业认定');
  } else if (policy.require_sme && isSme) {
    score += WEIGHT.SME;
    reasons.push('符合中小企业认定标准');
  }

  // Material gap analysis
  for (const material of (policy.required_materials || [])) {
    const key = MATERIAL_KEY_MAP[material];
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

  // Recommendation
  const recommendation = makeRecommendation(score, gaps, risks);

  return {
    policy,
    score,
    reasons,
    gaps,
    risks,
    recommendation,
    human_review_points: humanReview,
  };
}

/**
 * Match a company against a list of policies.
 * Returns sorted results (highest score first).
 */
function matchPolicies(company, policies, minScore = 0) {
  const results = [];
  for (const policy of policies) {
    const matched = evaluateMatch(company, policy);
    if (matched.score >= minScore) {
      results.push(matched);
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Generate recommendation based on score and gaps.
 */
function makeRecommendation(score, gaps) {
  if (score >= 70 && gaps.length === 0) return '推荐申请';
  if (score >= 50 && gaps.length <= 2) return '建议补充材料后申请';
  if (score >= 30) return '建议进一步评估';
  return '暂不推荐';
}

/**
 * Get score color class.
 */
function getScoreColor(score) {
  if (score >= 70) return '#34d399';  // green
  if (score >= 50) return '#fbbf24';  // yellow
  return '#94a3b8';  // gray
}

/**
 * Generate a service ticket for a matched policy.
 */
function generateTicket(company, matched) {
  const now = new Date();
  const ticketId = `SVC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const p = matched.policy;
  const priority = matched.score >= 80 ? '紧急' : matched.score >= 50 ? '一般' : '常规';

  return {
    ticket_id: ticketId,
    created_at: now.toLocaleString('zh-CN'),
    company_name: company.name,
    policy_name: p.name,
    policy_level: p.level,
    issuing_authority: p.issuing_authority,
    match_score: matched.score,
    priority,
    recommendation: matched.recommendation,
    subsidy: p.subsidy_description || '详见政策原文',
    deadline: p.deadline || '详见政策原文',
    gaps: matched.gaps,
    materials: p.required_materials || [],
    risks: matched.risks,
    source_url: p.source_url,
  };
}

/**
 * Generate ParkOps clipboard text from a ticket.
 */
function ticketToParkOpsText(ticket) {
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

/**
 * Generate a concise service report for clipboard export.
 */
function generateReport(company, results) {
  const now = new Date();
  const reportId = `YC-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

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
    `| 字段 | 内容 |`,
    `|------|------|`,
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

  // Per-policy detail
  lines.push('');
  lines.push('## 3. 政策详细分析');
  results.forEach((m, i) => {
    const p = m.policy;
    lines.push('');
    lines.push(`### 3.${i + 1} ${p.name}`);
    lines.push(`- **匹配度:** ${m.score}/100`);
    lines.push(`- **级别:** ${p.level} | **发布机构:** ${p.issuing_authority}`);
    lines.push(`- **截止日期:** ${p.deadline || 'N/A'}`);
    lines.push(`- **扶持内容:** ${p.subsidy_description || 'N/A'}`);
    lines.push('');
    lines.push('**匹配原因:**');
    m.reasons.forEach(r => lines.push(`- ${r}`));
    lines.push('');
    lines.push('**材料差距:**');
    if (m.gaps.length > 0) {
      m.gaps.forEach(g => lines.push(`- [ ] ${g}`));
    } else {
      lines.push('- 无重大材料缺失');
    }
    lines.push('');
    lines.push('**风险提示:**');
    if (m.risks.length > 0) {
      m.risks.forEach(r => lines.push(`- ${r}`));
    } else {
      lines.push('- 无重大风险');
    }
    if (m.human_review_points.length > 0) {
      lines.push('');
      lines.push('**人工复核点:**');
      m.human_review_points.forEach(h => lines.push(`- ${h}`));
    }
  });

  // Material gap summary
  lines.push('');
  lines.push('## 4. 材料差距汇总');
  const allGaps = {};
  results.forEach(m => {
    m.gaps.forEach(g => {
      if (!allGaps[g]) allGaps[g] = [];
      allGaps[g].push(m.policy.name);
    });
  });
  if (Object.keys(allGaps).length > 0) {
    lines.push('| 材料名称 | 关联政策数 | 紧急程度 |');
    lines.push('|---------|-----------|---------|');
    Object.entries(allGaps).forEach(([gap, policies]) => {
      const urgency = policies.length > 1 ? '高' : '中';
      lines.push(`| ${gap} | ${policies.length}项政策 | ${urgency} |`);
    });
  } else {
    lines.push('无材料差距。');
  }

  // Service tickets
  lines.push('');
  lines.push('## 5. 服务工单建议');
  results.slice(0, 4).forEach((m, i) => {
    const priority = m.score >= 80 ? '紧急' : m.score >= 50 ? '一般' : '常规';
    lines.push(`### 工单 ${i + 1}: ${m.policy.name} [${priority}]`);
    lines.push(`- 匹配度: ${m.score}/100 | 推荐: ${m.recommendation}`);
    if (m.gaps.length > 0) {
      m.gaps.slice(0, 3).forEach(g => lines.push(`- [ ] 准备: ${g}`));
    }
    lines.push('');
  });

  // Algorithm explanation
  lines.push('## 6. 匹配算法说明');
  lines.push('| 维度 | 权重 |');
  lines.push('|------|------|');
  lines.push('| 行业匹配 | 30% |');
  lines.push('| 区域匹配 | 20% |');
  lines.push('| 阶段匹配 | 15% |');
  lines.push('| 人员规模 | 10% |');
  lines.push('| 研发占比 | 10% |');
  lines.push('| 知识产权 | 5% |');
  lines.push('| 高企认定 | 5% |');
  lines.push('| 中小企业 | 5% |');

  // Disclaimer
  lines.push('');
  lines.push('---');
  lines.push('本报告由 YanCe Policy Agent v2.0 匹配引擎自动生成，结果**仅供参考**。所有推荐需**人工复核**后方可执行。');
  lines.push('*Generated by yance.ai*');

  return lines.join('\n');
}
