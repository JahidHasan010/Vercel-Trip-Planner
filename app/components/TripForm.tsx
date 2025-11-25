// // custome data with fuzzy search

// "use client";
// import React, { useState } from "react";
// import { MapPin, Calendar, Users, Send, Loader2, RefreshCw } from "lucide-react";
// import Fuse from "fuse.js";
// import { customCities } from "@/app/data/customCities"; // 👈 your 1000-city dataset

// export type TripFormData = {
//   origin: string;
//   destination: string;
//   start_date: string;
//   end_date: string;
//   interests: string;
// };

// type Props = {
//   formData: TripFormData;
//   onChange: (s: TripFormData) => void;
//   onSubmit: (payload: TripFormData) => Promise<void>;
//   onReset: () => void;
//   loading?: boolean;
// };

// // -------------------------------------------------------------------
// // ✅ Fuse.js configuration (fuzzy search engine)
// // -------------------------------------------------------------------
// const fuse = new Fuse(customCities, {
//   keys: ["city", "country"],
//   threshold: 0.3, // lower = stricter, higher = fuzzier (0.3 is a good balance)
//   includeScore: true,
// });

// export default function TripForm({
//   formData,
//   onChange,
//   onSubmit,
//   onReset,
//   loading,
// }: Props) {
//   const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
//   const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
//   const [typingField, setTypingField] = useState<"origin" | "destination" | null>(null);

//   // -------------------------------------------------------------------
//   // ✅ Fuzzy filter using Fuse.js
//   // -------------------------------------------------------------------
//   function filterCitiesFuzzy(query: string): string[] {
//     if (!query.trim()) return [];
//     const results = fuse.search(query);
//     return results.slice(0, 10).map((r) => `${r.item.city}, ${r.item.country}`);
//   }

//   // -------------------------------------------------------------------
//   // ✅ Debounce utility to prevent over-filtering
//   // -------------------------------------------------------------------
//   let debounceTimer: NodeJS.Timeout;
//   function debounceFilter(value: string, field: "origin" | "destination") {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => {
//       const suggestions = filterCitiesFuzzy(value);
//       if (field === "origin") setOriginSuggestions(suggestions);
//       else setDestSuggestions(suggestions);
//     }, 250);
//   }

//   // -------------------------------------------------------------------
//   // ✅ Input handler
//   // -------------------------------------------------------------------
//   function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
//     const { name, value } = e.target;
//     onChange({ ...formData, [name]: value });

//     if (name === "origin" || name === "destination") {
//       setTypingField(name);
//       debounceFilter(value, name as "origin" | "destination");
//     }
//   }

//   // -------------------------------------------------------------------
//   // ✅ Suggestion click handler
//   // -------------------------------------------------------------------
//   function handleSuggestionClick(value: string, field: "origin" | "destination") {
//     onChange({ ...formData, [field]: value });
//     if (field === "origin") setOriginSuggestions([]);
//     else setDestSuggestions([]);
//   }

//   // -------------------------------------------------------------------
//   // ✅ Form submission
//   // -------------------------------------------------------------------
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!formData.origin || !formData.destination || !formData.start_date || !formData.end_date)
//       return;
//     if (new Date(formData.start_date) > new Date(formData.end_date)) return;
//     await onSubmit(formData);
//   }

//   // -------------------------------------------------------------------
//   // ✅ UI
//   // -------------------------------------------------------------------
//   return (
//     <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-200 flex flex-col h-fit lg:sticky lg:top-6">
//       <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4 border-gray-100">
//         <RefreshCw className="w-6 h-6 text-[var(--vacai-blue)]" />
//         Plan Your Travel 
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6" id="trip-form">
//         {/* ------------------ ORIGIN & DESTINATION ------------------ */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Origin */}
//           <div className="relative">
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               🌍 Origin <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 name="origin"
//                 value={formData.origin}
//                 onChange={handleInput}
//                 disabled={loading}
//                 className="input-field pl-10"
//                 placeholder="  Enter origin city (e.g., London, UK)"
//                 autoComplete="off"
//               />
//             </div>

//             {/* 🔽 Suggestions dropdown for Origin */}
//             {originSuggestions.length > 0 && typingField === "origin" && (
//               <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
//                 {originSuggestions.map((city, idx) => (
//                   <li
//                     key={idx}
//                     onClick={() => handleSuggestionClick(city, "origin")}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                   >
//                     {city}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Destination */}
//           <div className="relative">
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               🗺️ Destination <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 name="destination"
//                 value={formData.destination}
//                 onChange={handleInput}
//                 disabled={loading}
//                 className="input-field pl-10"
//                 placeholder="  Enter destination (e.g., Paris, France)"
//                 autoComplete="off"
//               />
//             </div>

