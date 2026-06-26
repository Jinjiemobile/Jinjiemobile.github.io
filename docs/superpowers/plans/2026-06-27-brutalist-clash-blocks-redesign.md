# Brutalist Clash Blocks 重设计 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Jinjie Mobile 落地页从 Mono 工程风升级为 Bold Brutalist 粗野风(绿橙双撞 + 撞色块 + 硬阴影),保留 scramble signature。

**Architecture:** 纯视觉层改造。新增 clash token 到 `styles.css`,Hero/Frame/Log/Footer/Nav 的组件样式在原 class 上就地改写,scramble 着色分块逻辑在 `script.js` 用方案 a(解码完成后着色分块)实现。不引入第三方库、不重构 HTML 结构(仅微调标题 span 标记和 log-row 结构)。

**Tech Stack:** 原生 HTML/CSS/JS,Geist Mono 自托管字体,GitHub Pages 部署。无构建工具。

**Spec:** `docs/superpowers/specs/2026-06-27-brutalist-clash-blocks-redesign.md`

---

## 文件结构

| 文件 | 职责 | 改动类型 |
|---|---|---|
| `styles.css` | 设计 token + 所有组件样式 | 修改:新增 clash token、改写 Hero/Frame/Log/Footer/Nav 样式 |
| `index.html` | 单页结构 | 修改:`<html>` 初始 theme、Hero 标题 span 标记、log 标签 class、focus note 标记 |
| `script.js` | scramble + 主题 + 菜单 | 修改:scramble 着色分块(方案 a)、默认主题锁定 dark |

**无新增文件。** 所有改动集中在 3 个现有文件。

---

## Task 1: 新增 Clash Token 与主题默认值

建立视觉地基。新增绿橙双撞 token,定义两个主题下的值,并锁定深色为默认。

**Files:**
- Modify: `styles.css:22-49`(`:root` 和 `[data-theme="dark"]` 块)
- Modify: `index.html:2`(`<html>` 初始 theme)

- [ ] **Step 1: 在 `:root`(浅色主题)新增 clash token**

在 `styles.css` 的 `:root` 块(约第 22-35 行)末尾、`--shadow` 行之后追加:

```css
    --clash-o: #ff5500;
    --clash-o-soft: #d44a00;
    --clash-g: #087f6d;
    --clash-g-soft: #066156;
    --border-hard: 2px solid var(--ink);
    --shadow-hard: 4px 4px 0 var(--clash-g);
    --shadow-lg-hard: 6px 6px 0 var(--clash-g);
    --rotate-neg: -0.8deg;
    --rotate-pos: 0.6deg;
    --rotate-stamp: -2deg;
```

注意:浅色主题下 clash 用更深的 `--clash-o-soft`/`--clash-g-soft`(因为在浅底上需要足够对比度),深色主题用更亮的值(见 Step 2)。

- [ ] **Step 2: 在 `[data-theme="dark"]` 覆盖 clash token 为亮色值**

在 `styles.css` 的 `[data-theme="dark"]` 块(约第 36-49 行)末尾、`--shadow` 行之后追加:

```css
    --clash-o: #ff5500;
    --clash-o-soft: #ff7a3d;
    --clash-g: #49d6bd;
    --clash-g-soft: #49d6bd;
    --border-hard: 2px solid #fafaf7;
    --shadow-hard: 4px 4px 0 var(--clash-g);
    --shadow-lg-hard: 6px 6px 0 var(--clash-g);
```

深色主题下 `--border-hard` 用 `#fafaf7`(亮色),因为边框要在深底上可见。

- [ ] **Step 3: 锁定 `<html>` 初始深色主题(防 FOUC)**

`index.html:2` 将:
```html
<html lang="en" data-theme="light">
```
改为:
```html
<html lang="en" data-theme="dark">
```

- [ ] **Step 4: 浏览器验证**

打开 `index.html`(用 Live Server 或直接浏览器)。验证:
- 页面初始显示深色主题
- DevTools 检查 `:root` 的 computed style,确认 `--clash-o` = `#ff5500`、`--clash-g` = `#49d6bd`(深色主题下)
- 点击 `[ light ]` 按钮切换到浅色,确认 token 切换正常(此时视觉还没大改,但不应报错)

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: add clash color tokens and lock dark theme default

