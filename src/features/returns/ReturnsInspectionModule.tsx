import React, { useState } from 'react';
import { CheckCircle2, Wrench } from 'lucide-react';
import { Asset } from '../../types';
import { StatusBadge, ConditionBadge } from '../../components/feedback/Badges';

interface ReturnsInspectionModuleProps {
  assets: Asset[];
  onCompleteInspection: (outcome: 'GOOD_AVAILABLE' | 'DEFECTIVE_REPAIR', notes: string) => void;
}

export const ReturnsInspectionModule: React.FC<ReturnsInspectionModuleProps> = ({
  assets,
  onCompleteInspection
}) => {
  const targetAsset = assets.find((a) => a.assetTag === 'OPH-AST-00719') || assets[4];

  const [checklist, setChecklist] = useState({
    powerAdapterReturned: true,
    dataWipedNist: true,
    mdmLockRemoved: true,
  });

  const [diagnosticNotes, setDiagnosticNotes] = useState(
    'Trackpad ribbon re-seated, NIST 800-88 SSD purge verified, fresh Windows 11 24H2 image installed.'
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 2 • Return Intake & IT Diagnostic Assessment
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Equipment Returns, Data Wipe & Post-Return Routing
        </h1>
        <p className="text-xs text-[#607482]">
          Returned assets automatically enter <code className="font-mono text-[#B7791F]">UNDER_INSPECTION</code> and cannot be re-issued until IT completes data sanitization and physical condition verification.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DCE5EA]">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-lg font-bold text-[#05253D] tabular-nums">{targetAsset.assetTag}</span>
              <StatusBadge status={targetAsset.status} />
              <ConditionBadge condition={targetAsset.condition} />
            </div>
            <div className="text-sm font-semibold text-[#102A3A] mt-1">
              {targetAsset.model} • S/N: {targetAsset.serialNumber}
            </div>
            <div className="text-xs text-[#607482] mt-0.5">
              Returned by: <strong>Kevin Tan (OPH-10184)</strong> • HubSpot Ticket: <strong>#{targetAsset.hubspotTicket}</strong>
            </div>
          </div>
          <div className="text-xs text-[#607482] tabular-nums">
            Intake Bench: Manila Cyber Sigma — Floor 12 IT Lab
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
              Mandatory IT Return & Sanitization Checklist
            </h3>
            {[
              { key: 'powerAdapterReturned', label: 'Original 65W USB-C Power Adapter & Accessories Verified' },
              { key: 'dataWipedNist', label: 'NIST 800-88 SSD Data Wipe & Fresh OS Reformat Completed' },
              { key: 'mdmLockRemoved', label: 'BIOS Password Cleared & Previous User MDM Profile Unbound' }
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA] text-xs font-medium cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(checklist as any)[item.key]}
                  onChange={(e) =>
                    setChecklist({ ...checklist, [item.key]: e.target.checked })
                  }
                  className="rounded border-[#DCE5EA] text-[#05253D]"
                />
                <span className="text-[#102A3A]">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
              IT Diagnostic Notes & Atomic Post-Inspection Routing
            </h3>
            <textarea
              rows={3}
              value={diagnosticNotes}
              onChange={(e) => setDiagnosticNotes(e.target.value)}
              className="w-full p-3 text-xs bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg text-[#102A3A] focus:outline-none focus:border-[#00C8E8]"
            />
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onCompleteInspection('GOOD_AVAILABLE', diagnosticNotes)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Clear & Restock as AVAILABLE (Good)
              </button>
              <button
                onClick={() => onCompleteInspection('DEFECTIVE_REPAIR', diagnosticNotes)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#FDEDED] hover:bg-[#C83C3C] text-[#C83C3C] hover:text-white border border-[#C83C3C]/30 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                Flag Defective & Route to UNDER_REPAIR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
