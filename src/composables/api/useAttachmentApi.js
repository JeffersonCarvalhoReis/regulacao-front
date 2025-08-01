import { ref } from 'vue'
import { api } from '@/config/axios'

export function useAttachmentApi (resource) {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, data = null) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({ method, url, data, headers: {
        'Content-Type': 'multipart/form-data',
      },
      });

      return response.data
    }
    catch (err) { error.value = err
      throw err
    } finally {
      loading.value = false
    }

  }
  return {
    createWithAttachment: data => request('post', resource, data),
    updateWithAttachment: (id, data) => request('post', `${resource}/${id}?_method=PUT`, data),
    loading,
    error,
  }
}