Brutalist redesign foundation. Green+orange dual clash tokens
defined for both light/dark themes. Dark locked as default."
```

---

## Task 2: 默认主题锁定 dark(JS 逻辑)

Spec §9 要求默认锁定 dark、不跟随 OS。`script.js:36` 当前跟随 `prefers-color-scheme`,需改为强制 dark 并移除 OS 监听。

**Files:**
- Modify: `script.js:30-40`(主题初始化与 OS 监听)

- [ ] **Step 1: 改写主题初始化逻辑**

`script.js` 第 29-40 行,将:
```js
  // Follow OS color scheme live unless the user manually toggles.
  let userOverrode = false;
  const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
  const applyTheme = (mode) => {
    root.dataset.theme = mode;
    if (btn) btn.textContent = `[ ${mode} ]`;
  };
  applyTheme(darkMq.matches ? "dark" : "light");
  darkMq.addEventListener("change", (e) => {
    if (userOverrode) return;
    applyTheme(e.matches ? "dark" : "light");
  });
```
改为:
```js
  // Dark is the default brand theme. Users can still toggle to light.
  const applyTheme = (mode) => {
    root.dataset.theme = mode;
    if (btn) btn.textContent = `[ ${mode} ]`;
  };
  applyTheme("dark");
```

移除了 `userOverrode`、`darkMq` 及其事件监听。`btn` 的 click 切换逻辑(第 42-46 行)保持不变,用户仍可手动切换。

- [ ] **Step 2: 浏览器验证**

刷新页面。验证:
- 无论 OS 是浅色还是深色模式,页面初始都是 dark
- 点击 `[ dark ]`(此时显示当前态)切换到 light,再切回 dark,功能正常
- 控制台无报错(`darkMq` 未定义之类)

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: lock dark as default theme, stop following OS scheme

Brutalist design is dark-first. Removes prefers-color-scheme
listener; manual toggle still available."
```

---

## Task 3: Hero 标题双色块 + scramble 着色分块

核心冲击力。Spec §3.1。改 HTML 标题标记为可分块结构,改 scramble JS 为方案 a(解码完成后着色分块),改 CSS 双撞色块。

**Files:**
- Modify: `index.html:40-43`(Hero `<h1 class="display">` 标题)
- Modify: `script.js:1-21`(scramble 逻辑)
- Modify: `styles.css:131-138`(`.display` 标题样式)

- [ ] **Step 1: 改 HTML 标题为分块结构**

`index.html:40-43`,将:
```html
  <h1 class="display">
    <span class="scram" data-scramble data-text="BUILDING">BUILDING</span>
    <span class="line2"><span class="scram" data-scramble data-text="FOCUSED APPS">FOCUSED APPS</span><span class="accent-mark">.</span></span>
  </h1>
```
改为:
```html
  <h1 class="display">
    <span class="scram" data-scramble data-text="BUILDING">BUILDING</span>
    <span class="line2"><span class="scram scramble-dual" data-scramble data-text="FOCUSED APPS" data-split="FOCUSED|APPS">FOCUSED APPS</span><span class="accent-mark">.</span></span>
  </h1>
```

新增 `scramble-dual` class 和 `data-split` 属性(用 `|` 分隔两个词),供 JS 识别并着色分块。

- [ ] **Step 2: 改 scramble JS 支持解码后着色分块(方案 a)**

`script.js:1-21`,将整个 scramble 块改为:

