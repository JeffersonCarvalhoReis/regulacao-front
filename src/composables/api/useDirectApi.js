import { ref } from 'vue'
import { api } from '@/config/axios'

export function useDirectApi(resource) {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, data = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({ method, url: resource, data })
      return response.data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    get: () => request('get'),
    update: (data) => request('put', data),
    destroy: (data) => request('delete', data),
    loading,
    error,
  }
}
