// 陈述式一般现在时的动词变位（规则变位自动生成，不规则动词查表）

const IRREGULAR_PRESENT: Record<string, string[]> = {
  // 完全不规则
  ser: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
  estar: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
  ir: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
  haber: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
  dar: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
  ver: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
  saber: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben'],
  caber: ['quepo', 'cabes', 'cabe', 'cabemos', 'cabéis', 'caben'],
  // 第一人称不规则（-zco/-go 等）
  hacer: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
  salir: ['salgo', 'sales', 'sale', 'salimos', 'salís', 'salen'],
  poner: ['pongo', 'pones', 'pone', 'ponemos', 'ponéis', 'ponen'],
  traer: ['traigo', 'traes', 'trae', 'traemos', 'traéis', 'traen'],
  caer: ['caigo', 'caes', 'cae', 'caemos', 'caéis', 'caen'],
  oír: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'],
  valer: ['valgo', 'vales', 'vale', 'valemos', 'valéis', 'valen'],
  conocer: ['conozco', 'conoces', 'conoce', 'conocemos', 'conocéis', 'conocen'],
  ofrecer: ['ofrezco', 'ofreces', 'ofrece', 'ofrecemos', 'ofrecéis', 'ofrecen'],
  parecer: ['parezco', 'pareces', 'parece', 'parecemos', 'parecéis', 'parecen'],
  crecer: ['crezco', 'creces', 'crece', 'crecemos', 'crecéis', 'crecen'],
  nacer: ['nazco', 'naces', 'nace', 'nacemos', 'nacéis', 'nacen'],
  agradecer: ['agradezco', 'agradeces', 'agradece', 'agradecemos', 'agradecéis', 'agradecen'],
  conducir: ['conduzco', 'conduces', 'conduce', 'conducimos', 'conducís', 'conducen'],
  producir: ['produzco', 'produces', 'produce', 'producimos', 'producís', 'producen'],
  traducir: ['traduzco', 'traduces', 'traduce', 'traducimos', 'traducís', 'traducen'],
  // e→ie
  pensar: ['pienso', 'piensas', 'piensa', 'pensamos', 'pensáis', 'piensan'],
  empezar: ['empiezo', 'empiezas', 'empieza', 'empezamos', 'empezáis', 'empiezan'],
  entender: ['entiendo', 'entiendes', 'entiende', 'entendemos', 'entendéis', 'entienden'],
  preferir: ['prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren'],
  perder: ['pierdo', 'pierdes', 'pierde', 'perdemos', 'perdéis', 'pierden'],
  sentir: ['siento', 'sientes', 'siente', 'sentimos', 'sentís', 'sienten'],
  cerrar: ['cierro', 'cierras', 'cierra', 'cerramos', 'cerráis', 'cierran'],
  comenzar: ['comienzo', 'comienzas', 'comienza', 'comenzamos', 'comenzáis', 'comienzan'],
  despertar: ['despierto', 'despiertas', 'despierta', 'despertamos', 'despertáis', 'despiertan'],
  encender: ['enciendo', 'enciendes', 'enciende', 'encendemos', 'encendéis', 'encienden'],
  mentir: ['miento', 'mientes', 'miente', 'mentimos', 'mentís', 'mienten'],
  negar: ['niego', 'niegas', 'niega', 'negamos', 'negáis', 'niegan'],
  recomendar: ['recomiendo', 'recomiendas', 'recomienda', 'recomendamos', 'recomendáis', 'recomiendan'],
  sugerir: ['sugiero', 'sugieres', 'sugiere', 'sugerimos', 'sugerís', 'sugieren'],
  advertir: ['advierto', 'adviertes', 'advierte', 'advertimos', 'advertís', 'advierten'],
  divertir: ['divierto', 'diviertes', 'divierte', 'divertimos', 'divertís', 'divierten'],
  hervir: ['hiervo', 'hierves', 'hierve', 'hervimos', 'hervís', 'hierven'],
  convertir: ['convierto', 'conviertes', 'convierte', 'convertimos', 'convertís', 'convierten'],
  arrepentir: ['arrepiento', 'arrepientes', 'arrepiente', 'arrepentimos', 'arrepentís', 'arrepienten'],
  consentir: ['consiento', 'consientes', 'consiente', 'consentimos', 'consentís', 'consienten'],
  // o→ue
  poder: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
  contar: ['cuento', 'cuentas', 'cuenta', 'contamos', 'contáis', 'cuentan'],
  dormir: ['duermo', 'duermes', 'duerme', 'dormimos', 'dormís', 'duermen'],
  volver: ['vuelvo', 'vuelves', 'vuelve', 'volvemos', 'volvéis', 'vuelven'],
  encontrar: ['encuentro', 'encuentras', 'encuentra', 'encontramos', 'encontráis', 'encuentran'],
  recordar: ['recuerdo', 'recuerdas', 'recuerda', 'recordamos', 'recordáis', 'recuerdan'],
  soñar: ['sueño', 'sueñas', 'sueña', 'soñamos', 'soñáis', 'sueñan'],
  costar: ['cuesto', 'cuestas', 'cuesta', 'costamos', 'costáis', 'cuestan'],
  morir: ['muero', 'mueres', 'muere', 'morimos', 'morís', 'mueren'],
  jugar: ['juego', 'juegas', 'juega', 'jugamos', 'jugáis', 'juegan'],
  almorzar: ['almuerzo', 'almuerzas', 'almuerza', 'almorzamos', 'almorzáis', 'almuerzan'],
  acostar: ['acuesto', 'acuestas', 'acuesta', 'acostamos', 'acostáis', 'acuestan'],
  doler: ['duelo', 'dueles', 'duele', 'dolemos', 'doléis', 'duelen'],
  mover: ['muevo', 'mueves', 'mueve', 'movemos', 'movéis', 'mueven'],
  mostrar: ['muestro', 'muestras', 'muestra', 'mostramos', 'mostráis', 'muestran'],
  acordar: ['acuerdo', 'acuerdas', 'acuerda', 'acordamos', 'acordáis', 'acuerdan'],
  colgar: ['cuelgo', 'cuelgas', 'cuelga', 'colgamos', 'colgáis', 'cuelgan'],
  sonar: ['sueno', 'suenas', 'suena', 'sonamos', 'sonáis', 'suenan'],
  aprobar: ['apruebo', 'apruebas', 'aprueba', 'aprobamos', 'aprobáis', 'aprueban'],
  soler: ['suelo', 'sueles', 'suele', 'solemos', 'soléis', 'suelen'],
  morder: ['muerdo', 'muerdes', 'muerde', 'mordemos', 'mordéis', 'muerden'],
  rogar: ['ruego', 'ruegas', 'ruega', 'rogamos', 'rogáis', 'ruegan'],
  // e→i
  pedir: ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'],
  servir: ['sirvo', 'sirves', 'sirve', 'servimos', 'servís', 'sirven'],
  repetir: ['repito', 'repites', 'repite', 'repetimos', 'repetís', 'repiten'],
  seguir: ['sigo', 'sigues', 'sigue', 'seguimos', 'seguís', 'siguen'],
  vestir: ['visto', 'vistes', 'viste', 'vestimos', 'vestís', 'visten'],
  reír: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'],
  elegir: ['elijo', 'eliges', 'elige', 'elegimos', 'elegís', 'eligen'],
  despedir: ['despido', 'despides', 'despide', 'despedimos', 'despedís', 'despiden'],
  conseguir: ['consigo', 'consigues', 'consigue', 'conseguimos', 'conseguís', 'consiguen'],
  competir: ['compito', 'compites', 'compite', 'competimos', 'competís', 'compiten'],
  corregir: ['corrijo', 'corriges', 'corrige', 'corregimos', 'corregís', 'corrigen'],
  impedir: ['impido', 'impides', 'impide', 'impedimos', 'impedís', 'impiden'],
  medir: ['mido', 'mides', 'mide', 'medimos', 'medís', 'miden'],
  sonreír: ['sonrío', 'sonríes', 'sonríe', 'sonreímos', 'sonreís', 'sonríen'],
  freír: ['frío', 'fríes', 'fríe', 'freímos', 'freís', 'fríen'],
  gemir: ['gimo', 'gimes', 'gime', 'gemimos', 'gemís', 'gimen'],
  rendir: ['rindo', 'rindes', 'rinde', 'rendimos', 'rendís', 'rinden'],
  perseguir: ['persigo', 'persigues', 'persigue', 'perseguimos', 'perseguís', 'persiguen'],
  // 混合不规则
  tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
  venir: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
  decir: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
  querer: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
  construir: ['construyo', 'construyes', 'construye', 'construimos', 'construís', 'construyen'],
}

