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
   * Monta a mensagem do agendamento.
   * Tom neutro: pode ser lida tanto pelo paciente quanto por um responsável.
   */
  const buildAppointmentMessage = (appointment) => {
    const patientName = appointment.patient;

    const specialtyOrProcedure =
      appointment.specialist || appointment.procedure;

    const lines = [
      `Ol\u00e1! \u{1F44B}`,
      "",
      `Informamos que o agendamento para *${patientName}* foi confirmado pela Secretaria Municipal de Sa\u00fade de Itagua\u00e7u da Bahia.`,
      "",
      `\u{1F4C5} Data: ${formatAppointmentDate(appointment.date)}`,
      `\u{1F550} Hor\u00e1rio: ${appointment.time ?? ""}`,
      `\u{1F3E5} Local: ${appointment.provider_unit ?? ""}`,
    ];

    if (appointment.provider_unit_localization) {
      lines.push(
        `\u{1F4CD} Endere\u00e7o: ${appointment.provider_unit_localization}`,
      );
    }

    if (specialtyOrProcedure) {
      lines.push(
        `\u{1FA7A} ${
          appointment.specialist ? "Especialista" : "Procedimento"
        }: ${specialtyOrProcedure}`,
      );
    }

    if (appointment.doctor) {
      // Emoji neutro (pessoa profissional de sa\u00fade), sem marcar g\u00eanero.
      lines.push(
        `\u{1F9D1}\u{200D}\u{2695}\u{FE0F} M\u00e9dico(a): ${appointment.doctor}`,
      );
    }

    lines.push(
      "",
      "\u{1F4CC} Importante:",
      "Leve a requisi\u00e7\u00e3o m\u00e9dica original.",
      "",
      "Em caso de d\u00favidas, entre em contato conosco.",
      "",
      "Atenciosamente,",
      "Secretaria Municipal de Sa\u00fade de Itagua\u00e7u da Bahia.",
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
