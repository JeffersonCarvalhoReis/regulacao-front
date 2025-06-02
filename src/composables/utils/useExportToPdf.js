import jsPDF from 'jspdf';
import { toPng } from 'html-to-image'

export function useExportToPdf() {
  const  clickPrint = ref(false);

  const exportToPDF = async (printSection) => {
    const element = printSection;
    clickPrint.value = true

    try {
      const img = await elementToPng(element);
      const pdf = newPDF();

      img.onload = () => {
        const page = pageAdjustment(img, pdf);
        const blob = page.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      };
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
    } finally {
    setTimeout(() => {
      clickPrint.value = false
    }, 500)
  }
}

const elementToPng = async (element) => {
  const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
  const img = new Image();
  img.src = dataUrl;
  return img;
}

const newPDF = () => {
 return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  }

const pageAdjustment = (img, pdf) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(img.src);

      const maxWidth = pageWidth - 20; // Margens de 5mm em cada lado
      const maxHeight = pageHeight - 20; // Margens de 5mm em cima e embaixo

      // Tamanho da imagem proporcional à página
      let imgWidth = imgProps.width;
      let imgHeight = imgProps.height;

      // Ajuste de largura e altura para garantir que caiba na página
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;
        const ratio = Math.min(widthRatio, heightRatio); // Garante que a imagem caiba na página

        imgWidth = imgWidth * ratio;
        imgHeight = imgHeight * ratio;
      }

      // Centraliza a imagem
      const x = (pageWidth - imgWidth) / 2;
      const y = 10

      pdf.addImage(img.src, 'PNG', x, y, imgWidth, imgHeight);

      return pdf;
  }

  return {
    exportToPDF,
    clickPrint
  }
}
