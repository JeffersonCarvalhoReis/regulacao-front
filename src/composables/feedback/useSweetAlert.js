import Swal from "sweetalert2";

export function useSweetAlertFeedback() {
  const openLoading = (options) => {
    Swal.fire({
      target: document.body,
      title: options.loadingTitle || "Aguarde...",
      text: options.loadingText || "Processando sua solicitação...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const showSuccess = (response, options) => {
    Swal.fire({
      target: document.body,
      icon: "success",
      title: options.sucessoTitle || "Sucesso!",
      text: options.message || response.message,
      timerProgressBar: true,
      showConfirmButton: true,
      timer: options.timer || false,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "!bg-sky-400 text-white",
      },
    });
  };

  const showStandardError = async (error, options) => {
    const validationErrors = error.response?.data?.errors;

    const errorMessage = validationErrors
      ? Object.values(validationErrors).flat().join("<br>")
      : error.response?.data?.message || "Ocorreu um erro inesperado.";

    await Swal.fire({
      target: document.body,
      icon: "error",
      title: options.erroTitle || "Erro!",
      html: errorMessage,
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "!bg-sky-400 text-white",
      },
    }).then((result) => {
      if (result.isConfirmed && typeof options.onErrorRetry === "function") {
        options.onErrorRetry();
      }
    });
  };

  const showFeedback = async (asyncAction, options = {}) => {
    try {
      openLoading(options);
      const response = await asyncAction();
      showSuccess(response, options);
      return response;
    } catch (error) {
      await showStandardError(error, options);
      throw error;
    }
  };

  const showFeedbackLoading = async (asyncAction, options = {}) => {
    try {
      openLoading(options);
      const response = await asyncAction();
      Swal.close();
      return response;
    } catch (error) {
      Swal.close();
      await Swal.fire({
        target: document.body,
        icon: "error",
        title: options.erroTitle || "Erro!",
        text: error.response?.data?.message || "Ocorreu um erro inesperado.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "!bg-sky-400 text-white",
        },
      });
      throw error;
    }
  };

  const showInactivityAlert = (text = null) => {
    Swal.fire({
      target: document.body,
      icon: "warning",
      title: "Sessão Expirada",
      text:
        text ||
        "Você foi desconectado por inatividade. Por favor, faça o login novamente para continuar",
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "bg-blue-500 text-white",
      },
    });
  };

  const confirmModal = async (
    message = "Você tem certeza?",
    title = "Confirmação",
    icon = "warning",
    confirmButtonClass = "bg-red-500 text-white shadow-sm",
    cancelButtonClass = "bg-blue-500 text-white"
  ) => {
    const result = await Swal.fire({
      target: document.body,
      title,
      html: message,
      icon,
      showCancelButton: true,
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: confirmButtonClass,
        cancelButton: cancelButtonClass,
      },
    });

    return result.isConfirmed;
  };

  return {
    showFeedback,
    showFeedbackLoading,
    showInactivityAlert,
    confirmModal,
  };
}
