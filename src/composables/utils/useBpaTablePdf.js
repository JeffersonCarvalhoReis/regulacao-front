import { api } from "@/config/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useBpaTablePdf() {
  const isLoading = ref(false);
  const isGenerating = ref(false);

  const GENDER_LABELS = { M: "Masculino", F: "Feminino", O: "Outro" };

  function formatCompetence(value) {
    if (!value || value.length !== 6) return "";
    return `${value.slice(4, 6)}/${value.slice(0, 4)}`;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  }

  function formatGender(gender) {
    if (!gender) return "-";
    return GENDER_LABELS[gender] ?? String(gender).toUpperCase();
  }

  function formatAddress(person) {
    const parts = [];
    const streetLine = [person.street, person.neighborhood]
      .filter(Boolean)
      .join(", ");

    if (streetLine) parts.push(streetLine);

    const cep = import.meta.env.VITE_CEP;
    const ibge = import.meta.env.VITE_IBGE_CODE;

    if (cep) parts.push(`CEP: ${cep}`);
    if (ibge) parts.push(`Mun. (IBGE): ${ibge}`);

    return parts.length ? parts.join(" - ") : "-";
  }

  async function fetchBpaRecords(travelId, attendableType, attendableId) {
    if (!attendableId) return [];

    const { data } = await api.get("bpas", {
      params: {
        "filter[travel_id]": travelId,
        "filter[attendable_type]": attendableType,
        "filter[attendable_id]": attendableId,
      },
    });

    return data?.data ?? [];
  }

  /**
   * Monta um "bloco" de pessoa com todos os dados de identificação
   * disponíveis e a lista de procedimentos realizados no BPA.
   */
  function buildPersonEntry({ person, type, bpa }) {
    const procedures = bpa?.procedures?.length
      ? bpa.procedures.map((proc) => ({
          procedure: proc.procedure?.name?.toUpperCase() ?? "-",
          code: proc.procedure?.code ?? "-",
          date: formatDate(proc.date),
          quantity: proc.quantity ?? "-",
        }))
      : [{ procedure: "-", code: "-", date: "-", quantity: "-" }];

    return {
      type,
      name: person.name?.toUpperCase() ?? "-",
      cns: person?.cns ?? "-",
      gender: formatGender(person.gender),
      birthDate: formatDate(person.birth_date) || "-",
      race: person.race?.toUpperCase() ?? "-",
      address: formatAddress(person),
      phone: person.phone ?? "-",
      procedures,
    };
  }

  function normalizeList(data) {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }

  function isStandaloneCompanion(item) {
    return Boolean(item?.companion_id && !item?.patient_id);
  }
  /**
   * Busca e monta os dados (usado tanto para exibir a tabela em tela
   * quanto para gerar o PDF).
   */
  async function loadReportData(patientOrPatients, travelId) {
    isLoading.value = true;

    try {
      const items = normalizeList(patientOrPatients);

      const people = [];
      let establishment = null;
      let professional = null;
      let competence = "";

      for (const item of items) {
        /*
         * =====================================================
         * ACOMPANHANTE AVULSO
         * =====================================================
         */
        if (isStandaloneCompanion(item)) {
          const [bpa] = await fetchBpaRecords(
            travelId,
            "companion",
            item.companion_id,
          );

          if (bpa) {
            establishment ??= bpa.health_unit;
            professional ??= bpa.professional;
            competence ||= formatCompetence(bpa.competence);
          }

          people.push(
            buildPersonEntry({
              type: "Acompanhante",
              bpa,
              person: {
                cns: item?.companion_cns ?? "",
                name: item?.companion_name ?? "",
                gender: item?.companion_gender ?? "",
                birth_date: item?.companion_birth_date ?? "",
                race: item?.companion_race ?? "",
                street: item?.companion_street ?? "",
                neighborhood: item.companion_neighborhood,
                phone: item.companion_phone,
              },
            }),
          );

          if (item.extra_companions?.length) {
            for (const extra of item.extra_companions) {
              const [extraBpa] = await fetchBpaRecords(
                travelId,
                "companion",
                extra.companion.id,
              );

              people.push(
                buildPersonEntry({
                  type: "Acompanhante",
                  person: extra.companion,
                  bpa: extraBpa,
                }),
              );
            }
          }

          continue;
        }

        /*
         * =====================================================
         * PACIENTE
         * =====================================================
         */
        const [patientBpa] = await fetchBpaRecords(
          travelId,
          "patient",
          item.id,
        );

        if (patientBpa) {
          establishment ??= patientBpa.health_unit;
          professional ??= patientBpa.professional;
          competence ||= formatCompetence(patientBpa.competence);
        }

        people.push(
          buildPersonEntry({
            type: "Paciente",
            person: item,
            bpa: patientBpa,
          }),
        );

        /*
         * =====================================================
         * ACOMPANHANTE PRINCIPAL
         * =====================================================
         */
        if (item.companion?.id) {
          const [companionBpa] = await fetchBpaRecords(
            travelId,
            "companion",
            item.companion.id,
          );

          people.push(
            buildPersonEntry({
              type: "Acompanhante",
              person: item.companion,
              bpa: companionBpa,
            }),
          );
        }

        /*
         * =====================================================
         * ACOMPANHANTES EXTRAS
         * =====================================================
         */
        if (item.extra_companions?.length) {
          for (const extra of item.extra_companions) {
            const [extraBpa] = await fetchBpaRecords(
              travelId,
              "companion",
              extra.companion.id,
            );

            people.push(
              buildPersonEntry({
                type: "Acompanhante",
                person: extra.companion,
                bpa: extraBpa,
              }),
            );
          }
        }
      }

      return {
        people,
        rows: flattenPeople(people),
        establishment,
        professional,
        competence,
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Transforma a lista de blocos de pessoa em linhas "achatadas",
   * prontas para renderizar tanto na tabela HTML (com rowspan) quanto
   * no PDF. Cada linha carrega o índice da pessoa (para zebrar o
   * bloco inteiro), se é a primeira linha do bloco e quantas linhas
   * o bloco ocupa (rowSpan).
   */
  function flattenPeople(people) {
    const rows = [];

    people.forEach((person, personIndex) => {
      person.procedures.forEach((proc, procIndex) => {
        rows.push({
          personIndex,
          isFirstOfPerson: procIndex === 0,
          personRowSpan: person.procedures.length,
          type: person.type,
          name: person.name,
          cns: person?.cns ?? "",
          gender: person.gender,
          birthDate: person.birthDate,
          race: person.race,
          address: person.address,
          phone: person.phone,
          procedure: proc.procedure,
          code: proc.code,
          date: proc.date,
          quantity: proc.quantity,
        });
      });
    });

    return rows;
  }

  const PDF_COLUMNS = [
    { header: "Tipo", key: "type", width: 16 },
    { header: "Nome", key: "name", width: 34 },
    { header: "CNS", key: "cns", width: 26 },
    { header: "Nascimento", key: "birthDate", width: 18 },
    { header: "Sexo", key: "gender", width: 14 },
    { header: "Raça/Cor", key: "race", width: 18 },
    { header: "Endereço", key: "address", width: 46 },
    { header: "Telefone", key: "phone", width: 20 },
    { header: "Procedimento", key: "procedure", width: 29 },
    { header: "Código", key: "code", width: 18 },
    { header: "Data Atend.", key: "date", width: 18 },
    { header: "Qtde.", key: "quantity", width: 12 },
  ];

  const PERSON_KEYS = [
    "type",
    "name",
    "cns",
    "birthDate",
    "gender",
    "race",
    "address",
    "phone",
  ];

  function buildPdfBody(rows) {
    return rows.map((row) => {
      const cells = [];

      PDF_COLUMNS.forEach(({ key }) => {
        if (PERSON_KEYS.includes(key)) {
          if (!row.isFirstOfPerson) return; // célula "absorvida" pelo rowSpan
          cells.push(
            row.personRowSpan > 1
              ? { content: row[key], rowSpan: row.personRowSpan }
              : row[key],
          );
          return;
        }

        cells.push(row[key]);
      });

      return cells;
    });
  }

  /**
   * Gera e abre o PDF a partir de dados já carregados (não busca nada
   * na API de novo).
   */
  function renderPdf(reportData) {
    const { rows, establishment, professional, competence } = reportData;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPeople = new Set(rows.map((row) => row.personIndex)).size;

    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(
      "Relatório de BPA - Boletim de Produção Ambulatorial",
      pageWidth / 2,
      12,
      { align: "center" },
    );

    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.text(
      `Estabelecimento: ${establishment?.name ?? "-"}   |   CNES: ${establishment?.cnes ?? "-"}`,
      14,
      19,
    );
    doc.text(
      `Profissional: ${professional?.name ?? "-"}   |   CNS: ${professional?.cns ?? "-"}   |   CBO: ${professional?.cbo ?? "-"}   |   Mês/Ano: ${competence || "-"}`,
      14,
      24.5,
    );

    doc.setDrawColor(18, 97, 189);
    doc.setLineWidth(0.4);
    doc.line(14, 27.5, pageWidth - 14, 27.5);

    const columnStyles = {};
    PDF_COLUMNS.forEach((col, index) => {
      columnStyles[index] = { cellWidth: col.width };
    });

    autoTable(doc, {
      startY: 31,
      margin: { left: 14, right: 14, bottom: 16 },
      head: [PDF_COLUMNS.map((col) => col.header)],
      body: buildPdfBody(rows),
      styles: {
        fontSize: 7.5,
        cellPadding: 1.6,
        lineWidth: 0.1,
        lineColor: [120, 120, 120],
        valign: "middle",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [18, 97, 189],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: "center",
      },
      columnStyles,
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
      rowPageBreak: "avoid",
      didParseCell(data) {
        // Zebra por bloco de pessoa (não por linha), usando o índice
        // da pessoa embutido na primeira linha de cada bloco.
        if (data.section !== "body") return;

        const row = rows[data.row.index];
        if (row.personIndex % 2 === 1) {
          data.cell.styles.fillColor = [236, 242, 251];
        }
      },
      didDrawPage() {
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        doc.text(
          `Total de pessoas: ${totalPeople}   |   Total de registros: ${rows.length}`,
          14,
          pageHeight - 8,
        );
        doc.text(
          `Página ${currentPage} de ${pageCount}`,
          pageWidth - 14,
          pageHeight - 8,
          { align: "right" },
        );
        doc.setTextColor(0, 0, 0);
      },
    });

    const blobUrl = doc.output("bloburl");
    window.open(blobUrl, "_blank");
  }

  /**
   * Atalho: busca os dados e já abre o PDF em seguida.
   */
  async function generateBpaTablePDF(patientOrPatients, travelId) {
    isGenerating.value = true;

    try {
      const reportData = await loadReportData(patientOrPatients, travelId);
      renderPdf(reportData);
    } finally {
      isGenerating.value = false;
    }
  }

  return {
    loadReportData,
    renderPdf,
    generateBpaTablePDF,
    isLoading,
    isGenerating,
  };
}
