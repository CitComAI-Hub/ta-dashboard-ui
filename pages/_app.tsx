import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/auth";
import LoginForm from "../components/LoginForm";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setLoading(false);
  }, []);

  if (loading) return null;
  if (!authed) return <LoginForm onLogin={() => { setAuthed(true); }} />;

  return <Component {...pageProps} />;
} 