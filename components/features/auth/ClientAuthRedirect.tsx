"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ClientAuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home-page");
      } else {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return null; 
  }

  return <>{children}</>;
}
