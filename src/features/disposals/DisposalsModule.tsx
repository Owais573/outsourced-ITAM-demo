import React from 'react';
import { Trash2, HardDrive, CheckCircle2, Clock } from 'lucide-react';
import { DisposalState, Role } from '../../types';
import { StatusBadge, ConditionBadge } from '../../components/feedback/Badges';

interface DisposalsModuleProps {
  disposalState: DisposalState;
  currentRole: Role;
  onApproveStage: () => void;
  onToggleCheck: (key: string, checked: boolean) => void;
  onCompleteDisposal: () => void;
}

export const DisposalsModule: React.FC<DisposalsModuleProps> = ({
  disposalState,
  currentRole,
  onApproveStage,
  onToggleCheck,
  onCompleteDisposal
}) => {
  const isCreator = currentRole.id === disposalState.proposedBy;
  const canApprove = currentRole.canApproveDisposal && !isCreator;
  const allStagesApproved = disposalState.approvals.finance.approved && disposalState.approvals.ceo.approved;

  const canCompleteDestruction =
    disposalState.ssdSerialVerified &&
    disposalState.degaussedAndShredded &&
    disposalState.destructionCertUploaded &&
    disposalState.destructionPhotoUploaded &&
    !disposalState.completed;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 3 • Multi-Tier Approval & Storage Media Destruction Gate
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Asset Disposal Proposal DSP-2026-014 (OPH-AST-00304)
        </h1>
        <p className="text-xs text-[#607482]">
          Enforces Maker-Checker separation of duties (`creator_id != approver_id`) and physically blocks disposal completion until SSD/HDD destruction certificate and photo evidence are verified.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-6 space-y-6">
        {/* Asset Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#DCE5EA]">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-lg font-bold text-[#05253D] tabular-nums">OPH-AST-00304</span>
              <StatusBadge status={disposalState.completed ? 'DISPOSED' : 'PENDING_DISPOSAL'} />
              <ConditionBadge condition="BEYOND_REPAIR" />
            </div>
            <div className="text-sm font-semibold text-[#102A3A] mt-1">
              Dell Latitude 5420 • Age: 4.6 Years (Purchased 2022-04-11) • E-Waste Recycling & Media Shredding
            </div>
            <div className="text-xs text-[#607482] mt-0.5">
              Proposed by: <strong>{disposalState.ProposedByName} (FA Custodian)</strong> • NetSuite ID: <strong>NS-FA-1102</strong>
            </div>
          </div>
          {currentRole.canViewFinancials && (
            <div className="text-left md:text-right tabular-nums">
              <span className="text-xs text-[#607482] block">Net Book Valuation:</span>
              <span className="text-base sm:text-lg font-bold text-[#05253D]">PHP 0.00 (Fully Depreciated)</span>
            </div>
          )}
        </div>

        {/* Multi-Stage Approval Chain */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
              Multi-Stage Approval Chain (Maker-Checker Enforced)
            </h3>
            <span className="text-xs text-[#607482]">
              Viewing as: <strong className="text-[#05253D]">{currentRole.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'custodian', label: '1. FA Custodian Proposal', role: 'Clarisse Bautista', done: true },
              { key: 'vpqs', label: '2. VPQS Review', role: 'Elena Rodriguez', done: disposalState.approvals.vpqs.approved },
              { key: 'finance', label: '3. Finance Valuation', role: 'Carlo Mendoza', done: disposalState.approvals.finance.approved },
              { key: 'ceo', label: '4. Executive / PEZA Gate', role: 'Executive Sign-Off', done: disposalState.approvals.ceo.approved }
            ].map((stage) => (
              <div
                key={stage.key}
                className={`p-3.5 rounded-xl border ${
                  stage.done
                    ? 'bg-[#EBF7F0]/60 border-[#16834A]/30'
                    : 'bg-[#F5F8FA] border-[#DCE5EA]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#102A3A]">
                  <span>{stage.label}</span>
                  {stage.done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#B7791F]" />
                  )}
                </div>
                <div className="text-[11px] text-[#607482] mt-1">{stage.role}</div>
              </div>
            ))}
          </div>

          {/* Maker-Checker Status Banner */}
          <div className="p-3.5 rounded-xl bg-[#EEF3F6] border border-[#DCE5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="leading-relaxed">
              <span className="font-bold text-[#05253D]">Maker-Checker Rule (`RBAC-02`): </span>
              {isCreator ? (
                <span className="text-[#C83C3C] font-medium">
                  You ({currentRole.user}) created this proposal. Self-approval is strictly disabled (`creator_id != approver_id`). Switch to Finance Officer or VPQS Approver to authorize.
                </span>
              ) : canApprove ? (
                <span className="text-[#16834A] font-medium">
                  Independent Approver Verified (`creator_id != approver_id`). You are authorized to approve remaining stages.
                </span>
              ) : (
                <span className="text-[#607482]">
                  Your current role ({currentRole.name}) does not hold disposal approval authority.
                </span>
              )}
            </div>
            <button
              disabled={isCreator || !canApprove || allStagesApproved}
              onClick={onApproveStage}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#05253D] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#092741] transition-colors shrink-0"
            >
              Approve Pending Stage
            </button>
          </div>
        </div>

        {/* Mandatory Storage Media Physical Destruction Gate (DSP-02) */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F5F8FA] border-2 border-[#DCE5EA] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#C83C3C] shrink-0" />
              <h3 className="text-sm font-bold text-[#102A3A]">
                Mandatory Storage Media Physical Destruction Gate (`DSP-02`)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#607482] tabular-nums">
              Target Media: 512GB NVMe SSD (S/N: KX-992018-SSD)
            </span>
          </div>
          <p className="text-xs text-[#607482]">
            System strictly blocks irreversible disposal completion (HTTP 422 gate) until all four physical destruction checks and evidence uploads are verified:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'ssdSerialVerified', label: '1. Removed SSD/HDD Serial #KX-992018-SSD Verified Against Host' },
              { key: 'degaussedAndShredded', label: '2. Physical Degaussing / Mechanical Shredding Completed On-Site' },
              { key: 'destructionCertUploaded', label: '3. Signed Certificate of Media Destruction (PDF) Attached' },
              { key: 'destructionPhotoUploaded', label: '4. Photographic Evidence of Destroyed Storage Media Attached' }
            ].map((chk) => (
              <label
                key={chk.key}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-[#DCE5EA] font-medium cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(disposalState as any)[chk.key]}
                  onChange={(e) => onToggleCheck(chk.key, e.target.checked)}
                  className="rounded border-[#DCE5EA]"
                />
                <span className="text-[#102A3A] leading-tight">{chk.label}</span>
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-[#DCE5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#607482]">
              Irreversible Action: Retires asset in ITAM and flags NetSuite Fixed Asset #NS-FA-1102 for write-off.
            </span>
            <button
              disabled={!canCompleteDestruction}
              onClick={onCompleteDisposal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#C83C3C] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#B02B2B] transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              {disposalState.completed ? 'Disposal Completed (Retired)' : 'Complete Irreversible Disposal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
