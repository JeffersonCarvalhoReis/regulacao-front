import { useDirectApi } from "@/composables/api/useDirectApi";
import { useApiModule } from "../api/useApiModule";
import { useAttachmentApi } from "../api/useAttachmentApi";

export function useSolicitationApi() {
  const { createWithAttachment, updateWithAttachment } =
    useAttachmentApi("solicitations");

  const { patch: classifySolicitation } = useDirectApi("solicitations");

  const classify = async (solicitation, value = {}) => {
    return classifySolicitation(`${solicitation.id}/classify`, value);
  };

  const solicitionApiModule = useApiModule("solicitations");

  return {
    ...solicitionApiModule,
    createWithAttachment,
    updateWithAttachment,
    classify,
  };
}
