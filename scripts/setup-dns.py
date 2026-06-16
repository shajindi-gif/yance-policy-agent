#!/usr/bin/env python3
"""
YanCe Policy Agent - DNS 一键配置脚本
域名: yance.ai
目标: 将 yance.ai 指向 Vercel

使用方法:
1. 先在注册商处注册 yance.ai
2. 获取 DNS 管理权限（将 NS 指向你的 DNS 服务商）
3. 运行此脚本

支持 DNS 服务商:
- 阿里云 (alidns)
- Cloudflare
- 手动配置指引
"""

import sys
import os

# Vercel DNS 配置
VERCEL_IP = "76.76.21.21"
VERCEL_CNAME = "cname.vercel-dns.com"
DOMAIN = "yance.ai"

# Aliyun credentials — use environment variables for security
# Set: export ALIYUN_AK_ID=your_key_id ALIYUN_AK_SECRET=your_key_secret
ALIYUN_AK_ID = os.environ.get("ALIYUN_AK_ID", "")
ALIYUN_AK_SECRET = os.environ.get("ALIYUN_AK_SECRET", "")
ALIYUN_ENDPOINT = "alidns.cn-hangzhou.aliyuncs.com"


def configure_aliyun():
    """通过阿里云 DNS API 配置"""
    try:
        from alibabacloud_alidns20150109.client import Client
        from alibabacloud_tea_openapi.models import Config
        from alibabacloud_alidns20150109.models import (
            AddDomainRequest,
            AddDomainRecordRequest,
        )
    except ImportError:
        print("❌ 缺少 alibabacloud-alidns SDK，请运行: pip install alibabacloud-alidns20150109")
        sys.exit(1)

    config = Config(
        access_key_id=ALIYUN_AK_ID,
        access_key_secret=ALIYUN_AK_SECRET,
        endpoint=ALIYUN_ENDPOINT,
    )
    client = Client(config)

    # Step 1: Add domain to Aliyun DNS
    print(f"📡 正在将 {DOMAIN} 添加到阿里云 DNS...")
    try:
        resp = client.add_domain(AddDomainRequest(domain_name=DOMAIN))
        print(f"  ✅ 域名已添加到阿里云 DNS")
    except Exception as e:
        if "AlreadyExist" in str(e) or "already" in str(e).lower():
            print(f"  ℹ️  域名已在阿里云 DNS 中，跳过添加")
        else:
            print(f"  ❌ 添加失败: {e}")
            print(f"  💡 请确认域名已注册，且 NS 已指向阿里云")
            sys.exit(1)

    # Step 2: Add DNS records
    records = [
        {"rr": "@", "type": "A", "value": VERCEL_IP, "desc": "yance.ai → Vercel"},
        {"rr": "www", "type": "CNAME", "value": VERCEL_CNAME, "desc": "www.yance.ai → Vercel"},
    ]

    for r in records:
        print(f"📝 添加记录: {r['rr']}.{DOMAIN} {r['type']} {r['value']}")
        try:
            req = AddDomainRecordRequest(
                domain_name=DOMAIN,
                rr=r["rr"],
                type=r["type"],
                value=r["value"],
                ttl=600,
            )
            client.add_domain_record(req)
            print(f"  ✅ {r['desc']}")
        except Exception as e:
            if "RecordAlreadyExist" in str(e):
                print(f"  ℹ️  记录已存在，跳过")
            else:
                print(f"  ❌ 失败: {e}")

    print(f"\n🎉 DNS 配置完成！")
    print(f"   等待 1-5 分钟后访问 https://{DOMAIN}")
    print(f"   Vercel 会自动签发 HTTPS 证书")


