export function usePhoneFormatter () {
  const formatPhone = phone => {
    phone = phone.replace(/\D/g, '');

    if (phone.length <= 2) {
      return `(${phone}`;
    } else if (phone.length <= 6) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2)}`;
    } else if (phone.length <= 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    } else {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
    }

  };

  return { formatPhone };
}
