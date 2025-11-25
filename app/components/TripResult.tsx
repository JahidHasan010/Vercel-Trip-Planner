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

  // Render markdown itinerary content
  const renderItineraryContent = (text: string) => (
    <div className="prose max-w-none bg-white rounded-xl shadow-inner border border-gray-200 p-6 leading-relaxed text-gray-800">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );



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