/** 归一化西语答案：小写、去重音、ñ→n、去标点/倒问号感叹号、压缩空格 */
export function normalizeSpanish(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // 去重音 + ñ 的波浪号
    .replace(/[^a-z0-9 ]/g, '') // 去标点等
    .replace(/\s+/g, ' ')
    .trim()
}

/** 语法题判分：忽略重音、ñ、大小写、标点、倒问号感叹号 */
export function gradeGrammar(userAnswer: string, correctAnswer: string): boolean {
  return normalizeSpanish(userAnswer) === normalizeSpanish(correctAnswer)
}
