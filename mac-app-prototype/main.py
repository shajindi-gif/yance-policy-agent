#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YanCe Policy Agent Desktop
园区政策分析助手 - Mac 桌面应用原型

基于 tkinter 构建，无需额外依赖。
功能：企业信息录入、政策分析、报告生成与导出。
品牌：yance.ai
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from datetime import datetime
import os
import webbrowser

# ============================================
# Optional PIL/Pillow import for logo display
# ============================================
try:
    from PIL import Image, ImageTk
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


# ============================================
# Application Constants
# ============================================
APP_TITLE = "YanCe Policy Agent Desktop"
APP_VERSION = "1.0.0"
APP_BRAND_URL = "https://yance.ai"
WINDOW_SIZE = "1200x800"
MIN_SIZE = (960, 640)
SPLASH_DURATION_MS = 2000

# Color scheme — navy / teal / coral (matching yance.ai brand)
COLORS = {
    "bg_dark": "#0d1b2a",       # navy (main background)
    "bg_panel": "#1b2d45",      # navy-light (side panels)
    "bg_card": "#1a2f52",
    "bg_input": "#0a1628",
    "accent": "#0ea5e9",        # teal
    "accent_hover": "#38bdf8",
    "coral": "#f97316",         # coral (primary CTA)
    "coral_hover": "#fb923c",
    "text_primary": "#e2e8f0",
    "text_secondary": "#7dd3fc",
    "text_muted": "#64748b",
    "border": "#1e3a5f",
    "success": "#34d399",
    "warning": "#fbbf24",
    "danger": "#f87171",
}

# Region options
REGIONS = [
    "请选择区域",
    "上海市浦东新区",
    "上海市徐汇区",
    "上海市杨浦区",
    "上海市松江区",
    "上海市嘉定区",
    "上海市临港新片区",
    "北京市中关村",
    "北京市亦庄经开区",
    "深圳市南山区",
    "深圳市前海",
    "杭州市余杭区",
    "杭州市滨江区",
    "苏州市工业园区",
    "成都市天府新区",
    "广州市天河区",
    "武汉市东湖高新区",
    "合肥市高新区",
]

# Industry options
INDUSTRIES = [
    "请选择行业",
    "人工智能",
    "生物医药",
    "集成电路",
    "新材料",
    "新能源",
    "智能制造",
    "软件与信息服务",
    "数字经济",
    "金融科技",
    "文化创意",
    "现代农业",
    "航空航天",
    "其他",
]

# Needs checkbox options
NEEDS_OPTIONS = [
    "创业补贴",
    "场地补贴",
    "算力券",
    "模型券",
    "高企认定",
    "专精特新",
    "科技型中小企业",
    "人才引进",
    "研发费用补贴",
    "知识产权资助",
    "融资对接",
    "公共平台使用补贴",
]


# ============================================
# Logo Helper
# ============================================
def get_logo_path():
    """Return the path to logo.png in the same directory as this script."""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "logo.png")


def load_logo_image(size, fallback_text="Y"):
    """
    Attempt to load and resize logo.png via PIL.
    Returns (photo_image, is_real_logo) tuple.
    If PIL is unavailable or the file is missing, returns (None, False).
    """
    logo_path = get_logo_path()
    if not HAS_PIL or not os.path.exists(logo_path):
        return None, False
    try:
        img = Image.open(logo_path)
        img = img.resize(size, Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)
        return photo, True
    except Exception:
        return None, False


