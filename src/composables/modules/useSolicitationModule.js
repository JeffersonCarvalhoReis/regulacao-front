import { useApiModule } from '../api/useApiModule';
import { useAttachmentApi } from '../api/useAttachmentApi';


export function useSolicitationApi () {
   const {
      createWithAttachment,
      updateWithAttachment
     } = useAttachmentApi('solicitations');

     const userApiModule = useApiModule('solicitations');

   return {
      ...userApiModule,
      createWithAttachment,
      updateWithAttachment
   }
}
