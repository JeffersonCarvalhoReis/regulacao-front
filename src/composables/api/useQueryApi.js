import { ref } from 'vue'
import { api } from '@/config/axios'
import { useQueryFilters } from './useQueryFilters'

export function useQueryApi (resource) {

  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const meta = ref([])
  const {
    params, page, perPage, filters, sort, include,
    setFilter, setSort, clearFilters, reset, setTableOptions, setInclude
  } = useQueryFilters()

  const fetch = async () => {

    loading.value = true
    error.value = null

    try {
      await nextTick();
      const response = await api.get(resource, { params: params.value })
      data.value = response.data.data,
      meta.value = response.data.meta
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    data, meta, loading, error, refetch: fetch,

    // controles
    params, page, perPage, filters, sort, include,

    // métodos
    setFilter, setSort, clearFilters, reset, setTableOptions, setInclude
  }
}
