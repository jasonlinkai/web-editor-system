"use client";

import { getToken } from "source/libs/http";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace("/backend/login");
    }
  }, [router]);
  return children;
}
