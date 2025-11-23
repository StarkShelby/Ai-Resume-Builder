"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import AuthNavbar from "@/components/AuthNavbar";

import TemplateA from "@/components/SelectedTemplate/TemplateA";
import TemplateB from "@/components/SelectedTemplate/TemplateB";
import Template01 from "@/components/SelectedTemplate/Template01";
import Template02 from "@/components/SelectedTemplate/Template02";
import Template03 from "@/components/SelectedTemplate/Template03";
import Template04 from "@/components/SelectedTemplate/Template04";
import Template05 from "@/components/SelectedTemplate/Template05";
import Template06 from "@/components/SelectedTemplate/Template06";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResumeData, TemplateProps } from "./types";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*                       TEMPLATE REGISTRY                            */
/* ------------------------------------------------------------------ */
const resumeTemplates = [
  { key: "templateA", name: "Classic Professional", component: TemplateA, image: "/templates/template_a.png" },
  { key: "templateB", name: "Modern Colorful", component: TemplateB, image: "/templates/template_b.png" },
  { key: "resume_01", name: "Modern Blue", component: Template01, image: "/templates/resume_01_v2.png" },
  { key: "resume_02", name: "Clean Geometric", component: Template02, image: "/templates/resume_02_v2.png" },
  { key: "resume_03", name: "Sidebar Dark", component: Template03, image: "/templates/resume_03_v2.png" },
  { key: "resume_04", name: "Bold Red", component: Template04, image: "/templates/resume04.png" },
  { key: "resume_05", name: "Business Purple", component: Template05, image: "/templates/resume_05_v2.png" },
  { key: "resume_06", name: "Classic Green", component: Template06, image: "/templates/resume_06_v2.png" },
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
  software: [],
};

/* -------------------- NORMALIZER (Backend Safety) ------------------ */
function normalizeResumePayload(apiPayload: any): ResumeData {
  const raw = apiPayload?.data ?? apiPayload ?? {};

  return {
    personalInfo: {
      ...EMPTY_PERSONAL,
      ...(raw.personalInfo || raw.data?.personalInfo || {}),
    },
    summary: raw.summary ?? raw.data?.summary ?? "",
    experience: raw.experience ?? raw.data?.experience ?? [],
    education: raw.education ?? raw.data?.education ?? [],
    skills: raw.skills ?? raw.data?.skills ?? [],
    languages: raw.languages ?? raw.data?.languages ?? [],
    hobbies: raw.hobbies ?? raw.data?.hobbies ?? [],
    projects: raw.projects ?? raw.data?.projects ?? [],
    certifications: raw.certifications ?? raw.data?.certifications ?? [],
    software: raw.software ?? raw.data?.software ?? [],
    __template: raw.__template ?? raw.data?.__template,
  };
}

/* ================================================================== */
/*                  MAINCOMPONENT                             */
/* ================================================================== */
export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");

  const resumeContainerRef = useRef<HTMLDivElement>(null);

  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME);
  const [template, setTemplate] = useState<string | null>(null);

  /* ---------------- Load user + resume ---------------- */
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) router.push("/login");

    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));

    const templateFromUrl = searchParams.get("template");
    if (templateFromUrl) {
      setTemplate(templateFromUrl);
    }

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const token = Cookies.get("token");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/details/${resumeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResumeData(res.data.data.data);
      // Fix: Access template from the resume object (res.data.data), not the response root
      if (res.data.data.template) {
        setTemplate(res.data.data.template);
      }
    } catch (err) {
      toast.error("Failed to load resume.");
    }
  };

  /* ---------------- Save Resume ---------------- */
  const handleSave = async () => {
    setSaving(true);

    const finalResumeData = {
      ...resumeData,
      __template: template,
    };

    try {
      const token = Cookies.get("token");

      const url = resumeId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/resumes`;

      const method = resumeId ? "put" : "post";

      await axios[method](
        url,
        {
          title: finalResumeData.personalInfo.fullName || "My Resume",
          data: finalResumeData,
          template: template,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Resume saved!");
      router.push("/dashboard");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      toast.error("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- PDF Export ---------------- */
  const handleExportPdf = () => {
    if (!resumeContainerRef.current) return;

    html2canvas(resumeContainerRef.current, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );
      pdf.save("resume.pdf");
    });
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

      // 1. SECTION IS ARRAY (experience, education, skills, bullets, etc.)
      if (Array.isArray(newData[section])) {
        // Special case: replacing entire array (e.g., after remove operation)
        if (field === null && index === undefined && Array.isArray(value)) {
          (newData as any)[section] = value;
          return newData;
        }

        if (index === undefined) return newData; // invalid case

        // If the array item is a string (skills, languages)
        if (typeof (newData[section] as any[])[index] === "string") {
          (newData[section] as any[])[index] = value;
        }
        // If the array item is an object (experience, education)
        else if (typeof (newData[section] as any[])[index] === "object") {
          if (field) {
            const item = (newData[section] as any[])[index] as Record<
              string,
              any
            >;
            item[field] = value;
          } else {
            // Replace entire object if no field supplied
            (newData[section] as any[])[index] = value;
          }
        }

        return newData;
      }

      // 2. SECTION IS AN OBJECT (personalInfo)
      if (typeof newData[section] === "object" && field) {
        const obj = newData[section] as Record<string, any>;
        obj[field] = value;
        return newData;
      }

      // 3. SECTION IS STRING (summary)
      if (typeof newData[section] === "string") {
        newData[section] = value;
        return newData;
      }

      return newData;
    });
  };

  /* ---------------- ADD ITEMS ---------------- */
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

        case "software":
          newData.software = newData.software || [];
          newData.software.push("");
          break;

        case "projects":
          newData.projects = newData.projects || [];
          newData.projects.push({
            name: "",
            description: "",
            link: "",
            technologies: "",
          });
          break;

        default:
          break;
      }

      return newData;
    });
  };
  /* ---------------- REMOVE ITEMS ---------------- */
  const handleRemoveSection = (section: string, index: number) => {
    setResumeData((prev) => {
      const newData = structuredClone(prev);
      const key = section as keyof ResumeData;

      if (key in newData && Array.isArray(newData[key])) {
        const array = newData[key] as any[];
        array.splice(index, 1);
      }

      return newData;
    });
  };

  /* ---------------- Template Selection Screen ---------------- */
  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 font-sans">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Choose Your Template
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a professional design to get started. You can easily switch templates later.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {resumeTemplates.map((tpl, index) => (
              <motion.button
                key={tpl.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setTemplate(tpl.key)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col items-center text-left hover:border-purple-300/50"
              >
                <div className="w-full aspect-[210/297] overflow-hidden rounded-2xl border border-gray-100 mb-6 bg-gray-50 relative shadow-inner group-hover:shadow-md transition-all">
                  <img
                    src={(tpl as any).image}
                    alt={tpl.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Select Template
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{tpl.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Professional & Clean</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Selected Template Render ---------------- */
  const SelectedTemplate =
    (resumeTemplates.find((t) => t.key === template)?.component as
      | React.ComponentType<TemplateProps>
      | undefined) || (() => <div>Template not found</div>);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-20">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* SAVE + EXPORT BUTTONS */}
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

        {/* TEMPLATE DISPLAY */}
        <div
          id="resume-preview-wrapper"
          ref={resumeContainerRef}
          className="bg-white shadow-2xl w-[210mm] min-h-[297mm] mx-auto"
        >
          <SelectedTemplate
            data={resumeData}
            onUpdate={handleContentUpdate}
            onAdd={handleAddSection}
            onRemove={handleRemoveSection}
          />
        </div>
      </main>
    </div>
  );
}
