"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import AuthNavbar from "@/components/AuthNavbar";

export default function JobMatcherPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      toast.error("Both resume & job description required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analysis/jd-match`,
        {
          resume: resumeText,
          jobDesc: jobDesc,
        }
      );

      setResult(res.data);
      toast.success("Job match generated!");
    } catch (err) {
      toast.error("Failed to process job description");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <AuthNavbar showBackButton backHref="/dashboard" />

      <main className="max-w-4xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Job Description Matcher
        </h1>

        {/* Resume Input */}
        <textarea
          placeholder="Paste Resume Text Here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full h-40 p-4 border rounded-xl bg-white shadow mb-4"
        />

        {/* JD Input */}
        <textarea
          placeholder="Paste Job Description Here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full h-40 p-4 border rounded-xl bg-white shadow mb-6"
        />

        <button
          onClick={handleMatch}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow disabled:opacity-50"
        >
          {loading ? "Matching..." : "Match with Job"}
        </button>

        {/* RESULTS */}
        {result && (
          <div className="mt-8 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Job Match Score
              </h2>
              <p className="text-5xl font-bold text-purple-600">
                {result.score}%
              </p>
            </div>

            {result.missingKeywords?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-bold text-red-600 mb-3">
                  Missing Keywords
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {result.missingKeywords.map((kw: string, i: number) => (
                    <li key={i}>{kw}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow border">
                <h2 className="text-xl font-bold text-blue-600 mb-3">
                  Suggestions to Improve Match
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