```js
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const GLYPHS = "!<>-_\\/[]{}=+*?#01ABCDEFxyz";
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const target = el.dataset.text;
    const isDual = el.classList.contains("scramble-dual");
    const parts = isDual && el.dataset.split ? el.dataset.split.split("|") : null;

    const finalize = () => {
      if (isDual && parts) {
        // 方案 a:解码完成后着色分块 —— 整体解码,完成后按空格拆成两个色块 span
        el.innerHTML =
          '<span class="blk blk-g">' + parts[0] + "</span> " +
          '<span class="blk blk-o">' + parts[1] + "</span>";
      } else {
        el.textContent = target;
      }
    };

    if (reduce) { finalize(); return; }
    let frame = 0;
    const lockEvery = 5;
    const totalFrames = target.length * lockEvery + 8;
    const run = () => {
      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " ") { out += " "; continue; }
        out += i < frame / lockEvery ? target[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      // 解码过程中乱码字符用橙色(通过 class 控制),完成后着色分块
      el.textContent = out;
      el.classList.add("scrambling");
      frame++;
      if (frame >= totalFrames) {
        el.classList.remove("scrambling");
        finalize();
        return;
      }
      setTimeout(run, 38);
    };
    setTimeout(run, 250);
  });
```

关键变化:
- 新增 `finalize()` 函数,解码完成或 reduce 模式下调用
- dual 模式用 `innerHTML` 注入两个 `.blk` span(绿块/橙块)
- 解码过程中加 `scrambling` class(供 CSS 把乱码字符染橙)
- 移除原来硬编码的 `el.textContent = target`,统一走 `finalize()`

- [ ] **Step 3: 加 CSS 标题色块样式 + scramble 乱码染色**

`styles.css` 找到 `.display .accent-mark { color: var(--accent); }`(约第 138 行),在其后追加:

```css
  .display .scram.scrambling { color: var(--clash-o-soft); }
  .display .blk {
    display: inline-block;
    padding: 0 0.12em;
    color: var(--ink);
    line-height: 1;
  }
  .display .blk-g {
    background: var(--clash-g);
    transform: rotate(-0.8deg);
    box-shadow: 0.12em 0.12em 0 var(--clash-o);
  }
  .display .blk-o {
    background: var(--clash-o);
    transform: rotate(0.6deg);
    box-shadow: 0.12em 0.12em 0 var(--clash-g);
  }
```

注意:硬阴影用 `em` 单位(随字号缩放),而非固定 `6px`,保证移动端标题缩小时阴影比例协调。深色主题下 `.blk` 的 `color: var(--ink)` 会是亮色文字——但我们要的是块内**深色**字。需在 `[data-theme="dark"]` 覆盖:

在 `styles.css` 的 `[data-theme="dark"]` 块(clash token 之后)追加:
```css
  .display .blk { color: #0e1714; }
```

深色主题下块内字固定深色 `#0e1714`(因为绿橙块本身是亮色底,需要深字)。

- [ ] **Step 4: 浏览器验证**

刷新页面。验证:
- Hero 标题第二行 scramble 正常解码(乱码期间字符为橙色)
- 解码完成后:`FOCUSED` 在绿块(左倾)、`APPS` 在橙块(右倾),各有交叉色硬阴影
- `BUILDING` 保持普通文字色,无块
- 开 DevTools 开启 `prefers-reduced-motion: reduce`(Rendering 面板),刷新:标题直接显示分块结果,无解码动画
- 控制台无报错

- [ ] **Step 5: Commit**

```bash
git add index.html script.js styles.css
git commit -m "feat: hero dual clash blocks with scramble colorization

FOCUSED in green block, APPS in orange block, cross-color hard
shadows. Scramble retains: garbled chars show orange during decode,
finalizes into colored blocks after. Reduced-motion shows static."
```

---

## Task 4: Hero Eyebrow 印章标签 + 按钮 Brutalist 化

Spec §3.2、§3.3。

**Files:**
- Modify: `index.html:38`(eyebrow)
- Modify: `styles.css:122-130`(`.eyebrow`)、`styles.css:154-167`(`.btn`)

- [ ] **Step 1: 改 eyebrow 文案与标记**

`index.html:38`,将:
```html
  <p class="eyebrow"><span class="dot"></span> new mobile studio · 2026</p>
```
改为:
```html
  <p class="eyebrow stamp"><span class="ic">▸</span> new studio · 2026</p>
```

移除 `.dot`,加 `stamp` class 和 `▸` 图标。

- [ ] **Step 2: 改 eyebrow CSS 为撞色印章**

`styles.css` 的 `.eyebrow`(约第 122-130 行),将整块改为:

