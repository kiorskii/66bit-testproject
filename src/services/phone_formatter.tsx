// services/phone_formatter.ts
export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');        // оставляем только цифры

  /* 11 цифр — начинаются с 7 или 8 (79091234567 / 8909…) */
  if (digits.length === 11 && /^(7|8)\d{10}$/.test(digits)) {
    const d = digits.slice(1);                    // пропускаем первую
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  }

  /* 10 цифр (9091234567) */
  if (digits.length === 10) {
    return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }

  /* иначе — возвращаем как есть */
  return phone;
};
