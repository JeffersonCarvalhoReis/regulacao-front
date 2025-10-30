import { useApiModule } from "../api/useApiModule";
import { useDirectApi } from "../api/useDirectApi";

export function useMedicalReportApi() {
  // direct api para chamadas puntuais (inclui post/get/update/destroy)

  const { patch: closeMedicalReport } = useDirectApi("medical-reports");
  // módulo padronizado (index, list, params, refetch etc)
  const medicalReportsApiModule = useApiModule("medical-reports");

  // ação customizada: fechar laudo
  const closeReport = async (report = {}) => {
    // POST /medical-reports/{id}/close
    return closeMedicalReport(`${report.id}/close`, report);
  };

  return {
    ...medicalReportsApiModule,
    closeReport,
  };
}
