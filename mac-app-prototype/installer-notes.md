# YanCe Policy Agent Desktop - 分发与安装说明

## 分发方式

### 方式一：DMG 安装包（推荐）

最标准的 macOS 应用分发方式。

**制作 DMG：**
```bash
hdiutil create -volname "YanCe Policy Agent" \
  -srcfolder "dist/YanCe Policy Agent Desktop.app" \
  -ov -format UDZO \
  "YanCe-Policy-Agent-Desktop-v0.1.0.dmg"
```

**用户安装步骤：**
1. 双击下载的 .dmg 文件
2. 将 "YanCe Policy Agent Desktop" 拖入「应用程序」文件夹
3. 首次打开时，前往「系统设置 → 隐私与安全性」允许运行
4. 从 Launchpad 或应用程序文件夹启动

### 方式二：ZIP 压缩包

适合内部分发或小规模测试。

**制作 ZIP：**
```bash
cd dist
zip -r "YanCe-Policy-Agent-Desktop-v0.1.0.zip" "YanCe Policy Agent Desktop.app"
```

**用户安装步骤：**
1. 下载并解压 ZIP 文件
2. 将 .app 移入「应用程序」文件夹
3. 首次打开需通过 Gatekeeper 安全验证

### 方式三：Homebrew Cask（面向开发者）

```ruby
# homebrew-cask 配置示例
cask "yance-policy-agent" do
  version "0.1.0"
  sha256 "SHA256_CHECKSUM"
  url "https://releases.example.com/YanCe-Policy-Agent-Desktop-#{version}.dmg"
  name "YanCe Policy Agent Desktop"
  desc "园区政策分析助手"
  homepage "https://github.com/your-org/yance-policy-agent"
  app "YanCe Policy Agent Desktop.app"
end
```

### 方式四：源码直接运行

适合开发者和技术人员。

```bash
git clone https://github.com/your-org/yance-policy-agent.git
cd yance-policy-agent/mac-app-prototype
python3 main.py
```

## 安全与信任

### Gatekeeper 与代码签名

macOS 默认阻止运行未签名的应用。解决方案：

1. **最佳方案：代码签名 + 公证**
   - 需要 Apple Developer 账号
   - 用户可直接双击打开，无安全警告
   - 详见 `build_mac_app.md` 中的签名步骤

2. **临时方案：用户手动允许**
   - 右键点击 .app → 「打开」
   - 或前往「系统设置 → 隐私与安全性 → 仍要打开」

3. **开发者模式：**
   ```bash
   sudo spctl --master-disable
   # 注意：这会降低系统安全性，仅建议开发测试使用
   ```

### 沙盒配置

如需上架 Mac App Store，需要配置 App Sandbox：

```xml
<!-- Entitlements.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.app-sandbox</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
</dict>
</plist>
```

打包时添加 entitlements：
```bash
pyinstaller --windowed --name "YanCe Policy Agent Desktop" \
  --osx-bundle-identifier "com.yance.policy-agent" \
  main.py
codesign --force --deep --sign "Developer ID" \
  --entitlements Entitlements.plist \
  "dist/YanCe Policy Agent Desktop.app"
```

## 版本管理

### 版本号规则

遵循语义化版本（Semantic Versioning）：`MAJOR.MINOR.PATCH`

- MAJOR：不兼容的 API 变更
- MINOR：向下兼容的功能新增
- PATCH：向下兼容的问题修复

### 更新机制

**手动更新：**
1. 用户下载新版本 DMG
2. 安装新版本（自动覆盖旧版本）
3. 用户数据和配置保存在 `~/Library/Application Support/YanCe Policy Agent/`

**自动更新（计划中）：**
- 集成 Sparkle 框架实现自动更新
- 或使用自建更新服务器

## 数据存储

应用数据目录结构：

```
~/Library/Application Support/YanCe Policy Agent/
├── config.json          # 用户配置
├── reports/             # 历史报告
│   ├── 2025-01-15_企业A.md
│   └── 2025-01-16_企业B.md
├── policies/            # 导入的政策文件缓存
└── cache/               # 临时缓存
```

## 卸载

### 标准卸载
1. 将「应用程序」中的 "YanCe Policy Agent Desktop.app" 移入废纸篓
2. （可选）清理用户数据：
```bash
rm -rf ~/Library/Application\ Support/YanCe\ Policy\ Agent/
rm -rf ~/Library/Caches/com.yance.policy-agent/
rm -rf ~/Library/Preferences/com.yance.policy-agent.plist
```

### 提供卸载脚本
```bash
#!/bin/bash
# uninstall.sh
echo "正在卸载 YanCe Policy Agent Desktop..."
rm -rf "/Applications/YanCe Policy Agent Desktop.app"
rm -rf "$HOME/Library/Application Support/YanCe Policy Agent"
rm -rf "$HOME/Library/Caches/com.yance.policy-agent"
echo "卸载完成。"
```

## 技术支持

- 问题反馈：GitHub Issues
- 使用文档：应用内「帮助 → 使用说明」
- 联系邮箱：support@yance.example.com
