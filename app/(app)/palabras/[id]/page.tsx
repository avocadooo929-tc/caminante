import { Suspense } from 'react'
import { WordDetail } from './word-detail'

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense
      fallback={<p className="py-10 text-center text-bauhaus-muted">加载中…</p>}
    >
      <WordDetail id={id} />
    </Suspense>
  )
}
