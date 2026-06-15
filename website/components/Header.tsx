'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

/* -------------------------------------------
   Navigation Data
   ------------------------------------------- */
const productLinks = [
  {
    href: '/demo',
    icon: '🤖',
    title: 'PolicyCopilot',
    desc: 'AI政策问答与智能检索引擎',
  },
  {
    href: '/company-match',
    icon: '🏢',
    title: 'CompanyProfile',
    desc: '企业画像与资质智能分析',
  },
  {
    href: '/company-match',
    icon: '🔗',
    title: 'SubsidyMatch',
    desc: '政策资源精准匹配与推荐',
  },
  {
    href: '/brief-maker',
    icon: '📋',
    title: 'BriefMaker',
    desc: '申报材料清单与文档生成',
  },
  {
    href: '/parks',
    icon: '🏗️',
    title: 'ParkOps',
    desc: '园区企业服务工作台',
  },
];

const solutionLinks = [
  { href: '/parks', title: '园区公司', desc: '产业园区综合政策服务' },
  { href: '/parks', title: '孵化器', desc: '在孵企业政策赋能' },
  { href: '/parks', title: '招商运营', desc: '招商政策比对与落地服务' },
  { href: '/parks', title: '政企服务', desc: '政企沟通与申报协同' },
];

const resourceLinks = [
  { href: '/demo', title: 'Demo体验', desc: '在线体验产品功能' },
  { href: '/policy-knowledge-base', title: '政策知识库', desc: '浏览最新政策法规' },
  { href: '/about', title: '案例研究', desc: '客户成功故事' },
  { href: '/about', title: '博客', desc: '行业洞察与产品动态' },
];

/* -------------------------------------------
   Mega Menu Component
   ------------------------------------------- */
interface MegaMenuProps {
  items: Array<{
    href: string;
    icon?: string;
    title: string;
    desc: string;
  }>;
  columns?: number;
  onNavigate: () => void;
}

function MegaMenu({ items, columns = 2, onNavigate }: MegaMenuProps) {
  return (
    <div
      className={`mega-menu ${columns === 1 ? 'mega-menu-single' : ''}`}
      style={columns !== 1 ? undefined : { minWidth: 280 }}
    >
      <div
        className="mega-menu-grid"
        style={columns !== 2 ? { gridTemplateColumns: '1fr' } : undefined}
      >
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="mega-menu-item"
            onClick={onNavigate}
          >
            {item.icon && (
              <div className="mega-menu-icon">{item.icon}</div>
            )}
            <div className="mega-menu-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------
   Chevron SVG
   ------------------------------------------- */
function ChevronDown() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* -------------------------------------------
   Header Component
   ------------------------------------------- */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection for glass-morphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMenuEnter = useCallback((menu: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  }, []);

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="header-logo" onClick={closeAll}>
            <span className="header-logo-mark">YC</span>
            <span>YanCe</span>
            <span className="header-logo-domain">yance.ai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav" ref={navRef} aria-label="主导航">
            {/* 产品 */}
            <div
              className={`nav-item ${openMenu === 'products' ? 'open' : ''}`}
              onMouseEnter={() => handleMenuEnter('products')}
              onMouseLeave={handleMenuLeave}
            >
              <button
                className="nav-trigger"
                aria-expanded={openMenu === 'products'}
                aria-haspopup="true"
                onClick={() =>
                  setOpenMenu(openMenu === 'products' ? null : 'products')
                }
              >
                产品
                <ChevronDown />
              </button>
              <MegaMenu
                items={productLinks}
                columns={2}
                onNavigate={closeAll}
              />
            </div>

            {/* 解决方案 */}
            <div
              className={`nav-item ${openMenu === 'solutions' ? 'open' : ''}`}
              onMouseEnter={() => handleMenuEnter('solutions')}
              onMouseLeave={handleMenuLeave}
            >
              <button
                className="nav-trigger"
                aria-expanded={openMenu === 'solutions'}
                aria-haspopup="true"
                onClick={() =>
                  setOpenMenu(openMenu === 'solutions' ? null : 'solutions')
                }
              >
                解决方案
                <ChevronDown />
              </button>
              <MegaMenu
                items={solutionLinks}
                columns={2}
                onNavigate={closeAll}
              />
            </div>

            {/* 资源 */}
            <div
              className={`nav-item ${openMenu === 'resources' ? 'open' : ''}`}
              onMouseEnter={() => handleMenuEnter('resources')}
              onMouseLeave={handleMenuLeave}
            >
              <button
                className="nav-trigger"
                aria-expanded={openMenu === 'resources'}
                aria-haspopup="true"
                onClick={() =>
                  setOpenMenu(openMenu === 'resources' ? null : 'resources')
                }
              >
                资源
                <ChevronDown />
              </button>
              <MegaMenu
                items={resourceLinks}
                columns={1}
                onNavigate={closeAll}
              />
            </div>

            {/* Simple links */}
            <Link href="/pricing">定价</Link>
            <Link href="/about">关于我们</Link>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            <Link href="/demo" className="header-login">
              登录
            </Link>
            <Link href="/demo" className="btn btn-primary">
              预约Demo
            </Link>

            {/* Mobile hamburger */}
            <button
              className={`mobile-toggle ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        aria-label="移动端导航"
      >
        <div className="mobile-section-title">产品</div>
        {productLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon} {item.title}
          </Link>
        ))}

        <div className="mobile-section-title">解决方案</div>
        {solutionLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.title}
          </Link>
        ))}

        <div className="mobile-section-title">资源</div>
        {resourceLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            {item.title}
          </Link>
        ))}

        <Link href="/pricing" onClick={() => setMobileOpen(false)}>
          定价
        </Link>
        <Link href="/about" onClick={() => setMobileOpen(false)}>
          关于我们
        </Link>

        <Link
          href="/demo"
          className="btn btn-primary btn-lg"
          onClick={() => setMobileOpen(false)}
        >
          预约Demo
        </Link>
      </nav>
    </>
  );
}
