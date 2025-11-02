"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TripForm, { TripFormData } from "@/app/components/TripForm";
import TripResult from "@/app/components/TripResult";
import { sendTripRequest } from "@/app/api/tripApi";
import "./globals.css";

export default function Page() {
  const [form, setForm] = useState<TripFormData>({
    origin: "",
    destination: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      return d.toISOString().split("T")[0];
    })(),
    interests: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [itineraryRaw, setItineraryRaw] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(payload: TripFormData) {
    setStatus("loading");
    setItineraryRaw(null);
    setErrorMessage(null);

    try {
      const result = await sendTripRequest(payload);
      setItineraryRaw(result.itinerary || "");
      setStatus("success");
    } catch (err: any) {
      console.error("❌ Error in handleSubmit:", err);
      setErrorMessage(err?.message || "Unexpected error occurred");
      setStatus("error");
    }
  }

  function handleReset() {
    setForm({
      origin: "",
      destination: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 4);
        return d.toISOString().split("T")[0];
      })(),
      interests: "",
    });
    setItineraryRaw(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  // Scroll to result smoothly whenever it appears
  useEffect(() => {
    if ((status === "success" || status === "error") && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  return (
    <main className="min-h-screen font-sans">
      {/* Header */}
      <header className="header-bg text-white py-12 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--vacai-gold)] shadow-lg">
              <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12l20-7-9 7 9 7-20-7z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight"> Trip Planner • AI Agents</h1>
              <p className="text-blue-200 mt-1 text-lg">💫 Your Next Adventure, Perfectly Designed by Artificial Intelligence.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 pb-12">
        <div className="w-full max-w-6xl mx-auto px-8 -mt-10 pb-12 flex flex-col gap-8">
          {/* Trip Form */}
          <TripForm
            formData={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={status === "loading"}
          />

          {/* Collapsible Result Section */}
          <div className="min-h-[150px] w-full flex flex-col gap-4">
            <AnimatePresence>
              {(status === "success" || status === "error" || status === "loading") && (
                <motion.div
                  ref={resultRef}
                  key="trip-result"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <TripResult
                    result={itineraryRaw}
                    isLoading={status === "loading"}
                    statusLog={[]}
                    error={errorMessage}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}


