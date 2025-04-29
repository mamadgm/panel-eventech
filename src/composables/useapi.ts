// composables/useApi.ts
import axios from 'axios'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useApi<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string
) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const fetchData = async (payload?: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const response = await axios({
        method,
        url: `http://127.0.0.1:8000${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...(authStore.accessToken && {
            Authorization: `Bearer ${authStore.accessToken}`,
          }),
        },
        ...(method === 'GET' ? { params: payload } : { data: payload }),
      })

      data.value = response.data
    } catch (err: any) {
      data.value = err.response.data // Store the error details (non_field_errors)
      error.value =
        err.response?.data?.message || err.message || 'An unexpected error occurred'
      console.error('API Error:', err)
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetchData }
}
