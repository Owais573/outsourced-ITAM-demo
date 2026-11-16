import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Role, Clearance } from '../../types';

interface ExecutiveWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClearance: Clearance;
  currentRole: Role;
  onConfirmWaiver: (reason: string) => void;
}

export const ExecutiveWaiverModal: React.FC<ExecutiveWaiverModalProps> = ({
  isOpen,
  onClose,
  activeClearance,
  currentRole,
  onConfirmWaiver
}) => {
  const [reasonInput, setReasonInput] = useState('');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waiver-modal-title"
      className="fixed inset-0 z-50 bg-[#05253D]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#DCE5EA] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#05253D] text-white flex items-center justify-between shrink-0">
          <span id="waiver-modal-title" className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00C8E8]" />
            Executive Clearance Exception Waiver (`CLR-03`)
          </span>
          <button onClick={onClose} className="text-[#8797A2] hover:text-white p-1" aria-label="Close modal">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-[#102A3A] leading-relaxed">
            Unreturned serialized assets normally impose a <strong>hard system block</strong> on Staff Exit Clearance. An independent executive approver (VPQS) may record a formal exception justification (e.g., authorized payroll deduction settlement or police blotter write-off).
          </p>

          <div className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
            <span className="text-[#607482] block text-[11px]">Employee Clearance Case:</span>
            <span className="font-bold text-[#05253D] text-xs">
              {activeClearance.displayName} ({activeClearance.employeeId}) • {activeClearance.department}
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[#102A3A] mb-1">
              Mandatory Executive Exception Justification *
            </label>
            <textarea
              rows={3}
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="e.g., Authorized final pay deduction settlement signed with HR & Legal Counsel (Ref #LEG-2026-88)."
              className="w-full p-2.5 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA] focus:outline-none focus:border-[#00C8E8] text-xs text-[#102A3A]"
            />
          </div>

          {!currentRole.canApproveClearanceWaiver && (
            <div className="p-3 rounded-lg bg-[#FEF8EC] border border-[#B7791F]/30 text-[#B7791F] font-medium leading-snug">
              Note: Your active persona (<strong>{currentRole.name}</strong>) does not hold executive waiver authority. Confirming here simulates executive sign-off as <strong>Elena Rodriguez (VPQS)</strong>.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE5EA]">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg font-semibold border border-[#DCE5EA] hover:bg-[#F5F8FA]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const finalReason = reasonInput.trim() || 'Authorized final pay deduction settlement signed with HR & Legal (#LEG-2026-88).';
                onConfirmWaiver(finalReason);
                onClose();
              }}
              className="px-4 py-2 rounded-lg font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
            >
              Confirm Executive Waiver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
