"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import AuthNavbar from "@/components/AuthNavbar";
import ResumePreview from "@/components/ResumePreview";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  FileText,
  Clock,
  Edit,
  Eye,
  CheckCircle,
  Download,
  Trash2
} from "lucide-react";

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

  // Helper to get template image
  const getTemplateImage = (templateId: string) => {
    const map: Record<string, string> = {
      "templateA": "/templates/template_a.png",
      "templateB": "/templates/template_b.png",
      "resume_01": "/templates/resume_01_v2.png",
      "resume_02": "/templates/resume_02_v2.png",
      "resume_03": "/templates/resume_03_v2.png",
      "resume_04": "/templates/resume04.png",
      "resume_05": "/templates/resume_05_v2.png",
      "resume_06": "/templates/resume_06_v2.png",
    };
    return map[templateId] || "/templates/template_a.png"; // Default fallback
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Animated Background (Matches Home Page) */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <AuthNavbar user={user} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your resumes and track your progress.</p>
            </div>
            <Link href="/create">
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Create New Resume
              </Button>
            </Link>
          </motion.div>

          {resumes.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-16 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileText className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No resumes yet</h3>
              <p className="text-gray-600 max-w-md mb-8 text-lg">
                Start your professional journey. Create your first AI-powered resume in minutes.
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Plus className="w-6 h-6 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Resume Grid */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {resumes.map((resume) => (
                <motion.div
                  key={resume._id}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="group h-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 backdrop-blur-xl border-white/60 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden flex flex-col rounded-3xl border hover:border-purple-300/50">
                    {/* Card Header / Preview Image */}
                    <div className="h-64 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                      <img
                        src={getTemplateImage(resume.template)}
                        alt={resume.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />



                      {/* Quick Actions Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                          onClick={() => setPreviewingResumeId(resume._id)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                          onClick={() => handleExportPDF(resume._id)}
                        >
                          <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1" title={resume.title}>
                          {resume.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <Link href={`/create?id=${resume._id}&template=${resume.template}`} className="w-full">
                          <Button variant="outline" className="w-full border-gray-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Link href={`/resume/checker?id=${resume._id}`} className="w-full">
                          <Button variant="outline" className="w-full border-gray-200 hover:border-green-200 hover:bg-green-50 hover:text-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 mr-2" /> Check
                          </Button>
                        </Link>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        className="mt-3 w-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(resume._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Resume
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {previewingResumeId && (
            <ResumePreview
              resumeId={previewingResumeId}
              onClose={() => setPreviewingResumeId(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
