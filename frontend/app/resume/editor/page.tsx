"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import AuthNavbar from "@/components/AuthNavbar";

import TemplateA from "@/components/SelectedTemplate/TemplateA";
import TemplateB from "@/components/SelectedTemplate/TemplateB";
import Template01 from "@/components/SelectedTemplate/Template01";
import { ResumeData, TemplateProps } from "@/app/create/types";

/* ------------------------------------------------------------------ */
/*                       TEMPLATE REGISTRY                            */
/* ------------------------------------------------------------------ */
const resumeTemplates = [
  { key: "templateA", name: "Classic Professional", component: TemplateA },
  { key: "templateB", name: "Modern Colorful", component: TemplateB },
  { key: "resume_01", name: "Modern Blue", component: Template01 },
];

/* ------------------------- DEFAULT DATA --------------------------- */
const EMPTY_PERSONAL = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  website: "",
};

const DEFAULT_RESUME: ResumeData = {
  personalInfo: { ...EMPTY_PERSONAL },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  projects: [],
  certifications: [],
};

/* ================================================================== */
/*                         MAIN COMPONENT                             */
/* ================================================================== */
export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const resumeContainerRef = useRef<HTMLDivElement | null>(null);

  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME);
  const [template, setTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loadingResume, setLoadingResume] = useState(true);

  /* ---------------- Load user + resume ---------------- */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));

    if (resumeId) fetchResume();
    else setLoadingResume(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const fetchResume = async () => {
    setLoadingResume(true);
    try {
      const token = Cookies.get("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/details/${resumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("=== FETCH RESUME DEBUG ===");
      console.log("Full response:", res.data);
      console.log("Resume object:", res.data.data);

      // Backend returns { success: true, data: resume }
      // where resume = { _id, userId, title, data: {...resumeData}, template: "..." }
      const resume = res.data.data;

      console.log("Resume.data:", resume.data);
      console.log("Resume.template:", resume.template);

      // Extract the actual resume data from the nested 'data' field
      const actualResumeData = resume.data || DEFAULT_RESUME;
      const resumeTemplate = resume.template || "templateA";

      console.log("Extracted resume data:", actualResumeData);
      console.log("Extracted template:", resumeTemplate);
      console.log("=== END DEBUG ===");

      setResumeData(actualResumeData);
      setTemplate(resumeTemplate);
    } catch (err) {
      console.error("Failed to load resume:", err);
      toast.error("Failed to load resume.");
    } finally {
      setLoadingResume(false);
    }
  };

  /* ---------------- Save Resume ---------------- */
  const handleSave = async () => {
    if (!resumeId) {
      toast.error("No resume selected to save.");
      return;
    }

    setSaving(true);
    try {
      const token = Cookies.get("token");
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}`;

      await axios.put(
        url,
        {
          title: resumeData.personalInfo.fullName || "My Resume",
          data: { ...resumeData, __template: template },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Resume saved!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- PDF Export ---------------- */
  const handleExportPdf = async () => {
    if (!resumeContainerRef.current) return;

    const element = resumeContainerRef.current;

    // Load html2pdf
    const html2pdf = (await import("html2pdf.js")).default;

    const fileName = `${resumeData.personalInfo.fullName || 'resume'}.pdf`;

    // Hide all buttons before export
    const buttons = element.querySelectorAll('button');
    const inputs = element.querySelectorAll('input[type="file"], input[type="date"]');

    buttons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });
    inputs.forEach(input => {
      (input as HTMLElement).style.display = 'none';
    });

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      // Show buttons again
      buttons.forEach(btn => {
        (btn as HTMLElement).style.display = '';
      });
      inputs.forEach(input => {
        (input as HTMLElement).style.display = '';
      });
    }
  };



  /* ---------------- Handle Template Editing ---------------- */
  const handleContentUpdate = (
    section: keyof ResumeData,
    field: string | null,
    value: any,
    index?: number
  ) => {
    setResumeData((prev) => {
      const newData = structuredClone(prev);

      // array handling
      if (Array.isArray(newData[section])) {
        if (index === undefined) return newData;

        if (typeof (newData[section] as any[])[index] === "string") {
          (newData[section] as any[])[index] = value;
        } else if (typeof (newData[section] as any[])[index] === "object") {
          if (field) {
            (newData[section] as any[])[index][field] = value;
          } else {
            (newData[section] as any[])[index] = value;
          }
        }
        return newData;
      }

      // object handling
      if (typeof newData[section] === "object" && field) {
        (newData[section] as any)[field] = value;
        return newData;
      }

      // string handling
      if (typeof newData[section] === "string") {
        (newData[section] as any) = value;
        return newData;
      }

      return newData;
    });
  };

  /* ---------------- Add / Remove sections (pass-through) ---------------- */
  const handleAddSection = (section: string) => {
    setResumeData((prev) => {
      const newData = structuredClone(prev);
      switch (section) {
        case "experience":
          newData.experience.push({
            bullets: [],
            location: "",
            tasks: [],
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          });
          break;
        case "education":
          newData.education.push({
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            gpa: "",
          });
          break;
        case "skills":
          newData.skills.push("");
          break;
        case "languages":
          newData.languages = newData.languages || [];
          newData.languages.push("");
          break;
        case "hobbies":
          newData.hobbies = newData.hobbies || [];
          newData.hobbies.push("");
          break;
      }
      return newData;
    });
  };

  const handleRemoveSection = (section: string, index: number) => {
    setResumeData((prev) => {
      const newData = structuredClone(prev);
      const key = section as keyof ResumeData;
      if (key in newData && Array.isArray(newData[key])) {
        const arr = newData[key] as any[];
        arr.splice(index, 1);
      }
      return newData;
    });
  };

  const SelectedTemplate =
    (resumeTemplates.find((t) => t.key === (template || "templateA"))?.component as
      | React.ComponentType<TemplateProps>
      | undefined) || (() => <div>Template not found</div>);

  // Show loading state while fetching resume
  if (loadingResume) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading resume...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global styles to help html2canvas render colors */}
      <style jsx global>{`
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        /* hide interactive elements while printing if templates use .no-print */
        .no-print {
          display: none !important;
        }
      `}</style>

      <AuthNavbar user={user} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editing Resume</h1>

          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-4"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleExportPdf}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div
          id="resume-container"
          ref={resumeContainerRef}
          className="mx-auto bg-white shadow-lg"
          style={{
            maxWidth: "210mm", // A4 width
            minHeight: "297mm", // A4 height
            padding: "0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <SelectedTemplate
            data={resumeData}
            onUpdate={handleContentUpdate}
            onAdd={handleAddSection}
            onRemove={handleRemoveSection}
            previewMode={previewMode}
          />
        </div>
      </main>
    </div>
  );
}
