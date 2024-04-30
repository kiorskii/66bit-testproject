import { convertData } from "./convert";

const positionMap = {
  'Backend-разработчик': 'Backend',
  'Frontend-разработчик': 'Frontend',
  'Аналитик': 'Analyst',
  'Менеджер': 'Manager',
  'Дизайнер': 'Designer',
  'Fullstack': 'Fullstack'
};

const genderMap = {
  'Мужчина': 'Male',
  'Женщина': 'Female'
};

const stackMap = {
  'C#': 'CSharp',
  'React': 'React',
  'Java': 'Java',
  'PHP': 'PHP',
  'Figma': 'Figma',
  'Word': 'Word'
};
async function fetchEmployees(page = 1, count = 20, genders = [], positions = [], stack = [], name = "") {
  const url = new URL('https://frontend-test-api.stk8s.66bit.ru/api/Employee');
  url.searchParams.append("Page", page.toString());
  url.searchParams.append("Count", count.toString());
  if (name) url.searchParams.append("Name", name);

  genders.forEach(gender => {
    url.searchParams.append("Gender", genderMap[gender] || gender);
  });

  positions.forEach(position => {
    url.searchParams.append("Position", positionMap[position] || position);
  });

  stack.forEach(stack => {
    url.searchParams.append("Stack", stackMap[stack] || stack);
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Network error while fetching employees');
    }
    const data = await response.json();

    data.forEach(convertData);

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return ["No results"];
  }
}

async function fetchEmployee(id = undefined) {
  const url = new URL('https://frontend-test-api.stk8s.66bit.ru/api/Employee/' + id);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Network error while fetching employees');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error: ", error);
    return ["404 / Not Found :("];
  }
}


export { fetchEmployees, fetchEmployee };