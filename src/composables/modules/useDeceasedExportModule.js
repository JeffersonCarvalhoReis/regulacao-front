import { ref } from 'vue'
import { api } from '@/config/axios'
import { useQueryFilters } from '../api/useQueryFilters'

export function useDeceasedExportApi () {
  const loading = ref(false)
  const error = ref(null)

  // usa os mesmos filtros da listagem de falecidos
  const {
    params, setFilter, setSort, clearFilters,
  } = useQueryFilters()

  const exportDeceased = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/deceased-export', {
        params: params.value, // garante compatibilidade com Spatie
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'falecidos.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    exportDeceased,
    loading,
    error,
    setFilter, setSort, clearFilters,
  }
}
