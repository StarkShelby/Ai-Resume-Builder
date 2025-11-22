"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    toast.success("Logged out");
    setUser(null);
  };

  useEffect(() => {
    // detect scroll
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // detect logged-in user
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (userData) {
      setUser(JSON.parse(userData));
    } else if (token) {
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
        })
        .catch(() => {
          // Invalid token or fetch failed
          Cookies.remove("token");
          setUser(null);
        });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❌ DO NOT SHOW NAVBAR ON LOGIN / SIGNUP PAGES
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            ResumeForge
          </Link>

          {/* Right menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-medium font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Hi, {user?.name || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 shadow-lg"
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
