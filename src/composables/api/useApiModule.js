import { useQueryApi } from '@/composables/api/useQueryApi'
import { useCrudApi } from '@/composables/api/useCrudApi'

export function useApiModule (resource) {

  const query = useQueryApi(resource)
  const crud = useCrudApi(resource)

  return {
    data: query.data,
    meta: query.meta,
    loadingList: query.loading,
    params: query.params,
    refetch: query.refetch,
    setFilter: query.setFilter,
    setTableOptions: query.setTableOptions,
    clearFilters: query.clearFilters,
    setInclude: query.setInclude,
    setSort: query.setSort,
    create: crud.create,
    update: crud.update,
    destroy: crud.destroy,
    getById: crud.get,
    loadingCrud: crud.loading,
  }
}