```css
  .eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    margin-bottom: clamp(18px, 2.5vw, 26px);
    font-size: 11px; letter-spacing: 0.14em; color: var(--ink-soft); text-transform: uppercase;
  }
  .eyebrow.stamp {
    background: var(--clash-o);
    color: #0e1714;
    padding: 5px 12px;
    font-weight: 600;
    transform: rotate(-2deg);
    box-shadow: 3px 3px 0 var(--clash-g);
    border: 2px solid #0e1714;
  }
  [data-theme="dark"] .eyebrow.stamp { border-color: #fafaf7; }
  .eyebrow .ic { font-weight: 700; }
```

注意印章字色固定深色 `#0e1714`(橙底需深字),深色主题下边框改亮色。

- [ ] **Step 3: 改按钮为 Brutalist 硬阴影**

`styles.css` 的 `.btn` 相关(约第 154-167 行),将 `.btn-primary` 和 `.btn-ghost` 块改为:

```css
  .btn-primary {
    background: var(--clash-o);
    color: #0e1714;
    border: 2px solid #fafaf7;
    box-shadow: 4px 4px 0 var(--clash-g);
    font-weight: 600;
  }
  [data-theme="dark"] .btn-primary { border-color: #fafaf7; }
  .btn-primary:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--clash-g); }
  .btn-primary .bracket { color: rgb(14 23 20 / 0.5); }
  .btn-ghost {
    border: 2px solid var(--ink);
    color: var(--ink);
    background: transparent;
    box-shadow: 4px 4px 0 var(--clash-g);
  }
  [data-theme="dark"] .btn-ghost { border-color: #fafaf7; color: #fafaf7; }
  .btn-ghost:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--clash-g); }
  .btn-ghost:hover .bracket { color: var(--clash-o); }
```

hover 时按钮向左上位移 2px、阴影增大,制造"按下凸起"的硬切感(200ms 内,见 Task 8 统一 transition)。

- [ ] **Step 4: 浏览器验证**

刷新。验证:
- Eyebrow 是橙色印章标签,左倾 -2deg,绿阴影,深字
- primary 按钮:橙底深字白边框,绿硬阴影,hover 时左上移 + 阴影变大
- ghost 按钮:透明底深边框,绿硬阴影,hover 同上,括号变橙
- 浅色主题切换后同样可辨

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: hero eyebrow stamp + brutalist buttons

Eyebrow becomes orange rotated stamp with green shadow. Buttons
get hard shadows and lift-on-hover. Both themes defined."
```

---

## Task 5: Frame 素材窗口组件 Brutalist 化

Spec §3.4(Hero frame)、§4.1(Bento 双图)、§5.4(desk frame)。统一所有 frame 为硬边框 + 撞色硬阴影。

**Files:**
- Modify: `styles.css:169-185`(`.frame` 及相关)

- [ ] **Step 1: 改 frame 基础样式为硬边框 + 硬阴影**

`styles.css` 的 `.frame`(约第 170-173 行),将:
```css
  .frame {
    margin: 0; border: 1px solid var(--line); border-radius: 8px;
    background: var(--surface); overflow: hidden; box-shadow: var(--shadow);
  }
