"use client";

import { useEffect, useState } from "react";
import type { Design } from "./mock-data";

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/designs", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ designs: Design[] }>;
      })
      .then(({ designs: value }) => setDesigns(value))
      .catch(() => setError("Katalog desain gagal dimuat dari database."))
      .finally(() => setLoading(false));
  }, []);

  return { designs, loading, error };
}
