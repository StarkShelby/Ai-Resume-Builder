"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import TemplateA from "@/components/SelectedTemplate/TemplateA";
import TemplateB from "@/components/SelectedTemplate/TemplateB";
import Template01 from "@/components/SelectedTemplate/Template01";
import { ResumeData, TemplateProps } from "@/app/create/types";

const resumeTemplates: {
  key: string;
  name: string;
  component: React.ComponentType<TemplateProps>;
}[] = [
    { key: "templateA", name: "Classic Professional", component: TemplateA },
    { key: "templateB", name: "Modern Colorful", component: TemplateB },
    { key: "resume_01", name: "Modern Blue", component: Template01 },
  ];

interface ResumePreviewProps {
  resumeId: string;
  onClose: () => void;
}

export default function ResumePreview({
  resumeId,
  onClose,
}: ResumePreviewProps) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetails();
    }
  }, [resumeId]);

  const fetchResumeDetails = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/details/${resumeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resumeObj = response.data.data;
      setResumeData(resumeObj.data);
      setTemplate(resumeObj.template);
    } catch (error) {
      toast.error("Failed to load resume preview.");
      console.error("Failed to fetch resume details:", error);
    } finally {
      setLoading(false);
    }
  };

  const SelectedTemplate = template
    ? resumeTemplates.find((t) => t.key === template)?.component
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl">Loading Preview...</p>
          </div>
        ) : SelectedTemplate && resumeData ? (
          <div className="scale-75 origin-top">
            <SelectedTemplate data={resumeData} previewMode={true} />
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-red-500">
              Could not load resume preview. The template might be missing or
              data is corrupt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
