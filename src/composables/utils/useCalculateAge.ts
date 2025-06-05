export function useCalculateAge() {
  const calculateAge = (birthDateString, deathDateString = null) => {
    const today = deathDateString ? new Date(deathDateString) : new Date();
    const birthDate = new Date(birthDateString);

    const diffTime = today.getTime() - birthDate.getTime();

    if (diffTime < 0) return 'Data inválida';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Menos de 1 mês
    if (diffDays < 30) {
      return diffDays === 1 ? '1 dia' : `${diffDays} dias`;
    }

    let diffMonths =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    // Ajuste para meses incompletos
    if (today.getDate() < birthDate.getDate()) {
      diffMonths--;
    }

    // Menos de 1 ano
    if (diffMonths < 12) {
      return diffMonths === 1 ? '1 mês' : `${diffMonths} meses`;
    }

    // 1 ano ou mais
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();

    if (m < 0 || (m === 0 && d < 0)) {
      years--;
    }

    return years === 1 ? '1 ano' : `${years} anos`;
  };

  return {
    calculateAge
  };
}