// 代词式动词（-se 结尾，如 levantarse/llamarse）：变位时去掉 -se 再变位词干
export function isPronominalVerb(verb: string): boolean {
  return verb.endsWith('se') && verb.length > 2
}

function baseVerb(verb: string): string {
  return isPronominalVerb(verb) ? verb.slice(0, -2) : verb
}

// 常见「前缀 + 完全不规则动词」的复合词：mantener/tener、convenir/venir、componer/poner 等。
// 只列「变位可直接加前缀」的安全词干（按长度从长到短匹配，避免误匹配短词干）。
const PREFIXABLE_BASES = [
  'agradecer',
  'conocer',
  'parecer',
  'ofrecer',
  'traducir',
  'producir',
  'conducir',
  'crecer',
  'nacer',
  'tener',
  'venir',
  'poner',
  'hacer',
  'decir',
  'traer',
  'caer',
  'valer',
  'salir',
].sort((a, b) => b.length - a.length)

/** 复合不规则动词：若以某个不规则词干结尾，则前缀 + 该词干的不规则变位 */
function resolvePrefixedIrregular(verb: string): string[] | null {
  for (const base of PREFIXABLE_BASES) {
    if (verb.length > base.length && verb.endsWith(base)) {
      const prefix = verb.slice(0, verb.length - base.length)
      return IRREGULAR_PRESENT[base].map((form) => prefix + form)
    }
  }
  return null
}

