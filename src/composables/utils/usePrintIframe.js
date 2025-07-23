export function usePrintIframe () {

  const adjustIframeContent = attachmentRef => {
    const iframe = attachmentRef.value;
    if (iframe && iframe.contentWindow) {
      const iframeDocument = iframe.contentWindow.document;
      const style = iframeDocument.createElement('style');
      style.innerHTML = `
      @media print {
        @page {
          margin: 0;
        }

        body {
          margin: 0;
          padding: 0;
        }
        header, footer, .header, .footer {
          display: none !important;
        }
        * {
          visibility: visible !important;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    `;
      iframeDocument.head.appendChild(style);

      // Verifique se o iframe carregou conteúdo HTML (como uma imagem ou PDF)
      const content = iframeDocument.body;

      // Aplica um estilo para garantir que a imagem ou conteúdo seja ajustado
      const maxWidth = 1230; // Largura de uma página A4 em pixels
      const maxHeight = 842; // Altura de uma página A4 em pixels

      // Estilo para garantir que o conteúdo não ultrapasse a largura ou altura da página A4
      content.style.maxWidth = `${maxWidth}px`;
      content.style.maxHeight = `${maxHeight}px`;
      content.style.objectFit = 'contain'; // Isso ajusta o conteúdo sem distorcer

      content.style.display = 'flex';
      content.style.justifyContent = 'center'; // Centraliza horizontalmente
      content.style.alignItems = 'center'; // Centraliza verticalmente
      content.style.height = '100%'; // Assegura que o conteúdo ocupa toda a altura do iframe

      const images = iframeDocument.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '90%'; // Garante que a imagem não ultrapasse a largura disponível
        img.style.height = 'auto'; // Mantém a proporção da imagem
      });
    }
  };

  const printContent = attachmentRef => {
    const iframe = attachmentRef.value;
    if (iframe && iframe.contentWindow) {
      const iframeWindow = iframe.contentWindow;
      iframeWindow.focus(); // Necessário para garantir que o conteúdo esteja em foco
      iframeWindow.print(); // Chama o método de impressão da janela do iframe
    }
  };
  return {
    adjustIframeContent,
    printContent,
  }
}
