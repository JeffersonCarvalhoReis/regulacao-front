import { useAttachmentApi } from "@/composables/api/useAttachmentApi";
import { useApiModule } from "../api/useApiModule";

export function usePatientApi() {
  const { createWithAttachment, updateWithAttachment } =
    useAttachmentApi("patients");
  const patientApiModule = useApiModule("patients");
  return {
    ...patientApiModule,
    createWithAttachment,
    updateWithAttachment,
  };
}
