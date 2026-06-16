## YanCe Policy Agent iOS — Xcode 项目搭建 + App Store 上架指南

### 总费用

| 项目 | 费用 | 说明 |
|------|------|------|
| Apple Developer Program | **$99/年** | 必须，否则无法上架 App Store |
| Safari 扩展 | 包含在 App 内 | 不单独收费 |
| Chrome Web Store | $5 (一次性) | 已准备好 |
| yance.ai 域名 | ~$10-15/年 | Cloudflare |
| **总计** | **~$115-120 首年** | |

---

### 第一部分：在 Xcode 中创建项目

需要 Mac 电脑 + Xcode 15+。

#### Step 1: 创建主 App

1. 打开 Xcode → File → New → Project
2. 选择 **iOS → App**
3. 填写：
   - Product Name: `YanCePolicyAgent`
   - Team: 你的 Apple Developer 账号
   - Organization Identifier: `com.yance`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - Minimum Deployment: **iOS 16.0**
4. 保存到 `ios-app/` 目录下

#### Step 2: 替换 Swift 源文件

Xcode 生成项目后，删除默认的 `ContentView.swift`，然后：

1. 将 `ios-app/YanCePolicyAgent/YanCePolicyAgentApp.swift` 拖入项目
2. 将 `ios-app/YanCePolicyAgent/ContentView.swift` 拖入项目
3. 将 `ios-app/YanCePolicyAgent/Assets.xcassets/` 拖入项目（替换默认的）

#### Step 3: 添加 Safari Web Extension Target

1. File → New → Target
2. 选择 **Safari Web Extension**
3. 填写：
   - Product Name: `YanCeWebExtension`
   - Team: 同一个账号
   - Language: **Swift**
4. 删除 Xcode 自动生成的扩展文件
5. 将以下文件拖入 `YanCeWebExtension` target：
   - `ios-app/YanCeWebExtension/SafariWebExtensionHandler.swift`（替换默认的）
   - `safari-extension/manifest.json`
   - `safari-extension/popup.html`
   - `safari-extension/popup.js`
   - `safari-extension/matching.js`
   - `safari-extension/styles.css`
   - `safari-extension/background.js`
   - `safari-extension/icons/`（整个文件夹）
6. 确保这些文件的 Target Membership 勾选了 `YanCeWebExtension`

#### Step 4: 配置 Signing & Capabilities

**主 App (YanCePolicyAgent):**
- Signing: 选你的 Team
- Capabilities: 添加 **App Groups**
  - Group ID: `group.com.yance.policyagent`

**Extension (YanCeWebExtension):**
- Signing: 同一个 Team
- Capabilities: 添加 **App Groups**
  - Group ID: `group.com.yance.policyagent`（同一个）

#### Step 5: 构建测试

1. 选择 iOS Simulator（iPhone 15 Pro）
2. Cmd + R 运行
3. 确认 4 个 Tab 都能正常工作：工作台、插件、匹配、关于

---

### 第二部分：在真机测试 Safari 扩展

1. 连接 iPhone，选择真机设备
2. Cmd + R 安装到手机
3. 打开 Safari → 设置 → Safari → 扩展 → 找到 YanCe Policy Agent → 启用
4. 浏览任意政策网页，点击扩展图标测试

---

### 第三部分：App Store Connect 上架

#### 前置条件

1. 注册 Apple Developer Program（$99/年）
   - https://developer.apple.com/programs/enroll/
   - 需要 Apple ID + 信用卡 + 身份证验证
   - 审核 1-3 天

2. 在 App Store Connect 创建 App
   - https://appstoreconnect.apple.com
   - 新建 App → iOS
   - Bundle ID: `com.yance.policyagent`

#### App Store 信息填写

**App 名称:**
```
YanCe Policy Agent
```

**副标题:**
```
园区政策分析助手 · 8维匹配引擎
```

**描述:**
```
YanCe Policy Agent 是衍策引擎推出的 iOS 应用，专为园区运营人员、招商经理和企业服务顾问设计。

核心功能：

• 政策工作台 — 内置 WebView 访问 yance.ai 在线平台
• Safari 扩展 — 在任何政策网页上一键分析，6字段结构化提取
• 8维匹配引擎 — 行业/区域/阶段/规模/研发/IP/高企/中小企业 加权评分
• 材料缺口分析 — 自动对比企业资质与政策要求
• 服务工单 — 匹配度≥50自动生成，ParkOps标准格式
• 完整报告 — 6节结构化服务报告

Safari 扩展启用方式：设置 → Safari → 扩展 → YanCe Policy Agent

本应用为辅助工具，所有推荐需经人工复核。不提供投资建议或金融咨询服务。

由上海衍策引擎人工智能科技有限公司提供支持。
```

**关键词:**
```
政策分析,园区服务,政策匹配,企业画像,补贴申报,ParkOps,政策提取,AI政策
```

**类别:** 效率工具 (Productivity)

**隐私政策 URL:** https://yance-policy-agent.vercel.app/privacy

#### 截图要求

| 设备 | 尺寸 | 数量 |
|------|------|------|
| iPhone 6.7" | 1290×2796 或 1284×2778 | 至少 1 张 |
| iPhone 6.5" | 1242×2688 或 1284×2778 | 至少 1 张 |
| iPad 12.9" (可选) | 2048×2732 | 可选 |

建议截图内容：
1. 工作台（WebView 首页）
2. Safari 扩展弹出界面
3. 匹配引擎维度展示
4. 关于页面

#### 构建上传

1. Xcode → Product → Archive
2. Window → Organizer → Distribute App → App Store Connect
3. 上传成功后，在 App Store Connect 选择构建版本
4. 提交审核

审核周期：通常 1-3 天。

---

### 第四部分：文件结构总览

```
yance-policy-agent/
├── chrome-extension/          ← Chrome 插件 v2.0
│   ├── manifest.json
│   ├── popup.html/js/css
│   ├── matching.js            ← 8维匹配引擎
│   └── icons/
├── safari-extension/          ← Safari 插件 v2.0（复用 Chrome 代码 + 兼容层）
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html/js/css
│   ├── matching.js
│   └── icons/
├── ios-app/                   ← iOS App
│   ├── YanCePolicyAgent/      ← 主 App（SwiftUI + WebView）
│   │   ├── YanCePolicyAgentApp.swift
│   │   ├── ContentView.swift  ← 4 Tab UI
│   │   └── Assets.xcassets/
│   └── YanCeWebExtension/     ← Safari 扩展 Target
│       └── SafariWebExtensionHandler.swift
├── website/                   ← Next.js 网站
├── ai-policy-demo/            ← Python 匹配引擎原型
├── saas-demo/                 ← Streamlit SaaS Demo
└── skills/                    ← 5 个 AI Skill
```

---

### 路演前 Checklist

- [ ] Apple Developer Program 注册完成（$99）
- [ ] Xcode 项目构建成功
- [ ] 真机测试 Safari 扩展正常工作
- [ ] App Store Connect 创建 App
- [ ] 截图准备完成
- [ ] 提交审核（建议周三前提交，争取周四前通过）
- [ ] Chrome Web Store 提交审核（$5）
- [ ] Cloudflare 注册 yance.ai 域名（$10-15）
- [ ] 路演 PPT 数据核实
- [ ] 现场演示流程排练 2 遍