# ============================================
# Splash Screen
# ============================================
class SplashScreen(tk.Toplevel):
    """Modern splash screen shown during application startup."""

    def __init__(self, parent, duration_ms=SPLASH_DURATION_MS):
        super().__init__(parent)
        self.duration_ms = duration_ms
        self.overrideredirect(True)

        # Centre on screen
        w, h = 500, 340
        sx = (self.winfo_screenwidth() - w) // 2
        sy = (self.winfo_screenheight() - h) // 2
        self.geometry(f"{w}x{h}+{sx}+{sy}")
        self.configure(bg=COLORS["bg_dark"])

        # Main frame
        frame = tk.Frame(self, bg=COLORS["bg_dark"], width=w, height=h)
        frame.pack(fill=tk.BOTH, expand=True)

        # Logo image or fallback circle
        self._logo_photo = None
        logo_photo, is_real = load_logo_image((72, 72))
        if is_real and logo_photo is not None:
            self._logo_photo = logo_photo  # prevent GC
            logo_label = tk.Label(frame, image=logo_photo, bg=COLORS["bg_dark"])
            logo_label.place(relx=0.5, rely=0.28, anchor=tk.CENTER)
        else:
            logo_frame = tk.Frame(frame, bg=COLORS["accent"], width=72, height=72)
            logo_frame.place(relx=0.5, rely=0.28, anchor=tk.CENTER)
            logo_frame.pack_propagate(False)
            lbl = tk.Label(
                logo_frame, text="Y", font=("Helvetica Neue", 36, "bold"),
                bg=COLORS["accent"], fg="#ffffff",
            )
            lbl.place(relx=0.5, rely=0.5, anchor=tk.CENTER)

        # App title
        tk.Label(
            frame, text="YanCe Policy Agent Desktop",
            font=("Helvetica Neue", 20, "bold"),
            bg=COLORS["bg_dark"], fg="#ffffff",
        ).place(relx=0.5, rely=0.52, anchor=tk.CENTER)

        # Subtitle
        tk.Label(
            frame, text="园区政策分析助手",
            font=("Helvetica Neue", 13),
            bg=COLORS["bg_dark"], fg=COLORS["text_secondary"],
        ).place(relx=0.5, rely=0.63, anchor=tk.CENTER)

        # Brand URL
        tk.Label(
            frame, text="yance.ai",
            font=("Helvetica Neue", 13, "bold"),
            bg=COLORS["bg_dark"], fg=COLORS["coral"],
        ).place(relx=0.5, rely=0.74, anchor=tk.CENTER)

        # Version
        tk.Label(
            frame, text=f"v{APP_VERSION}",
            font=("Helvetica Neue", 10),
            bg=COLORS["bg_dark"], fg=COLORS["text_muted"],
        ).place(relx=0.5, rely=0.84, anchor=tk.CENTER)

        # Loading progress bar
        self.progress = tk.Frame(frame, bg=COLORS["border"], width=220, height=4)
        self.progress.place(relx=0.5, rely=0.93, anchor=tk.CENTER)
        self.progress.pack_propagate(False)
        self.bar = tk.Frame(self.progress, bg=COLORS["accent"], width=0, height=4)
        self.bar.place(x=0, y=0)
        self._animate_bar(0)

    def _animate_bar(self, step):
        """Animate the loading bar from left to right."""
        max_w = 220
        current_w = int(max_w * (step / 20))
        self.bar.place(x=0, y=0, width=current_w, height=4)
        if step < 20:
            self.after(self.duration_ms // 20, lambda: self._animate_bar(step + 1))


# ============================================
# Main Application Class
# ============================================
class YanCePolicyAgentApp:
    """Main application window for YanCe Policy Agent Desktop."""

    def __init__(self, root):
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry(WINDOW_SIZE)
        self.root.minsize(*MIN_SIZE)
        self.root.configure(bg=COLORS["bg_dark"])

        # Keep references to prevent garbage collection
        self._logo_photo = None

        # Variables
        self.policy_file_path = tk.StringVar(value="")
        self.needs_vars = {}
        self.status_text = tk.StringVar(
            value=f"yance.ai | v{APP_VERSION} | 衍策引擎AI"
        )

        # Build UI
        self._setup_styles()
        self._create_menu()
        self._create_main_layout()
        self._create_status_bar()

    # ========================================
    # Styling
    # ========================================
    def _setup_styles(self):
        """Configure ttk styles for the dark navy/teal/coral theme."""
        style = ttk.Style()
        style.theme_use("clam")

        # Global frame
        style.configure("Dark.TFrame", background=COLORS["bg_dark"])
        style.configure("Panel.TFrame", background=COLORS["bg_panel"])
        style.configure("Card.TFrame", background=COLORS["bg_card"])

        # Labels
        style.configure(
            "Dark.TLabel",
            background=COLORS["bg_dark"],
            foreground=COLORS["text_primary"],
            font=("Helvetica Neue", 12),
        )
        style.configure(
            "Panel.TLabel",
            background=COLORS["bg_panel"],
            foreground=COLORS["text_primary"],
            font=("Helvetica Neue", 12),
        )
        style.configure(
            "PanelTitle.TLabel",
            background=COLORS["bg_panel"],
            foreground=COLORS["text_secondary"],
            font=("Helvetica Neue", 14, "bold"),
        )
        style.configure(
            "SectionTitle.TLabel",
            background=COLORS["bg_panel"],
            foreground=COLORS["text_secondary"],
            font=("Helvetica Neue", 11, "bold"),
        )
        style.configure(
            "Muted.TLabel",
            background=COLORS["bg_panel"],
            foreground=COLORS["text_muted"],
            font=("Helvetica Neue", 10),
        )
        style.configure(
            "Header.TLabel",
            background=COLORS["bg_dark"],
            foreground="#ffffff",
            font=("Helvetica Neue", 18, "bold"),
        )
        style.configure(
            "SubHeader.TLabel",
            background=COLORS["bg_dark"],
            foreground=COLORS["text_muted"],
            font=("Helvetica Neue", 11),
        )
        style.configure(
            "Brand.TLabel",
            background=COLORS["bg_dark"],
            foreground=COLORS["coral"],
            font=("Helvetica Neue", 11, "bold"),
        )

        # Buttons
        style.configure(
            "Primary.TButton",
            background=COLORS["accent"],
            foreground="#ffffff",
            font=("Helvetica Neue", 12, "bold"),
            padding=(16, 8),
            borderwidth=0,
        )
        style.map(
            "Primary.TButton",
            background=[("active", COLORS["accent_hover"]), ("disabled", COLORS["border"])],
        )
        style.configure(
            "Coral.TButton",
            background=COLORS["coral"],
            foreground="#ffffff",
            font=("Helvetica Neue", 13, "bold"),
            padding=(16, 10),
            borderwidth=0,
        )
        style.map(
            "Coral.TButton",
            background=[("active", COLORS["coral_hover"]), ("disabled", COLORS["border"])],
        )
        style.configure(
            "Secondary.TButton",
            background=COLORS["bg_card"],
            foreground=COLORS["text_secondary"],
            font=("Helvetica Neue", 11),
            padding=(12, 6),
            borderwidth=0,
        )
        style.map(
            "Secondary.TButton",
            background=[("active", COLORS["border"])],
        )
        style.configure(
            "Success.TButton",
            background=COLORS["success"],
            foreground=COLORS["bg_dark"],
            font=("Helvetica Neue", 11, "bold"),
            padding=(12, 6),
            borderwidth=0,
        )
        style.configure(
            "ExportPDF.TButton",
            background=COLORS["coral"],
            foreground="#ffffff",
            font=("Helvetica Neue", 11, "bold"),
            padding=(12, 6),
            borderwidth=0,
        )
        style.map(
            "ExportPDF.TButton",
            background=[("active", COLORS["coral_hover"])],
        )

        # Entry
        style.configure(
            "Dark.TEntry",
            fieldbackground=COLORS["bg_input"],
            foreground=COLORS["text_primary"],
            insertcolor=COLORS["text_primary"],
            borderwidth=1,
            relief="solid",
        )
        style.map(
            "Dark.TEntry",
            bordercolor=[("focus", COLORS["accent"])],
            lightcolor=[("focus", COLORS["accent"])],
            darkcolor=[("focus", COLORS["accent"])],
        )

        # Combobox
        style.configure(
            "Dark.TCombobox",
            fieldbackground=COLORS["bg_input"],
            foreground=COLORS["text_primary"],
            selectbackground=COLORS["accent"],
            selectforeground="#ffffff",
            borderwidth=1,
        )
        style.map(
            "Dark.TCombobox",
            bordercolor=[("focus", COLORS["accent"])],
            fieldbackground=[("readonly", COLORS["bg_input"])],
        )

        # Checkbutton
        style.configure(
            "Panel.TCheckbutton",
            background=COLORS["bg_panel"],
            foreground=COLORS["text_primary"],
            font=("Helvetica Neue", 11),
        )
        style.map(
            "Panel.TCheckbutton",
            background=[("active", COLORS["bg_card"])],
        )

        # Separator
        style.configure("Dark.TSeparator", background=COLORS["border"])

    # ========================================
    # Menu Bar
    # ========================================
    def _create_menu(self):
        """Create the application menu bar."""
        menubar = tk.Menu(
            self.root, bg=COLORS["bg_panel"], fg=COLORS["text_primary"],
            activebackground=COLORS["accent"], activeforeground="#ffffff",
        )

        # File menu
        file_menu = tk.Menu(
            menubar, tearoff=0, bg=COLORS["bg_panel"], fg=COLORS["text_primary"],
            activebackground=COLORS["accent"], activeforeground="#ffffff",
        )
        file_menu.add_command(label="新建项目", command=self._on_new_project, accelerator="Cmd+N")
        file_menu.add_command(label="导入政策文件...", command=self._on_import_policy, accelerator="Cmd+O")
        file_menu.add_separator()
        file_menu.add_command(label="保存报告", command=self._on_save_report, accelerator="Cmd+S")
        file_menu.add_command(label="另存报告为...", command=self._on_save_report_as, accelerator="Cmd+Shift+S")
        file_menu.add_command(label="导出报告为 PDF...", command=self._on_export_pdf, accelerator="Cmd+Shift+P")
        file_menu.add_separator()
        file_menu.add_command(label="退出", command=self.root.quit, accelerator="Cmd+Q")
        menubar.add_cascade(label="文件", menu=file_menu)

        # Edit menu
        edit_menu = tk.Menu(
            menubar, tearoff=0, bg=COLORS["bg_panel"], fg=COLORS["text_primary"],
            activebackground=COLORS["accent"], activeforeground="#ffffff",
        )
        edit_menu.add_command(label="撤销", accelerator="Cmd+Z")
        edit_menu.add_command(label="重做", accelerator="Cmd+Shift+Z")
        edit_menu.add_separator()
        edit_menu.add_command(label="剪切", accelerator="Cmd+X")
        edit_menu.add_command(label="复制", accelerator="Cmd+C")
        edit_menu.add_command(label="粘贴", accelerator="Cmd+V")
        menubar.add_cascade(label="编辑", menu=edit_menu)

        # Help menu
        help_menu = tk.Menu(
            menubar, tearoff=0, bg=COLORS["bg_panel"], fg=COLORS["text_primary"],
            activebackground=COLORS["accent"], activeforeground="#ffffff",
        )
        help_menu.add_command(label="使用说明", command=self._show_help)
        help_menu.add_command(label="打开 yance.ai", command=self._open_website)
        help_menu.add_command(label="检查更新...", command=self._check_for_updates)
        help_menu.add_separator()
        help_menu.add_command(label="关于 YanCe Policy Agent", command=self._show_about)
        menubar.add_cascade(label="帮助", menu=help_menu)

        self.root.config(menu=menubar)

    # ========================================
    # Main Layout
    # ========================================
    def _create_main_layout(self):
        """Build the two-panel main layout with logo header."""
        # --- Top Header Bar ---
        header_frame = ttk.Frame(self.root, style="Dark.TFrame")
        header_frame.pack(fill=tk.X, padx=20, pady=(14, 6))

        # Logo area (left)
        logo_area = ttk.Frame(header_frame, style="Dark.TFrame")
        logo_area.pack(side=tk.LEFT)

        # Try loading real logo
        logo_photo, is_real = load_logo_image((40, 40))
        if is_real and logo_photo is not None:
            self._logo_photo = logo_photo  # prevent GC
            tk.Label(
                logo_area, image=logo_photo, bg=COLORS["bg_dark"],
            ).pack(side=tk.LEFT, padx=(0, 12))
        else:
            # Fallback: letter badge
            tk.Label(
                logo_area, text="Y", font=("Helvetica Neue", 20, "bold"),
                bg=COLORS["accent"], fg="#ffffff", width=2, height=1,
            ).pack(side=tk.LEFT, padx=(0, 12))

        ttk.Label(logo_area, text="YanCe Policy Agent", style="Header.TLabel").pack(side=tk.LEFT)
        ttk.Label(
            logo_area, text="  v" + APP_VERSION, style="SubHeader.TLabel",
        ).pack(side=tk.LEFT, padx=(4, 0), pady=(8, 0))

        # Brand URL (right)
        brand_label = tk.Label(
            header_frame, text="yance.ai",
            font=("Helvetica Neue", 12, "bold"),
            bg=COLORS["bg_dark"], fg=COLORS["coral"],
            cursor="hand2",
        )
        brand_label.pack(side=tk.RIGHT, padx=(0, 4))
        brand_label.bind("<Button-1>", lambda e: self._open_website())

        # Separator
        ttk.Separator(self.root, orient=tk.HORIZONTAL, style="Dark.TSeparator").pack(
            fill=tk.X, padx=20, pady=(2, 6),
        )

        # --- Paned Window ---
        paned = tk.PanedWindow(
            self.root, orient=tk.HORIZONTAL, bg=COLORS["bg_dark"],
            sashwidth=4, sashrelief=tk.FLAT, sashpad=2,
        )
        paned.pack(fill=tk.BOTH, expand=True, padx=16, pady=6)

        # Left panel
        left_frame = ttk.Frame(paned, style="Panel.TFrame", width=420)
        paned.add(left_frame, minsize=340, width=420)
        self._build_left_panel(left_frame)

        # Right panel
        right_frame = ttk.Frame(paned, style="Panel.TFrame")
        paned.add(right_frame, minsize=420)
        self._build_right_panel(right_frame)

    # ========================================
    # Left Panel — Input Form
    # ========================================
    def _build_left_panel(self, parent):
        """Build the left panel with the enterprise/park input form."""
        canvas = tk.Canvas(parent, bg=COLORS["bg_panel"], highlightthickness=0)
        scrollbar = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=canvas.yview)
        scroll_frame = ttk.Frame(canvas, style="Panel.TFrame")

        scroll_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all")),
        )

        canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(8, 0), pady=4)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, pady=4)

        # Mousewheel scrolling
        def _on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        canvas.bind_all("<MouseWheel>", _on_mousewheel)

        # --- Panel Title ---
        ttk.Label(scroll_frame, text="企业与园区信息", style="PanelTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(12, 4),
        )
        ttk.Label(
            scroll_frame, text="请填写基本信息以生成政策服务报告", style="Muted.TLabel",
        ).pack(anchor=tk.W, padx=16, pady=(0, 12))

        # --- Park Name ---
        ttk.Label(scroll_frame, text="园区名称", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 4),
        )
        self.park_name_var = tk.StringVar(value="张江人工智能产业园")
        ttk.Entry(
            scroll_frame, textvariable=self.park_name_var, style="Dark.TEntry", width=40,
        ).pack(fill=tk.X, padx=16, pady=(0, 8), ipady=4)

        # --- Company Name ---
        ttk.Label(scroll_frame, text="企业名称", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 4),
        )
        self.company_name_var = tk.StringVar(value="")
        ttk.Entry(
            scroll_frame, textvariable=self.company_name_var, style="Dark.TEntry", width=40,
        ).pack(fill=tk.X, padx=16, pady=(0, 8), ipady=4)

        # --- Region Dropdown ---
        ttk.Label(scroll_frame, text="所在区域", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 4),
        )
        self.region_var = tk.StringVar(value=REGIONS[0])
        ttk.Combobox(
            scroll_frame, textvariable=self.region_var, values=REGIONS,
            state="readonly", style="Dark.TCombobox", width=37,
        ).pack(fill=tk.X, padx=16, pady=(0, 8))

        # --- Industry Dropdown ---
        ttk.Label(scroll_frame, text="所属行业", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 4),
        )
        self.industry_var = tk.StringVar(value=INDUSTRIES[0])
        ttk.Combobox(
            scroll_frame, textvariable=self.industry_var, values=INDUSTRIES,
            state="readonly", style="Dark.TCombobox", width=37,
        ).pack(fill=tk.X, padx=16, pady=(0, 8))

        # --- Needs Checkboxes ---
        ttk.Separator(scroll_frame, orient=tk.HORIZONTAL, style="Dark.TSeparator").pack(
            fill=tk.X, padx=16, pady=(16, 8),
        )
        ttk.Label(scroll_frame, text="当前需求（可多选）", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 8),
        )

        needs_frame = ttk.Frame(scroll_frame, style="Panel.TFrame")
        needs_frame.pack(fill=tk.X, padx=16, pady=(0, 8))

        for i, need in enumerate(NEEDS_OPTIONS):
            var = tk.BooleanVar(value=False)
            self.needs_vars[need] = var
            cb = ttk.Checkbutton(
                needs_frame, text=need, variable=var, style="Panel.TCheckbutton",
            )
            row, col = i // 2, i % 2
            cb.grid(row=row, column=col, sticky=tk.W, padx=(0, 16), pady=2)

        needs_frame.columnconfigure(0, weight=1)
        needs_frame.columnconfigure(1, weight=1)

        # --- Policy File Import ---
        ttk.Separator(scroll_frame, orient=tk.HORIZONTAL, style="Dark.TSeparator").pack(
            fill=tk.X, padx=16, pady=(16, 8),
        )
        ttk.Label(scroll_frame, text="政策文件导入（可选）", style="SectionTitle.TLabel").pack(
            anchor=tk.W, padx=16, pady=(8, 8),
        )

        file_frame = ttk.Frame(scroll_frame, style="Panel.TFrame")
        file_frame.pack(fill=tk.X, padx=16, pady=(0, 8))

        ttk.Entry(
            file_frame, textvariable=self.policy_file_path, style="Dark.TEntry", width=28,
        ).pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=3)
        ttk.Button(
            file_frame, text="浏览...", style="Secondary.TButton", command=self._on_browse_file,
        ).pack(side=tk.RIGHT, padx=(8, 0))

        # --- Generate Report Button (coral CTA) ---
        ttk.Separator(scroll_frame, orient=tk.HORIZONTAL, style="Dark.TSeparator").pack(
            fill=tk.X, padx=16, pady=(16, 8),
        )

        ttk.Button(
            scroll_frame, text="生成报告", style="Coral.TButton",
            command=self._on_generate_report,
        ).pack(fill=tk.X, padx=16, pady=(8, 20))

    # ========================================
    # Right Panel — Report Preview
    # ========================================
    def _build_right_panel(self, parent):
        """Build the right panel with the report preview area."""
        # Panel header
        header_frame = ttk.Frame(parent, style="Panel.TFrame")
        header_frame.pack(fill=tk.X, padx=16, pady=(12, 8))

        ttk.Label(header_frame, text="报告预览", style="PanelTitle.TLabel").pack(side=tk.LEFT)

        # Button row
        btn_frame = ttk.Frame(header_frame, style="Panel.TFrame")
        btn_frame.pack(side=tk.RIGHT)

        ttk.Button(
            btn_frame, text="导出 PDF", style="ExportPDF.TButton",
            command=self._on_export_pdf,
        ).pack(side=tk.LEFT, padx=(0, 8))

        ttk.Button(
            btn_frame, text="保存报告", style="Success.TButton",
            command=self._on_save_report,
        ).pack(side=tk.LEFT)

        # Separator
        ttk.Separator(parent, orient=tk.HORIZONTAL, style="Dark.TSeparator").pack(
            fill=tk.X, padx=16, pady=(0, 8),
        )

        # Report text area
        self.report_text = tk.Text(
            parent,
            bg=COLORS["bg_input"],
            fg=COLORS["text_primary"],
            font=("Menlo", 12),
            insertbackground=COLORS["text_primary"],
            selectbackground=COLORS["accent"],
            selectforeground="#ffffff",
            relief=tk.FLAT,
            wrap=tk.WORD,
            padx=16,
            pady=12,
            spacing1=2,
            spacing3=2,
        )
        report_scrollbar = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=self.report_text.yview)
        self.report_text.configure(yscrollcommand=report_scrollbar.set)

        self.report_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(16, 0), pady=(0, 16))
        report_scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 8), pady=(0, 16))

        # Configure heading tag style for report branding
        self.report_text.tag_configure(
            "brand_header",
            foreground=COLORS["coral"],
            font=("Menlo", 11, "bold"),
        )
        self.report_text.tag_configure(
            "section_heading",
            foreground=COLORS["accent"],
            font=("Menlo", 13, "bold"),
        )

        self._set_placeholder_text()

    def _set_placeholder_text(self):
        """Set placeholder text in the report area."""
        self.report_text.delete("1.0", tk.END)
        self.report_text.insert(tk.END, "报告预览区域\n\n", "section_heading")
        self.report_text.insert(tk.END, "请在左侧面板填写企业和园区信息，\n")
        self.report_text.insert(tk.END, "然后点击「生成报告」按钮。\n\n")
        self.report_text.insert(tk.END, "生成的报告将包含以下内容：\n")
        sections = [
            "企业基本信息概览",
            "政策匹配分析",
            "可申报政策清单",
            "申报条件符合度评估",
            "所需材料清单",
            "申报时间窗口",
            "预估政策支持",
            "风险提示",
            "园区服务建议",
            "后续行动建议",
            "关联政策推荐",
            "历史申报记录参考",
            "企业画像摘要",
            "报告元信息",
        ]
        for i, section in enumerate(sections, 1):
            self.report_text.insert(tk.END, f"  {i:2d}. {section}\n")
        self.report_text.insert(tk.END, "\n\n提示：可导入本地政策文件（.txt / .pdf）进行针对性分析。")
        self.report_text.insert(tk.END, "\n报告头部将包含 yance.ai 品牌标识。", "brand_header")

    # ========================================
    # Status Bar
    # ========================================
    def _create_status_bar(self):
        """Create the bottom status bar."""
        status_frame = tk.Frame(self.root, bg=COLORS["bg_panel"], height=28)
        status_frame.pack(fill=tk.X, side=tk.BOTTOM)
        status_frame.pack_propagate(False)

        tk.Label(
            status_frame, textvariable=self.status_text,
            font=("Helvetica Neue", 10),
            bg=COLORS["bg_panel"], fg=COLORS["text_muted"],
            anchor=tk.W, padx=12,
        ).pack(side=tk.LEFT, fill=tk.X, expand=True)

        tk.Label(
            status_frame,
            text=f"yance.ai | v{APP_VERSION} | 衍策引擎AI",
            font=("Helvetica Neue", 10, "bold"),
            bg=COLORS["bg_panel"], fg=COLORS["coral"],
            anchor=tk.E, padx=12,
        ).pack(side=tk.RIGHT)

    # ========================================
    # Event Handlers
    # ========================================
    def _on_browse_file(self):
        """Open file dialog to select a policy file."""
        filepath = filedialog.askopenfilename(
            title="选择政策文件",
            filetypes=[
                ("政策文件", "*.txt *.pdf *.docx *.md"),
                ("文本文件", "*.txt *.md"),
                ("所有文件", "*.*"),
            ],
        )
        if filepath:
            self.policy_file_path.set(filepath)
            self.status_text.set(f"已选择文件：{os.path.basename(filepath)}")

    def _on_generate_report(self):
        """Generate a policy service report."""
        park_name = self.park_name_var.get().strip()
        company_name = self.company_name_var.get().strip()
        region = self.region_var.get()
        industry = self.industry_var.get()

        if not park_name:
            messagebox.showwarning("提示", "请填写园区名称")
            return
        if not company_name:
            messagebox.showwarning("提示", "请填写企业名称")
            return
        if region == REGIONS[0]:
            messagebox.showwarning("提示", "请选择所在区域")
            return
        if industry == INDUSTRIES[0]:
            messagebox.showwarning("提示", "请选择所属行业")
            return

        selected_needs = [need for need, var in self.needs_vars.items() if var.get()]

        self.status_text.set("正在生成报告...")
        self.root.update()

        report = self._generate_sample_report(
            park_name=park_name,
            company_name=company_name,
            region=region,
            industry=industry,
            needs=selected_needs,
            policy_file=self.policy_file_path.get(),
        )

        # Display report with styled branding header
        self.report_text.delete("1.0", tk.END)
        lines = report.split("\n")
        for i, line in enumerate(lines):
            if i < 5 and ("yance.ai" in line or "YanCe Policy Agent" in line):
                self.report_text.insert(tk.END, line + "\n", "brand_header")
            elif line.startswith("## "):
                self.report_text.insert(tk.END, line + "\n", "section_heading")
            else:
                self.report_text.insert(tk.END, line + "\n")
        self.report_text.see("1.0")

        ts = datetime.now().strftime("%Y-%m-%d %H:%M")
        self.status_text.set(
            f"报告生成完成 | {company_name} | {ts} | yance.ai"
        )
        messagebox.showinfo("完成", f"已为 {company_name} 生成政策服务报告")

    def _on_save_report(self):
        """Save the report as a Markdown file."""
        content = self.report_text.get("1.0", tk.END).strip()
        if not content or content.startswith("报告预览区域"):
            messagebox.showwarning("提示", "请先生成报告再保存")
            return

        company_name = self.company_name_var.get().strip() or "企业"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_name = f"{company_name}_政策服务报告_{timestamp}.md"

        filepath = filedialog.asksaveasfilename(
            title="保存报告",
            defaultextension=".md",
            initialfile=default_name,
            filetypes=[
                ("Markdown 文件", "*.md"),
                ("文本文件", "*.txt"),
                ("所有文件", "*.*"),
            ],
        )
        if filepath:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            self.status_text.set(f"报告已保存：{os.path.basename(filepath)}")
            messagebox.showinfo("保存成功", f"报告已保存至：\n{filepath}")

    def _on_save_report_as(self):
        """Alias for save report."""
        self._on_save_report()

    def _on_export_pdf(self):
        """Export the report as PDF (using reportlab) or fallback to .md."""
        content = self.report_text.get("1.0", tk.END).strip()
        if not content or content.startswith("报告预览区域"):
            messagebox.showwarning("提示", "请先生成报告再导出")
            return

        company_name = self.company_name_var.get().strip() or "企业"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_name = f"{company_name}_政策服务报告_{timestamp}.pdf"

        filepath = filedialog.asksaveasfilename(
            title="导出 PDF 报告",
            defaultextension=".pdf",
            initialfile=default_name,
            filetypes=[("PDF 文件", "*.pdf")],
        )
        if not filepath:
            return

        # Try reportlab
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import cm
            from reportlab.lib.colors import HexColor
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.pdfbase import pdfmetrics
            from reportlab.pdfbase.cidfonts import UnicodeCIDFont

            # Register a CID font for Chinese text
            pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
            font_name = "STSong-Light"

            doc = SimpleDocTemplate(
                filepath, pagesize=A4,
                leftMargin=2 * cm, rightMargin=2 * cm,
                topMargin=2 * cm, bottomMargin=2 * cm,
            )

            styles = getSampleStyleSheet()
            brand_style = ParagraphStyle(
                "Brand", parent=styles["Normal"],
                fontName=font_name, fontSize=10, leading=14,
                textColor=HexColor("#f97316"),
            )
            title_style = ParagraphStyle(
                "CNTitle", parent=styles["Title"],
                fontName=font_name, fontSize=20, leading=26,
                textColor=HexColor("#0d1b2a"),
            )
            heading_style = ParagraphStyle(
                "CNHeading", parent=styles["Heading2"],
                fontName=font_name, fontSize=14, leading=18,
                textColor=HexColor("#0ea5e9"),
            )
            body_style = ParagraphStyle(
                "CNBody", parent=styles["Normal"],
                fontName=font_name, fontSize=10, leading=16,
                textColor=HexColor("#1e293b"),
            )

            story = []
            # PDF header branding
            story.append(Paragraph("YanCe Policy Agent | yance.ai", brand_style))
            story.append(Spacer(1, 0.5 * cm))

            for line in content.split("\n"):
                line = line.strip()
                if not line:
                    story.append(Spacer(1, 0.2 * cm))
                elif line.startswith("# "):
                    story.append(Paragraph(line[2:], title_style))
                elif line.startswith("## "):
                    story.append(Spacer(1, 0.3 * cm))
                    story.append(Paragraph(line[3:], heading_style))
                elif line.startswith("### "):
                    story.append(Paragraph(f"<b>{line[4:]}</b>", body_style))
                elif line.startswith("---") or line.startswith("━"):
                    story.append(Spacer(1, 0.3 * cm))
                else:
                    safe_line = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    story.append(Paragraph(safe_line, body_style))

            doc.build(story)
            self.status_text.set(f"PDF 已导出：{os.path.basename(filepath)}")
            messagebox.showinfo("导出成功", f"PDF 报告已导出至：\n{filepath}")

        except ImportError:
            # Fallback: save as .md with note
            md_path = filepath.replace(".pdf", ".md")
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(content)
            self.status_text.set(f"reportlab 未安装，已导出为 Markdown：{os.path.basename(md_path)}")
            messagebox.showwarning(
                "PDF 导出提示",
                f"未安装 reportlab 库，已改为导出 Markdown 文件。\n\n"
                f"如需 PDF 导出，请运行：\npip3 install reportlab\n\n"
                f"Markdown 文件已保存至：\n{md_path}",
            )

    def _on_new_project(self):
        """Reset form for a new project."""
        self.park_name_var.set("")
        self.company_name_var.set("")
        self.region_var.set(REGIONS[0])
        self.industry_var.set(INDUSTRIES[0])
        self.policy_file_path.set("")
        for var in self.needs_vars.values():
            var.set(False)
        self._set_placeholder_text()
        self.status_text.set(f"yance.ai | v{APP_VERSION} | 衍策引擎AI | 已重置")

    def _on_import_policy(self):
        """Import a policy file."""
        self._on_browse_file()

    def _open_website(self):
        """Open yance.ai in the default browser."""
        webbrowser.open(APP_BRAND_URL)

    def _check_for_updates(self):
        """Check for updates (placeholder)."""
        messagebox.showinfo(
            "检查更新",
            f"当前版本：v{APP_VERSION}\n\n"
            f"您正在使用最新版本。\n\n"
            f"如需了解最新动态，请访问：\nyance.ai",
        )

    def _show_help(self):
        """Show help dialog."""
        help_text = (
            "YanCe Policy Agent Desktop 使用说明\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "1. 在左侧面板填写园区和企业基本信息\n"
            "2. 选择所在区域和所属行业\n"
            "3. 勾选企业当前需求（可多选）\n"
            "4. （可选）导入本地政策文件\n"
            "5. 点击「生成报告」按钮\n"
            "6. 在右侧预览生成的报告\n"
            "7. 点击「保存报告」导出为 Markdown 文件\n"
            "8. 点击「导出 PDF」生成 PDF 格式报告\n\n"
            "支持的政策文件格式：.txt .pdf .docx .md\n\n"
            "官网：yance.ai\n"
            "如需帮助，请联系技术支持团队。"
        )
        messagebox.showinfo("使用说明", help_text)

    def _show_about(self):
        """Show about dialog with version and branding."""
        about_text = (
            f"YanCe Policy Agent Desktop\n"
            f"版本：{APP_VERSION}\n\n"
            f"园区政策分析助手\n"
            f"帮助园区工作人员分析政策、服务园区企业\n\n"
            f"官网：yance.ai\n"
            f"© 2025 YanCe Policy Agent | yance.ai"
        )
        messagebox.showinfo("关于 YanCe Policy Agent", about_text)

    # ========================================
    # Report Generation
    # ========================================
    def _generate_sample_report(self, park_name, company_name, region, industry, needs, policy_file):
        """Generate a comprehensive sample policy service report."""
        now = datetime.now()
        report_id = f"RPT-{now.strftime('%Y%m%d%H%M%S')}"

        needs_text = "、".join(needs) if needs else "暂未选择"

        policy_ref = ""
        if policy_file:
            policy_ref = f"\n引用政策文件：{os.path.basename(policy_file)}\n"

        report = f"""# 政策服务报告

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  YanCe Policy Agent | yance.ai
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

报告编号：{report_id}
生成时间：{now.strftime('%Y年%m月%d日 %H:%M:%S')}
生成工具：YanCe Policy Agent Desktop v{APP_VERSION} (yance.ai)
{policy_ref}
---

## 一、企业基本信息概览

| 项目 | 内容 |
|------|------|
| 企业名称 | {company_name} |
| 所属园区 | {park_name} |
| 所在区域 | {region} |
| 所属行业 | {industry} |
| 当前需求 | {needs_text} |

## 二、政策匹配分析

根据企业所在区域（{region}）和行业（{industry}），结合当前需求方向，以下为政策匹配分析结果：

### 匹配度评分
- 区域政策覆盖度：★★★★☆（4/5）
- 行业政策匹配度：★★★★☆（4/5）
- 需求匹配精准度：{'★★★★☆（4/5）' if len(needs) > 2 else '★★★☆☆（3/5）'}

### 分析要点
{region}针对{industry}行业有较为完善的政策支持体系，
尤其在{'、'.join(needs[:3]) if needs else '创新发展'}等方面有明确的支持措施。
建议重点关注以下几类政策方向。

## 三、可申报政策清单

### 3.1 国家级政策

1. **高新技术企业认定**
   - 支持内容：企业所得税减按15%征收
   - 申报窗口：每年4-9月（分批次）
   - 匹配度：{'高' if '高企认定' in needs else '中'}

2. **专精特新"小巨人"企业认定**
   - 支持内容：财政奖补 + 融资优惠 + 项目优先
   - 申报窗口：每年第二季度
   - 匹配度：{'高' if '专精特新' in needs else '中'}

3. **科技型中小企业评价**
   - 支持内容：研发费用加计扣除比例提高至100%
   - 申报窗口：全年可申报
   - 匹配度：中

### 3.2 {region}地方政策

4. **{region}科技创新专项资金**
   - 支持内容：研发费用补贴，最高不超过实际研发投入的20%
   - 申报窗口：每年3-4月
   - 匹配度：高

5. **{region}产业园区企业扶持办法**
   - 支持内容：场地租金减免、公共平台使用补贴
   - 申报窗口：每季度一次
   - 匹配度：{'高' if '场地补贴' in needs else '中'}

6. **{region}人才引进计划**
   - 支持内容：人才安居补贴、子女入学便利、落户加分
   - 申报窗口：每年5-6月
   - 匹配度：{'高' if '人才引进' in needs else '中'}

{'### 3.3 专项政策（基于需求匹配）' if needs else ''}
{self._generate_needs_policies(needs, region) if needs else ''}

## 四、申报条件符合度评估

### 基本条件（已满足）
- [x] 在{region}注册并实际经营
- [x] 独立法人资格
- [x] 属于{industry}行业

### 待核实条件
- [ ] 上年度研发投入占比是否达到3%以上
- [ ] 是否拥有自主知识产权（发明专利或软著）
- [ ] 近两年有无重大违法违规记录
- [ ] 员工社保缴纳情况是否正常
- [ ] 企业征信是否良好

### 建议
建议企业在申报前重点核实上述待核实条件，如有不足之处可提前准备补充材料。

## 五、所需材料清单

### 通用材料
1. 企业营业执照副本（复印件加盖公章）
2. 法定代表人身份证明
3. 企业上年度审计报告
4. 企业近12个月社保缴纳证明
5. 企业纳税证明（近两年）

### 专项材料
6. 知识产权证书及清单（专利、软著、商标等）
7. 高新技术企业认定证书（如适用）
8. 研发项目立项材料
9. 产学研合作协议（如适用）
10. 项目申报书（含技术方案和预期效益）

### 材料准备建议
- 所有复印件需加盖公章
- 审计报告须由有资质的会计师事务所出具
- 知识产权证书需确认为企业自有，非受让获得
- 研发费用归集须符合财务规范

## 六、申报时间窗口

| 政策名称 | 申报时间 | 状态 |
|----------|----------|------|
| 高新技术企业认定 | 4月-9月 | {'开放中' if 4 <= now.month <= 9 else '未开放'} |
| 专精特新认定 | 4月-6月 | {'开放中' if 4 <= now.month <= 6 else '未开放'} |
| 科技型中小企业 | 全年 | 开放中 |
| 地方科技创新资金 | 3月-4月 | {'开放中' if 3 <= now.month <= 4 else '未开放'} |
| 产业园区扶持 | 每季度 | 开放中 |

## 七、预估政策支持

### 税收优惠
- 高新技术企业：企业所得税减免（15% vs 25%）
- 研发费用加计扣除：100%加计扣除

### 财政补贴
- 科技创新专项资金：预计可申请 10-50 万元
- 场地租金减免：预计每年节省 5-15 万元
- 人才引进补贴：预计每人 5-20 万元

### 其他支持
- 公共技术服务平台使用补贴
- 创业导师对接服务
- 融资对接与路演机会

## 八、风险提示

1. **申报窗口期有限** — 部分政策申报窗口仅2-4周，请提前备齐材料
2. **材料真实性要求** — 所有申报材料必须真实有效，虚假信息将被取消资格并记入信用档案
3. **竞争性评审** — 部分补贴项目采取竞争性评审，不保证100%获批
4. **政策变动风险** — 政策可能随年度调整，建议关注最新发布通知
5. **后续监管要求** — 获批企业须按要求报送年度经营数据，接受跟踪管理
6. **知识产权时效** — 注意知识产权的有效期和权属关系

## 九、园区服务建议

### 对园区运营团队建议

1. **主动推送** — 将该企业的匹配政策信息主动推送给企业负责人
2. **申报辅导** — 安排专人提供一对一申报辅导服务
3. **材料预审** — 在企业提交前进行材料预审，提高通过率
4. **进度跟踪** — 建立申报进度台账，定期跟进
5. **政策更新** — 及时将新发布的政策信息同步给企业

### 对企业的建议

1. 尽快完成知识产权梳理和研发费用归集
2. 提前联系会计师事务所准备审计报告
3. 关注各政策的官方网站获取最新申报通知
4. 充分利用园区公共技术服务平台降低研发成本
5. 积极参与园区组织的政策宣讲和培训活动

## 十、后续行动建议

### 短期（1-2周内）
1. 整理企业现有知识产权清单
2. 联系审计机构确认研发费用归集情况
3. 收集并整理所有通用申报材料

### 中期（1-3个月）
4. 完成科技型中小企业评价申报
5. 准备高新技术企业认定申报材料
6. 申请产业园区企业扶持

### 长期（3-12个月）
7. 根据发展情况规划专精特新认定申报
8. 持续关注并申报地方各类专项政策
9. 建立企业政策申报年度计划

## 十一、关联政策推荐

以下政策可能对企业未来发展有帮助：

1. **数字化转型专项资金** — 支持企业数字化转型项目
2. **产学研合作项目** — 鼓励企业与高校/科研院所合作
3. **国际市场开拓资金** — 支持企业参加国际展会和拓展海外市场
4. **绿色低碳发展补贴** — 支持企业节能减排和绿色生产
5. **人才安居工程** — 为企业核心人才提供住房补贴

## 十二、历史申报记录参考

（当前为首份报告，暂无历史申报记录。后续报告将自动关联历史数据。）

## 十三、企业画像摘要

基于已录入信息生成的企业画像：

- **企业类型**：{industry}领域科技型企业
- **发展阶段**：成长期（推测）
- **政策需求画像**：{needs_text}
- **区域优势**：位于{region}，可享受国家、省/市、区三级政策叠加
- **建议关注方向**：{'技术创新、知识产权布局、人才引进' if len(needs) <= 2 else '技术创新、资质认定、规模扩张、人才团队'}

## 十四、报告元信息

- 报告编号：{report_id}
- 生成时间：{now.strftime('%Y-%m-%d %H:%M:%S')}
- 数据来源：YanCe Policy Agent 政策数据库 (yance.ai) + 公开政策信息
- 分析引擎：YanCe Policy Agent v{APP_VERSION}
- 免责声明：本报告内容仅供参考，具体政策信息以官方发布为准。请结合实际情况进行核实确认。

---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  本报告由 YanCe Policy Agent Desktop 自动生成
  yance.ai | 如有疑问，请联系园区运营团队
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        return report

    def _generate_needs_policies(self, needs, region):
        """Generate policy entries based on selected needs."""
        policies = {
            "创业补贴": "- **创业启动资金补贴**：首次创业企业可申请5-20万元启动资金补贴\n",
            "场地补贴": "- **场地租金补贴**：入驻园区企业可享受50%-100%租金减免，最长3年\n",
            "算力券": "- **算力券政策**：AI企业可申请算力使用补贴，最高50万元/年\n",
            "模型券": "- **模型券政策**：大模型开发企业可申请模型训练资源补贴\n",
            "高企认定": "- **高企认定奖励**：首次认定奖励20-30万元，重新认定奖励10-15万元\n",
            "专精特新": "- **专精特新奖励**：市级专精特新奖励10-30万，国家级50-100万\n",
            "科技型中小企业": "- **科技型中小企业**：研发费用加计扣除100%，亏损结转延长至10年\n",
            "人才引进": "- **人才引进补贴**：高层次人才安居补贴10-100万元，子女入学便利\n",
            "研发费用补贴": "- **研发投入补贴**：按实际研发投入的10%-20%给予补贴\n",
            "知识产权资助": "- **知识产权资助**：发明专利授权补贴5000-10000元/件\n",
            "融资对接": "- **融资服务**：园区组织投融资对接会，提供担保增信服务\n",
            "公共平台使用补贴": "- **公共平台补贴**：使用公共技术服务平台费用补贴50%-80%\n",
        }

        result = ""
        for need in needs:
            if need in policies:
                result += policies[need]
        return result


# ============================================
# Application Entry Point
# ============================================
def main():
    """Launch the YanCe Policy Agent Desktop application."""
    root = tk.Tk()

    # macOS-specific settings
    try:
        root.tk.call(
            "::tk::unsupported::MacWindowStyle", "style", root._w,
            "document", "closeBox collapseBox",
        )
    except tk.TclError:
        pass

    # Set app icon (if available)
    icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icon.icns")
    if os.path.exists(icon_path):
        try:
            root.iconbitmap(icon_path)
        except tk.TclError:
            pass

    # Show splash screen
    splash = SplashScreen(root)
    root.withdraw()

    def _launch_main():
        splash.destroy()
        root.deiconify()
        YanCePolicyAgentApp(root)

    root.after(SPLASH_DURATION_MS, _launch_main)
    root.mainloop()


if __name__ == "__main__":
    main()
