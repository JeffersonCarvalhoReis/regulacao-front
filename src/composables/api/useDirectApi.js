import { api } from "@/config/axios";
import { ref } from "vue";

export function useDirectApi(resource) {
  const loading = ref(false);
  const error = ref(null);

  const request = async (method, url, data = null) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api({ method, url, data });
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    get: () => request("get", `${resource}`),
    create: (data) => request("post", resource, data),
    update: (data) => request("put", `${resource}`, data),
    patch: (id, data) => request("patch", `${resource}/${id}`, data),
    destroy: (val) => request("delete", `${resource}/${val.id}`),
    loading,
    error,
  };
}
