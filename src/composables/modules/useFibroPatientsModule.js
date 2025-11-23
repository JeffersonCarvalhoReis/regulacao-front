import { useApiModule } from "../api/useApiModule";
import { useAttachmentApi } from "../api/useAttachmentApi";

export function useFibroPatientsApi() {
  const { createWithAttachment, updateWithAttachment } =
    useAttachmentApi("fibro-patients");

  const userApiModule = useApiModule("fibro-patients");

  return {
    ...userApiModule,
    createWithAttachment,
    updateWithAttachment,
  };
}