export const PRONOUNS = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos']

function regularConjugation(verb: string): string[] | null {
  if (verb.endsWith('ar')) {
    const stem = verb.slice(0, -2)
    return [stem + 'o', stem + 'as', stem + 'a', stem + 'amos', stem + 'áis', stem + 'an']
  }
  if (verb.endsWith('er')) {
    const stem = verb.slice(0, -2)
    return [stem + 'o', stem + 'es', stem + 'e', stem + 'emos', stem + 'éis', stem + 'en']
  }
  if (verb.endsWith('ir')) {
    const stem = verb.slice(0, -2)
    return [stem + 'o', stem + 'es', stem + 'e', stem + 'imos', stem + 'ís', stem + 'en']
  }
  return null
}

/** 返回陈述式一般现在时的六个人称形式，无法变位时返回 null */
export function getPresentConjugation(verb: string): string[] | null {
  const base = baseVerb(verb)
  if (IRREGULAR_PRESENT[base]) return IRREGULAR_PRESENT[base]
  const prefixed = resolvePrefixedIrregular(base)
  if (prefixed) return prefixed
  return regularConjugation(base)
}

/** 判断某动词是否属于不规则动词表（含复合词、代词式动词） */
export function isIrregularVerb(verb: string): boolean {
  const base = baseVerb(verb)
  return base in IRREGULAR_PRESENT || resolvePrefixedIrregular(base) !== null
}

/** 逐个人称判断是否不规则（与规则变位对比），返回六个布尔值 */
export function getIrregularMask(verb: string): boolean[] | null {
  const base = baseVerb(verb)
  const forms = getPresentConjugation(verb)
  const regular = regularConjugation(base)
  if (!forms || !regular) return null
  return forms.map((f, i) => f !== regular[i])
}
