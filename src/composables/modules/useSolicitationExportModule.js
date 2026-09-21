import { ref } from 'vue'
import { api } from '@/config/axios'

export function useSolicitationExportApi () {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Gera e baixa a planilha de solicitações de exame ainda sem agendamento
   * para um ou mais procedimentos selecionados.
   * @param {Array<number>} procedureIds
   */
  const exportSolicitations = async (procedureIds = []) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/solicitations-export', {
        params: { procedure_id: procedureIds },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: response.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'solicitacoes_sem_agendamento.xlsx')
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
    exportSolicitations,
    loading,
    error,
  }
}
