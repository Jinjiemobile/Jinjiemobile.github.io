# Brutalist Clash Blocks 视觉重设计

- **日期**:2026-06-27
- **项目**:Jinjie Mobile 落地页(`Jinjiemobile.github.io`)
- **范围**:CSS/视觉层重设计 + 轻量 HTML 标记调整,不重构页面结构
- **前置**:在 Mono 工程硬核重设计(2026-06-26)基础上的视觉方向转向

## 1. 背景与目标

当前页面刚完成一次 Mono 工程硬核重设计(翡翠绿单色、Geist Mono、scramble 解码动效),工程质量在水准之上。但用户希望探索一个**更强的视觉方向**,让页面更有辨识度和冲击力。

经头脑风暴确认以下决策:

1. **方向**:Bold Brutalism 粗野主义(反精致的硬核态度)
2. **强度**:中度——深底 + 超大黑体撞色块 + 硬阴影,态度与专业感平衡
3. **配色**:绿橙双撞(绿 `#49d6bd` 延续品牌 + 橙 `#ff5500` 制造撞击)
4. **范围**:Hero + 素材窗口做强改造,其余 section 用 Brutalist 元素轻度统一
5. **动效**:保留 scramble 解码,装进 Brutalist 撞色块

**目标**:在不重构页面 HTML 结构、不放弃 scramble signature 资产的前提下,把页面从"冷静工程风"升级为"Bold Brutalist 粗野风",首屏冲击力最大化,全页视觉一致。

## 2. 设计 Token

### 2.1 配色(深色为默认主题)

| Token | 值 | 用途 |
|---|---|---|
| `--ink` | `#0e1714` | 深底主背景(近黑墨绿) |
| `--ink-2` | `#1a2823` | 卡片/块次级底色 |
| `--paper` | `#fafaf7` | 文字主色 + 亮块底色 |
| `--clash-o` | `#ff5500` | 橙撞色(标题块、印章、NOW 标签、Footer 顶线) |
| `--clash-o-soft` | `#ff7a3d` | 橙的次级(文字高亮、scramble 临时字符) |
| `--clash-g` | `#49d6bd` | 绿撞色(标题块、frame 阴影、NEXT 标签、Nav 底线) |
| `--mute` | `#5a6a64` | 次级文字、LATER 状态、背景网格线 |

### 2.2 核心 Brutalist Token

| Token | 值 | 用途 |
|---|---|---|
| `--border` | `2px solid var(--paper)` | 所有边框统一 2px 硬边 |
| `--shadow-hard` | `4px 4px 0 <clash>` | 硬阴影(blur 恒为 0,撞色) |
| `--shadow-lg` | `6px 6px 0 <clash>` | 大号硬阴影(Hero 标题块) |
| `--rotate-neg` | `-0.8deg` | 色块轻微左倾 |
| `--rotate-pos` | `0.6deg` | 色块轻微右倾 |
| `--rotate-stamp` | `-2deg` | 印章标签旋转 |

### 2.3 Brutalism 三原则

1. **硬边无模糊** — 所有阴影 blur 为 0,边框 2px 实线,圆角不超过 4px
2. **撞色块即结构** — 不用渐变,纯色块拼接制造层次
3. **手作不完美感** — 色块轻微旋转 `±0.8deg`、印章旋转 `±2deg`,打破精确网格

## 3. Hero 改造(强)

Hero 是冲击力主战场。保留现有结构(eyebrow → display 标题 → hero-meta + frame),视觉层全面 Brutalist 化。

### 3.1 标题色块布局

现有标题:
```
BUILDING
FOCUSED APPS.    ← scramble 作用于 "FOCUSED APPS" 整体
```

改造:
- `BUILDING` — 纯 `--paper` 色,无块,作为"静"的锚点
- `FOCUSED` — **绿撞色块**:`--clash-g` 底 + `--ink` 字,`rotate(-0.8deg)`,硬阴影 `6px 6px 0 var(--clash-o)`(橙阴影)
- `APPS` — **橙撞色块**:`--clash-o` 底 + `--ink` 字,`rotate(0.6deg)`,硬阴影 `6px 6px 0 var(--clash-g)`(绿阴影)
- `.` 句号 — `--clash-g` 色,收尾

scramble 动效保留。解码过程中临时乱码字符用 `--clash-o-soft` 色,解码完成后恢复为块内深色 `--ink`。乱码的粗粝感强化 raw 气质。

