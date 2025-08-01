export function usePatientLabel () {
  const { formatDate } = useFormatDate();
  const { calculateAge } = useCalculateAge();

  const patientLabel = patient => {
    if (!patient || !patient.name || !patient.birth_date) return '';

    const date = formatDate(patient.birth_date);
    const age = calculateAge(patient.birth_date);

    if (patient.is_deceased) {
      const lastAge = calculateAge(patient.birth_date, patient.date_of_dead);
      const deathDate = formatDate(patient.date_of_dead);
      return `(Falecido)${patient.name} - DN: ${date} - DO: ${deathDate} - ${lastAge}`;
    }

    return `${patient.name} - DN: ${date} - ${age}`;
  }

  return {
    patientLabel,
  }
}
