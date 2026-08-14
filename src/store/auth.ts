import { create } from 'zustand'

interface AuthStore {
  isAuthModalOpen: boolean;
  redirectTo: string;
  authMessage: string;
  authSubmessage: string;
  openAuthModal: (redirectTo?: string, message?: string, submessage?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthModalOpen: false,
  redirectTo: '/',
  authMessage: 'Sign in to continue',
  authSubmessage: 'Create an account or sign in with Google to manage your orders and account.',
  openAuthModal: (redirectTo, message, submessage) => set({ 
    isAuthModalOpen: true, 
    redirectTo: redirectTo || '/',
    authMessage: message || 'Sign in to continue',
    authSubmessage: submessage || 'Create an account or sign in with Google to manage your orders and account.'
  }),
  closeAuthModal: () => set({ isAuthModalOpen: false, redirectTo: '/' }),
}))
