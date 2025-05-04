import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:3001/api" });

export interface User {
  id: number;
  email: string;
  role: "HR" | "Employee";
}

export const login = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return user as User;
};

export const initAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;
