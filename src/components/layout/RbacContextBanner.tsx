import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { Role } from '../../types';

interface RbacContextBannerProps {
  currentRole: Role;
}

export const RbacContextBanner: React.FC<RbacContextBannerProps> = ({ currentRole }) => {
  return (
    <div className="bg-[#EEF3F6] border-b border-[#DCE5EA] px-4 lg:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-10">
      <div className="flex items-center gap-2 text-[#102A3A] min-w-0">
        <span className="font-semibold text-[#05253D] shrink-0">RBAC Scope:</span>
        <span className="text-[#607482] truncate">{currentRole.description}</span>
      </div>
      <div className="flex items-center gap-3 tabular-nums shrink-0 text-[11px] sm:text-xs">
        <span className="inline-flex items-center gap-1 font-medium">
          Financial Visibility:{' '}
          {currentRole.canViewFinancials ? (
            <span className="text-[#16834A] font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
            </span>
          ) : (
            <span className="text-[#B7791F] font-semibold flex items-center gap-0.5">
              <Lock className="w-3.5 h-3.5" /> Restricted (Hidden)
            </span>
          )}
        </span>
        <span className="text-[#CBD5E1] hidden sm:inline">|</span>
        <span className="hidden sm:inline-flex items-center gap-1 font-medium">
          Self-Approval Override:{' '}
          <span className="text-[#C83C3C] font-semibold">Strictly Blocked</span>
        </span>
      </div>
    </div>
  );
};