def configure_manual():
    """输出手动配置指引"""
    print(f"""
╔══════════════════════════════════════════════════╗
║     yance.ai DNS 配置指引 (手动)               ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  在你的域名注册商 DNS 管理面板中添加以下记录:     ║
║                                                  ║
║  ┌──────────────────────────────────────────────┐║
║  │ 类型  │ 主机记录 │ 记录值                    │║
║  ├──────────────────────────────────────────────┤║
║  │ A     │ @        │ {VERCEL_IP}        │║
║  │ CNAME │ www      │ {VERCEL_CNAME}  │║
║  └──────────────────────────────────────────────┘║
║                                                  ║
║  TTL: 600 (或默认值)                             ║
║                                                  ║
║  配置完成后:                                      ║
║  1. 等待 1-5 分钟 DNS 生效                       ║
║  2. Vercel 会自动签发 HTTPS 证书                 ║
║  3. 访问 https://yance.ai 验证                  ║
║                                                  ║
╚══════════════════════════════════════════════════╝

📋 域名注册推荐渠道 (.ai 域名):
   • Cloudflare Registrar — 成本价注册，DNS 管理最方便
     https://dash.cloudflare.com/ → Domains → Register Domain
   • Namecheap — 约 $58/年
     https://www.namecheap.com/domains/registration/cctld/ai/
   • Porkbun — 约 $65/年
     https://porkbun.com/

💡 推荐 Cloudflare：注册后可直接用 Cloudflare DNS，
   速度快、免费、支持 API 管理。
""")


def verify_dns():
    """验证 DNS 配置是否正确"""
    import subprocess

    print(f"\n🔍 验证 DNS 配置...")
    print(f"{'─' * 50}")

    # Check A record
    try:
        result = subprocess.run(
            ["dig", DOMAIN, "A", "+short"],
            capture_output=True, text=True, timeout=10
        )
        a_records = result.stdout.strip()
        if VERCEL_IP in a_records:
            print(f"  ✅ {DOMAIN} A 记录正确: {a_records}")
        elif a_records:
            print(f"  ⚠️  {DOMAIN} A 记录: {a_records} (期望: {VERCEL_IP})")
        else:
            print(f"  ❌ {DOMAIN} A 记录未找到")
    except Exception as e:
        print(f"  ❌ DNS 查询失败: {e}")

    # Check CNAME record
    try:
        result = subprocess.run(
            ["dig", f"www.{DOMAIN}", "CNAME", "+short"],
            capture_output=True, text=True, timeout=10
        )
        cname = result.stdout.strip()
        if VERCEL_CNAME in cname:
            print(f"  ✅ www.{DOMAIN} CNAME 正确: {cname}")
        elif cname:
            print(f"  ⚠️  www.{DOMAIN} CNAME: {cname} (期望: {VERCEL_CNAME})")
        else:
            print(f"  ❌ www.{DOMAIN} CNAME 未找到")
    except Exception as e:
        print(f"  ❌ DNS 查询失败: {e}")

    # Check HTTPS
    try:
        result = subprocess.run(
            ["curl", "-sI", f"https://{DOMAIN}"],
            capture_output=True, text=True, timeout=10
        )
        if "200" in result.stdout or "301" in result.stdout or "302" in result.stdout:
            print(f"  ✅ https://{DOMAIN} 可访问")
        else:
            print(f"  ⏳ https://{DOMAIN} 尚未就绪（DNS 可能还在传播）")
    except Exception:
        print(f"  ⏳ https://{DOMAIN} 尚未就绪")


if __name__ == "__main__":
    print("=" * 50)
    print("  YanCe Policy Agent DNS 配置工具")
    print("  域名: yance.ai → Vercel")
    print("=" * 50)

    if len(sys.argv) > 1:
        mode = sys.argv[1]
    else:
        print("\n选择配置方式:")
        print("  1. 阿里云 DNS (自动)")
        print("  2. 手动配置 (输出指引)")
        print("  3. 验证 DNS")
        mode = input("\n请输入选项 (1/2/3): ").strip()

    if mode in ("1", "aliyun"):
        configure_aliyun()
        verify_dns()
    elif mode in ("2", "manual"):
        configure_manual()
    elif mode in ("3", "verify"):
        verify_dns()
    else:
        print("无效选项")
        sys.exit(1)
