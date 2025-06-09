import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoGestao from '@/assets/images/logo-gestao.png';
import logoSecretaria from '@/assets/images/logo-saude.png'


export function useExportToPdf() {

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const  clickPrint = ref(false);

const toBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};

const exportToPDF = async (columnsRef, travelInfo, fileInfo) => {
    clickPrint.value = true
    const doc = new jsPDF({
    orientation: fileInfo.orientation, // aqui define o modo paisagem
    unit: 'mm',               // unidade de medida
    format: 'a4'              // tamanho da página
  });

  const imgBase64Prefeitura = await toBase64(logoGestao);
  const imgBase64Secretaria = await toBase64(logoSecretaria);

   // Adicionar brasão no topo esquerdo
  doc.addImage(imgBase64Prefeitura as string, 'PNG', 15, 10, 45, 15);
  doc.addImage(imgBase64Secretaria as string, 'PNG', fileInfo.orientation == 'landscape' ? 240 : 155, 10, 40, 15);

  // Cabeçalho do PDF
  doc.setFontSize(12);
  doc.text(`Viagem para ${capitalizeFirstLetter(travelInfo.city)}`, fileInfo.docX, 10, { align: 'center' });
  doc.text(capitalizeFirstLetter(travelInfo.date) , fileInfo.docX, 17, { align: 'center' });
  doc.text(travelInfo.title, fileInfo.docX, 24, { align: 'center' });

  // Definir colunas
  const columns = columnsRef;

  // Pegando os dados da tabela manualmente
  const rows: string[][] = [];
  const tableRows = document.querySelectorAll('.table-row');
  tableRows.forEach((row) => {
    const cells = row.querySelectorAll('.table-cell');
    const rowData: string[] = [];
    cells.forEach((cell) => {
      rowData.push(cell.textContent?.trim() || '');
    });
    rows.push(rowData);
  });

  // Gerando tabela no PDF
  const table = autoTable(doc, {
    startY: 30,
    head: [columns],
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineWidth: 0.1, // garante linhas visíveis
      lineColor: [0, 0, 0] // preto
    },
    headStyles: {
      fillColor: [18, 97, 189],
      textColor: [255, 255, 255],
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
  });

  const finalY =  doc.lastAutoTable?.finalY ;

  const pageWidth = doc.internal.pageSize.getWidth();
  const lineWidth = 100; // largura da linha da assinatura
  const centerX = pageWidth / 2;
  const lineStartX = centerX - lineWidth / 2;
  const lineEndX = centerX + lineWidth / 2;
  const lineY = finalY + 30; // posição vertical da linha
  const textY = lineY + 5;   // texto logo abaixo da linha

  // Linha de assinatura
  doc.line(lineStartX, lineY, lineEndX, lineY);

  // Texto abaixo da linha
  doc.setFontSize(10);
  doc.text(`${travelInfo.signature}`, centerX, textY, { align: 'center' });
  if(travelInfo.signatureSubtitle) doc.text(`${travelInfo.signatureSubtitle}`, centerX, textY + 5, { align: 'center' });


  // Salvar o PDF
  doc.save(`${fileInfo.fileName}.pdf`);

  setTimeout(() => {
    clickPrint.value = false
  }, 3000)
};
  return {
    exportToPDF,
    clickPrint
  }
}