//             {/* 🔽 Suggestions dropdown for Destination */}
//             {destSuggestions.length > 0 && typingField === "destination" && (
//               <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
//                 {destSuggestions.map((city, idx) => (
//                   <li
//                     key={idx}
//                     onClick={() => handleSuggestionClick(city, "destination")}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                   >
//                     {city}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* ------------------ DATES ------------------ */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               📅 Start Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               name="start_date"
//               type="date"
//               value={formData.start_date}
//               onChange={handleInput}
//               disabled={loading}
//               min={new Date().toISOString().split("T")[0]}
//               className="input-field pl-10"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1">
//               📅 End Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               name="end_date"
//               type="date"
//               value={formData.end_date}
//               onChange={handleInput}
//               disabled={loading}
//               min={formData.start_date || new Date().toISOString().split("T")[0]}
//               className="input-field pl-10"
//             />
//           </div>
//         </div>

//         {/* ------------------ INTERESTS ------------------ */}
//         <div>
//           <label className="block text-sm font-bold text-gray-700 mb-1">
//             🧑‍🤝‍🧑 Traveler High-Level Interests <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="interests"
//             value={formData.interests}
//             onChange={handleInput}
//             disabled={loading}
//             rows={4}
//             className="input-field pl-10 resize-none"
//             placeholder="e.g., Adventure, Romantic, Cultural, Relaxation, Food & Wine, Nature & Wildlife, Luxury, Budget-Friendly, Family Fun, Beach Escape, Historical Sites"
//           />
//         </div>

//         {/* ------------------ BUTTONS ------------------ */}
//         <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//           <button
//             type="button"
//             onClick={onReset}
//             disabled={loading}
//             className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
//           >
//             Clear Form & Result
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="btn-primary flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...
//               </>
//             ) : (
//               <>
//                 <Send className="w-5 h-5" /> Generate Itinerary
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { MapPin, Calendar, Users, Send, Loader2, RefreshCw } from "lucide-react";
import Fuse from "fuse.js";
import { customCities } from "@/app/data/customCities"; // 👈 your 1000-city dataset

export type TripFormData = {
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  interests: string;
};

type Props = {
  formData: TripFormData;
  onChange: (s: TripFormData) => void;
  onSubmit: (payload: TripFormData) => Promise<void>;
  onReset: () => void;
  loading?: boolean;
};

// ------------------ Fuse.js for cities ------------------
const fuseCities = new Fuse(customCities, {
  keys: ["city", "country"],
  threshold: 0.3,
  includeScore: true,
});

// ------------------ Interests list & Fuse ------------------
const allInterests = [
  "Adventure",
  "Cultural / Heritage",
  "Nature & Wildlife",
  "Beach & Seaside",
  "Wellness & Spa",
  "Food & Culinary",
  "Photography",
  "History & Archaeology",
  "Luxury & High-end Travel",
  "Budget / Backpacking",
  "Family Travel",
  "Romance & Couples",
  "Eco / Sustainable Travel",
  "Voluntourism / Social Impact",
  "Spiritual / Pilgrimage",
  "Nightlife & Party",
  "Sports & Adventure Sports",
  "Festival & Events Travel",
  "Roadtrip & Overlanding",
  "Wildlife Safaris",
  "Medical / Health Tourism",
  "Learning / Educational Travel",
  "Dark Travel / Thanatourism",
  "Birdwatching / Ornithology",
  "Nocturnal Travel (Stargazing, Night Tours)"
];

const fuseInterests = new Fuse(allInterests, {
  threshold: 0.3,
  includeScore: true,
});

