import { ref } from 'vue'
import { api } from '@/config/axios'

export function useCrudApi (resource) {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, data = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({ method, url, data })
      return response.data }
    catch (err) { error.value = err
      throw err
    } finally {
      loading.value = false
    }

  }
  return {
    create: data => request('post', resource, data),
    update: (id, data) => request('put', `${resource}/${id}`, data),
    destroy: val => request('delete', `${resource}/${val.id}`),
    get: id => request('get', `${resource}/${id}`),
    loading,
    error,
  }
}
