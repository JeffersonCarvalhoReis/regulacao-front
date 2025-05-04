export function useFormatCns () {
  const formatCns = value => {
    if (!value) return '';
    value = value.replace(/\D/g, '');

    value = value
      .replace(/^(\d{3})(\d)/, '$1 $2')
      .replace(/^(\d{3}) (\d{4})(\d)/, '$1 $2 $3')
      .replace(/^(\d{3}) (\d{4}) (\d{4})(\d)/, '$1 $2 $3 $4')
      .substr(0, 18);

    return value;
  };

  return { formatCns };
}
