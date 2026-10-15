'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Level, PartOfSpeech } from '@/lib/types'
import { LEVELS, levelFromValue, levelIndex } from '@/lib/levels'
import { STATIC_WORDS, getStaticWord } from '@/lib/words-data'
import { loadManualWords } from '@/lib/manual-words'
import { wordId } from '@/lib/word-id'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/ui/badge'
import { SpeakButton } from '@/components/speak-button'
import { logStudy } from '@/lib/study'

interface PoolWord {
  id: string
  spanish: string
  pos: PartOfSpeech
  definition_cn: string
  level: Level
  gender: 'm' | 'f' | null
  source: string
}

const POS_OPTIONS: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'article',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Folder({
  title,
  count,
  open,
  onToggle,
  selecting,
  onToggleSelect,
  actionBar,
  children,
}: {
  title: string
  count: number
  open: boolean
  onToggle: () => void
  selecting: boolean
  onToggleSelect: () => void
  actionBar?: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="overflow-hidden shadow-none">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center justify-between px-3 py-3 text-left"
        >
          <span className="font-black">{title}</span>
          <span className="text-xs font-bold text-bauhaus-muted">
            {count} 词 {open ? '▲' : '▼'}
          </span>
        </button>
        <button
          type="button"
          onClick={onToggleSelect}
          className={`mr-2 rounded-sm border-2 px-2 py-1 text-xs font-black ${
            selecting
              ? 'border-bauhaus-black bg-bauhaus-black text-white'
              : 'border-bauhaus-line bg-white text-bauhaus-muted hover:border-bauhaus-black'
          }`}
        >
          {selecting ? '取消' : '多选'}
        </button>
      </div>
      {open && (
        <div className="border-t-2 border-bauhaus-line">
          {selecting && actionBar}
          {children}
        </div>
      )}
    </Card>
  )
}

