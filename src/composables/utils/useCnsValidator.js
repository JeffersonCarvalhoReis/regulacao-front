export function useCnsValidator () {
  const isValidCns = cns => {
    cns = cns.replace(/[^\d]/g, '');

    if (cns.length !== 15) return false;

    const firstDigit = cns.charAt(0);

    if (firstDigit === '1' || firstDigit === '2') {
      const pis = cns.substring(0, 11);
      let sum = 0;

      for (let i = 0; i < 11; i++) {
        sum += parseInt(pis.charAt(i)) * (15 - i);
      }

      let dv = 11 - (sum % 11);
      if (dv === 11) dv = 0;

      const result = pis + '000' + dv;
      return result === cns;
    }

    if (['7', '8', '9'].includes(firstDigit)) {
      let sum = 0;
      for (let i = 0; i < 15; i++) {
        sum += parseInt(cns.charAt(i)) * (15 - i);
      }

      return sum % 11 === 0;
    }

    return false;
  };

  return {
    isValidCns,
  };
}