**关键实现约束(scramble 与双块布局的张力)**:现有 HTML 中 `FOCUSED APPS` 是单个 scramble span(`data-text="FOCUSED APPS"`),但视觉上需拆成两个分别装进绿块/橙块的独立元素。实现需二选一:
- **方案 a(推荐)**:scramble 完成后,用 JS 将解码结果按空格拆分,把 `FOCUSED` 包进绿块 span、`APPS` 包进橙块 span。scramble 过程中整块用橙色乱码显示在单一容器里,完成后着色分块。
- **方案 b**:把 `FOCUSED` 和 `APPS` 拆成两个独立 scramble span,各自解码。两个 scramble 错峰启动制造层次。

推荐方案 a,因为单次 scramble 的视觉连贯性更好,且乱码期间不需要区分颜色。具体由实现计划决定。

### 3.2 Eyebrow 印章标签

现有 `new mobile studio · 2026` → 改为撞色印章标签:
- 橙底 `--clash-o` + 深字 `--ink`,`rotate(-2deg)`
- 硬阴影 `3px 3px 0 var(--clash-g)`
- 文案:`▸ NEW STUDIO · 2026`

### 3.3 Hero-meta 区

- `.hero-lede` 文字保持 `--paper` 色,`//` 和 `mobile tools` 关键词用 `--clash-o-soft` 高亮
- **按钮**:
  - primary `[ see what's next ]` — 橙底 `--clash-o` + 深字 `--ink`,2px 白边框,硬阴影 `4px 4px 0 var(--clash-g)`
  - ghost `[ github ]` — 透明底,2px 白边框 + 白字,硬阴影 `4px 4px 0 var(--clash-g)`

### 3.4 Hero frame 图

- 保留 `▸ ~/assets/hero-phone.jpg` 路径栏(工程隐喻与 Brutalism 不冲突)
- frame 加 2px 白边框 + 硬阴影 `6px 6px 0 var(--clash-g)`(绿阴影)
- `.frame-bar` 路径栏改白底深字硬边框,`4:3` 信息标用橙底

### 3.5 网格背景

现有全局 `body::before` 已有极淡横线网格(间距 8px)。本设计**复用并强化**这一既有语言:Hero 区域将网格间距放大到 32px 并加纵向线(`linear-gradient` 双向),与全局 8px 横线网格叠加。不新增独立的 hero 网格系统,避免冲突。

## 4. 素材窗口组件(Focus section,强)

现有 Bento 双图 + note。呼应 Hero 色块语言但不重复手法。

### 4.1 Bento 双图 frame 改造

两个 frame 各配撞色硬阴影,颜色**交替**:
- 左图(横向 16:11):2px 白边框 + 硬阴影 `6px 6px 0 var(--clash-g)`(绿),`rotate(-0.5deg)`
- 右图(纵向 3:4 tall):2px 白边框 + 硬阴影 `6px 6px 0 var(--clash-o)`(橙),`rotate(0.5deg)`

两图一左倾一右倾,形成手工拼贴张力。交替配色让 Focus 区有独立节奏,通过共享硬阴影语言与 Hero 串联。

`.frame-bar` 信息标(16:11 / 3:4)分别用绿底、橙底,与各自阴影色呼应。

### 4.2 Section 标题

现有 `where it's <span class="mute">made.</span>`:
- `made.` 装进**小号橙撞色块**:`--clash-o` 底 + `--ink` 字,`rotate(-1deg)`,硬阴影 `3px 3px 0 var(--clash-g)`
- 这是 Hero 手法的"轻量版"——单个词装块

### 4.3 Section note

现有 `.sec-note`:
- 文字保持 `--mute` 色
- 开头 `//` 换成 `--clash-g` 色,关键词 `real devices` 用 `--clash-o-soft` 高亮
- 加左侧 4px 绿色竖线 `border-left: 4px solid var(--clash-g)`,呼应 Log 区竖线系统

## 5. Log 区(轻度统一)

现有三行 log-row + desk frame。

### 5.1 标签撞色化(核心)

- `NOW` — 橙底深字 `--clash-o`,实心撞色块,保留 `.pulse` 呼吸点
- `NEXT` — 透明底 + 2px 绿边框 + 绿字 `--clash-g`,描边块
- `LATER` — 透明底 + 2px 灰边框 + 灰字 `--mute`,描边块

用"实心 → 描边 → 描边"降级表达优先级递减。

### 5.2 左侧竖线系统

每行 `log-row` 加 4px 左侧竖线,颜色与标签一致:
- NOW 行:`border-left: 4px solid var(--clash-o)`
- NEXT 行:`border-left: 4px solid var(--clash-g)`
- LATER 行:`border-left: 4px solid var(--mute)`

与 Focus note 竖线呼应,形成全局"标注线"系统。竖线色 = 标签色,把标签和正文视觉绑定。

### 5.3 Section 标题

现有 `what's <span>cooking.</span>`:
- `cooking.` 装进**绿撞色块**(与 Focus 的 `made.` 橙块形成对仗——一橙一绿)

### 5.4 desk frame

