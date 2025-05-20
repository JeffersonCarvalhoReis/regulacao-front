export function usePatientLabel() {
    const { formatDate } = useFormatDate();
    const { calculateAge } = useCalculateAge();

    const patientLabel = (patient) => {
    if(!patient) return '';

    const date = formatDate(patient.birth_date);
    const age = calculateAge(patient.birth_date);
    if(patient.is_deceased){
      const age = calculateAge(patient.birth_date, patient.date_of_dead);
      const deathDate = formatDate(patient.date_of_dead)
      return `(Falecido)${patient.name} - DN: ${date} - DO: ${deathDate} - ${age} anos`
    }
    return `${patient.name} - DN: ${date} - ${age} anos`

  }
  return {
    patientLabel
  }
}
