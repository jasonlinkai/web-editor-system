"use client";
import { useRouter } from "next/navigation";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStores();
  const router = useRouter();

  if (!isAuthenticated) {
    router.replace("/backend/login");
    return null;
  } else {
    return children;
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
