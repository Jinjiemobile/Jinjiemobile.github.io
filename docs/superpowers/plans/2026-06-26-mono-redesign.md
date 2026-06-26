# Jinjie Mobile Mono 重设计 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Jinjie Mobile 落地页重设计为 Mono 工程硬核方向,替换现有 `index.html` / `styles.css` / `script.js`。

**Architecture:** 以已提交的 `_design/mockup-mono.html` 为蓝图,把它的内联样式/脚本落地为正式三文件结构;Geist Mono 从 Google Fonts CDN 换为自托管 woff2;补上移动端 hamburger 菜单(修正原版导航 `display:none` 缺陷)和无障碍细节。原地替换,不另起项目。

**Tech Stack:** 原生 HTML / CSS(CSS 变量) / 原生 JS(IntersectionObserver、matchMedia),Geist Mono 自托管,无构建工具。

## Global Constraints

(摘自 spec,每个 task 隐含遵守)

- **em-dash 全文为零**:`index.html` / `styles.css` / `script.js` 不得出现 `—`(U+2014)或 `–`(U+2013)作分隔。用 `-` 或重组句子。
- **单强调色**:翡翠绿 `#087f6d`(浅)/ `#49d6bd`(深),无 AI 紫/蓝渐变,无纯黑纯白。
- **双主题**:light 默认 + `[data-theme="dark"]`,同时尊重 `prefers-color-scheme: dark`。
- **字体**:Geist Mono 唯一字族,自托管 woff2,`font-display: swap`,首屏 fallback `ui-monospace, "SF Mono", Menlo, monospace`。关闭连字 `font-feature-settings: "calt" 0, "liga" 0`。字号阶梯按 spec §3。
- **动效**:全部 `prefers-reduced-motion: reduce` 降级为静态。禁止 `window.addEventListener('scroll')` 改 state / GSAP。
- **移动端导航**:≤720px 用 hamburger 菜单,**不得 `display:none` 隐藏导航**。
- **图片**:用真实 `aspect-ratio` 比例标注,不写编造的像素尺寸。复用现有 `assets/` 4 张图,不新增。
- **不改**:CNAME、域名、IA(锚点 `#focus` / `#log` / `#contact`)、文案冷静语气、品牌绿基因。
- **分支**:`mono-redesign`(已建)。每个 task 结束 commit。
- **验证策略**:无单测框架(YAGNI)。每个 task 验证 = 本地起 server + 浏览器手动 + 静态检查(grep / Lighthouse)。

---

## File Structure

| 文件 | 操作 | 责任 |
|---|---|---|
| `fonts/geist-mono-latin-{400,500,600}-normal.woff2` | 新增 | 自托管字体二进制 |
| `styles.css` | 重写 | @font-face + :root token(明暗) + base + nav + hero + section + frame + log + footer + 响应式 + reduced-motion |
| `index.html` | 重写 | head(保留 meta + 补 og:image)+ body 结构(nav/hero/focus/log/footer + theme toggle + hamburger) |
| `script.js` | 重写 | scramble 解码 + nav 滚动边线 + theme toggle + 移动端 menu toggle |
| `site.webmanifest` | 微调 | `theme_color` 改 `#087f6d` |
| `_design/mockup-mono.html` | 保留 | 蓝图参考,不动 |

---

## Task 1: 自托管 Geist Mono 字体

**Files:**
- Create: `fonts/geist-mono-latin-400-normal.woff2`
- Create: `fonts/geist-mono-latin-500-normal.woff2`
- Create: `fonts/geist-mono-latin-600-normal.woff2`

**Interfaces:**
- Consumes: 无
- Produces: `fonts/` 下三个 woff2,供 Task 2 的 `@font-face` 引用

- [ ] **Step 1: 下载三个字重的 woff2**

在项目根 `Jinjiemobile.github.io/` 执行(用 Fontsource 的 jsdelivr 源,自托管专用):

