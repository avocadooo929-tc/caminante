import { createClient } from './supabase/client'
import type { Word } from './types'
import { buildWordMap } from './words-data'

/**
 * 拉取数据库里的手动词（source='manual'，id 已经是 slug）。
 * Supabase 单次最多 1000 行，所以分页拉全量。
 */
export async function loadManualWords(): Promise<Word[]> {
  const supabase = createClient()
  const all: Word[] = []
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data } = await supabase
      .from('words')
      .select('id, spanish, pos, definition_cn, level, frequency_rank, source, gender')
      .eq('source', 'manual')
      .range(from, from + PAGE - 1)
    const rows = (data ?? []) as unknown as Word[]
    all.push(...rows)
    if (rows.length < PAGE) break
  }
  return all
}

/** 静态词 + 手动词 合并后的查词表（按 slug） */
export async function loadWordMap(): Promise<Map<string, Word>> {
  return buildWordMap(await loadManualWords())
}
