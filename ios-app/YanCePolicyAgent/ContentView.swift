import SwiftUI
import WebKit

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Tab 1: Dashboard (WebView)
            NavigationStack {
                YanCeWebView(url: URL(string: "https://yance-policy-agent.vercel.app")!)
                    .toolbar {
                        ToolbarItem(placement: .principal) {
                            HStack(spacing: 8) {
                                Image("logo")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                                    .clipShape(RoundedRectangle(cornerRadius: 6))
                                Text("YanCe Policy Agent")
                                    .font(.headline)
                                    .fontWeight(.bold)
                            }
                        }
                    }
            }
            .tabItem {
                Image(systemName: "house.fill")
                Text("工作台")
            }
            .tag(0)

            // Tab 2: Policy Clipper (Extension guide)
            NavigationStack {
                ExtensionGuideView()
                    .navigationTitle("Policy Clipper")
            }
            .tabItem {
                Image(systemName: "puzzlepiece.extension.fill")
                Text("插件")
            }
            .tag(1)

            // Tab 3: Match Engine
            NavigationStack {
                MatchEngineView()
                    .navigationTitle("匹配引擎")
            }
            .tabItem {
                Image(systemName: "chart.bar.fill")
                Text("匹配")
            }
            .tag(2)

            // Tab 4: About
            NavigationStack {
                AboutView()
                    .navigationTitle("关于")
            }
            .tabItem {
                Image(systemName: "info.circle.fill")
                Text("关于")
            }
            .tag(3)
        }
        .tint(Color(red: 14/255, green: 165/255, blue: 233/255)) // Sky Blue #0EA5E9
    }
}

// ============================================
// WebView
// ============================================
struct YanCeWebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}
}

// ============================================
// Extension Guide View
// ============================================
struct ExtensionGuideView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Policy Clipper")
                        .font(.title)
                        .fontWeight(.bold)
                    Text("Safari 浏览器插件 · 8维匹配引擎")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top)

                // Status card
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                        .font(.title2)
                    VStack(alignment: .leading) {
                        Text("插件已就绪")
                            .font(.headline)
                        Text("前往 Safari 设置 → 扩展 中启用")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                }
                .padding()
                .background(Color.green.opacity(0.1))
                .cornerRadius(12)

                // How to enable
                VStack(alignment: .leading, spacing: 12) {
                    Text("启用步骤")
                        .font(.headline)

                    StepRow(number: 1, title: "打开 Safari 浏览器", desc: "在 iPhone/iPad 上打开 Safari")
                    StepRow(number: 2, title: "进入设置 → Safari", desc: "打开系统设置，找到 Safari")
                    StepRow(number: 3, title: "扩展 → YanCe Policy Agent", desc: "找到 Policy Agent 并开启")
                    StepRow(number: 4, title: "浏览政策网页", desc: "在 Safari 中打开任意政策网页，点击扩展图标")
                }

                // Feature list
                VStack(alignment: .leading, spacing: 8) {
                    Text("核心功能")
                        .font(.headline)
                        .padding(.top, 8)

                    FeatureRow(icon: "doc.text.magnifyingglass", title: "政策提取", desc: "6字段结构化提取：名称、机构、行业、金额、期限、材料", color: .blue)
                    FeatureRow(icon: "chart.bar.xaxis", title: "8维匹配", desc: "行业30% + 区域20% + 阶段15% + 规模10% + 研发10% + IP5% + 高企5% + 中小5%", color: .orange)
                    FeatureRow(icon: "checklist", title: "材料缺口", desc: "自动对比企业资质与政策要求，列出缺失材料", color: .yellow)
                    FeatureRow(icon: "doc.fill.badge.plus", title: "服务工单", desc: "匹配度≥50自动生成工单，一键复制ParkOps格式", color: .red)
                    FeatureRow(icon: "doc.richtext", title: "完整报告", desc: "6节服务报告含企业信息、匹配总览、逐项分析、缺口汇总", color: .green)
                }

                Spacer()
            }
            .padding(.horizontal)
        }
    }
}

// ============================================
// Match Engine View
// ============================================
struct MatchEngineView: View {
    let dimensions = [
        ("行业匹配", 30, "企业所属行业是否在政策覆盖范围内"),
        ("区域匹配", 20, "企业注册地是否属于政策适用区域"),
        ("阶段匹配", 15, "企业发展阶段是否符合政策要求"),
        ("人员规模", 10, "员工人数是否在政策规定范围内"),
        ("研发占比", 10, "研发费用占比是否达到政策门槛"),
        ("知识产权", 5, "是否拥有必要的知识产权"),
        ("高企认定", 5, "高新技术企业认定等资质"),
        ("中小企业", 5, "是否符合中小企业标准"),
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("8维加权匹配引擎")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("与 GitHub 开源项目 policy_matcher.py 完全对齐")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.top)

