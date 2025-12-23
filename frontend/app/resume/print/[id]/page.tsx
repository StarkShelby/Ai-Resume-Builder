"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import TemplateA from "@/components/SelectedTemplate/TemplateA";
import TemplateB from "@/components/SelectedTemplate/TemplateB";
import Template01 from "@/components/SelectedTemplate/Template01";
import Template02 from "@/components/SelectedTemplate/Template02";
import Template03 from "@/components/SelectedTemplate/Template03";
import Template04 from "@/components/SelectedTemplate/Template04";
import Template05 from "@/components/SelectedTemplate/Template05";
import Template06 from "@/components/SelectedTemplate/Template06";

/* ------------------------------------------------------------------ */
/*                       TEMPLATE REGISTRY                            */
/* ------------------------------------------------------------------ */
const templateRegistry: any = {
    templateA: TemplateA,
    templateB: TemplateB,
    resume_01: Template01,
    resume_02: Template02,
    resume_03: Template03,
    resume_04: Template04,
    resume_05: Template05,
    resume_06: Template06,
};

export default function PrintPage() {
    const params = useParams();
    const resumeId = params.id;

    const [resumeData, setResumeData] = useState<any>(null);
    const [template, setTemplate] = useState<string>("templateA");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!resumeId) return;

        const fetchResume = async () => {
            try {
                // We rely on the cookie being present (set by Puppeteer or user browser)
                const token = Cookies.get("token");

                // If this page is hit by Puppeteer, the token cookie must be set in the browser context
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/details/${resumeId}`,
                    {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }
                );

                if (res.data.success) {
                    const data = res.data.data;
                    setResumeData(data.data);
                    setTemplate(data.template || "templateA");
                } else {
                    setError("Failed to fetch resume data.");
                }
            } catch (err: any) {
                console.error("Error fetching resume for print:", err);
                setError("Error loading resume.");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [resumeId]);

    if (loading) return <div>Loading for print...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!resumeData) return <div>No data found</div>;

    const TemplateComponent = templateRegistry[template];

    if (!TemplateComponent) {
        return <div>Template not found: {template}</div>;
    }

    return (
        <div
            id="print-container"
            style={{
                width: "210mm",
                minHeight: "297mm",
                margin: "0 auto",
                backgroundColor: "white",
                // Print specific overrides can go here
                overflow: "hidden"
            }}
        >
            <style jsx global>{`
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }
            `}</style>
            <TemplateComponent data={resumeData} previewMode={true} />
        </div>
    );
}
