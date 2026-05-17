import { create } from 'zustand'
import { ChildProfile } from '@/types/child'

interface User {
  uid:                string
  email:              string
  displayName:        string | undefined
  activeCharacter:    string
  onboardingComplete: boolean
  adventureLevel:     'cautious' | 'curious' | 'adventurous'
  homeCuisine:        string
  notificationsEnabled: boolean
}

interface AuthState {
  user:        User | null
  children:    ChildProfile[]
  activeChild: ChildProfile | null
  isLoading:   boolean

  setUser:        (user: User | null) => void
  setChildren:    (children: ChildProfile[]) => void
  setActiveChild: (child: ChildProfile | null) => void
  setLoading:     (loading: boolean) => void
  reset:          () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:        null,
  children:    [],
  activeChild: null,
  isLoading:   true,

  setUser:        (user) => set({ user }),
  setChildren:    (children) => set({ children }),
  setActiveChild: (child) => set({ activeChild: child }),
  setLoading:     (isLoading) => set({ isLoading }),
  reset:          () => set({ user: null, children: [], activeChild: null, isLoading: false }),
}))
