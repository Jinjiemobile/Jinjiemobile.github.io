# Jinjie Mobile 落地页重设计 - Mono 工程硬核方向

- **日期**:2026-06-26
- **状态**:待用户审阅
- **范围**:`index.html` / `styles.css` / `script.js` 重设计(原地替换,非另起项目)
- **参考 mockup**:`_design/mockup-mono.html`(v3 减法版,已验收方向)
- **设计规范遵循**:`design-taste-frontend` skill(Anti-Slop Frontend)

---

## 1. 背景与目标

现有页面(`index.html`)是一个静态 GitHub Pages 落地页,品牌为 "Jinjie Mobile"(新独立移动应用工作室,coming-soon 状态)。原页面工程质量和配色品味已在水准之上,但用户反馈**"没有设计感"**:过于通用、缺少视觉记忆点。

本次重设计目标:**在不破坏 calm-utility 品牌基因的前提下,建立强视觉签名,让页面有辨识度**。

### 为什么选 Mono 工程硬核方向
- 原页面 system-ui 字体无个性,grotesk 虽高级但遍地皆是,辨识度弱。
- Mono 等宽字 + 全大写显示天然带"开发者工作室"气质,与 mobile/dev 品牌身份咬合。
- **Scramble 解码动效**是核心 signature,且"解码 = 产品正在成型"与 coming-soon 状态形成隐喻,动效有动机,不为动而动。
- 纯 JS 可实现,无需 GSAP,符合原项目零构建依赖架构。

---

## 2. Design Read & Dials

> Reading this as:新独立移动应用工作室的 coming-soon 落地页,受众为早期关注者/开发者,采用 **Mono 工程硬核 + calm-utility** 语言,原生 HTML/CSS + CSS 变量 token + 轻量 JS。

| Dial | 值 | 说明 |
|---|---|---|
| `DESIGN_VARIANCE` | 6 | 左对齐巨型标题、bento 不对称、log 列表 |
| `MOTION_INTENSITY` | 4 | scramble 解码 + 光标/pulse + hover,无 pin/scrub |
| `VISUAL_DENSITY` | 3 | 大留白,clamp 节奏 |

---

## 3. 字体系统

- **字族**:Geist Mono(全站唯一字族,显示 + 正文 + 元数据统一工程气质)
- **自托管方案**(生产):下载 Geist Mono woff2 至 `fonts/`,`@font-face` 声明 + `font-display: swap`。首屏文案 fallback 到 `ui-monospace, "SF Mono", Menlo, monospace` 保 LCP。**不使用** Google Fonts `<link>`(mockup 用 CDN 仅作验证)。
- **关闭连字**:`font-feature-settings: "calt" 0, "liga" 0`(等宽不应有连字变化)

### 字号 / 字重阶梯
| 用途 | 字号 | 字重 | letter-spacing | line-height | transform |
|---|---|---|---|---|---|
| Display 标题 | `clamp(3rem, 11vw, 9rem)` | 600 | -0.045em | 0.92 | uppercase |
| Section 标题 | `clamp(1.6rem, 3.8vw, 3rem)` | 600 | -0.035em | 1 | uppercase |
| Log 条目 | `clamp(1.02rem, 1.9vw, 1.42rem)` | 500 | -0.02em | 1.35 | - |
| 正文 lede | `clamp(0.98rem, 1.4vw, 1.12rem)` | 400 | 0 | 1.7 | - |
| Eyebrow / 元数据 | 11-13px | 500 | 0.03-0.14em | 1.5-1.8 | uppercase(eyebrow) |

**Display 第二行**用 `padding-left: clamp(0, 7vw, 6rem)` 做缩进,制造排版张力,移动端归零。

---

## 4. 配色系统

保留原翡翠绿品牌色,工程纸感中性底。明暗双主题,基于 CSS 变量。

### 浅色(默认)
| token | 值 | 用途 |
|---|---|---|
| `--bg` | `#f5f8f6` | 页面底 |
| `--surface` | `#ffffff` | 卡片/窗口底 |
| `--ink` | `#0e1714` | 主文字(off-black) |
| `--ink-soft` | `#5d6c66` | 次文字 |
| `--ink-faint` | `#97a39e` | 元数据/注释 |
| `--line` | `#d7e1db` | 分隔线/边框 |
| `--accent` | `#087f6d` | 翡翠绿,主强调 |
| `--accent-ink` | `#064f45` | 强调文字/hover |
| `--accent-soft` | `#d7f2eb` | 强调底/pulse 光晕 |
| `--warn` | `#b8732a` | NEXT 状态 |