```bash
mkdir -p fonts
curl -L -o fonts/geist-mono-latin-400-normal.woff2 "https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5/files/geist-mono-latin-400-normal.woff2"
curl -L -o fonts/geist-mono-latin-500-normal.woff2 "https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5/files/geist-mono-latin-500-normal.woff2"
curl -L -o fonts/geist-mono-latin-600-normal.woff2 "https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5/files/geist-mono-latin-600-normal.woff2"
```

- [ ] **Step 2: 验证文件存在且非空**

```bash
ls -la fonts/
```
Expected: 三个 `.woff2` 文件,每个 > 20KB。若某文件 < 1KB,说明 URL 失效,到 https://www.jsdelivr.com/package/npm/@fontsource/geistmonel 找当前路径替换(包名是 `@fontsource/geist-mono`)。

- [ ] **Step 3: Commit**

```bash
git add fonts
git commit -m "chore: self-host Geist Mono woff2 (400/500/600)"
```

---

## Task 2: 落地 styles.css / index.html / script.js 三文件

**Files:**
- Create(覆盖): `styles.css`
- Create(覆盖): `index.html`
- Create(覆盖): `script.js`

**Interfaces:**
- Consumes: `fonts/*.woff2`(Task 1), `_design/mockup-mono.html`(蓝图)
- Produces: 完整可工作的 Mono 页面(桌面端),视觉匹配 mockup;后续 Task 3/4 在此基础上增强

**核心策略**:`_design/mockup-mono.html` 已是完整可工作的 v3 页面(内联 css/js,CDN 字体)。本 task 把它拆成三文件,做三处修改:(1) 字体 CDN → 自托管 `@font-face`;(2) `<head>` 换回正式 meta(含 og:image、manifest、favicon);(3) 去掉 mockup 的 CDN `<link>`。其余 css/html/js 直接迁移。

- [ ] **Step 1: 写 styles.css(从 mockup 提取 + 自托管 @font-face)**

打开 `_design/mockup-mono.html`,把 `<style>...</style>` 标签内的全部 CSS 复制到 `styles.css`。然后在文件**最顶部**(在 `:root` 之前)插入以下 `@font-face`:

```css
@font-face {
  font-family: "Geist Mono";
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url("fonts/geist-mono-latin-400-normal.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Mono";
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url("fonts/geist-mono-latin-500-normal.woff2") format("woff2");
}
@font-face {
  font-family: "Geist Mono";
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url("fonts/geist-mono-latin-600-normal.woff2") format("woff2");
}
```

确认 `body` 的 `font-family` 仍是 `"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;`(mockup 原样,自托管 @font-face 后自动生效)。

- [ ] **Step 2: 写 index.html 的 `<head>`**

`<head>` 用以下内容(保留原站的 meta/favicon/manifest,补 `og:image`,去掉 mockup 的 Google Fonts `<link>`):

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Jinjie Mobile is building focused mobile apps with thoughtful interfaces and real utility.">
  <meta name="theme-color" content="#f7fbf8" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0c1210" media="(prefers-color-scheme: dark)">
  <meta property="og:title" content="Jinjie Mobile">
  <meta property="og:description" content="Focused mobile apps in development.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/hero-phone.jpg">
  <title>Jinjie Mobile</title>
  <link rel="icon" href="assets/jinjie-mobile-icon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/jinjie-mobile-icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/jinjie-mobile-icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="stylesheet" href="styles.css">
</head>
```

- [ ] **Step 3: 写 index.html 的 `<body>`**

打开 `_design/mockup-mono.html`,把它的整个 `<body>...</body>` 复制过来(mockup 的 nav 内已含 `<button class="theme-btn" id="toggle">`,一并保留)。**只删掉 `</body>` 前的那段内联 `<script>...</script>`**,改为外联引用:

```html
  <script src="script.js"></script>
