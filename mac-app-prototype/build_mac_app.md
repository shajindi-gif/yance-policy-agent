# YanCe Policy Agent Desktop - Mac .app 打包指南

本文档详细说明如何将 Python 应用打包为 macOS 独立 .app 应用包。

## 前置条件

- macOS 10.15+
- Python 3.8+（建议使用 Homebrew 安装）
- PyInstaller 6.0+

## 步骤一：环境准备

### 安装 Homebrew（如尚未安装）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 安装 Python（推荐使用 Homebrew）

```bash
brew install python@3.11
```

### 创建虚拟环境（推荐）

```bash
cd mac-app-prototype
python3 -m venv venv
source venv/bin/activate
```

### 安装 PyInstaller

```bash
pip install pyinstaller
```

## 步骤二：测试运行

在打包前确保应用可以正常运行：

```bash
python3 main.py
```

确认应用窗口正常打开，所有功能可用。

## 步骤三：打包

### 基础打包

```bash
pyinstaller --windowed --name "YanCe Policy Agent Desktop" main.py
```

### 推荐打包参数

```bash
pyinstaller \
  --windowed \
  --name "YanCe Policy Agent Desktop" \
  --icon icon.icns \
  --onedir \
  --clean \
  --noconfirm \
  main.py
```

参数说明：
- `--windowed`：以 GUI 模式运行，不显示终端窗口
- `--name`：指定应用名称
- `--icon`：指定应用图标（.icns 格式）
- `--onedir`：打包为目录（推荐，比 --onefile 启动更快）
- `--clean`：清理临时文件后重新打包
- `--noconfirm`：自动确认覆盖

### 带自定义图标的打包

1. 准备 1024x1024 的 PNG 图标
2. 转换为 .icns 格式：

```bash
# 使用 macOS 自带工具
mkdir icon.iconset
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
iconutil -c icns icon.iconset -o icon.icns
```

3. 打包时引用图标文件

## 步骤四：检查输出

打包完成后，输出目录结构：

```
dist/
└── YanCe Policy Agent Desktop.app    # 最终应用包
    └── Contents/
        ├── Info.plist
        ├── MacOS/
        │   └── YanCe Policy Agent Desktop
        ├── Resources/
        │   └── icon-windowed.icns
        └── Frameworks/
```

## 步骤五：测试 .app

### 直接运行

```bash
open "dist/YanCe Policy Agent Desktop.app"
```

### 验证功能

1. 确认应用可以正常启动
2. 测试所有输入功能
3. 测试报告生成
4. 测试报告保存功能
5. 确认菜单栏可用
6. 检查窗口缩放

## 步骤六：签名与公证（发布必需）

### 代码签名

需要 Apple Developer 账号（$99/年）。

```bash
# 查看可用证书
security find-identity -v -p codesigning

# 签名应用
codesign --force --deep --sign "Developer ID Application: Your Name (TEAM_ID)" \
  "dist/YanCe Policy Agent Desktop.app"
```

### 公证（Notarization）

```bash
# 提交公证
xcrun notarytool submit "dist/YanCe Policy Agent Desktop.app" \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# 装订公证票据
xcrun stapler staple "dist/YanCe Policy Agent Desktop.app"
```

## 步骤七：创建 DMG 安装包

```bash
# 创建 DMG
hdiutil create -volname "YanCe Policy Agent" \
  -srcfolder "dist/YanCe Policy Agent Desktop.app" \
  -ov -format UDZO \
  "YanCe-Policy-Agent-Desktop.dmg"
```

## 常见问题

### Q: 打包后应用闪退
检查是否使用了正确的 Python 版本，确保 tkinter 可用：
```bash
python3 -c "import tkinter; print('tkinter OK')"
```

### Q: 打包体积过大
使用 `--onedir` 代替 `--onefile`，或排除不需要的模块：
```bash
pyinstaller --windowed --name "YanCe Policy Agent Desktop" \
  --exclude-module numpy \
  --exclude-module scipy \
  --exclude-module matplotlib \
  main.py
```

### Q: 图标不显示
确保 .icns 文件格式正确，包含多种尺寸。使用 `iconutil` 验证。

### Q: macOS 阻止打开
前往「系统设置 → 隐私与安全性」，点击「仍要打开」。
或运行：
```bash
xattr -cr "dist/YanCe Policy Agent Desktop.app"
```
