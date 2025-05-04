import { toDate } from 'date-fns-tz';
import { format, isValid } from 'date-fns';

export function useFormatDate () {

  const formatDate = date => {
    const dateValue = date instanceof Date
    ? date
    : toDate(date);
  if (isValid(dateValue)) {

    return format(dateValue, 'dd/MM/yyyy');
  }

    return date;

  }
  return { formatDate };
}
