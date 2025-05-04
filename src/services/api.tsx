/* ──────────────────────────────────────────────
   Универсальные обёртки: apiGet / apiPost / …
   ────────────────────────────────────────────── */
const BASE_URL = "http://localhost:3001/api";

function authHeaders(extra: HeadersInit = {}) {
  const token = localStorage.getItem("token");
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const resp = await fetch(`${BASE_URL}${path}`, {
    headers: authHeaders({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
    ...options,
  });
  if (!resp.ok) {
    throw new Error(`API ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

export const apiGet = <T = any,>(path: string) => request<T>(path);
export const apiPost = <T = any,>(path: string, body?: any) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
/* если в файле вдруг нет apiPut — добавьте: */
export const apiPut = <T = any,>(path: string, body?: any) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });

export const apiDelete = <T = any,>(path: string) =>
  request<T>(path, { method: "DELETE" });

/* ──────────────────────────────────────────────
      СТАРЫЕ МАПЫ И ФУНКЦИИ ОСТАВЛЯЕМ ДЛЯ СПИСКА
      ────────────────────────────────────────────── */
import { convertData } from "./convert";

const positionMap = {
  /* … ваши карты … */
};
const genderMap = {
  /* … */
};
const stackMap = {
  /* … */
};

async function fetchEmployees(
  page = 1,
  count = 20,
  genders: string[] = [],
  positions: string[] = [],
  stack: string[] = [],
  name = ""
) {
  const q = new URLSearchParams();
  q.append("Page", page.toString());
  q.append("Count", count.toString());
  if (name) q.append("Name", name);
  genders.forEach((g) => q.append("Gender", genderMap[g] || g));
  positions.forEach((p) => q.append("Position", positionMap[p] || p));
  stack.forEach((s) => q.append("Stack", stackMap[s] || s));

  // передаём путь без дополнительного /api
  const data = await apiGet<any[]>(`/Employee?${q.toString()}`);
  data.forEach(convertData);
  data.forEach((e) => {
    if (e.capacity === undefined) e.capacity = Math.floor(Math.random() * 100);
  });
  return data;
}

async function fetchEmployee(id: number | string) {
  return apiGet(`/Employee/${id}`);
}

async function updateEmployee(id: number, updatedData: any) {
  return apiPut(`/Employee/${id}`, updatedData);
}

export { fetchEmployees, fetchEmployee, updateEmployee };
