import React, { useState, useEffect, useRef } from 'react';
import { Search, X, QrCode } from 'lucide-react';
import { Asset } from '../../types';
import { StatusBadge } from '../feedback/Badges';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = assets.filter((a) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      a.assetTag.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q) ||
      a.assignee.toLowerCase().includes(q) ||
      (a.hubspotTicket && a.hubspotTicket.toLowerCase().includes(q))
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-[#05253D]/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-16 p-3 sm:p-4 animate-fadeIn"
    >
      <div 
        className="bg-white rounded-2xl max-w-xl w-full border border-[#DCE5EA] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar with Search, Inline Clear, and Explicit Close Button */}
        <div className="p-3 sm:p-3.5 border-b border-[#DCE5EA] flex items-center gap-2.5 sm:gap-3 shrink-0 bg-white">
          <Search className="w-4 h-4 text-[#00B7D8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Tag, Serial, Assignee, HubSpot #..."
            className="flex-1 text-xs sm:text-sm text-[#102A3A] focus:outline-none placeholder:text-[#8797A2] bg-transparent min-w-0"
            aria-label="Search assets query"
          />

          {/* Inline Clear Search Query Button (visible when text is entered) */}
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-[#8797A2] hover:text-[#05253D] hover:bg-[#EEF3F6] active:bg-[#DCE5EA] transition-colors shrink-0 cursor-pointer"
              title="Clear search text"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dedicated Close Button for Mobile & Desktop */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5F8FA] hover:bg-[#EEF3F6] active:bg-[#DCE5EA] border border-[#DCE5EA] text-[#05253D] font-semibold text-xs transition-colors shrink-0 shadow-2xs cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00C8E8]/40"
            aria-label="Close search"
            title="Close search modal (ESC)"
          >
            <X className="w-4 h-4 text-[#05253D] stroke-[2.3]" />
            <span className="text-xs">Close</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-white text-[#607482] border border-[#DCE5EA] rounded shadow-2xs ml-0.5">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-[#DCE5EA] text-xs">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-[#607482]">
              No assets matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  onSelectAsset(a);
                  onClose();
                }}
                className="w-full py-2.5 px-3 hover:bg-[#EAFBFD] flex items-center justify-between text-left rounded-lg transition-colors gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#05253D] tabular-nums">{a.assetTag}</span>
                    <span className="font-medium text-[#102A3A] truncate">{a.model}</span>
                  </div>
                  <div className="text-[11px] text-[#607482] mt-0.5 tabular-nums truncate">
                    Custody: {a.assignee} • S/N: {a.serialNumber} • {a.siteName}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={a.status} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
