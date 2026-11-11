"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/admin/login/login.module.css";

export function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setLoading(false);
      setError(payload.error ?? "Login admin gagal.");
      return;
    }
    window.location.assign("/admin");
  }

  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.field}><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required/></div>
    <div className={styles.field}><label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required/></div>
    <p className={styles.error} role="alert">{error}</p>
    <button className={styles.submit} type="submit" disabled={loading}>{loading ? "Memeriksa…" : "Masuk ke admin"}</button>
  </form>;
}
