import { Suspense } from 'react'
import { LessonDetail } from './lesson-detail'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense
      fallback={<p className="py-10 text-center text-bauhaus-muted">加载中…</p>}
    >
      <LessonDetail id={id} />
    </Suspense>
  )
}