### 深色(`[data-theme="dark"]` / `prefers-color-scheme: dark`)
`--bg #0c1210` / `--surface #121b18` / `--ink #eaf3ee` / `--ink-soft #94a59e` / `--ink-faint #5a6a64` / `--line #233029` / `--accent #49d6bd` / `--accent-ink #95f0dc` / `--accent-soft #173d36` / `--warn #d99a52`

### 配色纪律
- **一个强调色**(翡翠绿)贯穿全页,CTA / pulse / 路径图标 / accent 标点统一用它。
- **无 AI 紫/蓝渐变**。无纯黑纯白。
- 主题切换:尊重 `prefers-color-scheme`,并提供手动 toggle(放在 sticky nav 右上角,与 focus/log/contact 菜单同行;移动端菜单收起为 hamburger 时,toggle 仍保留在右上角)。

---

## 5. 布局规范

容器统一 `width: min(1180px, calc(100% - 32px))` 居中。

### 5.1 Nav(sticky, 64px)
- 左:`> jinjie.mobile_` 命令行 prompt logo(`>` 翡翠绿,`_` 闪烁光标)
- 右:`focus / log / contact` 菜单(无编号),hover 出边框 + 底色
- 滚动 8px 后底边线出现
- backdrop-filter blur

### 5.2 Hero
- Eyebrow:`● new mobile studio · 2026`(翡翠绿点 + 大写小字)
- Display scramble 标题:两行
  - 第一行:`BUILDING`
  - 第二行(缩进):`FOCUSED APPS` + 翡翠绿 `.`
  - 进入时 scramble 解码
- hero-bottom(grid 2 列):
  - 左:lede(`//` 起首的注释式文案)+ CTA(`[ see what's next ]` 主 / `[ github ]` 次)
  - 右:hero-phone.jpg 工程素材窗口
- 移动端 hero-bottom 单列

### 5.3 Focus section("where it's made.")
- 标题 + bento 网格(`1.5fr 1fr`):
  - 大图:focus-workspace.jpg(16:11)
  - 竖图:feature-closeup.jpg(3:4)
- 下方 `//` 注释 note
- 移动端 bento 单列

### 5.4 Log section("what's cooking.")
- 标题 + log 列表(`92px 1fr`):
  - NOW(翡翠绿)+ pulse 点 | Researching small, focused mobile tools. + `//` 注释
  - NEXT(琥珀) | Building first release candidates. + `//` 注释
  - LATER(灰) | Publishing support and privacy pages. + `//` 注释
- 下方满宽:coming-soon-desk.jpg 工程窗口(16:8)

### 5.5 Footer
- 左:`© 2026 jinjie.mobile · focused apps in progress`
- 右:`github // hello@jinjiemobile.com`

### 5.6 工程素材窗口(.frame)
所有图片统一用此组件包裹,这是 Mono 方向的灵魂:
- 顶栏(frame-bar):左 `▸ ~/assets/<文件名>`(`▸` 翡翠绿,`~/assets/` 灰),右 真实比例(如 `4:3`)
- 图(object-fit cover)
- 圆角 8px,边框,柔和投影
- **比例用真实 aspect-ratio,不写编造的像素尺寸**(skill 4.9)

---

## 6. 动效规范

所有动效 `MOTION_INTENSITY ≤ 4`,均可在 `prefers-reduced-motion: reduce` 下降级。

| 动效 | 触发 | 实现 | reduced-motion |
|---|---|---|---|
| Scramble 解码 | 页面加载 | JS 逐字锁定,reduced-motion 直显目标文本 | 直显 |
| 光标 blink | 持续 | CSS `steps(1)` 1.05s | 关闭 |
| Pulse 点 | 持续(NOW) | CSS 1.8s opacity | 关闭 |
| Nav 底边线 | 滚动 8px | scroll 事件加 class(passive) | 保留(非动效) |
| Hover/active | 交互 | transition 160-200ms,active `translateY(1px)` | 关闭 transition |

**禁止**:`window.addEventListener('scroll')` 驱动 React state、`requestAnimationFrame` 改 state、GSAP。Scramble 用 setTimeout 节流即可。

---

## 7. 响应式规范

