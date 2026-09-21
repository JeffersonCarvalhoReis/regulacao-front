import { ref } from 'vue'
import { api } from '@/config/axios'

export function useRepressedDemandApi () {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Gera e baixa a planilha de Demanda Reprimida: solicitações ainda sem
   * agendamento, filtradas por um ou mais procedimentos (exames) ou por
   * uma ou mais especialidades (consultas).
   * @param {'procedure'|'specialist'} type
   * @param {Array<number>} ids
   */
  const exportRepressedDemand = async (type, ids = []) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/solicitations-repressed-demand-export', {
        params: { type, ids },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'demanda_reprimida.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    exportRepressedDemand,
    loading,
    error,
  }
}
