import { format, isValid } from "date-fns";
import { toDate } from "date-fns-tz";

export function useWhatsappMessage() {
  /**
   * Normaliza um telefone brasileiro para o formato aceito pelo WhatsApp.
   * Retorna apenas números, incluindo o DDI 55.
   */
  const normalizePhone = (phone) => {
    if (!phone) return null;

    const digits = String(phone).replace(/\D/g, "");

    if (!digits) return null;

    // Já possui o DDI do Brasil.
    if (digits.startsWith("55") && digits.length >= 12) {
      return digits;
    }

    // Telefone brasileiro com DDD.
    if (digits.length === 10 || digits.length === 11) {
      return `55${digits}`;
    }

    return digits;
  };

  /**
   * Formata a data do agendamento.
   */
  const formatAppointmentDate = (date) => {
    if (!date) return "";

    const dateValue = date instanceof Date ? date : toDate(date);

    return isValid(dateValue) ? format(dateValue, "dd/MM/yyyy") : String(date);
  };

  /**
   * Monta a linha de data, incluindo o horário quando existir.
   */
  const buildDateLine = (appointment) => {
    const date = formatAppointmentDate(appointment.date);

    return `\u{1F4C5} Data: ${date}`;
  };

  /**
   * Monta a mensagem do agendamento.
   * - Com especialista: usa o modelo de consulta (especialidade + médico).
   * - Sem especialista: usa o modelo de exame/procedimento.
   */
  const buildAppointmentMessage = (appointment) => {
    const patientName = appointment.patient ?? "";
    const isConsultation = Boolean(appointment.specialist);

    const lines = [
      `Ol\u00e1, ${patientName}! Informamos que sua solicita\u00e7\u00e3o foi agendada pela Secretaria Municipal de Sa\u00fade de Itagua\u00e7u da Bahia.`,
      "",
      buildDateLine(appointment),
      `\u{1F3E5} Local: ${appointment.provider_unit ?? ""}`,
    ];

    if (isConsultation) {
      lines.push(`\u{1FA7A} Especialidade: ${appointment.specialist}`);
      if (appointment.doctor) {
        lines.push(
          `\u{1F468}\u{200D}\u{2695}\u{FE0F} M\u00e9dico: ${appointment.doctor ?? ""}`,
        );
      }
    } else {
      lines.push(`\u{1FA7A} Exame: ${appointment.procedure ?? ""}`);
    }

    lines.push(
      "",
      "\u{1F4CC} IMPORTANTE:",
      "\u00c9 *OBRIGAT\u00d3RIO* retirar o comprovante de agendamento na Secretaria Municipal de Sa\u00fade, portando a solicita\u00e7\u00e3o m\u00e9dica original.",
      "",
      "\u26A0\uFE0F Sem o comprovante de agendamento, n\u00e3o ser\u00e1 poss\u00edvel realizar o atendimento.",
      "",
      "\u2753 *Voc\u00ea confirma seu interesse no agendamento?*",
      "",
      "Caso n\u00e3o tenhamos retorno com a confirma\u00e7\u00e3o, o agendamento ser\u00e1 cancelado.",
      "",
      "Em caso de d\u00favidas, entre em contato conosco.",
      "",
      "Atenciosamente,",
      "SECRETARIA MUNICIPAL DE SA\u00daDE DE ITAGUA\u00c7U DA BAHIA",
    );

    return lines.join("\n");
  };

  /**
   * Retorna a URL do WhatsApp com a mensagem preenchida.
   */
  const getAppointmentWhatsappUrl = (appointment) => {
    const phone = normalizePhone(
      appointment.patient_phone ?? appointment.solicitation?.patient_phone,
    );

    if (!phone) return null;

    const message = buildAppointmentMessage(appointment);

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  };

  /**
   * Abre o WhatsApp com o número e a mensagem preenchidos.
   */
  const openAppointmentWhatsapp = (appointment) => {
    const url = getAppointmentWhatsappUrl(appointment);

    if (!url) return false;

    window.open(url, "_blank", "noopener,noreferrer");

    return true;
  };

  return {
    normalizePhone,
    buildAppointmentMessage,
    getAppointmentWhatsappUrl,
    openAppointmentWhatsapp,
  };
}