                // Scoring dimensions
                VStack(spacing: 10) {
                    ForEach(dimensions, id: \.0) { dim in
                        HStack {
                            Text(dim.0)
                                .font(.subheadline)
                                .fontWeight(.medium)
                                .frame(width: 80, alignment: .leading)
                            GeometryReader { geo in
                                ZStack(alignment: .leading) {
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(Color.gray.opacity(0.2))
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(Color(red: 14/255, green: 165/255, blue: 233/255))
                                        .frame(width: geo.size.width * CGFloat(dim.1) / 30.0)
                                }
                            }
                            .frame(height: 20)
                            Text("\(dim.1)%")
                                .font(.caption)
                                .fontWeight(.bold)
                                .frame(width: 36)
                        }
                        Text(dim.2)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .padding(.leading, 80)
                    }
                }

                // Recommendation levels
                VStack(alignment: .leading, spacing: 8) {
                    Text("推荐等级")
                        .font(.headline)
                        .padding(.top, 8)

                    RecRow(score: "≥70 + 无缺口", rec: "推荐申请", color: .green)
                    RecRow(score: "≥50 + ≤2缺口", rec: "建议补充材料后申请", color: .yellow)
                    RecRow(score: "≥30", rec: "建议进一步评估", color: .orange)
                    RecRow(score: "<30", rec: "暂不推荐", color: .gray)
                }

                // Sample policies
                VStack(alignment: .leading, spacing: 8) {
                    Text("内置样本政策")
                        .font(.headline)
                        .padding(.top, 8)

                    PolicyRow(name: "上海市高新技术企业认定", level: "市级", subsidy: "所得税15%+奖励")
                    PolicyRow(name: "徐汇区AI产业专项扶持", level: "区级", subsidy: "最高200万元")
                    PolicyRow(name: "科技型中小企业创新资金", level: "市级", subsidy: "最高50万元")
                    PolicyRow(name: "徐汇区企业租金补贴", level: "区级", subsidy: "最高30%租金")
                    PolicyRow(name: "国家中小企业发展专项", level: "国家级", subsidy: "最高100万元")
                    PolicyRow(name: "上海市AI产业发展专项", level: "市级", subsidy: "最高500万元")
                }

                Spacer()
            }
            .padding(.horizontal)
        }
    }
}

// ============================================
// About View
// ============================================
struct AboutView: View {
    var body: some View {
        List {
            Section("产品") {
                HStack { Text("版本"); Spacer(); Text("2.0.0").foregroundColor(.secondary) }
                HStack { Text("引擎"); Spacer(); Text("8维加权匹配").foregroundColor(.secondary) }
                HStack { Text("品牌"); Spacer(); Text("yance.ai").foregroundColor(.secondary) }
            }

            Section("功能") {
                HStack { Text("政策提取"); Spacer(); Text("6字段结构化").foregroundColor(.secondary) }
                HStack { Text("匹配分析"); Spacer(); Text("8维度100分制").foregroundColor(.secondary) }
                HStack { Text("企业画像"); Spacer(); Text("本地持久化存储").foregroundColor(.secondary) }
                HStack { Text("服务工单"); Spacer(); Text("ParkOps标准格式").foregroundColor(.secondary) }
                HStack { Text("完整报告"); Spacer(); Text("6节结构化报告").foregroundColor(.secondary) }
            }

            Section("关于") {
                HStack { Text("公司"); Spacer(); Text("上海衍策引擎人工智能科技有限公司").foregroundColor(.secondary) }
                Link("访问官网", destination: URL(string: "https://yance-policy-agent.vercel.app")!)
                Link("GitHub 开源", destination: URL(string: "https://github.com/shajindi-gif/yance-policy-agent")!)
            }

            Section {
                Text("本应用为辅助工具，所有推荐需经人工复核。不提供投资建议或金融咨询服务。")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

// ============================================
// Helper Views
// ============================================
struct StepRow: View {
    let number: Int
    let title: String
    let desc: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text("\(number)")
                .font(.headline)
                .foregroundColor(.white)
                .frame(width: 28, height: 28)
                .background(Color(red: 14/255, green: 165/255, blue: 233/255))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.subheadline).fontWeight(.medium)
                Text(desc).font(.caption).foregroundColor(.secondary)
            }
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let desc: String
    let color: Color

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.title3)
                .frame(width: 32)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.subheadline).fontWeight(.medium)
                Text(desc).font(.caption).foregroundColor(.secondary)
            }
        }
    }
}

struct RecRow: View {
    let score: String
    let rec: String
    let color: Color

    var body: some View {
        HStack {
            Text(score)
                .font(.caption)
                .frame(width: 100, alignment: .leading)
            Text(rec)
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
    }
}

struct PolicyRow: View {
    let name: String
    let level: String
    let subsidy: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Spacer()
                Text(level)
                    .font(.caption2)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color.blue.opacity(0.1))
                    .foregroundColor(.blue)
                    .cornerRadius(8)
            }
            Text(subsidy)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
        Divider()
    }
}
