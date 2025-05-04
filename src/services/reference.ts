import API from "./auth";

// Должности
export const fetchPositions = async (): Promise<string[]> => {
  const res = await API.get<string[]>("/positions");
  return res.data;
};

export const addPosition = async (name: string): Promise<void> => {
  await API.post("/positions", { name });
};

export const deletePosition = async (name: string): Promise<void> => {
  await API.delete(`/positions/${encodeURIComponent(name)}`);
};

// Компетенции
export const fetchCompetencies = async (): Promise<string[]> => {
  const res = await API.get<string[]>("/competencies");
  return res.data;
};

export const addCompetency = async (name: string): Promise<void> => {
  await API.post("/competencies", { name });
};

export const deleteCompetency = async (name: string): Promise<void> => {
  await API.delete(`/competencies/${encodeURIComponent(name)}`);
};
