/**
 * YanCe Policy Agent v2.0 — Safari popup.js
 * Cross-browser compatibility shim + full logic
 * Brand: yance.ai
 */

// Safari uses browser.* namespace; normalize to chrome.* for code reuse
if (typeof browser !== 'undefined' && typeof chrome === 'undefined') {
  window.chrome = browser;
}


// ============================================
// State
// ============================================
let companies = [];
let selectedCompanyId = null;
let currentExtraction = null;
let currentMatchResults = [];
let currentTickets = [];

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  await loadCompanies();
  renderCompanyList();
  updateMatchCompanySelect();
  initExtractTab();
  initCompanyTab();
  initMatchTab();
  initTicketTab();
});

// ============================================
// Tab Navigation
// ============================================
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ============================================
// TAB 1: Policy Extraction
// ============================================
function initExtractTab() {
  document.getElementById('btn-extract').addEventListener('click', handleExtract);
}

async function handleExtract() {
  const btn = document.getElementById('btn-extract');
  const loading = document.getElementById('loading');
  btn.disabled = true;
  loading.classList.remove('hidden');
  document.getElementById('extract-results').classList.add('hidden');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) throw new Error('no tab');

    const pageText = await extractPageText(tab.id);
    currentExtraction = analyzePolicyContent(pageText, tab.url, tab.title);
    renderExtraction(currentExtraction);
    document.getElementById('extract-results').classList.remove('hidden');
  } catch (e) {
    console.error('Extract error:', e);
    currentExtraction = getMockExtraction();
    renderExtraction(currentExtraction);
    document.getElementById('extract-results').classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
    btn.disabled = false;
  }
}

function renderExtraction(data) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '待确认'; };
  set('ex-policy-name', data.policy_name);
  set('ex-issuing-authority', data.issuing_authority);
  set('ex-subsidy-amount', data.subsidy_amount);
  set('ex-application-deadline', data.application_deadline);

  const indEl = document.getElementById('ex-target-industry');
  if (indEl) {
    indEl.innerHTML = '';
    (data.target_industry || []).forEach(ind => {
      const tag = document.createElement('span');
      tag.className = 'tag tag-coral';
      tag.textContent = ind;
      indEl.appendChild(tag);
    });
  }

  const matEl = document.getElementById('ex-material-list');
  if (matEl) {
    matEl.innerHTML = '';
    (data.material_requirements || []).forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      matEl.appendChild(li);
    });
  }
}

// ============================================
// TAB 2: Company CRUD
// ============================================
function initCompanyTab() {
  document.getElementById('btn-add-company').addEventListener('click', () => showCompanyForm());
  document.getElementById('btn-back-list').addEventListener('click', () => hideCompanyForm());
  document.getElementById('company-form').addEventListener('submit', handleSaveCompany);
}

async function loadCompanies() {
  return new Promise(resolve => {
    chrome.storage.local.get(['companies'], (result) => {
      companies = result.companies || [];
      if (companies.length === 0) {
        companies = [{ ...SAMPLE_COMPANY }];
        chrome.storage.local.set({ companies });
      }
      resolve();
    });
  });
}

async function saveCompanies() {
  return new Promise(resolve => {
    chrome.storage.local.set({ companies }, resolve);
  });
}

