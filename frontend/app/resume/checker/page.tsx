"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import AuthNavbar from "@/components/AuthNavbar";

// VIEWERS
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

// RESUME TEMPLATES
import TemplateA from "@/components/SelectedTemplate/TemplateA";
import TemplateB from "@/components/SelectedTemplate/TemplateB";
import Template01 from "@/components/SelectedTemplate/Template01";

const templateRegistry: any = {
    templateA: TemplateA,
    templateB: TemplateB,
    resume_01: Template01,
};

import { motion } from "framer-motion"; // Required for potential future animations or consistent styling
import Link from "next/link"; // Not strictly needed for background, but good practice if adding links
import CollapsibleSection from "@/components/CollapsibleSection"; // Ensure this import is present

export default function ResumeCheckerPage() {
    const router = useRouter();
    const params = useSearchParams();
    const resumeId = params.get("id");

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Added for error messages

    const [savedResume, setSavedResume] = useState<any>(null);
    const [resumeText, setResumeText] = useState("");
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null); // To store the actual file for ATS check
    const [scale, setScale] = useState(0.6);
    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // -------- RESIZE HANDLER ----------
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;

            const baseWidth = 794; // px width of A4 page
            const newScale = containerWidth / baseWidth;

            setScale(Math.min(newScale, 1)); // prevent enlarging beyond 1:1
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [savedResume]);
    // Recalculate when resume loads

    // -------- AUTH ----------
    useEffect(() => {
        const token = Cookies.get("token");
        const userData = Cookies.get("user");
        if (!token) router.push("/login");
        if (userData) setUser(JSON.parse(userData));
    }, []);

    // -------- LOAD SAVED RESUME ----------
    useEffect(() => {
        if (!resumeId) {
            setError(
                "No resume ID provided. Please navigate from the dashboard or create a new resume."
            );
            console.log("No resumeId in URL params.");
            return;
        }

        const loadResume = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            try {
                console.log(`Attempting to load resume with ID: ${resumeId}`);
                const token = Cookies.get("token");
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/details/${resumeId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const resumeData = res.data.data; // Fix: Unwrap the response to get the actual resume object
                console.log("Resume data loaded:", resumeData);
                setSavedResume(resumeData);

                // Extract text from fields
                const content = resumeData.data; // Use resumeData.data based on backend model structure
                const extractedText = Object.values(content)
                    .map((section: any) =>
                        typeof section === "object"
                            ? Object.values(section).join(" ")
                            : section
                    )
                    .join(" ");

                setResumeText(extractedText);
                setFileURL(null);
                // Removed: toast.success("Saved resume loaded successfully!"); to prevent double toasts
            } catch (err: any) {
                console.error("Failed to load saved resume:", err);
                setError(
                    `Failed to load saved resume: ${err.response?.data?.error || err.message
                    }`
                );
                toast.error("Failed to load saved resume");
            }

            setLoading(false);
        };

        loadResume();
    }, [resumeId]);

    // -------- FILE UPLOAD ----------
    const handleFileUpload = async (file: File | null) => {
        if (!file) return toast.error("No file selected");
        setSavedResume(null);
        setUploadedFile(file); // Store the actual file

        const url = URL.createObjectURL(file);
        setFileURL(url); // Keep the fileURL to display the preview
        setResumeText(""); // Clear previous text, as we'll send the file

        // Extract text for immediate preview/display, but ATS will use the file
        const formData = new FormData();
        formData.append("file", file);

        const loader = toast.loading("Extracting text for preview...");

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
                formData
            );

            toast.dismiss(loader);
            if (!res.data.text) {
                console.log("No text extracted from uploaded file for preview.");
                return toast.error("Could not extract text for preview");
            }

            setResumeText(res.data.text);
            toast.success("Text extracted for preview!");
        } catch (err) {
            console.error("Text extraction failed:", err);
            toast.dismiss(loader);
            toast.error("Text extraction failed");
        }
    };

    // -------- ATS CHECK ----------
    const checkATS = async () => {
        if (!uploadedFile && !savedResume) {
            return toast.error(
                "Please upload a file or load a saved resume for ATS check."
            );
        }

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            let res;
            if (uploadedFile) {
                console.log("Sending uploaded file to ATS checker.");
                const formData = new FormData();
                formData.append("file", uploadedFile);
                res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/check-file-for-ats`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else if (savedResume) {
                console.log("Sending saved resume text to ATS checker.");
                // For saved resumes, we still rely on the extracted text for now.
                // Future improvement could be to re-generate PDF from saved data and send.
                const content = savedResume.data;
                const extractedText = Object.values(content)
                    .map((section: any) =>
                        typeof section === "object"
                            ? Object.values(section).join(" ")
                            : section
                    )
                    .join(" ");

                if (!extractedText.trim()) {
                    return toast.error("Saved resume has no content for ATS check.");
                }

                res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/check-text`,
                    { text: extractedText }
                );
            } else {
                return toast.error("No resume content to check.");
            }

            console.log("ATS check result:", res.data);
            setResult(res.data.data);
            toast.success("ATS Ready!");
        } catch (err: any) {
            console.error("ATS check failed:", err);
            setError(`ATS check failed: ${err.response?.data?.error || err.message}`);
            toast.error("ATS failed");
        }

        setLoading(false);
    };

    // -------- TEMPLATE PREVIEW ----------
    const renderSavedPreview = () => {
        if (!savedResume) return null;

        const TemplateComponent = templateRegistry[savedResume.template];
        if (!TemplateComponent) return <p>Template not found</p>;

        return (
            <TemplateComponent
                data={savedResume.data} // FIXED: Use savedResume.data instead of savedResume.content
                previewMode={true}
            />
        );
    };

    // -------- UI ----------
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Gradient Background with Blur Effect - Copied from Hero.tsx */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Auth Navbar (positioned above the animated background) */}
            <div className="absolute top-0 left-0 right-0 z-20">
                <AuthNavbar user={user} showBackButton backHref="/dashboard" />
            </div>

            {/* Main Content (positioned relative to the section, above background) */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg my-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: Resume Preview & Upload */}
                <div className="lg:col-span-1 flex flex-col items-center lg:sticky lg:top-24 lg:self-start h-fit">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-12">
                        AI Resume Checker
                    </h1>
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 w-full"
                            role="alert"
                        >
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}
                    {/* UPLOAD */}
                    <div
                        className="relative border-4 border-dashed border-purple-300 p-12 bg-purple-50 rounded-2xl text-center shadow-inner hover:border-purple-400 transition-colors duration-200 ease-in-out cursor-pointer mb-8 w-full"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFileUpload(e.dataTransfer.files?.[0] || null);
                        }}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={inputRef}
                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                        />
                        <svg
                            className="mx-auto h-20 w-20 text-purple-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                        </svg>
                        <p className="text-2xl font-semibold text-purple-800">
                            Drag & Drop Your Resume Here
                        </p>
                        <p className="mt-2 text-lg text-purple-600">
                            or{" "}
                            <span className="text-purple-700 font-bold underline cursor-pointer">
                                click to upload
                            </span>
                        </p>
                        <p className="mt-1 text-sm text-purple-500">
                            Supported formats: PDF, DOCX, PNG, JPG
                        </p>
                        {resumeId && (
                            <p className="mt-4 text-sm text-gray-500">
                                Loading resume with ID: {resumeId}
                            </p>
                        )}
                    </div>

                    {/* PREVIEW */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                            Resume Preview
                        </h3>

                        <div
                            ref={containerRef}
                            className="w-full flex justify-center items-start overflow-hidden rounded-xl bg-gray-50 border"
                            style={{
                                height: "900px", // fixed height of card
                                position: "relative",
                            }}
                        >
                            {savedResume ? (
                                <div
                                    style={{
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top center",
                                        width: "794",
                                        minHeight: "1122px",
                                    }}
                                >
                                    {renderSavedPreview()}
                                </div>
                            ) : fileURL && uploadedFile ? (
                                <div className="w-full flex justify-center">
                                    {/* Existing upload preview viewer here */}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center mt-20">
                                    Upload a resume or select one from the dashboard.
                                </p>
                            )}
                        </div>
                    </div>


                </div>

                {/* Right Column: Resume Review & ATS Analysis */}
                <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
                            Resume Review
                        </h2>

                        {/* Placeholder for "Your Resume Score" */}
                        {/* ATS Score - Existing ATS check button and result display */}
                        <div
                            className={`p-6 rounded-lg shadow-sm transition-all duration-300 ease-in-out
                ${result?.score >= 70
                                    ? "bg-green-50 border border-green-200 ring-4 ring-green-100"
                                    : result?.score < 70
                                        ? "bg-red-50 border border-red-200 ring-4 ring-red-100"
                                        : "bg-gray-50 border border-gray-200"
                                }
              `}
                        >
                            <h3
                                className={`flex items-center font-bold text-xl mb-3 ${result?.score >= 70
                                    ? "text-green-800"
                                    : result?.score < 70
                                        ? "text-red-800"
                                        : "text-gray-800"
                                    }`}
                            >
                                <svg
                                    className={`w-6 h-6 mr-2 ${result?.score >= 70
                                        ? "text-green-500"
                                        : result?.score < 70
                                            ? "text-red-500"
                                            : "text-gray-500"
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {result?.score >= 70 ? (
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        ></path>
                                    ) : result?.score < 70 ? (
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    )}
                                </svg>
                                ATS Score - {result?.score || "--"}/100
                            </h3>
                            <p className="text-gray-700 mb-4">
                                How well does your resume pass through Applicant Tracking
                                Systems? Your resume was scanned like an employer would. Here's
                                how it performed:
                            </p>
                            <ul className="text-gray-700 space-y-2">
                                {result?.strengths?.map((strength: string, index: number) => (
                                    <li key={`strength-${index}`} className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>{" "}
                                        {strength}
                                    </li>
                                ))}
                                {result?.weaknesses?.map((weakness: string, index: number) => (
                                    <li key={`weakness-${index}`} className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-red-500 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>{" "}
                                        {weakness}
                                    </li>
                                ))}
                                {/* Placeholder for when no results are available yet */}
                                {!result && (
                                    <>
                                        <li className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-gray-400 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>{" "}
                                            (No feedback yet)
                                        </li>
                                    </>
                                )}
                            </ul>
                            <p className="mt-4 text-sm text-gray-600">
                                Want a better score? Improve your resume by applying the
                                suggestions listed below.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={checkATS}
                        disabled={(!uploadedFile && !savedResume) || loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl text-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                    >
                        {loading ? "Checking Resume..." : "Analyze Resume"}
                    </button>

                    {/* ATS Analysis Report - Existing component */}



                    {result && (
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 pb-4 border-b-2 border-purple-200">
                                Detailed ATS Report
                            </h2>

                            {/* Conditional rendering for strengths, weaknesses, and suggestions using CollapsibleSection */}
                            {result.strengths?.length > 0 && (
                                <CollapsibleSection
                                    sectionTitle="Strengths"
                                    items={result.strengths.map((s: string) => ({
                                        title: s,
                                        content: [],
                                    }))}
                                    colorClass="text-green-700"
                                    bgColorClass="bg-green-50"
                                    disableItemCollapse={false} // Strengths can be collapsible
                                />
                            )}

                            {result.weaknesses?.length > 0 && (
                                <CollapsibleSection
                                    sectionTitle="Areas for Improvement (Weaknesses)"
                                    items={result.weaknesses.map((w: string) => ({
                                        title: w,
                                        content: [],
                                    }))}
                                    colorClass="text-red-700"
                                    bgColorClass="bg-red-50"
                                    disableItemCollapse={true} // Weaknesses should not be collapsible
                                />
                            )}

                            {result.suggestions?.length > 0 && (
                                <CollapsibleSection
                                    sectionTitle="Suggestions"
                                    items={result.suggestions.map((s: string) => ({
                                        title: s,
                                        content: [],
                                    }))}
                                    colorClass="text-blue-700"
                                    bgColorClass="bg-blue-50"
                                    disableItemCollapse={true} // Suggestions should not be collapsible
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </section>
    );
}
