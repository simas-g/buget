import { create } from 'zustand'
import { getFullUser } from '../lib/auth/currentUser'

const useStore = create((set) => ({
  user: null,
  fetchUser: async () => {
    const fullUser = await getFullUser()
    set({ user: fullUser })
  },
}))

export default useStore
