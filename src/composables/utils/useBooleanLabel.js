export function useBooleanLabel() {
  const booleanToLabel = (value, yes = 'Sim', no = 'Não') => {
    return value === true || value === 1 || value === '1' ? yes : no
  }

  return {
    booleanToLabel,
  }
}
