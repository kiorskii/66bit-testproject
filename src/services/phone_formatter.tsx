export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');

  // Форматируем номер: +x (xxx) xxx-xx-xx
  if (cleaned.length <= 10) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone; 
};

