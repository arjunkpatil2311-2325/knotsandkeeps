import { LoginForm } from '@/components/LoginForm'

export default async function LoginPage() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">ThreeKnots</h1>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>
      <LoginForm />
    </div>
  )
}