export default function VocabularioPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState<PoolWord[]>([])
  const [units, setUnits] = useState<{ unit: string; words: PoolWord[] }[]>([])
  const [added, setAdded] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [openRoot, setOpenRoot] = useState<Set<string>>(
    new Set(['builtin', 'textbook'])
  )
  const [openUnit, setOpenUnit] = useState<Set<string>>(new Set())

  // 多选状态（按词书，而非全局）
  const [selectFolder, setSelectFolder] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortMode, setSortMode] = useState<'dict' | 'random'>('dict')
  const [userLevel, setUserLevel] = useState<Level>('A1')

  const [adding, setAdding] = useState(false)
  const [nSpanish, setNSpanish] = useState('')
  const [nDefinition, setNDefinition] = useState('')
  const [nPos, setNPos] = useState<PartOfSpeech>('noun')
  const [nLevel, setNLevel] = useState<Level>('A1')
  const [nGender, setNGender] = useState<'m' | 'f' | ''>('')
  const [addError, setAddError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: prof } = await supabase
      .from('profiles')
      .select('target_level')
      .eq('id', user.id)
      .single()
    if (prof?.target_level) setUserLevel(levelFromValue(prof.target_level))

    // 手动词（数据库，source='manual'，id 已是 slug）
    const manualWords = await loadManualWords()

    // 分页拉取用户已加入的单词（Supabase 单次最多 1000 行）
    const mineIds: string[] = []
    for (let from = 0; ; from += 1000) {
      const { data } = await supabase
        .from('user_words')
        .select('word_id')
        .eq('user_id', user.id)
        .range(from, from + 999)
      const rows = (data ?? []) as { word_id: string }[]
      mineIds.push(...rows.map((r) => r.word_id))
      if (rows.length < 1000) break
    }

    // 合并：静态词（打包数据）+ 手动词（数据库）
    const toPool = (w: { id: string; spanish: string; pos: PartOfSpeech; definition_cn: string; level: Level; gender: 'm' | 'f' | null; source: string }): PoolWord => ({
      id: w.id,
      spanish: w.spanish,
      pos: w.pos,
      definition_cn: w.definition_cn,
      level: w.level,
      gender: w.gender,
      source: w.source,
    })
    const all: PoolWord[] = [...STATIC_WORDS.map(toPool), ...manualWords.map(toPool)]

    setWords(all)
    setAdded(new Set(mineIds))

    // 教材单元：从静态词表里 unit 非空的词分组
    const unitMap = new Map<string, PoolWord[]>()
    for (const w of STATIC_WORDS) {
      if (!w.unit) continue
      const list = unitMap.get(w.unit) ?? []
      list.push(toPool(w))
      unitMap.set(w.unit, list)
    }
    setUnits(
      [...unitMap.entries()]
        .map(([unit, ws]) => ({ unit, words: ws }))
        .sort((a, b) => a.unit.localeCompare(b.unit))
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addWord(wordId: string) {
    if (!userId) return
    const supabase = createClient()
    await supabase.from('user_words').upsert(
      {
        user_id: userId,
        word_id: wordId,
        proficiency: 0,
        due_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,word_id' }
    )
    await logStudy({ added: 1 })
    setAdded((s) => new Set(s).add(wordId))
  }

  function toggleSelect(wordId: string) {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(wordId)) next.delete(wordId)
      else next.add(wordId)
      return next
    })
  }

  function toggleSelectFolder(key: string) {
    setSelectFolder((cur) => (cur === key ? null : key))
    setSelected(new Set())
  }

  async function bulkAdd() {
    if (!userId || selected.size === 0) return
    const supabase = createClient()
    const byId = new Map(words.map((w) => [w.id, w]))

    let ordered = [...selected]
    if (sortMode === 'dict') {
      ordered = ordered.sort((a, b) =>
        (byId.get(a)?.spanish ?? '').localeCompare(byId.get(b)?.spanish ?? '')
      )
    } else {
      ordered = shuffle(ordered)
    }

    await supabase.from('user_words').upsert(
      ordered.map((word_id) => ({
        user_id: userId,
        word_id,
        proficiency: 0,
        due_at: new Date().toISOString(),
      })),
      { onConflict: 'user_id,word_id' }
    )

    await logStudy({ added: ordered.length })
    setAdded((s) => {
      const next = new Set(s)
      ordered.forEach((id) => next.add(id))
      return next
    })
    setSelected(new Set())
  }

  function quickSelect(n: number, folderList: PoolWord[]) {
    // 只选当前词书里、且不高于用户当前水平的词
    const candidates = folderList.filter(
      (w) => !added.has(w.id) && levelIndex(w.level) <= levelIndex(userLevel)
    )
    let picked: PoolWord[]
    if (sortMode === 'dict') {
      picked = [...candidates]
        .sort((a, b) => a.spanish.localeCompare(b.spanish))
        .slice(0, n)
    } else {
      picked = shuffle(candidates).slice(0, n)
    }
    setSelected(new Set(picked.map((w) => w.id)))
  }

  async function addCustomWord(e: SyntheticEvent) {
    e.preventDefault()
    setAddError(null)
    if (!userId) return
    const supabase = createClient()

    const spanish = nSpanish.trim()
    const pos = nPos
    const slug = wordId(spanish, pos)

    // 已存在静态词：直接加入背诵，不往 words 表写
    if (!getStaticWord(slug)) {
      const { error: wordErr } = await supabase.from('words').upsert(
        {
          id: slug,
          spanish,
          pos,
          definition_cn: nDefinition.trim(),
          level: nLevel,
          source: 'manual',
          gender: nGender === '' ? null : nGender,
        },
        { onConflict: 'id' }
      )
      if (wordErr) {
        setAddError(wordErr.message)
        return
      }
    }

    await supabase.from('user_words').upsert(
      {
        user_id: userId,
        word_id: slug,
        proficiency: 0,
        due_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,word_id' }
    )

    setNSpanish('')
    setNDefinition('')
    setNGender('')
    setAdding(false)
    await logStudy({ added: 1 })
    await load()
  }

  function toggleRoot(key: string) {
    setOpenRoot((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleUnit(key: string) {
    setOpenUnit((s) => {
      const next = new Set(s)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const builtin = useMemo(
    () => words.filter((w) => w.source === 'builtin'),
    [words]
  )
  const manual = useMemo(
    () => words.filter((w) => w.source === 'manual'),
    [words]
  )
  const textbookWords = useMemo(
    () => units.flatMap((u) => u.words),
    [units]
  )
  const textbookCount = textbookWords.length
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return words.filter(
      (w) => w.spanish.toLowerCase().includes(q) || w.definition_cn.includes(q)
    )
  }, [words, search])

  const renderWordRow = (w: PoolWord, selectMode: boolean) => (
    <WordRow
      key={w.id}
      w={w}
      added={added.has(w.id)}
      onAdd={() => addWord(w.id)}
      selectMode={selectMode}
      checked={selected.has(w.id)}
      onToggleSelect={() => toggleSelect(w.id)}
    />
  )

  const renderActionBar = (folderList: PoolWord[]) => (
    <div className="border-b-2 border-bauhaus-line bg-bauhaus-paper px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-black">已选 {selected.size} 个</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSortMode('dict')}
            className={`rounded-sm border-2 px-2 py-1 text-xs font-black ${
              sortMode === 'dict'
                ? 'border-bauhaus-black bg-bauhaus-black text-white'
                : 'border-bauhaus-line bg-white text-bauhaus-muted'
            }`}
          >
            字典序选择
          </button>
          <button
            type="button"
            onClick={() => setSortMode('random')}
            className={`rounded-sm border-2 px-2 py-1 text-xs font-black ${
              sortMode === 'random'
                ? 'border-bauhaus-black bg-bauhaus-black text-white'
                : 'border-bauhaus-line bg-white text-bauhaus-muted'
            }`}
          >
            随机序选择
          </button>
        </div>
        <Button size="sm" onClick={bulkAdd} disabled={selected.size === 0}>
          加入背诵
        </Button>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="text-xs font-bold text-bauhaus-muted">
          当日学习量：
        </span>
        {[10, 20, 30].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => quickSelect(n, folderList)}
            className="rounded-sm border-2 border-bauhaus-line px-2 py-0.5 text-xs font-black hover:border-bauhaus-black"
          >
            选{n}词
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      {/* 添加单词 */}
      <Button variant="secondary" className="w-full" onClick={() => setAdding(true)}>
        ＋ 添加单词
      </Button>

      {/* 添加单词表单 */}
      {adding && (
        <Card className="p-5">
          <form onSubmit={addCustomWord} className="flex flex-col gap-3">
            <h2 className="font-black">添加单词</h2>
            <input
              required
              value={nSpanish}
              onChange={(e) => setNSpanish(e.target.value)}
              placeholder="西班牙语（如：perro）"
              className="h-11 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-3 outline-none focus:bg-white"
            />
            <input
              required
              value={nDefinition}
              onChange={(e) => setNDefinition(e.target.value)}
              placeholder="中文释义（如：狗）"
              className="h-11 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-3 outline-none focus:bg-white"
            />
            <div className="flex gap-3">
              <select
                value={nPos}
                onChange={(e) => setNPos(e.target.value as PartOfSpeech)}
                className="h-11 flex-1 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-2 outline-none"
              >
                {POS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={nLevel}
                onChange={(e) => setNLevel(e.target.value as Level)}
                className="h-11 flex-1 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-2 outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            {nPos === 'noun' && (
              <select
                value={nGender}
                onChange={(e) => setNGender(e.target.value as 'm' | 'f' | '')}
                className="h-11 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-2 outline-none"
              >
                <option value="">阴阳性（不确定可不选）</option>
                <option value="m">阳性（el）</option>
                <option value="f">阴性（la）</option>
              </select>
            )}
            {addError && (
              <p className="text-sm font-bold text-bauhaus-red">{addError}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdding(false)}
              >
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </Card>
      )}

      {/* 搜索 */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索单词或释义…"
        className="h-11 w-full rounded-sm border-2 border-bauhaus-black bg-white px-3 outline-none focus:bg-bauhaus-paper"
      />

      {/* 搜索结果（平铺，不参与多选） */}
      {search.trim() !== '' && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-bauhaus-muted">
            找到 {filtered.length} 个结果
          </div>
          <Card className="overflow-hidden shadow-none">
            <div className="divide-y-2 divide-bauhaus-line">
              {filtered.map((w) => renderWordRow(w, false))}
            </div>
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-bauhaus-muted">
                没有匹配的结果
              </p>
            )}
          </Card>
        </div>
      )}

      {/* 文件夹树 */}
      {search.trim() === '' && !loading && (
        <div className="flex flex-col gap-3">
          <Folder
            title="内置词库"
            count={builtin.length}
            open={openRoot.has('builtin')}
            onToggle={() => toggleRoot('builtin')}
            selecting={selectFolder === 'builtin'}
            onToggleSelect={() => toggleSelectFolder('builtin')}
            actionBar={renderActionBar(builtin)}
          >
            <div className="divide-y-2 divide-bauhaus-line">
              {builtin.map((w) => renderWordRow(w, selectFolder === 'builtin'))}
            </div>
          </Folder>

          <Folder
            title="教材 · 现代西班牙语（第一册）"
            count={textbookCount}
            open={openRoot.has('textbook')}
            onToggle={() => toggleRoot('textbook')}
            selecting={selectFolder === 'textbook'}
            onToggleSelect={() => toggleSelectFolder('textbook')}
            actionBar={renderActionBar(textbookWords)}
          >
            <div className="divide-y-2 divide-bauhaus-line">
              {units.map((u) => (
                <div key={u.unit}>
                  <button
                    type="button"
                    onClick={() => toggleUnit(u.unit)}
                    className="flex w-full items-center justify-between bg-bauhaus-paper px-4 py-2 text-left"
                  >
                    <span className="text-sm font-bold">{u.unit}</span>
                    <span className="text-xs font-bold text-bauhaus-muted">
                      {u.words.length} 词 {openUnit.has(u.unit) ? '▲' : '▼'}
                    </span>
                  </button>
                  {openUnit.has(u.unit) && (
                    <div className="divide-y-2 divide-bauhaus-line">
                      {u.words.map((w) =>
                        renderWordRow(w, selectFolder === 'textbook')
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Folder>

          <Folder
            title="手动添加"
            count={manual.length}
            open={openRoot.has('manual')}
            onToggle={() => toggleRoot('manual')}
            selecting={selectFolder === 'manual'}
            onToggleSelect={() => toggleSelectFolder('manual')}
            actionBar={renderActionBar(manual)}
          >
            <div className="divide-y-2 divide-bauhaus-line">
              {manual.map((w) => renderWordRow(w, selectFolder === 'manual'))}
            </div>
          </Folder>
        </div>
      )}
    </div>
  )
}

function WordRow({
  w,
  added,
  onAdd,
  selectMode,
  checked,
  onToggleSelect,
}: {
  w: PoolWord
  added: boolean
  onAdd: () => void
  selectMode: boolean
  checked: boolean
  onToggleSelect: () => void
}) {
  const selectable = selectMode && !added
  return (
    <div
      onClick={selectable ? onToggleSelect : undefined}
      className={`flex items-center justify-between gap-2 border-b-2 border-bauhaus-line px-3 py-2 last:border-b-0 ${
        selectable ? 'cursor-pointer' : ''
      } ${checked && selectable ? 'bg-bauhaus-yellow/30' : ''}`}
    >
      {selectMode &&
        (added ? (
          <span className="shrink-0 rounded-sm bg-bauhaus-blue px-1.5 py-0.5 text-[10px] font-black text-white">
            已加入
          </span>
        ) : (
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-bauhaus-black text-xs font-black ${
              checked ? 'bg-bauhaus-blue text-white' : 'bg-white'
            }`}
          >
            {checked && '✓'}
          </span>
        ))}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold">{w.spanish}</span>
          {w.gender && (
            <span
              className={`text-xs font-black ${
                w.gender === 'm' ? 'text-bauhaus-blue' : 'text-bauhaus-red'
              }`}
            >
              {w.gender === 'm' ? 'm.' : 'f.'}
            </span>
          )}
          <SpeakButton text={w.spanish} size={14} />
        </div>
        <div className="truncate text-xs text-bauhaus-muted">
          {w.definition_cn}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <LevelBadge level={w.level} />
        {!selectMode &&
          (added ? (
            <span className="text-xs font-bold text-bauhaus-blue">已加入</span>
          ) : (
            <Button size="sm" variant="outline" onClick={onAdd}>
              加入
            </Button>
          ))}
      </div>
    </div>
  )
}