function renderCompanyList() {
  const list = document.getElementById('company-list');
  const empty = document.getElementById('no-companies');
  list.innerHTML = '';

  if (companies.length === 0) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  companies.forEach(c => {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.innerHTML =
      '<div class="company-card-info">' +
        '<div class="company-card-name">' + c.name + '</div>' +
        '<div class="company-card-meta">' + c.industry + ' · ' + c.stage + ' · ' + c.region + '</div>' +
        '<div class="company-card-tags">' +
          '<span class="tag-sm">' + c.employees + '人</span>' +
          '<span class="tag-sm">研发' + c.rd_ratio_percent + '%</span>' +
          (c.has_ip ? '<span class="tag-sm tag-ok">IP</span>' : '') +
          (c.has_high_tech_cert ? '<span class="tag-sm tag-ok">高企</span>' : '') +
          (c.is_sme ? '<span class="tag-sm tag-ok">中小</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="company-card-actions">' +
        '<button class="btn btn-sm btn-ghost" data-edit="' + c.id + '">编辑</button>' +
        '<button class="btn btn-sm btn-ghost btn-danger" data-del="' + c.id + '">删除</button>' +
      '</div>';
    card.querySelector('[data-edit]').addEventListener('click', () => showCompanyForm(c.id));
    card.querySelector('[data-del]').addEventListener('click', () => deleteCompany(c.id));
    list.appendChild(card);
  });
}

function showCompanyForm(editId) {
  document.getElementById('company-list-area').classList.add('hidden');
  document.getElementById('company-form-area').classList.remove('hidden');

  if (editId) {
    const c = companies.find(x => x.id === editId);
    if (!c) return;
    document.getElementById('form-title').textContent = '编辑企业';
    document.getElementById('cf-id').value = c.id;
    document.getElementById('cf-name').value = c.name;
    document.getElementById('cf-industry').value = c.industry;
    document.getElementById('cf-stage').value = c.stage;
    document.getElementById('cf-region').value = c.region;
    document.getElementById('cf-park').value = c.park || '';
    document.getElementById('cf-employees').value = c.employees;
    document.getElementById('cf-rd-ratio').value = c.rd_ratio_percent;
    document.getElementById('cf-ip-count').value = c.ip_count || 0;
    document.getElementById('cf-founded').value = c.founded_year || 2023;
    document.getElementById('cf-has-ip').checked = c.has_ip || false;
    document.getElementById('cf-has-high-tech').checked = c.has_high_tech_cert || false;
    document.getElementById('cf-is-sme').checked = c.is_sme || false;
  } else {
    document.getElementById('form-title').textContent = '新增企业';
    document.getElementById('company-form').reset();
    document.getElementById('cf-id').value = '';
  }
}

function hideCompanyForm() {
  document.getElementById('company-form-area').classList.add('hidden');
  document.getElementById('company-list-area').classList.remove('hidden');
}

async function handleSaveCompany(e) {
  e.preventDefault();
  const id = document.getElementById('cf-id').value || ('co-' + Date.now());
  const company = {
    id,
    name: document.getElementById('cf-name').value,
    industry: document.getElementById('cf-industry').value,
    stage: document.getElementById('cf-stage').value,
    region: document.getElementById('cf-region').value,
    park: document.getElementById('cf-park').value,
    employees: parseInt(document.getElementById('cf-employees').value) || 0,
    rd_ratio_percent: parseFloat(document.getElementById('cf-rd-ratio').value) || 0,
    ip_count: parseInt(document.getElementById('cf-ip-count').value) || 0,
    founded_year: parseInt(document.getElementById('cf-founded').value) || 2023,
    has_ip: document.getElementById('cf-has-ip').checked,
    has_high_tech_cert: document.getElementById('cf-has-high-tech').checked,
    is_sme: document.getElementById('cf-is-sme').checked,
  };

  const idx = companies.findIndex(c => c.id === id);
  if (idx >= 0) companies[idx] = company;
  else companies.push(company);

  await saveCompanies();
  renderCompanyList();
  updateMatchCompanySelect();
  hideCompanyForm();
}

async function deleteCompany(id) {
  if (!confirm('确定删除该企业画像？')) return;
  companies = companies.filter(c => c.id !== id);
  await saveCompanies();
  renderCompanyList();
  updateMatchCompanySelect();
}

// ============================================
// TAB 3: Matching
// ============================================
function initMatchTab() {
  const select = document.getElementById('match-company-select');
  select.addEventListener('change', () => {
    selectedCompanyId = select.value;
    document.getElementById('btn-run-match').disabled = !selectedCompanyId;
  });
  document.getElementById('btn-run-match').addEventListener('click', runMatching);
  document.getElementById('btn-copy-report').addEventListener('click', copyReport);
}

function updateMatchCompanySelect() {
  const select = document.getElementById('match-company-select');
  select.innerHTML = '<option value="">-- 选择企业 --</option>';
  companies.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name + ' (' + c.industry + ' · ' + c.region + ')';
    select.appendChild(opt);
  });
  if (selectedCompanyId) select.value = selectedCompanyId;
}

