import { api } from '@/config/axios'

export function useAddPassengerApi() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, id, resource, data = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({ method, url: `/travels/${id}/${resource}`, data })
      return response.data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    addPassenger: (id, data) => request('post', id, 'patients', data),
    updateCompanion: (id, data) => request('put', id, 'companions', data),
    movePassenger: (id, data) => request('post', id, 'move-patients', data),
    destroy: (id, data) => request('delete', id, 'patients', data),
    loading,
    error,
  }
}
