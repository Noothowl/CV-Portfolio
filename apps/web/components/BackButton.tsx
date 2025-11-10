"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/projects" }: { fallback?: string }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback, { scroll: false });
    }
  }

  return (
    <button className="btn-secondary" onClick={goBack} aria-label="Back">
      ←
    </button>
  );
}
