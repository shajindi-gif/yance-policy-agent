/**
 * test/run.js — YanCe Policy Agent Engine Tests
 * Verifies the core engine is functional and produces correct results.
 */
import {
  evaluateMatch,
  matchPolicies,
  extractPolicyFields,
  generateTicket,
  ticketToParkOpsText,
  generateReport,
  makeRecommendation,
  SAMPLE_COMPANY,
  WEIGHT,
} from '../src/policy-engine.js';
import { getDB } from '../src/policy-db.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

// ============================================================
// Test 1: Database Loading
// ============================================================
console.log('\n[Test 1] Database Loading');
const db = getDB();
const policies = db.getAll();
assert(policies.length >= 10, `数据库包含 ${policies.length} 条政策 (≥10)`);
assert(db.getById('SH-HT-001') !== null, '可按 ID 查询政策 SH-HT-001');
assert(db.getById('NAT-AI-001') !== null, '可按 ID 查询政策 NAT-AI-001');
assert(db.search('人工智能').length > 0, '关键词搜索 "人工智能" 有结果');
assert(db.filter({ region: '徐汇区' }).length > 0, '区域筛选 "徐汇区" 有结果');

// ============================================================
// Test 2: Matching Engine — Sample Company
// ============================================================
console.log('\n[Test 2] Matching Engine — Sample Company');
const results = matchPolicies(SAMPLE_COMPANY, policies, 0);
assert(results.length > 0, `匹配到 ${results.length} 条政策`);
assert(results[0].score > 0, `最高匹配分 ${results[0].score}/100`);
assert(typeof results[0].recommendation === 'string', '推荐动作是字符串');
assert(results[0].reasons.length > 0, '匹配原因非空');

// Verify score is deterministic
const results2 = matchPolicies(SAMPLE_COMPANY, policies, 0);
assert(results[0].score === results2[0].score, '匹配结果确定性（两次运行分数一致）');

// ============================================================
// Test 3: Scoring Weights
// ============================================================
console.log('\n[Test 3] Scoring Weights');
const totalWeight = Object.values(WEIGHT).reduce((a, b) => a + b, 0);
assert(totalWeight === 100, `权重总和 = ${totalWeight} (应为100)`);

// ============================================================
// Test 4: Recommendation Logic
// ============================================================
console.log('\n[Test 4] Recommendation Logic');
assert(makeRecommendation(80, []) === '推荐申请', '≥70 + 无缺口 → 推荐申请');
assert(makeRecommendation(55, ['缺一个']) === '建议补充材料后申请', '≥50 + ≤2缺口 → 补充材料');
assert(makeRecommendation(35, []) === '建议进一步评估', '≥30 → 进一步评估');
assert(makeRecommendation(20, []) === '暂不推荐', '<30 → 暂不推荐');

// ============================================================
// Test 5: Single Policy Evaluation
// ============================================================
console.log('\n[Test 5] Single Policy Evaluation');
const htPolicy = db.getById('SH-HT-001');
if (htPolicy) {
  const match = evaluateMatch(SAMPLE_COMPANY, htPolicy);
  assert(match.score >= 0 && match.score <= 100, `高企认定匹配分: ${match.score}/100`);
  assert(Array.isArray(match.gaps), '材料缺口是数组');
  assert(Array.isArray(match.risks), '风险提示是数组');
  assert(Array.isArray(match.reasons), '匹配原因是数组');
}

// ============================================================
// Test 6: Policy Extraction
// ============================================================
console.log('\n[Test 6] Policy Extraction (6-field)');
const sampleText = `关于上海市人工智能产业发展专项资金的通知
发文单位：上海市科学技术委员会
面向人工智能、智能机器人等行业的企业
最高500万元专项资金支持
申请截止日期：2026年12月15日
申请材料包括：高新技术企业认定证书、知识产权证书、AI产品/服务说明、近一年营收证明、项目实施方案`;

const extracted = extractPolicyFields(sampleText);
assert(extracted.policy_name.length > 0, `提取政策名称: ${extracted.policy_name}`);
assert(extracted.issuing_authority.length > 0, `提取发文机构: ${extracted.issuing_authority}`);
assert(extracted.target_industry.length > 0, `提取目标行业: ${extracted.target_industry}`);
assert(extracted.subsidy_amount.length > 0, `提取补贴金额: ${extracted.subsidy_amount}`);
assert(extracted.application_deadline.length > 0, `提取截止日期: ${extracted.application_deadline}`);
assert(extracted.material_requirements.length > 0, `提取材料要求: ${extracted.material_requirements.length}项`);

// ============================================================
// Test 7: Ticket Generation
// ============================================================
console.log('\n[Test 7] Ticket Generation');
if (htPolicy) {
  const matched = evaluateMatch(SAMPLE_COMPANY, htPolicy);
  const ticket = generateTicket(SAMPLE_COMPANY, matched);
  assert(ticket.ticket_id.startsWith('SVC-'), `工单ID格式正确: ${ticket.ticket_id}`);
  assert(ticket.company_name === SAMPLE_COMPANY.name, '工单企业名称正确');
  assert(ticket.policy_name === htPolicy.name, '工单政策名称正确');
  assert(typeof ticket.priority === 'string', '优先级是字符串');

  const parkOps = ticketToParkOpsText(ticket);
  assert(parkOps.includes('ParkOps'), 'ParkOps 文本包含标识');
  assert(parkOps.includes(ticket.ticket_id), 'ParkOps 文本包含工单ID');
}

// ============================================================
// Test 8: Report Generation
// ============================================================
console.log('\n[Test 8] Report Generation');
const report = generateReport(SAMPLE_COMPANY, results);
assert(report.includes('# 政策匹配服务报告'), '报告包含标题');
assert(report.includes('## 1. 企业基本信息'), '报告包含企业信息章节');
assert(report.includes('## 2. 匹配政策总览'), '报告包含总览章节');
assert(report.includes('## 6. 匹配算法说明'), '报告包含算法说明章节');
assert(report.includes('yance.ai'), '报告包含品牌标识');

// ============================================================
// Test 9: Duplicate Gap Prevention
// ============================================================
console.log('\n[Test 9] Duplicate Gap Prevention');
const companyNoIp = { ...SAMPLE_COMPANY, has_ip: false, ip_count: 0 };
const ipPolicy = db.getById('SH-AI-001'); // requires IP
if (ipPolicy) {
  const match = evaluateMatch(companyNoIp, ipPolicy);
  const ipGaps = match.gaps.filter(g =>
    g.includes('知识产权') || g.includes('has_ip')
  );
  // Should have exactly one IP-related gap (from dimension check), not two
  assert(ipGaps.length === 1, `知识产权缺口不重复: ${ipGaps.length}条 (应为1)`);
}

// ============================================================
// Summary
// ============================================================
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${'='.repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
