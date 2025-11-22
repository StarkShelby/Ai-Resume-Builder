import { ReactNode } from "react";

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    twitter?: string;
    github: string;
    website: string;
    jobTitle?: string;
  };
  summary: string;
  experience: Array<{
    bullets: string[];
    location: ReactNode;
    tasks: string[];
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: string[];
  languages?: string[];
  hobbies?: string[];
  projects: Array<{
    name: string;
    description: string;
    link?: string;
    technologies?: string;
  }>;
  certifications: Array<any>;
  software?: string[];
  __template?: string;
}

export interface TemplateProps {
  data?: ResumeData;
  onUpdate?: (
    section: keyof ResumeData,
    field: string | null,
    value: string,
    index?: number
  ) => void;
  onAdd?: (section: string) => void;
  onRemove?: (section: string, index: number) => void;
  previewMode?: boolean;
}
