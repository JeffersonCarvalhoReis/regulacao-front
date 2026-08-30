export function useRoles() {
  const translateRole = (role) => {
    const mapRole = {
      admin: "Adminstrador",
      regulation_officer: "Regulador",
      reception: "Recepção",
      provider_unit_manager: "Unidade Prestadora",
      tfd: "TFD",
      caps: "CAPS",
      regulation_doctor: "Médico Regulador",
    };
    return mapRole[role] || "Usuário";
  };

  const roles = [
    { value: "admin", name: "Administrador" },
    { value: "caps", name: "CAPS" },
    { value: "regulation_doctor", name: "Médico Regulador" },
    { value: "reception", name: "Recepção" },
    { value: "regulation_officer", name: "Regulador" },
    { value: "tfd", name: "TFD" },
    { value: "provider_unit_manager", name: "Usuário Unidade Prestadora" },
  ];

  return {
    translateRole,
    roles,
  };
}
