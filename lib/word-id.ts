/**
 * 稳定词 ID（slug）规则，与 SQL 迁移、生成脚本保持一致。
 * 规则：spanish 小写 → 保留字母/数字与西语重音字母（á é í ó ú ü ñ），
 * 其余字符替换为 `-` → 去掉首尾 `-` → 拼接 `-pos`。
 *
 * 例：casa|noun → `casa-noun`；por qué|adverb → `por-qu-adverb`；allí|adverb → `allí-adverb`。
 * 保留重音是为了避免 allí/allá、aún/aun 这类词碰撞（去掉重音会撞成同一个 ID）。
 * SQL 等价写法：
 *   btrim(regexp_replace(lower(spanish), '[^a-z0-9áéíóúüñ]+', '-', 'g'), '-') || '-' || pos
 */
export function wordId(spanish: string, pos: string): string {
  const base = spanish
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúüñ]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${pos}`
}
