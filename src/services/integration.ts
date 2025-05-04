import API from "./auth";

export interface IntegrationTokens {
  jira?: string;
  bitrix?: string;
  "1c"?: string;
}

// Получить все сохранённые токены
export const fetchIntegrationTokens = async (): Promise<IntegrationTokens> => {
  const res = await API.get<IntegrationTokens>("/integrations");
  return res.data;
};

// Сохранить токен для конкретного сервиса
export const saveIntegrationToken = async (
  service: "jira" | "bitrix" | "1c",
  token: string
): Promise<void> => {
  await API.post(`/integrations/${service}`, { token });
};

// Удалить токен для конкретного сервиса
export const deleteIntegrationToken = async (
  service: "jira" | "bitrix" | "1c"
): Promise<void> => {
  await API.delete(`/integrations/${service}`);
};
