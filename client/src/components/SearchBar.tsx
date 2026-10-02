import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { searchEvents } from "../services/ticketmaster";
import type { Concert } from "../types/concert";

interface SearchBarProps {
  query: string;
  onSearch: (value: string) => void;
  onSelectConcert?: (concert: Concert) => void;
}

export function SearchBar({ query, onSearch, onSelectConcert }: SearchBarProps) {
  const [results, setResults] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        const data = await searchEvents(query);
        setResults(data);
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by artist or show..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => query.length > 2 && setIsOpen(true)}
        className={`
          text-white font-mono
          placeholder:text-gray-600 placeholder:font-sans
          bg-[#121212]/50 hover:bg-gray-500/10 
          min-w-full min-h-8 rounded-lg p-3 focus:outline-1 focus:outline-[#262626]
          caret-[#0457cb] cursor-text
        `}
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            onSearch("");
            setResults([]);
            setIsOpen(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0457cb] hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}