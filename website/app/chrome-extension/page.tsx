import Link from 'next/link';

export const metadata = {
  title: 'YanCe Policy Clipper — Chrome 浏览器插件 | yance.ai',
  description:
    '在任何政策网页上一键分析，自动提取政策名称、发文机构、适用行业、补贴金额、申报期限、材料要求。一键生成 ParkOps 服务工单。',
};

const EXTRACTION_FIELDS = [
  {
    icon: '🎯',
    field: 'policy_name',
    label: '政策名称',
    desc: '自动识别政策文件标题，支持"关于...的通知/意见/办法"等标准格式',
    example: '关于支持园区科技创新企业高质量发展的若干措施',
  },
  {
    icon: '🏛️',
    field: 'issuing_authority',
    label: '发文机构',
    desc: '提取政策发布机关，如人民政府、科技局、发改委、管委会等',
    example: '上海市浦东新区科技和经济委员会',
  },
  {
    icon: '🏭',
    field: 'target_industry',
    label: '适用行业',
    desc: '智能识别 7 大行业领域：AI、生物医药、集成电路、新材料、新能源、智能制造、软件',
    example: '人工智能、生物医药、集成电路、新材料',
  },
  {
    icon: '💰',
    field: 'subsidy_amount',
    label: '补贴金额',
    desc: '提取政策中的资金补贴数额，支持"最高X万""不超过X万"等表述',
    example: '最高 200 万元（综合补贴总额）',
  },
  {
    icon: '📅',
    field: 'application_deadline',
    label: '申报期限',
    desc: '识别截止日期，支持"截止""截至""申报期限"等关键词及多种日期格式',
    example: '2025年6月30日',
  },
  {
    icon: '📋',
    field: 'material_requirements',
    label: '材料要求',
    desc: '列出申报所需材料清单，含营业执照、审计报告、知识产权证明等',
    example: '企业营业执照、审计报告、知识产权证书、项目申报书...',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: '浏览政策网页',
    desc: '在政府官网、园区公告、政策平台浏览任意政策文件',
  },
  {
    step: '02',
    title: '点击插件分析',
    desc: '点击 Chrome 工具栏的 YanCe 图标，选择"分析当前页面政策"',
  },
  {
    step: '03',
    title: '查看结构化结果',
    desc: '6 大字段自动提取并展示，一目了然掌握政策要点',
  },
  {
    step: '04',
    title: '同步到 ParkOps',
    desc: '一键复制为 ParkOps 服务工单格式，粘贴到园区工作台即可使用',
  },
];

