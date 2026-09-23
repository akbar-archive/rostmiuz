"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Invalid email or password.");
      setSubmitting(false);
    }
  }

  return { email, setEmail, password, setPassword, error, submitting, handleSubmit };
}
