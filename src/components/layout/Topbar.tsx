import React from 'react';
import {
  Menu,
  Search,
  Building2,
  KeyRound,
  Database,
  ChevronRight
} from 'lucide-react';
import { SITES } from '../../data/roles';
import { Role } from '../../types';

interface TopbarProps {
  activeModuleTitle: string;
  selectedSite: string;
  onSelectSite: (site: string) => void;
  currentRole: Role;
  onSelectRole: (roleId: string) => void;
  roles: Role[];
  onOpenCommandSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeModuleTitle,
  selectedSite,
  onSelectSite,
  currentRole,
  onSelectRole,
  roles,
  onOpenCommandSearch,
  onOpenMobileMenu
}) => {
  return (
    <header className="h-16 bg-white border-b border-[#DCE5EA] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-20">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] text-[#05253D] hover:bg-[#EAFBFD] hover:border-[#00C8E8] hover:text-[#00B7D8] active:bg-[#DDF7FB] active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00C8E8]/40"
          aria-label="Open navigation sidebar"
          title="Open navigation menu"
        >
          <Menu className="w-5 h-5 stroke-[2.3]" />
        </button>

        <div className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
          <span className="text-[#607482] font-medium hidden sm:inline">Outsourced ITAM</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#8797A2] hidden sm:inline" />
          <span className="font-semibold text-[#05253D] truncate">{activeModuleTitle}</span>
        </div>

        <span
          title="DESIGN.md Section 14 Compliance: Clearly labelled seeded demo data for internal team review"
          className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAFBFD] text-[#05253D] border border-[#00C8E8]/40 shrink-0"
        >
          <Database className="w-3 h-3 text-[#00B7D8]" />
          SEEDED DEMO
        </span>
      </div>

      {/* Center: Global Command Search (Ctrl+K) */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-2 min-w-0">
        <button
          onClick={onOpenCommandSearch}
          className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs text-[#607482] bg-[#F5F8FA] hover:bg-[#EEF3F6] border border-[#DCE5EA] rounded-xl sm:rounded-lg transition-colors cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#00C8E8]/40"
          aria-label="Search asset registry"
        >
          <span className="flex items-center gap-2 truncate min-w-0">
            <Search className="w-4 h-4 text-[#00B7D8] shrink-0" />
            <span className="truncate hidden sm:inline">Search tag, serial, employee, HubSpot...</span>
            <span className="truncate sm:hidden text-[#607482]">Search assets...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-white text-[#102A3A] border border-[#DCE5EA] rounded shadow-2xs tabular-nums shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Site Scope Selector & RBAC Role Persona Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Site Scope Filter */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg px-2.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-[#00B7D8] shrink-0" />
          <select
            aria-label="Site Scope Selector"
            value={selectedSite}
            onChange={(e) => onSelectSite(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#102A3A] focus:outline-none cursor-pointer"
          >
            {SITES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.short}
              </option>
            ))}
          </select>
        </div>

        {/* RBAC Role Persona Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#05253D] text-white px-2 sm:px-3 py-1 rounded-lg border border-[#092741] shrink-0">
          <KeyRound className="w-3.5 h-3.5 text-[#00C8E8] shrink-0" />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#00C8E8] font-bold leading-none">
              RBAC Persona
            </span>
            <select
              aria-label="RBAC Role Switcher"
              value={currentRole.id}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-[#05253D] text-white text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer max-w-[85px] xs:max-w-[110px] sm:max-w-[160px] truncate"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#05253D] text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
