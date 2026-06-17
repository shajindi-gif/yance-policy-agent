import Link from 'next/link';

export default function DemoPage() {
  return (
    <>
      {/* Page Banner */}
      <section
        className="page-banner"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d44 60%, #0d1b2a 100%)',
        }}
      >
        <div className="container">
          <span
            className="badge"
            style={{
              background: 'rgba(14,165,233,0.2)',
              color: '#0ea5e9',
              marginBottom: '16px',
            }}
          >
            产品演示
          </span>
          <h1>体验 Policy Agent</h1>
          <p>
            在线体验智能政策服务的核心功能，或预约一次专属演示了解如何为你的园区量身定制方案。
          </p>
        </div>
      </section>

      {/* Demo Options */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">演示方式</span>
            <h2 className="section-title">选择适合你的体验方式</h2>
          </div>

          <div className="grid grid-2" style={{ gap: '32px' }}>
            {/* Self-service Demo */}
            <div className="card" style={{ padding: '40px', borderTop: '3px solid #0ea5e9' }}>
              <div
                className="badge"
                style={{
                  background: 'rgba(14,165,233,0.1)',
                  color: '#0ea5e9',
                  marginBottom: '16px',
                }}
              >
                自助体验
              </div>
              <h3 className="card-title" style={{ fontSize: '1.5rem' }}>
                在线互动 Demo
              </h3>
              <p className="card-desc" style={{ marginBottom: '24px' }}>
                无需预约，直接体验政策问答、企业画像查询和政策匹配功能。Demo 内置示例数据，你可以立即看到产品效果。
              </p>
              <ul className="module-card-features" style={{ marginBottom: '32px' }}>
                <li>政策智能问答体验</li>
                <li>企业画像查询示例</li>
                <li>政策匹配结果展示</li>
                <li>材料清单生成演示</li>
              </ul>
              <a
                href="https://yance.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  background: '#0ea5e9',
                  color: '#fff',
                  borderColor: '#0ea5e9',
                  borderRadius: '12px',
                }}
              >
                打开在线 Demo &rarr;
              </a>
            </div>

            {/* Guided Demo */}
            <div
              className="card"
              style={{
                padding: '40px',
                border: '2px solid #f97316',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 16px',
                  background: '#f97316',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                推荐
              </div>
              <div
                className="badge"
                style={{
                  background: '#fff7ed',
                  color: '#f97316',
                  marginBottom: '16px',
                }}
              >
                专属演示
              </div>
              <h3 className="card-title" style={{ fontSize: '1.5rem' }}>
                预约园区专属 Demo
              </h3>
              <p className="card-desc" style={{ marginBottom: '24px' }}>
                由我们的产品专家为你进行 30 分钟的线上演示，针对你园区的实际场景进行讲解和方案建议。
              </p>
              <ul className="module-card-features" style={{ marginBottom: '32px' }}>
                <li>1 对 1 产品演示</li>
                <li>针对你园区的场景定制</li>
                <li>现场问答和技术咨询</li>
                <li>部署方案和报价建议</li>
              </ul>
              <Link
                href="#contact"
                className="btn"
                style={{
                  background: '#f97316',
                  color: '#fff',
                  borderColor: '#f97316',
                  borderRadius: '12px',
                }}
              >
                预约园区 Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Mockup */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">产品预览</span>
            <h2 className="section-title">Demo 界面预览</h2>
          </div>

          <div className="demo-container">
            <div className="demo-toolbar">
              <span className="demo-toolbar-dot" style={{ background: '#ff5f57' }} />
              <span className="demo-toolbar-dot" style={{ background: '#ffbd2e' }} />
              <span className="demo-toolbar-dot" style={{ background: '#28ca42' }} />
              <span className="demo-toolbar-url">
                https://yance.ai
              </span>
            </div>
            <div
              style={{
                padding: '48px',
                background: 'var(--bg-alt)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
              }}
            >
              <div style={{ fontSize: '4rem' }}>&#x1F5A5;&#xFE0F;</div>
              <h3 style={{ color: 'var(--text)', textAlign: 'center' }}>
                园区服务驾驶舱
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  maxWidth: '480px',
                }}
              >
                在完整 Demo 中，你可以看到企业画像、政策匹配、材料清单、服务工单等完整功能的交互体验。
              </p>
              <a
                href="https://yance.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ background: '#0ea5e9', borderColor: '#0ea5e9', borderRadius: '12px' }}
              >
                体验完整 Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Walkthrough */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">功能导览</span>
            <h2 className="section-title">Demo 中包含的核心功能</h2>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {[
              { icon: '\u{1F916}', title: '政策智能问答', desc: '输入自然语言问题，获得带政策原文引用的精准回答。支持多轮对话和条件追问。' },
              { icon: '\u{1F3E2}', title: '企业画像查询', desc: '查看企业的多维度画像，包括基本信息、资质认证、知识产权和发展阶段评估。' },
              { icon: '\u{1F3AF}', title: '政策匹配引擎', desc: '自动匹配企业可申报的政策项目，展示匹配度评分和材料缺口分析。' },
              { icon: '\u{1F4CB}', title: '材料清单生成', desc: '根据申报政策自动生成所需材料清单，标注已备和缺口材料。' },
              { icon: '\u{1F4C8}', title: '服务工单管理', desc: '创建和跟踪每个企业的服务工单，管理任务分配和完成状态。' },
              { icon: '\u{1F4CA}', title: '运营报告', desc: '查看园区服务运营数据报告，包括服务覆盖率、政策利用率等核心指标。' },
            ].map((feat) => (
              <div key={feat.title} className="card">
                <div className="card-icon">{feat.icon}</div>
                <h3 className="card-title">{feat.title}</h3>
                <p className="card-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section section-alt" id="contact">
        <div className="container">
          <div className="container-narrow">
            <div className="section-header">
              <span className="section-label">预约演示</span>
              <h2 className="section-title">预约园区专属 Demo</h2>
              <p className="section-subtitle">
                填写以下信息，我们的产品专家将在 1 个工作日内与你联系。
              </p>
            </div>

            <div className="card" style={{ padding: '40px' }}>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">姓名 *</label>
                  <input type="text" className="form-input" placeholder="请输入你的姓名" />
                </div>
                <div className="form-group">
                  <label className="form-label">公司名称 *</label>
                  <input type="text" className="form-input" placeholder="请输入园区或公司名称" />
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">职位</label>
                  <input type="text" className="form-input" placeholder="请输入你的职位" />
                </div>
                <div className="form-group">
                  <label className="form-label">联系邮箱 *</label>
                  <input type="email" className="form-input" placeholder="name@company.com" />
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">联系电话</label>
                  <input type="tel" className="form-input" placeholder="请输入手机号码" />
                </div>
                <div className="form-group">
                  <label className="form-label">园区规模</label>
                  <select className="form-input form-select">
                    <option value="">请选择</option>
                    <option value="small">100 家以下企业</option>
                    <option value="medium">100-500 家企业</option>
                    <option value="large">500-2000 家企业</option>
                    <option value="xlarge">2000 家以上企业</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">补充说明</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="请描述你的需求或关注点"
                />
              </div>
              <button
                className="btn btn-lg"
                style={{
                  width: '100%',
                  background: '#f97316',
                  color: '#fff',
                  borderColor: '#f97316',
                  borderRadius: '12px',
                }}
              >
                提交预约申请
              </button>
              <p className="form-help" style={{ textAlign: 'center', marginTop: '16px' }}>
                我们将在 1 个工作日内通过邮件联系你 &middot; contact@yance.ai
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
