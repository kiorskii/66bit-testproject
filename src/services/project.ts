import { apiGet, apiPost, apiPut } from "./api";
import { Project, ProjectForm } from "../types";

export const recommendTeam = (payload: { skills: string[]; size: number }) =>
  apiPost<{ members: any[]; explain: string }>("/teams/recommend", payload);

export const createProject = (data: Project) =>
  apiPost<Project>("/projects", data);

export const fetchProjects = () => apiGet<Project[]>("/projects");
export const fetchProject = (id: number | string) =>
  apiGet<Project>("/projects/" + id);

export const fetchAnalysis = (id: number | string) =>
  apiGet<{
    metrics: { durationDays: number; avgLoad: number; riskScore: number };
    description: string; // ← добавили
    risks: string[];
    recommendations: string[];
  }>(`/projects/${id}/analysis`);

export const askProjectAssistant = (id: number | string, text: string) =>
  apiPost<{ reply: string; ts: number }>(`/projects/${id}/ask`, {
    message: text,
  });

export const updateProjectTeam = (id: number | string, team: any[]) =>
  apiPut(`/projects/${id}/team`, { team });

export interface EmpProject {
  id: number;
  name: string;
  priority: "Low" | "Med" | "High";
  role: string;
  start: string;
  end: string;
}

export const fetchEmployeeProjects = (id: number | string) =>
  apiGet<EmpProject[]>(`/Employee/${id}/projects`);
