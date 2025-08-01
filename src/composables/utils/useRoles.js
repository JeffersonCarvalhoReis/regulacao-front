export function useRoles () {

  const translateRole = role => {
    const mapRole = {
      'admin': 'Adminstrador',
      'regulation_officer': 'Regulador',
      'reception': 'Recepção',
      'provider_unit_manager' : 'Unidade Prestadora',
      'tfd' : 'TFD',
    }
    return mapRole[role] || 'Usuário'
  };

  const roles = [
    { value: 'admin', name: 'Administrador' },
    { value: 'regulation_officer', name: 'Regulador' },
    { value: 'reception', name: 'Recepção' },
    { value: 'provider_unit_manager', name: 'Usuário Unidade Prestadora' },
    { value: 'tfd', name: 'TFD' },

  ]

  return {
    translateRole,
    roles,
  }
}