</body>
</html>
```

即 `<body>` 结构 = mockup 的 nav + main(hero/focus/log)+ footer + `<script src="script.js">`。

- [ ] **Step 4: 写 script.js**

打开 `_design/mockup-mono.html`,把 `<script>...</script>` 内的全部 JS 复制到 `script.js`(scramble 解码 + nav 滚动边线 + theme toggle)。

- [ ] **Step 5: 本地起 server 验证整页**

```bash
cd /Users/shijunxing/Documents/github/jinjiemobile/Jinjiemobile.github.io
python3 -m http.server 8000
```
浏览器打开 `http://localhost:8000/`。

Expected(对照 mockup `http://localhost:8000/_design/mockup-mono.html`):
- 巨型 `BUILDING / FOCUSED APPS.` 标题,进入时 scramble 解码
- `> jinjie.mobile_` 光标闪烁
- hero 右下 `hero-phone.jpg` 工程窗口(`▸ ~/assets/hero-phone.jpg · 4:3`)
- focus bento 两图、log 三行 + desk 图、footer
- 右上 `[ light ]` toggle,点击切深色
- 字体是 Geist Mono(等宽),**非系统默认**(若仍是系统字体,检查 styles.css 的 @font-face 路径和 fonts/ 文件)

视觉应与 mockup 一致。

- [ ] **Step 6: 静态检查 em-dash 为零**

```bash
grep -rn $'\xe2\x80\x94' index.html styles.css script.js
grep -rn $'\xe2\x80\x93' index.html styles.css script.js
```
Expected: 无输出(两条都为空)。

- [ ] **Step 7: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: land Mono redesign as index/styles/script (self-hosted Geist Mono)"
```

---

## Task 3: 移动端 hamburger 菜单

**Files:**
- Modify: `index.html`(nav 加 menu 按钮)
- Modify: `styles.css`(hamburger 样式 + 菜单展开)
- Modify: `script.js`(menu toggle)

**Interfaces:**
- Consumes: Task 2 的三文件
- Produces: ≤720px 时 nav 右上 hamburger 按钮,点击展开 focus/log/contact 下拉;移动端导航可用

**背景**:mockup 在 ≤720px 把 `.nav-menu` 直接 `display:none`(原版缺陷)。本 task 修正为可展开菜单。

- [ ] **Step 1: index.html nav 内加 hamburger 按钮**

在 `index.html` 的 `<div class="nav-right">` 里,在 `<button class="theme-btn">` 之前插入:

```html
    <button class="menu-btn" id="menuBtn" aria-label="Toggle navigation" aria-expanded="false">[ menu ]</button>
```

- [ ] **Step 2: styles.css 加 hamburger 样式 + 修改移动端规则**

在 `styles.css` 末尾(其它样式后)追加:

```css
.menu-btn {
  display: none;
  font-family: inherit; font-size: 12px; letter-spacing: 0.03em;
  padding: 7px 12px; border: 1px solid var(--line); border-radius: 4px;
  background: var(--surface); color: var(--ink-soft); cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease;
}
.menu-btn:hover { color: var(--accent-ink); border-color: var(--accent); }
```

然后把 ≤720px 媒体查询里的 `.nav-menu { display: none; }` 替换为展开式菜单规则:

```css
@media (max-width: 720px) {
  .menu-btn { display: inline-flex; }
  .nav-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    min-width: 160px;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--surface);
    box-shadow: var(--shadow);
    display: none;
  }
  .nav-menu.open { display: flex; }
  .nav-menu a { padding: 10px 12px; }
  .display .line2 { padding-left: 0; }
  .log-row { grid-template-columns: 1fr; gap: 8px; }
}
```

注意:`.nav` 需要 `position: relative`(已是 sticky,sticky 提供 positioning context,absolute 子元素相对它定位;若菜单定位偏,给 `.nav` 加 `position: sticky; position: -webkit-sticky;` 已有,无需改)。

- [ ] **Step 3: script.js 加 menu toggle**

在 `script.js` 末尾追加:

```js
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.querySelector(".nav-menu");
if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  // 点菜单项后收起
  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}
