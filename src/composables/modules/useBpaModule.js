import { api } from "@/config/axios";
import { ref } from "vue";
import { useApiModule } from "../api/useApiModule";

export function useBpaApi() {
  const loading = ref(false);
  const error = ref(null);

  const exportBpa = async (competence) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/bpa/export/${competence}`, {
        responseType: "blob", // essencial para download
      });

      // Criar link para download automático
      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `bpa_${competence}.txt`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const bpaModule = useApiModule("bpas");

  return {
    ...bpaModule,
    exportBpa,
    loading,
    error,
  };
}
