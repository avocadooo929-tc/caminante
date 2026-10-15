import {
  getIrregularMask,
  getPresentConjugation,
  isIrregularVerb,
  PRONOUNS,
} from '@/lib/conjugations'

/** 展示动词陈述式一般现在时的六个人称变位，不规则的人称单独标红 */
export function VerbConjugation({ verb }: { verb: string }) {
  const forms = getPresentConjugation(verb)
  if (!forms) return null

  const mask = getIrregularMask(verb) ?? forms.map(() => false)
  const hasIrregular = isIrregularVerb(verb)

  return (
    <div>
      {hasIrregular && (
        <span className="mb-1.5 inline-block rounded-sm bg-bauhaus-red px-1.5 py-0.5 text-xs font-black text-white">
          不规则变位
        </span>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        {PRONOUNS.map((p, i) => (
          <div
            key={p}
            className="flex items-center justify-between rounded-sm border-2 border-bauhaus-line bg-bauhaus-paper px-2 py-1"
          >
            <span className="text-xs font-bold text-bauhaus-muted">{p}</span>
            <span className={`text-sm font-bold ${mask[i] ? 'text-bauhaus-red' : ''}`}>
              {forms[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
