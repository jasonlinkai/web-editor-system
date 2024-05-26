"use client";
import { useStores } from "@/libs/mobx/useMobxStateTreeStores";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";

const Redirect = observer(() => {
  const { setToken } = useStores();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const credential =
      searchParams !== null ? searchParams.get("credential") : "";
    if (credential) {
      setToken(credential || "");
      router.replace("/backend/protected/home");
    } else {
      router.replace("/backend/login");
    }
  }, [setToken, router, searchParams]);

  return <div>Redirecting...</div>;
});

export default Redirect;