function runMatching() {
  const company = companies.find(c => c.id === selectedCompanyId);
  if (!company) return;

  currentMatchResults = matchPolicies(company, SAMPLE_POLICIES);
  currentTickets = [];

  currentMatchResults.forEach(m => {
    if (m.score >= 50) currentTickets.push(generateTicket(company, m));
  });

  renderMatchResults(company, currentMatchResults);
  renderTickets(company, currentTickets);
}

function renderMatchResults(company, results) {
  document.getElementById('match-results-area').classList.remove('hidden');

  const summaryEl = document.getElementById('match-summary');
  const recommend = results.filter(r => r.recommendation === '推荐申请').length;
  const supplement = results.filter(r => r.recommendation === '建议补充材料后申请').length;
  const totalGaps = results.reduce((s, r) => s + r.gaps.length, 0);

  summaryEl.innerHTML =
    '<div class="summary-row">' +
      '<div class="summary-item"><div class="summary-num">' + results.length + '</div><div class="summary-label">匹配政策</div></div>' +
      '<div class="summary-item"><div class="summary-num summary-green">' + recommend + '</div><div class="summary-label">推荐申请</div></div>' +
      '<div class="summary-item"><div class="summary-num summary-yellow">' + supplement + '</div><div class="summary-label">补充材料</div></div>' +
      '<div class="summary-item"><div class="summary-num summary-red">' + totalGaps + '</div><div class="summary-label">材料缺口</div></div>' +
    '</div>' +
    '<div class="summary-company">' + company.name + ' · ' + company.industry + ' · ' + company.stage + '</div>';

  const cardsEl = document.getElementById('match-cards');
  cardsEl.innerHTML = '';

  results.forEach((m, i) => {
    const color = getScoreColor(m.score);
    const recClass = m.recommendation === '推荐申请' ? 'green' : m.recommendation.includes('补充') ? 'yellow' : 'gray';
    const card = document.createElement('div');
    card.className = 'match-card';

    let detailsHTML =
      '<div class="match-detail-section">' +
        '<div class="match-detail-label">补贴: <strong>' + (m.policy.subsidy_description || '详见原文') + '</strong></div>' +
        '<div class="match-detail-label">截止: <strong>' + (m.policy.deadline || '详见原文') + '</strong></div>' +
      '</div>' +
      '<details class="match-detail-toggle"><summary>匹配原因 (' + m.reasons.length + ')</summary>' +
        '<ul class="match-detail-list">' + m.reasons.map(r => '<li>' + r + '</li>').join('') + '</ul></details>';

    if (m.gaps.length > 0) {
      detailsHTML += '<details class="match-detail-toggle"><summary>材料差距 (' + m.gaps.length + ')</summary>' +
        '<ul class="match-detail-list match-gap-list">' + m.gaps.map(g => '<li>⚠ ' + g + '</li>').join('') + '</ul></details>';
    }
    if (m.risks.length > 0) {
      detailsHTML += '<details class="match-detail-toggle"><summary>风险提示 (' + m.risks.length + ')</summary>' +
        '<ul class="match-detail-list match-risk-list">' + m.risks.map(r => '<li>⚡ ' + r + '</li>').join('') + '</ul></details>';
    }
    if (m.human_review_points.length > 0) {
      detailsHTML += '<details class="match-detail-toggle"><summary>人工复核 (' + m.human_review_points.length + ')</summary>' +
        '<ul class="match-detail-list">' + m.human_review_points.map(h => '<li>🔍 ' + h + '</li>').join('') + '</ul></details>';
    }

    const canTicket = m.score >= 50;
    card.innerHTML =
      '<div class="match-card-header">' +
        '<div class="match-score" style="color:' + color + '">' + m.score + '<span class="match-score-max">/100</span></div>' +
        '<div class="match-card-title-area"><div class="match-card-name">' + m.policy.name + '</div>' +
          '<div class="match-card-meta">' + m.policy.level + ' · ' + m.policy.region + ' · ' + m.policy.issuing_authority + '</div></div>' +
        '<span class="match-rec match-rec-' + recClass + '">' + m.recommendation + '</span>' +
      '</div>' +
      '<div class="match-card-body">' + detailsHTML + '</div>' +
      '<div class="match-card-footer">' +
        '<button class="btn btn-sm btn-coral" data-idx="' + i + '">' + (canTicket ? '复制此工单' : '分数不足') + '</button>' +
      '</div>';

    const ticketBtn = card.querySelector('.btn-coral');
    if (canTicket) {
      ticketBtn.addEventListener('click', () => {
        const co = companies.find(c => c.id === selectedCompanyId);
        const ticket = generateTicket(co, m);
        copyToClipboard(ticketToParkOpsText(ticket), ticketBtn);
      });
    } else {
      ticketBtn.disabled = true;
    }

    cardsEl.appendChild(card);
  });
}