```

- [ ] **Step 4: 移动端验证**

本地 server 仍开着(`http://localhost:8000/`)。浏览器开 devtools,切到 ≤720px(如 iPhone 视图)。

Expected:
- 右上出现 `[ menu ]` + `[ light ]` 两个按钮
- 点 `[ menu ]` 展开 focus/log/contact 下拉,`aria-expanded` 变 true
- 点菜单项跳转后菜单收起
- 点 `[ light ]` 仍能切主题
- 桌面端(>720px)`[ menu ]` 不显示,菜单正常横排

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: mobile hamburger menu (fixes nav display:none regression)"
```

---

## Task 4: 无障碍收尾 + manifest + 验收

**Files:**
- Modify: `index.html`(skip link)
- Modify: `site.webmanifest`(theme_color)
- Modify: `styles.css`(skip link 样式)

**Interfaces:**
- Consumes: Task 1-3 全部
- Produces: 通过 spec §13 验收标准的最终页面

- [ ] **Step 1: index.html 加 skip-to-content 链接**

在 `<body>` 紧开头(在 `<nav>` 之前)插入:

```html
<a class="skip-link" href="#top">Skip to content</a>
```

- [ ] **Step 2: styles.css 加 skip link 样式**

在 `styles.css` 追加:

```css
.skip-link {
  position: absolute;
  left: 16px;
  top: -48px;
  z-index: 20;
  padding: 10px 16px;
  background: var(--accent);
  color: #f7fffc;
  border-radius: 6px;
  font-size: 13px;
  transition: top 160ms ease;
}
.skip-link:focus { top: 12px; }
```

- [ ] **Step 3: 更新 site.webmanifest theme_color**

把 `site.webmanifest` 里 `"theme_color": "#087f6d"` 确认/改为:

```json
  "theme_color": "#087f6d",
```
(`background_color` 保持 `#f7fbf8`)。

- [ ] **Step 4: 图片 alt 审查**

确认 `index.html` 里 4 张 `<img>` 都有有意义的 `alt`(mockup 已有,核对未被改掉):hero-phone / focus-workspace / feature-closeup / coming-soon-desk。

- [ ] **Step 5: 验收检查清单**

本地 server 开着,逐项验证:

1. **em-dash 为零**:
   ```bash
   grep -rn $'\xe2\x80\x94' index.html styles.css script.js
   ```
   无输出。
2. **双主题对比度**:Chrome DevTools → Lighthouse → Accessibility,或用浏览器审计。主按钮 `#087f6d`/`#f7fffc` 对比度应 > 4.5:1。文字 `#0e1714`/`#f5f8f6` 应 > 7:1。深色同理。
3. **reduced-motion**:Chrome DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`,刷新。Expected:scramble 直显(无解码动画)、光标不闪、pulse 不动、scroll 平滑关闭。
4. **Lighthouse**:DevTools → Lighthouse → Performance + Accessibility + SEO。Expected:LCP < 2.5s,CLS < 0.1,Accessibility ≥ 95。
5. **移动端**:≤720px hamburger 可用(继承 Task 3)。
6. **font-display: swap** 生效:DevTools Network 慢速 3G 刷新,首屏先显示 fallback mono 再换 Geist Mono,无大跳动(CLS < 0.1)。

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css site.webmanifest
git commit -m "feat: a11y skip-link + manifest theme_color + final verification"
```

---

## 完成标准

- [ ] 4 个 task 全部 commit 到 `mono-redesign` 分支
- [ ] `http://localhost:8000/` 视觉匹配 `_design/mockup-mono.html`
- [ ] em-dash grep 为零
- [ ] 双主题 + reduced-motion + 移动端 hamburger 均工作
- [ ] Lighthouse Perf/Access/SEO 达标

## 不在范围

- 真实产品截图(无产品)
- 多页 / 后端 / CMS
- 推送 origin / 合并 main / GitHub Pages 部署验证(用户确认后再做)
