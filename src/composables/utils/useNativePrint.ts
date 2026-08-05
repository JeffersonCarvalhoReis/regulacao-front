/**
 * Impressão nativa (via window.print) de um elemento do DOM.
 *
 * Diferente do fluxo baseado em html-to-image + jsPDF (useExportToPdf),
 * aqui não há rasterização em canvas/imagem: o próprio navegador
 * paginacom o conteúdo real (texto/DOM), o que é muito mais rápido
 * quando há muitas páginas (ex.: imprimir todos os BPAs de uma viagem).
 *
 * Estratégia:
 * 1. Clona o elemento a ser impresso (para não mexer no DOM "ao vivo"
 *    dentro do diálogo, que tem overflow/scroll do Vuetify).
 * 2. Copia o valor atual dos campos (input/textarea/select), já que
 *    cloneNode não copia propriedades setadas via JS (apenas atributos).
 * 3. Insere o clone num container fixado diretamente no body.
 * 4. Usa CSS global (ver assets/tailwind.css) para, durante a impressão,
 *    esconder todo o resto da página e mostrar somente esse container.
 * 5. Chama window.print() e depois remove o container.
 */
export function useNativePrint() {
  const isPrinting = ref(false);

  function syncFieldValues(source: HTMLElement, target: HTMLElement) {
    const selector = "input, textarea, select";
    const sourceFields = source.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(selector);
    const targetFields = target.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(selector);

    sourceFields.forEach((field, index) => {
      const clonedField = targetFields[index];
      if (!clonedField) return;

      clonedField.value = field.value;

      if (
        field instanceof HTMLSelectElement &&
        clonedField instanceof HTMLSelectElement
      ) {
        clonedField.selectedIndex = field.selectedIndex;
      }
    });
  }

  function printElement(element: HTMLElement | null) {
    if (!element) return;

    isPrinting.value = true;

    const container = document.createElement("div");
    container.id = "native-print-root";

    const clone = element.cloneNode(true) as HTMLElement;
    syncFieldValues(element, clone);
    container.appendChild(clone);
    document.body.appendChild(container);

    document.body.classList.add("printing-native");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;

      document.body.classList.remove("printing-native");
      container.remove();
      isPrinting.value = false;
      window.removeEventListener("afterprint", finish);
    };

    window.addEventListener("afterprint", finish);

    // Aguarda um frame para garantir que o container recém-inserido
    // já foi "pintado" pelo navegador antes de abrir o diálogo de impressão.
    requestAnimationFrame(() => {
      window.print();
      // Fallback: nem todo navegador dispara "afterprint" de forma confiável.
      setTimeout(finish, 1000);
    });
  }

  return {
    printElement,
    isPrinting,
  };
}
