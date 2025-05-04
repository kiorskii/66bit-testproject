export type Priority = 'Low'|'Med'|'High';

export interface ProjectForm {
  name: string;
  description?: string;
  skills: string[];        // требуемые компетенции
  start: string;           // ISO YYYY-MM-DD
  end: string;
  priority: Priority;
}


export interface Project extends ProjectForm {
  id: number;
}
