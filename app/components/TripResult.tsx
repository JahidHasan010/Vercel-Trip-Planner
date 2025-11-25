"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle, Smile, Loader2, XCircle, ClipboardCopy } from "lucide-react";

interface TripResultProps {
  result: string | null;
  isLoading: boolean;
  statusLog: any[];
  error: string | null;
}

export default function TripResult({ result, isLoading, statusLog, error }: TripResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // // Render markdown itinerary content
  // const renderItineraryContent = (text: string) => (
  //   <div className="prose max-w-none bg-white rounded-xl shadow-inner border border-gray-200 p-6 leading-relaxed text-gray-800">
  //     <ReactMarkdown>{text}</ReactMarkdown>
  //   </div>
  // );

  const renderItineraryContent = (text: string) => {
  if (!text) return null;

  const lines = text.split(/\n+/).filter(line => line.trim() !== "");
  const mainTitle = lines.length > 0 ? lines[0].trim() : "";
  const contentLines = lines.slice(1);

  const content: React.ReactNode[] = [];
  let currentList: string[] = [];

  // Helper to flush current bullet list
  const flushList = (key: string) => {
    if (currentList.length > 0) {
      content.push(
        <ul
          key={`list-${key}`}
          className="ml-6 list-disc text-gray-700 space-y-1"
        >
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  // 🎯 Flexible section header patterns
  const headerPatterns = [
    {
      regex: /(Overview|Trip Overview|Summary|Introduction)/i,
      className:
        "text-2xl font-bold text-blue-700 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "🌍",
    },
    {
      regex: /(Quick budget snapshot|Budget breakdown|Cost overview)/i,
      className:
        "text-2xl font-bold text-amber-600 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "💰",
    },
    {
      regex: /(High-level daily plan|Daily itinerary|Schedule)/i,
      className:
        "text-2xl font-bold text-green-700 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "📅",
    },
    {
      regex: /(Free & low-cost activities|Free activities|Budget-friendly ideas)/i,
      className:
        "text-2xl font-bold text-indigo-600 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "🪙",
    },
    {
      regex: /(Paid activities|Tickets & Tours|Paid experiences)/i,
      className:
        "text-2xl font-bold text-rose-600 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "🎟️",
    },
    {
      regex: /(Packing suggestions|Packing checklist|Family packing tips|Packing & gear)/i,
      className:
        "text-2xl font-bold text-yellow-600 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "🎒",
    },
    {
      regex: /(Family travel tips|Travel Tips & Safety Notes|Travel tips)/i,
      className:
        "text-2xl font-bold text-purple-700 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "🛡️",
    },
    {
      regex: /(Optional add-ons|Next steps|Checklist)/i,
      className:
        "text-2xl font-bold text-teal-700 mt-6 mb-2 border-b border-gray-200 pb-1",
      icon: "✅",
    },
  ];

  // 🔍 Parse content line-by-line
  contentLines.forEach((line, index) => {
    const trimmed = line.trim();
    const key = `${index}-${trimmed.slice(0, 10)}`;

    // Match predefined headers
    const matchedHeader = headerPatterns.find(h => h.regex.test(trimmed));
    if (matchedHeader) {
      flushList(key);
      content.push(
        <h2 key={key} className={matchedHeader.className}>
          {matchedHeader.icon} {trimmed}
        </h2>
      );
      return;
    }

    // 🧭 Detect “Day 1 — …” style titles
    if (/^Day\s*\d+/i.test(trimmed)) {
      flushList(key);
      content.push(
        <h3
          key={key}
          className="text-xl font-semibold text-[var(--vacai-blue)] mt-5 mb-2 flex items-center gap-2"
        >
          🧭 {trimmed}
        </h3>
      );
      return;
    }

    // 📋 Subsection headers (Morning, Evening, etc.)
    if (
      /^(Morning|Afternoon|Evening|Recommended restaurants|Accommodation suggestion|Estimated daily cost)/i.test(
        trimmed
      )
    ) {
      flushList(key);
      content.push(
        <h4 key={key} className="text-lg font-bold text-gray-700 mt-3 mb-1">
          {trimmed}
        </h4>
      );
      return;
    }

    // 🔹 Bullet points
    if (/^[-•]\s*/.test(trimmed)) {
      currentList.push(trimmed.replace(/^[-•]\s*/, ""));
      return;
    }

    // 🧾 Label-value lines (e.g. "Location: Tokyo")
    if (trimmed.includes(":")) {
      flushList(key);
      const [label, value] = trimmed.split(/:(.+)/);
      content.push(
        <p key={key} className="text-gray-700">
          <span className="font-semibold text-gray-800">
            {label.trim()}:
          </span>
          {value ? ` ${value.trim()}` : ""}
        </p>
      );
      return;
    }

    // ⚙️ Fallback: automatically bold probable section titles
    if (
      /^[A-Z][a-z].*(activities|suggestion|checklist|tips|overview|plan|cost|gear)/i.test(
        trimmed
      )
    ) {
      flushList(key);
      content.push(
        <h4 key={key} className="text-lg font-bold text-gray-800 mt-3 mb-1">
          {trimmed}
        </h4>
      );
      return;
    }

    // 🧍 Normal text
    flushList(key);
    content.push(
      <p key={key} className="text-gray-700">
        {trimmed}
      </p>
    );
  });

  if (currentList.length > 0) flushList("end");

  return (
    <div className="max-w-none bg-white rounded-xl shadow-inner border border-gray-200 p-6 leading-relaxed text-gray-800 space-y-3">
      {mainTitle && (
        <h1 className="text-3xl font-extrabold text-[var(--vacai-blue)] border-b pb-3 mb-4">
          {mainTitle}
        </h1>
      )}
      {content}
    </div>
  );
};



  // Content rendering based on state
  let content: React.ReactNode;

  // Empty state
  if (!isLoading && !result && !error) {
    content = (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50/50">
        <Smile className="w-14 h-14 text-gray-400 mb-4 animate-bounce" />
        <p className="text-xl font-bold text-gray-600">Your Custom Itinerary Awaits!</p>
        <p className="mt-2 text-md">
          Fill out the form and click <strong>'Generate Itinerary'</strong> to see your plan.
        </p>
      </div>
    );
  } 
  // Loading state
  else if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center text-center text-gray-500">
        <Loader2 className="w-14 h-14 text-[var(--vacai-blue)] animate-spin mb-5" />
        <p className="text-xl font-bold text-gray-600">Crafting Your Journey...</p>
      </div>
    );
  } 
  // Error state
  else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center text-center text-red-600 bg-red-50 border border-red-300 rounded-xl p-8">
        <XCircle className="w-14 h-14 mb-4" />
        <p className="text-2xl font-extrabold">Generation Failed</p>
        <p className="mt-4 text-sm font-medium">Error Details:</p>
        <p className="text-sm font-mono bg-red-100/70 p-4 rounded-lg mt-2 overflow-auto max-w-full text-left border border-red-200 shadow-inner">
          {error}
        </p>
      </div>
    );
  } 
  // Success state with content
  else {
    content = (
      <div className="overflow-y-auto max-h-[600px] pr-4">
        {renderItineraryContent(result || "")}
      </div>
    );
  }

  return (
    <div className="result-card-bg relative flex flex-col gap-4">
      {/* Header with title and copy button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-[var(--vacai-gold)]" />
          Generated AI Itinerary
        </h2>

        {result && !isLoading ? (
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-md ${
              copied
                ? "bg-green-100 text-green-700 border border-green-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" /> Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="w-4 h-4" /> Copy Itinerary
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Main content area */}
      <div className="flex-grow">{content}</div>
    </div>
  );
}