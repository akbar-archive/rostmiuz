"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { watchAuth } from "@/lib/auth";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
