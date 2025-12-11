"use client";
import { useState, useEffect, ReactNode } from "react";
import { isAuthenticated, AUTH_CHANGE_EVENT } from "../services/auth";
import LoginForm from "../components/LoginForm";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handler = () => setAuthed(isAuthenticated());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  if (loading) return null;
  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;
  return <>{children}</>;
} 