export default function TripForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  loading,
}: Props) {
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [interestSuggestions, setInterestSuggestions] = useState<string[]>([]);
  const [typingField, setTypingField] = useState<"origin" | "destination" | "interests" | null>(null);

  // ------------------ City fuzzy search ------------------
  function filterCitiesFuzzy(query: string): string[] {
    if (!query.trim()) return [];
    const results = fuseCities.search(query);
    return results.slice(0, 10).map((r) => `${r.item.city}, ${r.item.country}`);
  }

  let debounceTimer: NodeJS.Timeout;
  function debounceFilter(value: string, field: "origin" | "destination") {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const suggestions = filterCitiesFuzzy(value);
      if (field === "origin") setOriginSuggestions(suggestions);
      else setDestSuggestions(suggestions);
    }, 250);
  }

  // ------------------ Handle city input ------------------
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });

    if (name === "origin" || name === "destination") {
      setTypingField(name);
      debounceFilter(value, name as "origin" | "destination");
    } else if (name === "interests") {
      setTypingField("interests");
      handleInterestInput(e as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }

  // ------------------ Interests fuzzy search (anywhere in textarea) ------------------
  function handleInterestInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    onChange({ ...formData, interests: value });

    const cursorPos = e.target.selectionStart || value.length;

    // Split text into words separated by comma
    const splitValues = value.split(",");
    let cumulativeLength = 0;
    let currentWordIndex = 0;

    for (let i = 0; i < splitValues.length; i++) {
      cumulativeLength += splitValues[i].length + 1; // +1 for comma
      if (cumulativeLength >= cursorPos) {
        currentWordIndex = i;
        break;
      }
    }

    const currentWord = splitValues[currentWordIndex].trim();
    if (!currentWord) return setInterestSuggestions([]);

    const results = fuseInterests.search(currentWord).map(r => r.item);
    setInterestSuggestions(results.slice(0, 5));
    setTypingField("interests");
  }

  // ------------------ Replace current word on suggestion click ------------------
  function handleInterestClick(selected: string) {
    const splitValues = formData.interests.split(",");
    let cumulativeLength = 0;
    let cursorPos = splitValues.join(",").length;

    const newValues = splitValues.map((word) => {
      if (word.trim() !== "" && interestSuggestions.includes(word.trim())) {
        const replaced = selected;
        interestSuggestions.splice(interestSuggestions.indexOf(word.trim()), 1); // remove replaced
        return replaced;
      }
      return word.trim();
    });

    // If nothing replaced (user typing at end)
    if (!newValues.includes(selected)) newValues.push(selected);

    onChange({ ...formData, interests: newValues.join(", ") });
    setInterestSuggestions([]);
  }

  // ------------------ Suggestion click handler ------------------
  function handleSuggestionClick(value: string, field: "origin" | "destination") {
    onChange({ ...formData, [field]: value });
    if (field === "origin") setOriginSuggestions([]);
    else setDestSuggestions([]);
  }

  // ------------------ Form submit ------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.origin || !formData.destination || !formData.start_date || !formData.end_date) return;
    if (new Date(formData.start_date) > new Date(formData.end_date)) return;
    await onSubmit(formData);
  }

  // ------------------ UI ------------------
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-200 flex flex-col h-fit lg:sticky lg:top-6">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4 border-gray-100">
        <RefreshCw className="w-6 h-6 text-[var(--vacai-blue)]" />
        Plan Your Travel 
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" id="trip-form">
        {/* ------------------ ORIGIN & DESTINATION ------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              🌍 Origin <span className="text-red-500">*</span>
            </label>
            <input
              name="origin"
              value={formData.origin}
              onChange={handleInput}
              disabled={loading}
              className="input-field pl-10"
              placeholder="Enter origin city (e.g., London, UK)"
              autoComplete="off"
            />
            {originSuggestions.length > 0 && typingField === "origin" && (
              <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {originSuggestions.map((city, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionClick(city, "origin")}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              🗺️ Destination <span className="text-red-500">*</span>
            </label>
            <input
              name="destination"
              value={formData.destination}
              onChange={handleInput}
              disabled={loading}
              className="input-field pl-10"
              placeholder="Enter destination (e.g., Paris, France)"
              autoComplete="off"
            />
            {destSuggestions.length > 0 && typingField === "destination" && (
              <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {destSuggestions.map((city, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionClick(city, "destination")}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ------------------ DATES ------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              📅 Start Date <span className="text-red-500">*</span>
            </label>
            <input
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInput}
              disabled={loading}
              min={new Date().toISOString().split("T")[0]}
              className="input-field pl-10"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              📅 End Date <span className="text-red-500">*</span>
            </label>
            <input
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleInput}
              disabled={loading}
              min={formData.start_date || new Date().toISOString().split("T")[0]}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* ------------------ INTERESTS ------------------ */}
        <div className="relative">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            🧑‍🤝‍🧑 Traveler High-Level Interests <span className="text-red-500">*</span>
          </label>
          <textarea
            name="interests"
            value={formData.interests}
            onChange={handleInput}
            disabled={loading}
            rows={4}
            className="input-field pl-10 resize-none"
            placeholder="e.g., Adventure, Romantic, Cultural..."
          />
          {interestSuggestions.length > 0 && typingField === "interests" && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {interestSuggestions.map((interest, idx) => (
                <li
                  key={idx}
                  onClick={() => handleInterestClick(interest)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {interest}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ------------------ BUTTONS ------------------ */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear Form & Result
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Generate Itinerary
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}



