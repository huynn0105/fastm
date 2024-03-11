export const formatPhoneNumber = (phoneNumber, stringSpace = '.') => {
  if (!phoneNumber) {
    return '';
  }

  const phone = phoneNumber.replace(/[^0-9]/g, '');
  return `${phone.slice(0, 4)}${stringSpace}${phone.slice(4, 7)}${stringSpace}${phone.slice(7)}`;
};