async function copyReport() {
  const company = companies.find(c => c.id === selectedCompanyId);
  if (!company || currentMatchResults.length === 0) return;
  const report = generateReport(company, currentMatchResults);
  copyToClipboard(report, document.getElementById('btn-copy-report'));
}

// ============================================
// TAB 4: Tickets
// ============================================
function initTicketTab() {
  document.getElementById('btn-copy-all-tickets').addEventListener('click', copyAllTickets);
  document.getElementById('btn-open-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://yance.ai' });
  });
}

function renderTickets(company, tickets) {
  const noTickets = document.getElementById('no-tickets');
  const area = document.getElementById('tickets-area');

  if (tickets.length === 0) { noTickets.classList.remove('hidden'); area.classList.add('hidden'); return; }
  noTickets.classList.add('hidden');
  area.classList.remove('hidden');
  document.getElementById('ticket-count').textContent = tickets.length;

  const cardsEl = document.getElementById('ticket-cards');
  cardsEl.innerHTML = '';

  tickets.forEach(t => {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.innerHTML =
      '<div class="ticket-card-header"><span class="ticket-id">' + t.ticket_id + '</span>' +
        '<span class="ticket-priority ticket-priority-' + (t.priority === '紧急' ? 'high' : 'normal') + '">' + t.priority + '</span></div>' +
      '<div class="ticket-card-name">' + t.policy_name + '</div>' +
      '<div class="ticket-card-meta">' + t.policy_level + ' · 匹配度 ' + t.match_score + '/100 · ' + t.recommendation + '</div>' +
      '<div class="ticket-card-detail">补贴: ' + t.subsidy + '<br>截止: ' + t.deadline + '</div>' +
      (t.gaps.length > 0 ? '<div class="ticket-card-gaps">缺口: ' + t.gaps.join('、') + '</div>' : '') +
      '<button class="btn btn-sm btn-coral btn-ticket-copy">复制此工单</button>';

    card.querySelector('.btn-ticket-copy').addEventListener('click', (e) => {
      copyToClipboard(ticketToParkOpsText(t), e.target);
    });
    cardsEl.appendChild(card);
  });
}

function copyAllTickets() {
  if (currentTickets.length === 0) return;
  const allText = currentTickets.map(t => ticketToParkOpsText(t)).join('\n\n');
  copyToClipboard(allText, document.getElementById('btn-copy-all-tickets'));
}

