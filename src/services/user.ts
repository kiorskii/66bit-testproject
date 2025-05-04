import API from "./auth";

export interface User {
  id: number;
  email: string;
  role: "HR" | "Employee" | "PM" | "Lead";
}

// Получить всех пользователей
export const fetchUsers = async (): Promise<User[]> => {
  const res = await API.get<User[]>("/users");
  return res.data;
};

// Создать нового пользователя
export const createUser = async (payload: {
  email: string;
  password: string;
  role: string;
}): Promise<User> => {
  const res = await API.post<{ user: User }>("/users", payload);
  return res.data.user;
};

export const deleteUser = async (id: number | string): Promise<void> => {
  await API.delete(`/users/${id}`);
};