与其他 frame 统一:2px 白边框 + 硬阴影 `6px 6px 0 var(--clash-g)`。

## 6. Footer(轻度统一)

现有版权 + 链接,克制收尾。

- **顶部分割线**升级为 2px 橙撞色边框 `border-top: 2px solid var(--clash-o)`,作为整页"最后一击",呼应 Hero eyebrow 印章的橙
- 版权 `© 2026 jinjie.mobile` 保持 `--mute`
- 链接 `github` / `hello@` hover 时下划线变橙,从左到右展开 200ms
- 整体保留克制——这里是"退场",不再做强冲击

## 7. Nav(轻度统一)

- **底部边框**升级为 2px 绿色撞色边框 `border-bottom: 2px solid var(--clash-g)`,与 Footer 橙顶线首尾呼应(顶绿底橙)
- **prompt logo** `> jinjie.mobile_` 保持绿色 `--clash-g` + 闪烁光标(CLI prompt 气质与 Brutalism 契合,不动)
- **菜单链接** hover 时整个区域变橙底深字 `background: var(--clash-o); color: var(--ink)`,200ms 硬切
- **按钮** `[ menu ]` / `[ light ]` 保留方括号,hover 时方括号字符染色为 `--clash-o`
- 移动端 hamburger、主题切换、`aria-expanded` 逻辑全保留,只改视觉

## 8. 全局动效纪律(红线)

继承自前置 Mono 设计 spec,Brutalist 改造必须遵守:

1. **所有交互动效 ≤ 200ms 硬切** — 用 `steps()` 或 `linear`,不用 `ease-in-out`。色块出现/消失要"咔嗒"硬切感
2. **`prefers-reduced-motion: reduce` 全量降级** — scramble 降级为静态直接显示最终文字;hover 色块降级为颜色变化;所有 transition 降级为 `0ms`
3. **MOTION_INTENSITY ≤ 4** — 不引入 scroll-driven 动画、GSAP、rAF 循环
4. **scramble 范围限定** — 只作用于 Hero 标题,不扩展到其他文字
5. **触屏适配** — hover 色块效果用 `@media (hover: hover)` 包裹,触屏降级为无

## 9. 主题切换策略

- **深色为默认**:现有 `script.js` 已读取 `prefers-color-scheme`。改为 **默认锁定 dark**(无论 OS 偏好),用户仍可手动切换到 light。具体:`script.js:36` 的 `applyTheme(darkMq.matches ? "dark" : "light")` 改为 `applyTheme("dark")`,并移除跟随 OS 的 `darkMq.addEventListener` 逻辑(保留手动切换)。`<html>` 初始 `data-theme="dark"` 避免 FOUC。
- 浅色主题同样应用所有 Brutalist token(浅底 `#fafaf7` + 撞色块),阴影颜色对比度保持有效
- 切换逻辑保留现有 `script.js` 的手动切换部分,token 值在两个 theme 下分别定义

## 10. 改造范围总结

| Section | 力度 | 核心手法 |
|---|---|---|
| Hero | 强 | 双色块装词 + 交叉阴影 + scramble 保留 + 印章 eyebrow + 网格背景 |
| 素材窗口(Focus) | 强 | 双图交替阴影 + 反向旋转拼贴 + 单词装块标题 |
| Log | 轻度 | 标签降级撞色 + 左侧竖线系统 + 绿块标题 |
| Footer | 轻度 | 橙顶线收尾 + hover 下划线变橙 |
| Nav | 轻度 | 绿底线 + hover 变色块 + 方括号染色 |

## 11. 不在本次范围

明确排除,避免范围蔓延:

- 不重构页面 HTML 结构(只加 class / 微调标记)
- 不新增 section(不增产品预览、时间线等)
- 不替换现有图片资源
- 不引入第三方库或构建工具
- 不改动 scramble 的核心算法(只改其文字颜色行为)

## 12. 验收标准

- [ ] 深色主题下,Hero 双色块 + 交叉阴影视觉呈现符合设计
- [ ] scramble 动效正常运行,临时字符为橙色,解码后为块内深色
- [ ] Focus 双图交替绿橙阴影 + 反向旋转
- [ ] Log 三标签实心/描边/描边降级 + 同色竖线
- [ ] Nav 绿底线 + 菜单 hover 变橙块
- [ ] Footer 橙顶线 + 链接 hover 下划线变橙
- [ ] 浅色主题下所有元素对比度达标,撞色块清晰可辨
- [ ] `prefers-reduced-motion: reduce` 下所有动效降级为静态/即时
- [ ] 触屏设备 hover 效果正确降级
- [ ] 移动端响应式正常(hamburger、堆叠布局)
- [ ] Lighthouse:LCP < 2.5s,CLS < 0.1