// ============================================
// Page Text Extraction
// ============================================
async function extractPageText(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('script, style, noscript, iframe').forEach(el => el.remove());
      return (clone.innerText || clone.textContent || '').substring(0, 15000);
    },
  });
  return results && results[0] ? results[0].result : '';
}

// ============================================
// Policy Analysis
// ============================================
function analyzePolicyContent(text, url, title) {
  if (!text || text.length < 50) return getMockExtraction();
  if (isPolicyPage(text, url, title) && text.length > 100) return extractFromContent(text, url, title);
  return getMockExtraction();
}

function isPolicyPage(text, url, title) {
  const govUrl = /gov\.cn|\.gov\.|\.edu\.cn|zhengce|zhengfu/;
  const kws = ['政策','补贴','扶持','奖励','资助','申报','通知','意见','办法','高新技术','专精特新','产业园','关于','印发'];
  return govUrl.test(url) || kws.filter(k => text.includes(k)).length >= 3;
}

function extractFromContent(text, url, title) {
  let policy_name = title || '待确认';
  for (const p of [/关于[\u4e00-\u9fa5]+(?:的通知|的意见|的办法|的方案|的措施)/, /[\u4e00-\u9fa5]+(?:扶持政策|支持政策|发展政策|专项资金)/]) {
    const m = text.match(p); if (m) { policy_name = m[0]; break; }
  }
  let issuing_authority = '待确认';
  for (const p of [/([\u4e00-\u9fa5]+(?:人民政府|管委会|科技局|发改委|经信委|工信局|科委))/, /([\u4e00-\u9fa5]+(?:办公室|财政厅|人社厅|商务厅))/]) {
    const m = text.match(p); if (m) { issuing_authority = m[1]; break; }
  }
  const target_industry = [];
  const indMap = {'人工智能':/人工智能|AI|大模型/,'生物医药':/生物医药|医药|创新药/,'集成电路':/集成电路|芯片|半导体/,'新材料':/新材料|先进材料/,'新能源':/新能源|光伏|储能/,'智能制造':/智能制造|机器人|自动化/,'软件与信息服务':/软件|信息服务|云计算/};
  for (const [k,v] of Object.entries(indMap)) { if (v.test(text)) target_industry.push(k); }
  if (target_industry.length === 0) target_industry.push('科技型企业');
  let subsidy_amount = '详见政策原文';
  for (const p of [/(?:最高|不超过)\s*([\d,]+)\s*万/, /补贴\s*([\d,]+)\s*万/, /奖励\s*([\d,]+)\s*万/]) {
    const m = text.match(p); if (m) { subsidy_amount = '最高 ' + m[1] + ' 万元'; break; }
  }
  let application_deadline = '详见政策原文';
  for (const p of [/(?:截止|截至|申报期限)[：:]*\s*(\d{4}年\d{1,2}月\d{1,2}日)/, /(\d{4}年\d{1,2}月\d{1,2}日)(?:前|之前)/]) {
    const m = text.match(p); if (m) { application_deadline = m[1]; break; }
  }
  return { policy_name, issuing_authority, target_industry, subsidy_amount, application_deadline, material_requirements: ['企业营业执照副本','企业近年度审计报告','相关知识产权证明材料','项目申报书','企业社保缴纳证明','其他相关佐证材料'] };
}

function getMockExtraction() {
  return {
    policy_name: '关于支持园区科技创新企业高质量发展的若干措施',
    issuing_authority: '上海市浦东新区科技和经济委员会',
    target_industry: ['人工智能','生物医药','集成电路','新材料'],
    subsidy_amount: '最高 200 万元（综合补贴总额）',
    application_deadline: '2025年6月30日',
    material_requirements: ['企业营业执照副本','上年度审计报告','知识产权证书及清单','高新技术企业认定证书','项目申报书','企业近12个月社保缴纳证明','企业纳税证明','场地租赁合同或产权证明'],
  };
}

// ============================================
// Clipboard
// ============================================
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ 已复制';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
  }).catch(() => alert('复制失败'));
}