export default function ChromeExtensionPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="page-banner">
        <div className="container">
          <div className="page-banner-inner" style={{ textAlign: 'center' }}>
            <span className="section-label">Chrome Extension</span>
            <h1
              className="page-banner-title"
              style={{ fontSize: '2.5rem', maxWidth: 700, margin: '0 auto' }}
            >
              YanCe Policy Clipper
            </h1>
            <p
              className="page-banner-desc"
              style={{ maxWidth: 600, margin: '16px auto 0' }}
            >
              在任何政策网页上一键提取结构化政策数据，自动生成园区服务工单。
              <br />
              Manifest V3 · 零依赖 · 本地分析 · 数据不出浏览器。
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                marginTop: 32,
              }}
            >
              <Link href="/demo" className="btn btn-primary">
                安装插件
              </Link>
              <Link href="#how-it-works" className="btn btn-outline">
                查看工作原理
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EXTENSION PREVIEW ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Live Preview</span>
            <h2 className="section-title">插件界面预览</h2>
          </div>

          {/* Mock Extension Popup */}
          <div
            style={{
              maxWidth: 420,
              margin: '0 auto',
              background: '#0d1b2a',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 20px 60px rgba(13,27,42,0.3)',
              border: '1px solid rgba(14,165,233,0.15)',
            }}
          >
            {/* Mock Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(14,165,233,0.2)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                衍
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                  YanCe Policy Agent
                </div>
                <div style={{ color: '#f97316', fontSize: 11, fontWeight: 600 }}>
                  yance.ai
                </div>
              </div>
            </div>

            {/* Mock Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                📄 分析当前页面政策
              </div>
              <div
                style={{
                  background: '#1b2d45',
                  color: '#7dd3fc',
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid rgba(14,165,233,0.25)',
                }}
              >
                ✏️ 生成园区服务工单
              </div>
            </div>

            {/* Mock Result Cards */}
            {[
              { icon: '🎯', label: '政策名称', value: '关于支持园区科技创新企业高质量发展的若干措施', bold: true },
              { icon: '🏛️', label: '发文机构', value: '上海市浦东新区科技和经济委员会' },
              { icon: '💰', label: '补贴金额', value: '最高 200 万元', highlight: true },
              { icon: '📅', label: '申报期限', value: '2025年6月30日' },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: '#1b2d45',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 8,
                  border: card.highlight
                    ? '1px solid rgba(52,211,153,0.25)'
                    : '1px solid rgba(14,165,233,0.12)',
                }}
              >
                <div style={{ color: card.highlight ? '#34d399' : '#7dd3fc', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  {card.icon} {card.label}
                </div>
                <div
                  style={{
                    color: card.highlight ? '#34d399' : '#e2e8f0',
                    fontSize: card.highlight ? 14 : 12.5,
                    fontWeight: card.highlight || card.bold ? 700 : 400,
                  }}
                >
                  {card.value}
                </div>
              </div>
            ))}

            {/* Mock Action Row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: '#fff',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                📋 复制到 ParkOps
              </div>
              <div
                style={{
                  flex: 1,
                  background: 'rgba(14,165,233,0.15)',
                  color: '#7dd3fc',
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'center',
                  border: '1px solid rgba(14,165,233,0.3)',
                }}
              >
                🔗 打开 Dashboard
              </div>
            </div>

            {/* Mock Disclaimer */}
            <div
              style={{
                marginTop: 14,
                padding: '8px 12px',
                background: 'rgba(251,191,36,0.06)',
                border: '1px solid rgba(251,191,36,0.15)',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 11,
                color: '#94a3b8',
              }}
            >
              ⓘ 本插件为辅助工具，政策建议需经人工复核
            </div>

            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: '#475569' }}>
              v1.0.0 | yance.ai
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6 EXTRACTION FIELDS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Structured Extraction</span>
            <h2 className="section-title">6 字段结构化提取</h2>
            <p className="section-subtitle">
              自动从政策原文中提取 6 大核心字段，每条数据都可追溯到原文。
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 20,
            }}
          >
            {EXTRACTION_FIELDS.map((f) => (
              <div
                key={f.field}
                className="card"
                style={{ padding: '24px 28px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 600, letterSpacing: 1 }}>
                      {f.field.toUpperCase()}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                      {f.label}
                    </h3>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
                  {f.desc}
                </p>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#166534',
                    fontWeight: 500,
                  }}
                >
                  示例: {f.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Workflow</span>
            <h2 className="section-title">4 步完成政策分析</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
            }}
          >
            {WORKFLOW_STEPS.map((s) => (
              <div key={s.step} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {s.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARKOPS INTEGRATION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="section-label">ParkOps Integration</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: 8, marginBottom: 16 }}>
                一键同步到园区工作台
              </h2>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 20 }}>
                分析结果可一键复制为 ParkOps 标准服务工单格式，直接粘贴到园区运营工作台即可使用。
                工单包含工单编号、创建时间、政策信息、材料要求等完整字段。
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span className="badge badge-teal">自动工单编号</span>
                <span className="badge badge-teal">时间戳</span>
                <span className="badge badge-teal">6 字段完整信息</span>
                <span className="badge badge-teal">材料清单</span>
                <span className="badge badge-teal">来源追溯</span>
              </div>
            </div>

            {/* Mock ParkOps Ticket */}
            <div
              style={{
                background: '#0d1b2a',
                borderRadius: 12,
                padding: 24,
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#e2e8f0',
                lineHeight: 1.8,
                border: '1px solid rgba(14,165,233,0.2)',
                overflow: 'hidden',
              }}
            >
              <div style={{ color: '#0ea5e9', marginBottom: 8 }}>
                ═══════════════════════════════════
              </div>
              <div style={{ fontWeight: 700, color: '#fff' }}>
                {'  '}ParkOps 服务工单  |  yance.ai
              </div>
              <div style={{ color: '#0ea5e9', marginBottom: 12 }}>
                ═══════════════════════════════════
              </div>
              <div>
                <span style={{ color: '#64748b' }}>工单编号：</span>
                <span style={{ color: '#f97316' }}>SVC-20250615-1430</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>创建时间：</span>2025/6/15 14:30:22
              </div>
              <div>
                <span style={{ color: '#64748b' }}>来源工具：</span>Chrome Extension v1.0.0
              </div>
              <div style={{ marginTop: 12, color: '#7dd3fc', fontWeight: 600 }}>
                ── 政策信息 ──
              </div>
              <div><span style={{ color: '#64748b' }}>政策名称：</span>关于支持园区科技创新企业...</div>
              <div><span style={{ color: '#64748b' }}>发文机构：</span>浦东新区科技和经济委员会</div>
              <div><span style={{ color: '#64748b' }}>适用行业：</span>AI、生物医药、集成电路</div>
              <div><span style={{ color: '#34d399' }}>补贴金额：</span><span style={{ color: '#34d399', fontWeight: 700 }}>最高 200 万元</span></div>
              <div><span style={{ color: '#64748b' }}>申报期限：</span>2025年6月30日</div>
              <div style={{ marginTop: 12, color: '#7dd3fc', fontWeight: 600 }}>
                ── 材料要求 ──
              </div>
              <div style={{ color: '#94a3b8' }}>{'  '}1. 企业营业执照副本</div>
              <div style={{ color: '#94a3b8' }}>{'  '}2. 审计报告（含研发费用专项）</div>
              <div style={{ color: '#94a3b8' }}>{'  '}3. 知识产权证书及清单</div>
              <div style={{ marginTop: 12, color: '#0ea5e9' }}>
                ═══════════════════════════════════
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INSTALLATION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Installation</span>
            <h2 className="section-title">安装指南</h2>
          </div>

          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {[
              {
                step: 1,
                title: '下载插件文件',
                desc: '从 GitHub 仓库下载 chrome-extension 目录，或联系 contact@yance.ai 获取最新安装包。',
              },
              {
                step: 2,
                title: '打开 Chrome 扩展管理',
                desc: '在 Chrome 地址栏输入 chrome://extensions，打开右上角"开发者模式"开关。',
              },
              {
                step: 3,
                title: '加载已解压的扩展',
                desc: '点击"加载已解压的扩展程序"，选择 chrome-extension 文件夹。',
              },
              {
                step: 4,
                title: '开始使用',
                desc: '浏览任意政策网页，点击工具栏的 YanCe 图标即可开始分析。',
              },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  gap: 20,
                  marginBottom: 24,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    fontSize: 18,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECH SPECS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Technical Specs</span>
            <h2 className="section-title">技术特性</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Manifest', value: 'V3 (最新版)' },
              { label: '权限', value: 'activeTab, scripting' },
              { label: '数据分析', value: '本地执行，数据不出浏览器' },
              { label: '政府页面识别', value: 'URL 模式 + 关键词启发式' },
              { label: '行业检测', value: '7 大领域正则匹配' },
              { label: '金额提取', value: '多格式数额正则' },
              { label: '日期提取', value: '截止日期多模式匹配' },
              { label: '工单格式', value: 'ParkOps 标准剪贴板格式' },
              { label: '品牌', value: 'Navy / Teal / Coral 主题' },
            ].map((item) => (
              <div
                key={item.label}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="cta-title">立即安装 Policy Clipper</h2>
          <p className="cta-subtitle">
            让每一条政策网页都变成可操作的结构化数据。
          </p>
          <div className="cta-actions">
            <Link href="/demo" className="btn btn-primary btn-lg">
              获取插件
            </Link>
            <a href="mailto:contact@yance.ai" className="btn btn-ghost">
              联系我们
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
