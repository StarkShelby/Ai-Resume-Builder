"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export interface AuthNavbarProps {
  user?: any;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function AuthNavbar({ user, showBackButton }: AuthNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // PAGE CHECK
  const inDashboard = pathname === "/dashboard";
  const inInternalPage =
    pathname?.startsWith("/resume/") && pathname !== "/dashboard";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LEFT SIDE */}
          <div>
            {/* Dashboard → show ONLY logo */}
            {inDashboard && (
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                ResumeForge
              </Link>
            )}

            {/* Internal pages → Back to Dashboard */}
            {showBackButton && (
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm  hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:text-purple-600 font-medium flex items-center"
              >
                ← {"Back to Dashboard"}
              </button>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span
                  className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all font-xl hidden sm:block"
                >
                  Hi, {user?.name || user?.fullName || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium 
             hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
