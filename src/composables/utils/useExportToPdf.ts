import logoGestao from "@/assets/images/logo-gestao.png";
import logoSecretaria from "@/assets/images/logo-saude.png";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useExportToPdf() {
  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const clickPrint = ref(false);

  const toBase64 = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const exportToPDF = async (columnsRef, travelInfo, fileInfo) => {
    clickPrint.value = true;
    const doc = new jsPDF({
      orientation: fileInfo.orientation, // aqui define o modo paisagem
      unit: "mm", // unidade de medida
      format: "a4", // tamanho da página
    });

    const imgBase64Prefeitura = await toBase64(logoGestao);
    const imgBase64Secretaria = await toBase64(logoSecretaria);

    // Adicionar brasão no topo esquerdo
    doc.addImage(imgBase64Prefeitura as string, "PNG", 15, 10, 45, 15);
    doc.addImage(
      imgBase64Secretaria as string,
      "PNG",
      fileInfo.orientation == "landscape" ? 240 : 155,
      10,
      40,
      15
    );

    // Cabeçalho do PDF
    doc.setFontSize(12);
    doc.text(
      `Viagem para ${capitalizeFirstLetter(travelInfo.city)}`,
      fileInfo.docX,
      10,
      { align: "center" }
    );
    doc.text(capitalizeFirstLetter(travelInfo.date), fileInfo.docX, 17, {
      align: "center",
    });
    doc.text(travelInfo.title, fileInfo.docX, 24, { align: "center" });

    // Definir colunas
    const columns = columnsRef;

    // Pegando os dados da tabela manualmente
    const rows: string[][] = [];
    const tableRows = document.querySelectorAll(".table-row");
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll(".table-cell");
      const rowData: string[] = [];
      cells.forEach((cell) => {
        rowData.push(cell.textContent?.trim() || "");
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
        lineColor: [0, 0, 0], // preto
      },
      headStyles: {
        fillColor: [18, 97, 189],
        textColor: [255, 255, 255],
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
    });

    const finalY = doc.lastAutoTable?.finalY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const lineWidth = 100; // largura da linha da assinatura
    const centerX = pageWidth / 2;
    const lineStartX = centerX - lineWidth / 2;
    const lineEndX = centerX + lineWidth / 2;
    const lineY = finalY + 5; // posição vertical da linha
    const textY = lineY + 5; // texto logo abaixo da linha

    // Linha de assinatura
    doc.line(lineStartX, lineY, lineEndX, lineY);

    // Texto abaixo da linha
    doc.setFontSize(10);
    doc.text(`${travelInfo.signature}`, centerX, textY, { align: "center" });
    if (travelInfo.signatureSubtitle)
      doc.text(`${travelInfo.signatureSubtitle}`, centerX, textY + 5, {
        align: "center",
      });

    // Salvar o PDF
    doc.save(`${fileInfo.fileName}.pdf`);

    setTimeout(() => {
      clickPrint.value = false;
    }, 3000);
  };

  const exportToImagePDF = async (
    printSection: HTMLElement,
    times: number = 1,
    pages: number = 1,
    topMargin: number = 10,
    extraPageSize: number = 0
  ) => {
    const element = printSection;
    clickPrint.value = true;

    try {
      const img: HTMLImageElement = await elementToPng(element);
      const pdf: jsPDF = newPDF();

      const page = pageAdjustment(
        img,
        pdf,
        times,
        pages,
        printSection,
        [".page-break"],
        topMargin,
        extraPageSize
      );
      const blob = page.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Erro ao exportar para PDF:", error);
    } finally {
      setTimeout(() => {
        clickPrint.value = false;
      }, 500);
    }
  };

  const elementToPng = async (
    element: HTMLElement
  ): Promise<HTMLImageElement> => {
    const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 1 });
    const img = new Image();

    return await new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = dataUrl;
    });
  };

  const newPDF = () => {
    return new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
  };

  const pageAdjustment = (
    img: HTMLImageElement,
    pdf: jsPDF,
    times: number,
    pages: number,
    containerElement: HTMLElement,
    breakSelectors: string[] = [],
    topMargin: number, // mm
    extraPageSize: number
  ) => {
    const imgProps = pdf.getImageProperties(img.src);
    const imgPxW = imgProps.width;
    const imgPxH = imgProps.height;

    const containerRect = containerElement.getBoundingClientRect();
    const containerDomH = containerRect.height || 1;
    const pxPerDomPx = imgPxH / containerDomH; // converte DOM px -> px da imagem

    // converte seletores em offsets na imagem (em px), usando bottom do elemento como ponto de quebra
    const breakOffsetsPx = Array.from(
      new Set(
        breakSelectors
          .map((sel) => {
            const el = containerElement.querySelector(
              sel
            ) as HTMLElement | null;
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const offsetDomPx = r.bottom - containerRect.top; // offset relativo ao topo do container
            return Math.min(
              imgPxH,
              Math.max(0, Math.round(offsetDomPx * pxPerDomPx))
            );
          })
          .filter((v): v is number => typeof v === "number")
      )
    ).sort((a, b) => a - b);

    const pageWmm = pdf.internal.pageSize.getWidth();
    const pageHmm = pdf.internal.pageSize.getHeight();
    const sideMargin = 10; // mm laterais fixos
    const bottomMargin = 10; // mm fixos
    const maxWmm = pageWmm - sideMargin * 2;
    const maxHmm = pageHmm - topMargin - bottomMargin;

    const defaultSliceHpx = Math.ceil(imgPxH / Math.max(1, pages));

    const slices: Array<{
      dataUrl: string;
      hPx: number;
      drawWmm: number;
      drawHmm: number;
    }> = [];
    let yOffsetPxGen = 0;
    for (let i = 0; i < pages && yOffsetPxGen < imgPxH; i++) {
      let hPx = Math.min(defaultSliceHpx, imgPxH - yOffsetPxGen);

      const nextBreak = breakOffsetsPx.find((b) => b > yOffsetPxGen);
      if (typeof nextBreak === "number" && nextBreak <= imgPxH) {
        if (nextBreak > yOffsetPxGen && nextBreak <= yOffsetPxGen + hPx) {
          hPx = nextBreak - yOffsetPxGen;
        }
      }

      if (hPx <= 0) break;

      const scaleMMperPx = Math.min(maxWmm / imgPxW, maxHmm / hPx);
      const drawWmm = imgPxW * scaleMMperPx;
      const drawHmm = hPx * scaleMMperPx;

      const canvas = document.createElement("canvas");
      canvas.width = imgPxW;
      canvas.height = hPx;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, yOffsetPxGen, imgPxW, hPx, 0, 0, imgPxW, hPx);
      const sliceDataUrl = canvas.toDataURL("image/png");

      slices.push({ dataUrl: sliceDataUrl, hPx, drawWmm, drawHmm });

      yOffsetPxGen += hPx;
      canvas.width = 0;
      canvas.height = 0;
    }

    // --- Colocação no PDF ---
    // Caso especial: imagem (a fatia) é menor que metade da altura útil da página e pediram >1 cópia
    const isSingleSlice = slices.length === 1;
    const singleSlice = isSingleSlice ? slices[0] : null;
    const isSmallForPacking =
      singleSlice && singleSlice.drawHmm <= maxHmm / 2 && times > 1;

    if (isSmallForPacking) {
      const drawWmm = singleSlice!.drawWmm;
      const drawHmm = singleSlice!.drawHmm;
      const gapMM = 1.2;
      const copiesPerPage = Math.max(1, Math.floor(maxHmm / drawHmm));
      let placed = 0;
      for (let copy = 0; copy < times; copy++) {
        if (placed % copiesPerPage === 0) {
          if (!(copy === 0)) pdf.addPage();
        }
        const xMM = (pageWmm - drawWmm) / 2;
        const yMM = topMargin + (placed % copiesPerPage) * (drawHmm * gapMM);
        pdf.addImage(singleSlice!.dataUrl, "PNG", xMM, yMM, drawWmm, drawHmm);
        placed++;
      }
      return pdf;
    }

    // Caso geral: reproduz o documento `times` vezes, cada vez com as fatias geradas
    let firstOutput = true;
    for (let t = 0; t < Math.max(1, times); t++) {
      for (let si = 0; si < slices.length; si++) {
        const s = slices[si];
        if (!firstOutput) pdf.addPage();
        const xMM = (pageWmm - s.drawWmm) / 2;
        const yMM = topMargin;
        pdf.addImage(s.dataUrl, "PNG", xMM, yMM, s.drawWmm, s.drawHmm);
        firstOutput = false;
      }
    }

    return pdf;
  };

  return {
    exportToImagePDF,
    exportToPDF,
    clickPrint,
  };
}
