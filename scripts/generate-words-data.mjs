// 解析 SQL 种子文件，生成 data/words.json（权威静态词表）。
// 用法：node scripts/generate-words-data.mjs
// 会做 slug 冲突校验，任意两词 slug 相同但 (spanish, pos) 不同则报错。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const supabaseDir = join(root, 'supabase')

// 只解析「最终词表」文件；旧的 seed_words.sql（带 frequency_rank 的小种子）已被 a1~c1 覆盖，跳过。
const WORD_FILES = [
  'seed_words_a1.sql',
  'seed_words_a2.sql',
  'seed_words_b1.sql',
  'seed_words_b2.sql',
  'seed_words_c1.sql',
  'seed_words_extra.sql',
  'seed_words_extra2.sql',
  'seed_textbook.sql',
]

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

function wordId(spanish, pos) {
  const base = spanish
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúüñ]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${pos}`
}

// 6 字段：('spanish', 'pos', 'definition', 'LEVEL', 'source', null|'m'|'f')
const WORD_RE =
  /^\(\s*'((?:[^'])*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'(A1|A2|B1|B2|C1)'\s*,\s*'([^']*)'\s*,\s*(null|'m'|'f')\s*\)\s*,?\s*$/

// 3 字段（仅教材文件的单元映射）：('spanish', 'pos', 'unit')
const UNIT_RE = /^\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*\)\s*,?\s*$/

const bySlug = new Map() // slug -> { spanish, pos, ... }
const origin = new Map() // slug -> 首次出现的文件，用于报错定位

function addWord(file, spanish, pos, definition, level, source, gender) {
  const slug = wordId(spanish, pos)
  const existing = bySlug.get(slug)
  if (existing) {
    if (existing.spanish === spanish && existing.pos === pos) {
      return // 重复词（不同文件同词），跳过，保留首个
    }
    throw new Error(
      `slug 冲突：\`${slug}\` 同时对应 (${existing.spanish}, ${existing.pos}) [${origin.get(slug)}] 与 (${spanish}, ${pos}) [${file}]`
    )
  }
  bySlug.set(slug, { spanish, pos, definition, level, source, gender })
  origin.set(slug, file)
}

for (const file of WORD_FILES) {
  const text = readFileSync(join(supabaseDir, file), 'utf8')
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(WORD_RE)
    if (m) {
      const [, spanish, pos, definition, level, source, genderRaw] = m
      addWord(file, spanish, pos, definition, level, source, genderRaw === 'null' ? null : genderRaw.replace(/'/g, ''))
    }
  }
}

// 教材单元映射：只从 seed_textbook.sql 的 `from (values ...)` 块读取
const unitByWord = new Map() // `${spanish}|${pos}` -> unit
{
  const text = readFileSync(join(supabaseDir, 'seed_textbook.sql'), 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(UNIT_RE)
    if (m) {
      const [, spanish, pos, unit] = m
      unitByWord.set(`${spanish}|${pos}`, unit)
    }
  }
}

const words = [...bySlug.values()].map((w) => ({
  id: wordId(w.spanish, w.pos),
  spanish: w.spanish,
  pos: w.pos,
  definition_cn: w.definition,
  level: w.level,
  gender: w.gender,
  source: w.source,
  unit: unitByWord.get(`${w.spanish}|${w.pos}`) ?? null,
}))

// 稳定排序：level → spanish → pos
words.sort((a, b) => {
  const l = LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level)
  if (l !== 0) return l
  const s = a.spanish.localeCompare(b.spanish)
  if (s !== 0) return s
  return a.pos.localeCompare(b.pos)
})

const outDir = join(root, 'data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'words.json'), JSON.stringify(words, null, 2) + '\n')

const byLevel = {}
for (const w of words) byLevel[w.level] = (byLevel[w.level] ?? 0) + 1
const bySource = {}
for (const w of words) bySource[w.source] = (bySource[w.source] ?? 0) + 1
console.log(`已生成 data/words.json，共 ${words.length} 词`)
console.log('按等级：', JSON.stringify(byLevel))
console.log('按来源：', JSON.stringify(bySource))
