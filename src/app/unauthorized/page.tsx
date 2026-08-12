import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-600">
            You are currently logged in, but your account does not have Administrator privileges.
          </p>
          <p className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            The email you logged in with does not match the configured ADMIN_EMAIL.
          </p>
        </div>
        <div className="flex flex-col space-y-3 mt-8">
          <Link 
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
          >
            Return to Store
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Sign out and try another account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
