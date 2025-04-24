// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('auth_token') || '',
  }),
  actions: {
    setToken(token: string) {
      this.accessToken = token
      localStorage.setItem('auth_token', token)
    },
    logout() {
      this.accessToken = ''
      localStorage.removeItem('auth_token')
    },
    
  },
})
