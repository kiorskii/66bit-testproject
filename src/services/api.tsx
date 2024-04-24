async function fetchEmployees(page = 1, count = 20, gender = "", position = "", stack = "") {
  const url = new URL('https://frontend-test-api.stk8s.66bit.ru/api/Employee');
  url.searchParams.append("Page", page.toString());
  url.searchParams.append("Count", count.toString());
  if (gender) url.searchParams.append("Gender", gender);
  if (position) url.searchParams.append("Position", position);
  if (stack) url.searchParams.append("Stack", stack);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Сетевая ошибка при получении данных о сотрудниках');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка: ", error);
    return [];
  }
}

export { fetchEmployees };