```
改为:
```css
  .frame {
    margin: 0; border: 2px solid #fafaf7; border-radius: 0;
    background: var(--surface); overflow: hidden;
    box-shadow: 6px 6px 0 var(--clash-g);
  }
  [data-theme="dark"] .frame { border-color: #fafaf7; }
  :root:not([data-theme="dark"]) .frame { border-color: var(--ink); }
```

圆角归零、边框加粗到 2px、柔和阴影换成绿色硬阴影。

- [ ] **Step 2: Hero frame 与 Bento 右图配橙阴影,desk frame 保持绿阴影**

在 `styles.css` 的 `.frame.hero-frame img`(约第 185 行)之后追加:

```css
  .frame.hero-frame { box-shadow: 6px 6px 0 var(--clash-g); }
  /* Bento: 左图绿阴影左倾,右图橙阴影右倾 — 交替拼贴 */
  .bento .frame:not(.tall) {
    box-shadow: 6px 6px 0 var(--clash-g);
    transform: rotate(-0.5deg);
  }
  .bento .frame.tall {
    box-shadow: 6px 6px 0 var(--clash-o);
    transform: rotate(0.5deg);
  }
  .frame.desk-frame { box-shadow: 6px 6px 0 var(--clash-g); }
```

- [ ] **Step 3: frame-bar 路径栏硬边框 + 信息标撞色**

`styles.css` 的 `.frame-bar`(约第 174-179 行)末尾的 `background` 行后,改 `.info` 样式。找到 `.frame-bar .info { color: var(--ink-faint); white-space: nowrap; }`(约第 183 行),改为:

```css
  .frame-bar .info {
    color: #0e1714; white-space: nowrap;
    background: var(--clash-g);
    padding: 2px 7px; font-weight: 600;
  }
  /* 右图(tall)的信息标用橙色呼应其阴影 */
  .bento .frame.tall .frame-bar .info { background: var(--clash-o); }
```

- [ ] **Step 4: 浏览器验证**

刷新。验证:
- 所有 frame:2px 硬边框、无圆角、绿色硬阴影(除 Bento 右图为橙色)
- Bento 双图:左图左倾 -0.5deg + 绿阴影,右图右倾 0.5deg + 橙阴影
- frame-bar 信息标(4:3、16:11 等)为绿底深字小标签;右图信息标为橙底
- 浅色主题下边框为深色,对比清晰

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: brutalist asset window frames

All frames: 2px hard border, no radius, hard color shadows.
Bento pair alternates green/orange shadows with opposing rotation.
Frame info badges become clash-colored chips."
```

---

## Task 6: Section 标题单词装块 + note 竖线

Spec §4.2、§4.3、§5.3。Focus 的 `made.` 装橙块、Log 的 `cooking.` 装绿块,note 加竖线。

**Files:**
- Modify: `index.html:68`、`index.html:86`、`index.html:91`(section 标题与 note)
- Modify: `styles.css:191-196`(`.sec-title`、`.sec-note`)

- [ ] **Step 1: 改 Focus section 标题标记**

`index.html:68`,将:
```html
    <h2 class="sec-title">where it's <span class="mute">made.</span></h2>
```
改为:
```html
    <h2 class="sec-title">where it's <span class="word-blk blk-o">made.</span></h2>
```

- [ ] **Step 2: 改 Log section 标题标记**

`index.html:91`,将:
```html
    <h2 class="sec-title">what's <span class="mute">cooking.</span></h2>
```
改为:
```html
    <h2 class="sec-title">what's <span class="word-blk blk-g">cooking.</span></h2>
```

- [ ] **Step 3: 改 Focus note 标记加竖线 class 与关键词高亮**

`index.html:86`,将:
```html
  <p class="sec-note">// small screens first. every idea starts with a narrow job and a reason to exist. prototypes land on real devices, not slide decks.</p>
```
改为:
```html
  <p class="sec-note note-bar">// small screens first. every idea starts with a narrow job and a reason to exist. prototypes land on <span class="hl">real devices</span>, not slide decks.</p>
```

- [ ] **Step 4: 加 CSS word-blk 与 note-bar 样式**

`styles.css` 找到 `.sec-title .mute { color: var(--ink-faint); }`(约第 195 行),在其后追加:

```css
  .sec-title .word-blk {
    display: inline-block;
    padding: 0 0.15em;
    color: #0e1714;
    line-height: 1;
    font-size: 0.92em;
  }
  .sec-title .word-blk.blk-o {
    background: var(--clash-o);
    transform: rotate(-1deg);
    box-shadow: 0.12em 0.12em 0 var(--clash-g);
  }
  .sec-title .word-blk.blk-g {
    background: var(--clash-g);
    transform: rotate(1deg);
    box-shadow: 0.12em 0.12em 0 var(--clash-o);
  }
```

然后找到 `.sec-note`(约第 196 行),在其后追加:

```css
  .sec-note.note-bar {
    border-left: 4px solid var(--clash-g);
    padding-left: 14px;
  }
  .sec-note.note-bar .hl { color: var(--clash-o-soft); font-weight: 500; }
```

- [ ] **Step 5: 浏览器验证**

刷新。验证:
- Focus 标题 `made.` 在橙色小块内(左倾),绿阴影
- Log 标题 `cooking.` 在绿色小块内(右倾),橙阴影
- Focus note 左侧有 4px 绿竖线,`real devices` 橙色高亮
- 一橙一绿标题形成对仗

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "feat: section title word-blocks + note guide bar

Focus 'made.' in orange block, Log 'cooking.' in green block
(green/orange pairing). Focus note gets green left bar + highlight."
```

---

## Task 7: Log 标签撞色降级 + 行竖线系统

Spec §5.1、§5.2。NOW 实心橙、NEXT 描边绿、LATER 描边灰,每行加同色左竖线。

**Files:**
- Modify: `styles.css:206-217`(`.log-row`、`.log-tag`)

- [ ] **Step 1: 改 log-row 加左侧竖线**

`styles.css` 的 `.log-row`(约第 206-209 行),将:
```css
  .log-row {
    display: grid; grid-template-columns: 92px 1fr; gap: 20px; align-items: baseline;
    padding: clamp(20px, 3vw, 28px) 0; border-bottom: 1px solid var(--line);
  }
```
改为:
```css
  .log-row {
    display: grid; grid-template-columns: 92px 1fr; gap: 20px; align-items: baseline;
    padding: clamp(20px, 3vw, 28px) 0 0 16px; border-bottom: 1px solid var(--line);
    border-left: 4px solid var(--mute);
  }
  .log-row.row-now { border-left-color: var(--clash-o); }
  .log-row.row-next { border-left-color: var(--clash-g); }
```

- [ ] **Step 2: 给 log-row 加状态 class**

`index.html` 的 log 区(约第 96-107 行),给三个 `.log-row` 分别加 class:
- 第一个 `<div class="log-row row-now">`
- 第二个 `<div class="log-row row-next">`
- 第三个保持 `<div class="log-row">`(默认 mute 竖线)

- [ ] **Step 3: 改 log-tag 为撞色标签**

`styles.css` 的 `.log-tag`(约第 210-213 行),将:
```css
  .log-tag { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
  .log-tag.now { color: var(--accent); }
  .log-tag.next { color: var(--warn); }
  .log-tag.later { color: var(--ink-faint); }
```
改为:
```css
  .log-tag {
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    display: inline-block; padding: 3px 9px; font-weight: 600; text-align: center;
    border: 2px solid var(--mute); color: var(--mute); background: transparent;
  }
  .log-tag.now { background: var(--clash-o); color: #0e1714; border-color: var(--clash-o); }
  .log-tag.next { color: var(--clash-g); border-color: var(--clash-g); }
  .log-tag.later { color: var(--ink-faint); border-color: var(--ink-faint); }
```

NOW 实心橙、NEXT/LATER 描边,实心→描边→描边降级。

- [ ] **Step 4: 浏览器验证**

刷新。验证:
- NOW 标签:橙底深字实心块,右侧呼吸点保留
- NEXT 标签:透明底绿描边绿字
- LATER 标签:透明底灰描边灰字
- 每行左侧竖线:NOW 行橙、NEXT 行绿、LATER 行灰,与标签同色

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: log tags clash downgrade + row guide bars

NOW solid orange, NEXT green outline, LATER gray outline (priority
downgrade). Each row gets left bar matching its tag color."
```

---

## Task 8: Nav + Footer Brutalist 化 + 全局硬切 transition

Spec §7、§6、§8。Nav 绿底线 + 菜单 hover 变橙块,Footer 橙顶线 + 链接 hover 下划线变橙,全局 transition 改硬切。

**Files:**
- Modify: `styles.css:100-103`(`.nav` 边框)、`styles.css:113-118`(`.nav-menu a`)、`styles.css:220-226`(`.foot`)、多处 `transition`

- [ ] **Step 1: Nav 底线改绿色撞色边框**

`styles.css` 的 `.nav`(约第 100-103 行),将:
```css
    border-bottom: 1px solid transparent;
    transition: border-color 200ms ease;
  }
  .nav.scrolled { border-color: var(--line); }
```
改为:
```css
    border-bottom: 2px solid var(--clash-g);
  }
```

移除 scrolled 状态切换(底线常驻绿色)。`.nav.scrolled` 规则删除。

- [ ] **Step 2: 菜单链接 hover 变橙块**

`styles.css` 的 `.nav-menu a`(约第 113-118 行),将:
```css
  .nav-menu a {
    padding: 7px 12px; color: var(--ink-soft);
    border: 1px solid transparent; border-radius: 4px;
    transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
  }
  .nav-menu a:hover { color: var(--accent-ink); border-color: var(--line); background: var(--surface); }
```
改为:
```css
  .nav-menu a {
    padding: 7px 12px; color: var(--ink);
    border: 2px solid transparent;
    transition: background 140ms steps(2), color 140ms steps(2);
  }
  @media (hover: hover) {
    .nav-menu a:hover {
      background: var(--clash-o);
      color: #0e1714;
    }
  }
```

hover 硬切成橙底深字。用 `@media (hover: hover)` 包裹,触屏降级。

- [ ] **Step 3: Footer 顶线改橙色撞色 + 链接 hover 下划线变橙**

`styles.css` 的 `.foot`(约第 221-226 行),将:
```css
  .foot {
    border-top: 1px solid var(--line); padding: 28px 0 44px;
    display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
    font-size: 12px; color: var(--ink-faint); letter-spacing: 0.03em;
  }
  .foot a:hover { color: var(--accent-ink); }
```
改为:
```css
  .foot {
    border-top: 2px solid var(--clash-o); padding: 28px 0 44px;
    display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
    font-size: 12px; color: var(--ink-faint); letter-spacing: 0.03em;
  }
  .foot a {
    border-bottom: 2px solid transparent;
    transition: border-color 140ms steps(2);
  }
  @media (hover: hover) {
    .foot a:hover { border-bottom-color: var(--clash-o); }
  }
```

- [ ] **Step 4: 全局 transition 统一为硬切(≤200ms)**

`styles.css` 中所有 `transition: ... ease` 的地方,改为硬切时序函数。需修改的位置:
- `.skip-link`(第 60 行):`transition: top 160ms ease;` → `transition: top 160ms steps(2);`
- `.btn`(第 158 行):`transition: transform 160ms ease, ...` → 把 `ease` 全改 `steps(2)`
- `.theme-btn`(第 233 行)、`.menu-btn`(第 242 行):`ease` → `steps(2)`
- `.cursor`(第 109 行)已用 `steps(1)`,不动

用编辑器全局替换 `ease)` → `steps(2))` 在上述 transition 行(注意只改 transition 声明里的,不动其他)。逐行确认。

- [ ] **Step 5: 浏览器验证**

刷新。验证:
- Nav 底部有 2px 绿色常驻线
- 菜单链接 hover:硬切成橙底深字(非柔和过渡)
- Footer 顶部有 2px 橙色线
- Footer 链接 hover:下划线变橙
- `[ menu ]` `[ light ]` 按钮 hover 过渡是硬切感
- 触屏(DevTools 切移动端):hover 效果不触发

- [ ] **Step 6: Commit**

```bash
git add styles.css
git commit -m "feat: brutalist nav + footer + hard-cut transitions

Nav: green bottom border, menu hover→orange block. Footer: orange
top border, link hover→orange underline. All transitions to steps()
hard-cut. Hover effects gated behind @media (hover: hover)."
```

---

## Task 9: 移动端响应式校准 + reduced-motion 复核

Spec §8(纪律)、§12(验收)。Bento/标题色块在移动端的缩放,reduced-motion 下 scramble 的静态降级复核。

**Files:**
- Modify: `styles.css:246-276`(媒体查询块)

- [ ] **Step 1: 移动端标题色块缩放校准**

`styles.css` 的 `@media (max-width: 720px)` 块(约第 251 行)内,在 `.display .line2 { padding-left: 0; }` 之后追加:

```css
    .display .blk { padding: 0 0.08em; }
    .display .blk-g { transform: rotate(-0.5deg); }
    .display .blk-o { transform: rotate(0.4deg); }
    .eyebrow.stamp { transform: rotate(-1.5deg); }
```

移动端标题字号小,色块内边距和旋转幅度同步缩小,避免色块溢出或旋转过度。

- [ ] **Step 2: 复核 reduced-motion 降级**

`styles.css` 的 `@media (prefers-reduced-motion: reduce)`(约第 273-276 行)当前是:
```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
    html { scroll-behavior: auto; }
  }
```

这块已正确禁用所有动画/过渡。scramble 的 reduce 降级在 `script.js`(Task 3 Step 2 的 `if (reduce) { finalize(); return; }`)已处理——直接显示分块结果。无需改动,仅验证。

- [ ] **Step 3: 浏览器验证(多断点)**

DevTools 响应式模式逐档验证:
- **桌面(>860px)**:Hero 双栏,Bento 双图并排,色块正常
- **平板(860px)**:Hero 单栏,Bento 单列堆叠
- **手机(720px)**:hamburger 菜单出现,标题色块缩小无溢出,印章旋转幅度减小
- **开启 reduced-motion**:scramble 直接显示 `FOCUSED`(绿块)`APPS`(橙块),无解码动画;所有 hover 即时无过渡

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "fix: mobile calibration for clash blocks + reduced-motion check

Scale block padding/rotation down on mobile. Verify scramble
reduced-motion path shows static colored blocks."
```

---

## Task 10: 最终验收 + Lighthouse

Spec §12 验收标准全量检查。

**Files:** 无修改(仅验证)

- [ ] **Step 1: 逐项核对验收清单**

对照 spec §12,在桌面深色主题下逐项确认:
- [ ] Hero 双色块 + 交叉阴影符合设计
- [ ] scramble 正常,临时字符橙、解码后块内深色
- [ ] Focus 双图交替绿橙阴影 + 反向旋转
- [ ] Log 三标签实心/描边/描边降级 + 同色竖线
- [ ] Nav 绿底线 + 菜单 hover 变橙块
- [ ] Footer 橙顶线 + 链接 hover 下划线变橙
- [ ] 浅色主题对比度达标,撞色块清晰
- [ ] reduced-motion 下全部静态/即时
- [ ] 触屏 hover 降级
- [ ] 移动端响应式正常

- [ ] **Step 2: Lighthouse 性能审计**

Chrome DevTools → Lighthouse → Performance(移动端模拟)。验证:
- LCP < 2.5s
- CLS < 0.1

如果超标,排查:色块 `transform: rotate` 是否触发额外合成层(应无害)、图片是否未懒加载、字体加载。记录结果。

- [ ] **Step 3: 如有问题修复后追加 commit,否则收尾**

```bash
# 无需 commit(纯验证)。若有修复:
# git commit -m "fix: lighthouse/perf adjustments"
```

---

## Self-Review

**1. Spec coverage 核对:**
- §2 Token → Task 1 ✅
- §3.1 标题色块 → Task 3 ✅
- §3.2 eyebrow 印章 → Task 4 ✅
- §3.3 按钮 → Task 4 ✅
- §3.4 Hero frame → Task 5 ✅
- §3.5 网格背景 → 复用现有 `body::before`,Task 5 未新增独立网格(spec 已调整为复用)✅
- §4.1 Bento 双图 → Task 5 ✅
- §4.2/§5.3 section 标题装块 → Task 6 ✅
- §4.3 note 竖线 → Task 6 ✅
- §5.1/§5.2 Log 标签+竖线 → Task 7 ✅
- §5.4 desk frame → Task 5 ✅
- §6 Footer → Task 8 ✅
- §7 Nav → Task 8 ✅
- §8 动效纪律 → Task 8(transition)+ Task 9(reduced-motion)✅
- §9 主题默认 → Task 1 + Task 2 ✅
- §12 验收 → Task 10 ✅

**2. Placeholder scan:** 无 TBD/TODO,所有 step 含完整代码或具体命令。✅

**3. Type consistency:** `--clash-o`/`--clash-g`/`--clash-o-soft` 在 Task 1 定义后,Task 3-8 全程一致引用;class 名 `blk-g`/`blk-o`/`word-blk`/`note-bar`/`row-now`/`row-next`/`stamp`/`scrambling`/`scramble-dual` 在定义与引用处拼写一致。✅