| 断点 | 行为 |
|---|---|
| 默认(>860px) | 全布局 |
| ≤860px | hero-bottom 单列;bento 单列;竖图比例改 16:11 |
| ≤720px | **导航改 hamburger**(见 §9);display 第二行缩进归零;log 单列 |

---

## 8. 与原版的关键差异(为什么更有设计感)

| 维度 | 原版 | 重设计 |
|---|---|---|
| 字体 | system-ui 无个性 | Geist Mono 全站,等宽工程感 |
| Signature | 仅淡入 | scramble 解码 = 成型隐喻 |
| 品牌表达 | 静态图标 logo | `> jinjie.mobile_` 命令行 prompt + 光标 |
| 图片呈现 | 普通照片摆放 | `▸ ~/assets/` 工程素材窗口 |
| 排版张力 | 居中规整 | 左对齐巨型标题 + 缩进第二行 |

---

## 9. 无障碍清单(含对原版的修正)

- [ ] **移动端导航**(修正原版 `display:none` 缺陷):≤720px 改 hamburger(右上角按钮,点击展开下拉菜单含 focus/log/contact),**不能直接隐藏导航**
- [ ] 焦点环:`focus-visible` 3px 翡翠绿 outline + offset
- [ ] 对比度达 WCAG AA:主按钮 `#087f6d` 底 / `#f7fffc` 字(通过);ink/ink-soft/bg 组合校验
- [ ] 所有动效 reduced-motion 降级
- [ ] 图片有意义的 alt
- [ ] `<html lang>` 与内容一致
- [ ] skip-to-content 跳转链接(可选,页面小)
- [ ] 主题 toggle 按钮有 `aria-label`

---

## 10. 落地实现范围(文件级)

| 文件 | 操作 | 说明 |
|---|---|---|
| `index.html` | 重写 | 新结构(nav/hero/focus/log/footer),保留 head meta,补 `og:image`,加移动端 menu 按钮 |
| `styles.css` | 重写 | 新 token + Geist Mono + 布局 + 工程窗口组件 + 响应式 |
| `script.js` | 重写 | scramble + nav scroll + theme toggle + 移动端 menu toggle |
| `fonts/` | 新增 | 自托管 Geist Mono woff2 + `@font-face` |
| `assets/` | 复用 | 现有 4 张图(hero-phone / focus-workspace / feature-closeup / coming-soon-desk),不新增 |
| `_design/mockup-mono.html` | 保留 | 作为实现对照参考;上线前可删 |
| `site.webmanifest` | 微调 | theme_color 更新为新 accent |

**不改**:CNAME、域名、IA(单页锚点 #focus/#log/#contact 保留)、文案语气(冷静实用)、品牌色基因。

---

## 11. design-taste-frontend Pre-Flight 对照

| 检查项 | 状态 |
|---|---|
| 零 em-dash | ✅ |
| 非 AI 紫色,单强调色锁 | ✅ 翡翠绿 |
| 双主题 + 一致性 | ✅ |
| 字体非 Inter / 非 Fraunces | ✅ Geist Mono |
| 按钮对比度 WCAG AA | ✅ |
| CTA 不换行、无重复意图 | ✅ |
| Hero 4 元素内、subtext ≤20 词 | ✅ |
| Eyebrow ≤ ceil(section/3) | ✅ 1 处(hero) |
| 无 section 编号 eyebrow | ✅(减法删除) |
| 无装饰坐标/version strip | ✅(减法删除) |
| 图片真实,非 div 假截图 | ✅ 复用真实图 |
| 无假精确数字 | ✅ 用真实比例 |
| 动效有动机 + reduced-motion | ✅ |
| 移动端导航可达 | ⏳ 实现阶段补 hamburger |

---

## 12. 不在范围

- 多页路由 / CMS / 后端
- 真实产品截图(无产品,用现有素材图)
- 滚动 pin / kinetic typography / GSAP(方向 B 已排除 C)
- 暗色为默认(默认浅色,尊重系统偏好 + 手动 toggle)

---

## 13. 验收标准

1. 视觉与 `_design/mockup-mono.html` v3 一致(字体/配色/布局/动效)
2. 移动端导航可用(hamburger)
3. Lighthouse:LCP < 2.5s,CLS < 0.1(图片有 aspect-ratio)
4. 双主题在明暗下对比度均达 AA
5. reduced-motion 下 scramble/pulse/光标全部降级为静态
6. em-dash 全文为零
