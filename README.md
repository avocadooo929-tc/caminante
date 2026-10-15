# Camina · 西语学习助手

辅助学习西班牙语的 PWA（可安装到手机主屏幕）。一套代码，同时支持 **iPhone（Safari）** 和 **Windows（Chrome/Edge）**。

功能：**背单词（间隔重复）· 例句理解（AI 按 A1–C1 难度生成）· 造句/翻译练习 · 循序渐进语法教程**。UI 为包豪斯简洁风格。

## 技术栈

- **Next.js 16**（App Router）+ TypeScript + Tailwind CSS v4
- **Supabase**（账号登录 + 云数据库，进度多端同步）
- **DeepSeek API**（生成例句、出题、批改）
- 部署：**Vercel**（免费额度）

## 目录结构

```
app/            页面与 API 路由
  (auth)/       登录 / 注册
  (app)/        单词 / 练习 / 语法 / 我的
  api/ai/       服务端 AI 接口（DeepSeek key 只在服务端）
components/     UI 组件（包豪斯风格）
lib/            AI 封装、Supabase 客户端、SRS 算法
supabase/       建表 SQL + 种子数据（高频词表、语法大纲）
proxy.ts        登录会话刷新（Next 16 的 middleware 改名版）
```

## 首次运行步骤

### 1. 准备三个账号（都免费）

| 平台 | 用途 | 要拿到什么 |
| --- | --- | --- |
| [Supabase](https://supabase.com) | 账号 + 数据库 | 项目 URL + anon key |
| [DeepSeek](https://platform.deepseek.com) | 例句 AI | API key |
| [Vercel](https://vercel.com) | 部署（可选） | — |

### 2. 配置 Supabase 数据库

1. 登录 Supabase，新建项目，记下 **Project URL** 和 **anon public key**（Settings → API）。
2. 打开左侧 **SQL Editor**，依次粘贴运行这几个文件的内容：
   - `supabase/migrations/0001_init.sql`（建表 + 权限）
   - `supabase/migrations/0002_daily.sql`（每日学习记录 + 每日目标）
   - `supabase/seed_words_a1.sql` ~ `seed_words_c1.sql` + `seed_words_extra.sql` + `seed_words_extra2.sql`（词库，按 A1–C1 分级，**7 个文件都要跑**；原 `seed_words.sql` 已被取代可跳过）
   - `supabase/seed_textbook.sql`（《现代西班牙语·第一册》教材词表）
   - `supabase/seed_grammar.sql`（语法 A1–C1 完整讲解）
   - `supabase/seed_grammar_exercises.sql`（语法练习）
3. （建议）在 **Authentication → Providers → Email** 里，先**关闭** “Confirm email”，本地测试时注册即可直接登录；上线时再按需打开。

### 3. 配置本地环境变量

复制 `.env.local.example` 为 `.env.local`，填入上一步拿到的值：

```
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
DEEPSEEK_API_KEY=你的DeepSeek key
```

### 4. 启动

```bash
npm install     # 首次
npm run dev     # 打开 http://localhost:3000
```

在手机（同一局域网）或部署到 Vercel 后，用 Safari 打开并「添加到主屏幕」即可像 App 一样使用。

## 常见问题

- **注册后收不到邮件**：去 Supabase 关掉 “Confirm email”，或换一个邮箱。
- **例句生成失败**：检查 `DEEPSEEK_API_KEY` 是否填对、账户是否还有余额。
- **手机访问不到**：本地 `npm run dev` 只能在同一局域网内访问；要在外网用，请部署到 Vercel。

## 后续规划

- [x] 教材词表导入（《现代西班牙语·第一册》）
- [x] 语法教程详细讲解 + 练习（A1–C1）
- [x] PWA 离线缓存 + iOS 图标
- [ ] 练习记录持久化与学习统计
- [ ] 更多教材 / 词库扩充
