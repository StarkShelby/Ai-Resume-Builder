"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ATSCheckPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/resume/checker");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to ATS checker...</p>
      </div>
    </div>
  );
}

