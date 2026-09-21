import { ref } from "vue";

/**
 * Composable simples para copiar textos (CPF, CNS, etc.) para a área de
 * transferência, com um estado reativo que permite dar feedback visual
 * (ex.: trocar o ícone/cor de um botão por alguns instantes).
 */
export function useClipboard(resetDelay = 1500) {
  const copiedKey = ref(null);

  const copy = async (text, key = "default") => {
    if (!text) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para contextos sem Clipboard API (ex.: http sem TLS)
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      copiedKey.value = key;
      setTimeout(() => {
        if (copiedKey.value === key) copiedKey.value = null;
      }, resetDelay);
    } catch (err) {
      console.error("Não foi possível copiar para a área de transferência", err);
    }
  };

  const isCopied = (key = "default") => copiedKey.value === key;

  return {
    copy,
    isCopied,
  };
}
