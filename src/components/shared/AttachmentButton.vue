<template>
  <v-btn
    v-if="attachment"
    color="success"
    prepend-icon="mdi-paperclip"
    @click="openAttachment = true"
  >
    Anexo
    <v-tooltip activator="parent">
      {{ attachmentText }}
    </v-tooltip>
  </v-btn>

  <v-btn v-else color="error" prepend-icon="mdi-paperclip-off">
    Anexo
    <v-tooltip activator="parent">
      {{ attachmentText }}
    </v-tooltip>
  </v-btn>
  <v-dialog v-model="openAttachment">
    <BaseCard title="Anexo" @close="openAttachment = false">
      <v-card-text class="flex justify-center items-end h-full">
        <iframe
          v-if="isPDF(attachment)"
          ref="attachmentRef"
          class="rounded-lg border"
          height="500px"
          :src="attachment"
          width="100%"
        />
        <img
          v-else-if="isImage(attachment)"
          ref="attachmentRef"
          class="rounded-lg border"
          :src="attachment"
          style="
            max-width: 100%;
            max-height: 800px;
            display: block;
            margin: auto;
          "
        />
      </v-card-text>

      <v-card-actions class="sticky bottom-0 bg-white z-10">
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-download"
          @click="handleDownloadFile"
        >
          Baixar
          <v-tooltip activator="parent">Baixar</v-tooltip>
        </v-btn>
        <v-btn
          color="success"
          variant="elevated"
          prepend-icon="mdi-printer"
          @click="handlePrint"
        >
          Imprimir
          <v-tooltip activator="parent">Imprimir</v-tooltip>
        </v-btn>
      </v-card-actions>
    </BaseCard>
  </v-dialog>
</template>

<script setup>
import { useDownloadFile } from "@/composables/utils/useDownloadFile";
import { usePrintIframe } from "@/composables/utils/usePrintIframe";

const props = defineProps({ attachment: { type: String, required: true } });

const openAttachment = ref(false);
const attachmentRef = ref(null);
const attachmentText = computed(() =>
  props.attachment
    ? "Clique para ver o arquivo anexado"
    : "Não há arquivo anexado",
);

const { printContent } = usePrintIframe();
const { downloadFile } = useDownloadFile();

const handlePrint = () => {
  console.log(attachmentRef);
  console.log(attachmentRef.value);
  console.log(attachmentRef.value?.contentWindow);
  printContent(attachmentRef);
};

const handleDownloadFile = () => {
  downloadFile(props.attachment);
};

const isPDF = (url) => {
  return url?.toLowerCase().endsWith(".pdf");
};

const isImage = (url) => {
  return /\.(jpe?g|png|gif|bmp|webp)$/i.test(url || "");
};
</script>
