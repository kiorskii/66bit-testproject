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
  const url = new URL('http://localhost:3001/api/Employee');
  const token = localStorage.getItem('token');
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
    const response = await fetch(url.toString(), {        
    headers: { Authorization: `Bearer ${token}` }
});
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
  const url = new URL('http://localhost:3001/api/Employee/' + id);
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
      });
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

const updateEmployee = async (id: number, updatedData: any) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:3001/api/Employee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    if (!response.ok) {
      throw new Error('Failed to update employee');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

export { fetchEmployees, fetchEmployee, updateEmployee };