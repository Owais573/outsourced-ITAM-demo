import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase
} from 'lucide-react';
import { Asset } from '../../types';

interface IssuanceWizardModuleProps {
  onConfirmHandover: (assetTag: string, employeeId: string, employeeName: string, gatepassRef: string) => void;
}

export const IssuanceWizardModule: React.FC<IssuanceWizardModuleProps> = ({ onConfirmHandover }) => {
  const [step, setStep] = useState(1);
  const [handoverCompleted, setHandoverCompleted] = useState(false);

  const [form, setForm] = useState({
    hubspotTicket: 'HS-90214',
    employeeId: 'OPH-10492',
    employeeName: 'Marco Reyes (Cloud Engineering)',
    site: 'Manila - Cyber Sigma',
    selectedAssetTag: 'OPH-AST-00871',
    ownershipType: 'COMPANY_OWNED',
    accessories: ['Lenovo 65W USB-C Adapter', 'ThinkPad 14" Sleeve', '3M Privacy Filter'],
    itStagingVerified: true,
    aafUploaded: true,
    aafFilename: 'AAF_OPH-AST-00871_MarcoReyes_Signed.pdf',
    gatepassRef: 'GP-MNL-2026-1104',
  });

  const handleCommit = () => {
    setHandoverCompleted(true);
    onConfirmHandover(
      form.selectedAssetTag,
      form.employeeId,
      'Marco Reyes',
      form.gatepassRef
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 1 • Guided Custody Handover Wizard
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Asset Issuance & Accountability Handover
        </h1>
        <p className="text-xs text-[#607482]">
          Enforces row-level atomic assignment (`SELECT FOR UPDATE`), mandatory signed AAF (Company-Owned) or CAAF (Client-Owned), and Gatepass verification. HubSpot ticket status alone never transfers custody.
        </p>
      </div>

      {/* 5-Step Stepper Header */}
      <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-5 border-b border-[#DCE5EA]">
          {[
            { step: 1, title: '1. Employee', sub: 'HubSpot & HR' },
            { step: 2, title: '2. Asset & Kit', sub: 'Pick Stock' },
            { step: 3, title: '3. IT Staging', sub: '2-Day Setup' },
            { step: 4, title: '4. Evidence', sub: 'Signed AAF' },
            { step: 5, title: '5. Commit', sub: 'Atomic Handover' }
          ].map((s) => {
            const active = step === s.step;
            const completed = step > s.step || handoverCompleted;
            return (
              <button
                key={s.step}
                onClick={() => setStep(s.step)}
                className={`text-left p-2.5 sm:p-3 rounded-lg border transition-all ${
                  active
                    ? 'bg-[#EAFBFD] border-[#00C8E8] ring-1 ring-[#00C8E8]'
                    : completed
                    ? 'bg-[#EBF7F0]/50 border-[#16834A]/30'
                    : 'bg-[#F5F8FA] border-[#DCE5EA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#05253D]">{s.title}</span>
                  {completed && <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#607482] mt-0.5">{s.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Wizard Step Body */}
        <div className="mt-5">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#102A3A] mb-1">
                  Approved HubSpot Service Request Reference *
                </label>
                <input
                  type="text"
                  value={form.hubspotTicket}
                  onChange={(e) => setForm({ ...form, hubspotTicket: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg tabular-nums font-medium text-[#102A3A]"
                />
                <span className="text-[11px] text-[#607482] mt-1 block">
                  Verified via HubSpot Read-Only Adapter: &ldquo;New Hire Workstation — Cloud Engineering&rdquo;
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102A3A] mb-1">
                  Recipient Employee (HR Master Reference) *
                </label>
                <select
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg font-medium text-[#102A3A]"
                >
                  <option value="OPH-10492">OPH-10492 — Marco Reyes (Cloud Engineering • Manila)</option>
                  <option value="OPH-10815">OPH-10815 — Patricia Gomez (FinTech AU • Cebu)</option>
                </select>
                <span className="text-[11px] text-[#16834A] mt-1 block font-medium">
                  Employment Status: ACTIVE • Zero overdue exit clearances
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#102A3A] mb-1">
                    Select Ownership Pool (Determines AAF vs CAAF Rule) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          ownershipType: 'COMPANY_OWNED',
                          selectedAssetTag: 'OPH-AST-00871',
                          aafFilename: 'AAF_OPH-AST-00871_MarcoReyes_Signed.pdf'
                        })
                      }
                      className={`p-3 rounded-lg border text-left text-xs font-semibold ${
                        form.ownershipType === 'COMPANY_OWNED'
                          ? 'bg-[#05253D] text-white border-[#05253D]'
                          : 'bg-[#F5F8FA] text-[#102A3A] border-[#DCE5EA]'
                      }`}
                    >
                      Company-Owned
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                        Requires Signed AAF
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          ownershipType: 'CLIENT_OWNED',
                          selectedAssetTag: 'OPH-AST-00896',
                          aafFilename: 'CAAF_OPH-AST-00896_ClientEquipment_Signed.pdf'
                        })
                      }
                      className={`p-3 rounded-lg border text-left text-xs font-semibold ${
                        form.ownershipType === 'CLIENT_OWNED'
                          ? 'bg-[#05253D] text-white border-[#05253D]'
                          : 'bg-[#F5F8FA] text-[#102A3A] border-[#DCE5EA]'
                      }`}
                    >
                      Client-Owned
                      <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                        Requires Signed CAAF
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#102A3A] mb-1">
                    Available Staged Asset (Status = AVAILABLE) *
                  </label>
                  <div className="p-3 rounded-lg bg-[#EAFBFD] border border-[#00C8E8]/50 text-xs">
                    <div className="font-bold text-[#05253D] tabular-nums">
                      {form.selectedAssetTag} — Lenovo ThinkPad T14 Gen 4 (Ryzen 7 PRO, 32GB, 1TB)
                    </div>
                    <div className="text-[#607482] mt-0.5 tabular-nums">
                      Serial: LN-PF49281K • Condition: BRAND_NEW • Vault A
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A3A] mb-1.5">
                  Bundled Accessories (Tracked on Return / Exit Clearance)
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.accessories.map((acc) => (
                    <span
                      key={acc}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA] text-xs font-medium text-[#102A3A]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16834A]" /> {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-4 rounded-xl bg-[#EBF7F0] border border-[#16834A]/30 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#16834A]">
                <CheckCircle2 className="w-5 h-5" />
                2-Day Pre-Issuance IT Technical Setup Verified
              </div>
              <p className="text-xs text-[#102A3A] leading-relaxed">
                Endorsed by <strong>Miguel Santos (IT Staff)</strong> on 2026-11-14 16:50 UTC. Windows 11 Pro 24H2 imaged, Kandji/Intune MDM enrolled, Bitdefender GravityZone EDR active, and hardware diagnostics passed.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
                    Accountability Evidence ({form.ownershipType === 'COMPANY_OWNED' ? 'AAF' : 'CAAF'})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF7F0] text-[#16834A]">
                    Magic-Byte PDF Verified
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#DCE5EA] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-[#00B7D8]" />
                    <div>
                      <div className="text-xs font-semibold text-[#102A3A] tabular-nums">
                        {form.aafFilename}
                      </div>
                      <div className="text-[10px] text-[#607482] tabular-nums">
                        SHA-256: 9f81c2a0...44b19e • Stored with opaque UUID key
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#16834A]">Attached</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#05253D] block">
                  Facility Security Gatepass & Policy
                </span>
                <div>
                  <label className="block text-xs text-[#607482] mb-1">Gatepass Reference</label>
                  <input
                    type="text"
                    value={form.gatepassRef}
                    onChange={(e) => setForm({ ...form, gatepassRef: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#DCE5EA] rounded-lg font-semibold tabular-nums text-[#102A3A]"
                  />
                </div>
                <p className="text-[11px] text-[#607482]">
                  Policy Rule: Reserved assets unclaimed after <strong>7 calendar days</strong> are automatically cancelled by the Outbox worker and returned to stock.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#05253D] text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#00C8E8] font-bold">
                    Final Custody Handover Summary
                  </span>
                  <span className="text-xs font-mono text-[#DCE5EA] tabular-nums">
                    Partial Unique Index: uq_asset_active_assignment
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-[#092741] tabular-nums">
                  <div>
                    <span className="text-[#8797A2] block">Asset Tag & Model:</span>
                    <span className="font-bold text-white">{form.selectedAssetTag} (ThinkPad T14 Gen 4)</span>
                  </div>
                  <div>
                    <span className="text-[#8797A2] block">Custody Recipient:</span>
                    <span className="font-bold text-white">{form.employeeName}</span>
                  </div>
                  <div>
                    <span className="text-[#8797A2] block">Signed Evidence & Gatepass:</span>
                    <span className="font-bold text-[#00C8E8]">{form.aafFilename} ({form.gatepassRef})</span>
                  </div>
                </div>
              </div>

              {handoverCompleted ? (
                <div className="p-4 rounded-xl bg-[#EBF7F0] border border-[#16834A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#16834A] shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-[#16834A]">
                        Physical Handover Confirmed & Committed Atomically
                      </div>
                      <div className="text-xs text-[#102A3A]">
                        Active custody record created. Asset {form.selectedAssetTag} is now ASSIGNED.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setHandoverCompleted(false);
                      setStep(1);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#16834A]/40 text-[#16834A] hover:bg-[#EBF7F0]"
                  >
                    Start New Issuance
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleCommit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] shadow-sm transition-colors"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    Confirm Physical Handover
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="mt-6 pt-4 border-t border-[#DCE5EA] flex items-center justify-between">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#DCE5EA] text-[#102A3A] disabled:opacity-40 hover:bg-[#F5F8FA]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
            </button>
            {step < 5 && (
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#05253D] text-white hover:bg-[#092741] transition-colors"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
