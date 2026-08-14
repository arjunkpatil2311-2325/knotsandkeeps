import { LoginForm } from '@/components/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const resolvedParams = await searchParams
  const next = resolvedParams?.next
  const error = resolvedParams?.error

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto pb-16">
      <LoginForm next={next} initialError={error} />
    </div>
  )
}
