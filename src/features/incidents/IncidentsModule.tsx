import React from 'react';

export const IncidentsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 9 • Factual Discrepancy, Loss & Damage Investigation
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Incidents, Missing Equipment & VPQS Escalations
        </h1>
        <p className="text-xs text-[#607482]">
          Uses neutral, factual investigation language. Reports of lost or stolen assets trigger an immediate automated alert to VPQS. Never makes automated negligence or payroll determinations.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE5EA]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-[#05253D] tabular-nums">INC-2026-007</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#FDEDED] text-[#C83C3C]">
                REPORTED STOLEN — VPQS ESCALATED
              </span>
            </div>
            <div className="text-sm font-semibold text-[#102A3A] mt-1">
              Asset OPH-AST-00698 — Dell Latitude 5430 • Last Known Custodian: Noel Evangelista (OPH-10511)
            </div>
          </div>
          <span className="text-xs text-[#607482] tabular-nums">
            Reported: 2026-11-10 • Linked HubSpot: #HS-89980
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
            <span className="font-bold text-[#05253D] block mb-1">1. Immediate VPQS Notification</span>
            <p className="text-[#607482] leading-relaxed">
              Automated high-priority alert dispatched to Elena Rodriguez (VPQS) via transactional outbox on 2026-11-10 08:14 UTC.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
            <span className="font-bold text-[#05253D] block mb-1">2. Police Report & Affidavit Vault</span>
            <p className="text-[#607482] leading-relaxed">
              Notarized Affidavit of Loss & PNP Blotter Extract (`PNP_Report_2026_1110.pdf`) verified and locked in Document Vault.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
            <span className="font-bold text-[#05253D] block mb-1">3. IT Security Containment</span>
            <p className="text-[#607482] leading-relaxed">
              Remote MDM lock & BitLocker cryptographic key revocation confirmed by Miguel Santos (IT Staff).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
