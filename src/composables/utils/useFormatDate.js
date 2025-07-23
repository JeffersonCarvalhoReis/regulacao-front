import { toDate } from 'date-fns-tz';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useFormatDate () {

  const formatDate = date => {
    const dateValue = date instanceof Date ? date : toDate(date);
    if (isValid(dateValue)) {
      return format(dateValue, 'dd/MM/yyyy');
    }
    return date;
  };

  const formatLongDate = date => {
    const dateValue = date instanceof Date ? date : toDate(date);
    if (isValid(dateValue)) {
      return format(dateValue, "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    }
    return date;
  };

  return { formatDate, formatLongDate };
}
