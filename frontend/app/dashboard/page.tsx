"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import AuthNavbar from "@/components/AuthNavbar";
import ResumePreview from "@/components/ResumePreview";

interface Resume {
  createdAt: string | number | Date;
  _id: string;
  title: string;
  updatedAt: string;
  template: string;
}

import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewingResumeId, setPreviewingResumeId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Check for token in URL (OAuth callback)
    const urlToken = searchParams.get("token");
    if (urlToken) {
      Cookies.set("token", urlToken, { expires: 7 });
      // Clear URL
      window.history.replaceState({}, document.title, "/dashboard");
    }

    const token = Cookies.get("token") || urlToken;
    const userData = Cookies.get("user");

    // If no token, redirect to login
    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
      fetchResumes();
    } else {
      // Token exists but user data missing - fetch it
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch user");
        })
        .then((data) => {
          setUser(data);
          Cookies.set("user", JSON.stringify(data), { expires: 7 });
          fetchResumes();
        })
        .catch(() => {
          // Invalid token or fetch failed
          Cookies.remove("token");
          router.push("/login");
        });
    }
  }, [searchParams]);

  const fetchResumes = async () => {
    try {
      const token = Cookies.get("token");

      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("TOKEN:", token);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("RESUME FETCH RESPONSE:", response.data);

      // Expected: { data: [...] }
      setResumes(response.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch resumes:", error);

      // If unauthorized, force logout
      if (error?.response?.status === 401) {
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Resume deleted");
      fetchResumes();
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  const handleExportPDF = async (id: string) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${id}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <AuthNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">My Resumes</h1>
          <Link
            href="/create"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            + Create New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <p className="text-gray-600 mb-4 text-lg">
              You don't have any resumes yet.
            </p>
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create your first resume →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {resume.title}
                </h3>

                {/* Created */}
                <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <span className="font-medium">Created:</span>
                  <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                  <span>
                    {new Date(resume.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>

                {/* Updated */}
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-medium">Updated:</span>
                  <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                  <span>
                    {new Date(resume.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>

                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/create?id=${resume._id}&template=${resume.template}`}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/resume/checker?id=${resume._id}`}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Check
                    </Link>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setPreviewingResumeId(resume._id)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Preview
                    </button>
                  </div>

                  <button
                    onClick={() => handleExportPDF(resume._id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {previewingResumeId && (
          <ResumePreview
            resumeId={previewingResumeId}
            onClose={() => setPreviewingResumeId(null)}
          />
        )}
      </main>
    </div>
  );
}
