import React from 'react';
import {
  UserMinus,
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Scale
} from 'lucide-react';
import { Clearance, Role } from '../../types';

interface ClearancesModuleProps {
  clearances: Clearance[];
  activeClearanceId: string;
  onSelectClearanceId: (id: string) => void;
  currentRole: Role;
  onMarkItemReturned: (clearanceId: string, itemId: string, itemTag: string) => void;
  onAdvanceLegalStage: (clearanceId: string) => void;
  onOpenWaiverModal: () => void;
  onApproveFinalClearance: (employeeName: string, employeeId: string) => void;
}

export const ClearancesModule: React.FC<ClearancesModuleProps> = ({
  clearances,
  activeClearanceId,
  onSelectClearanceId,
  currentRole,
  onMarkItemReturned,
  onAdvanceLegalStage,
  onOpenWaiverModal,
  onApproveFinalClearance
}) => {
  const activeClearance = clearances.find((c) => c.id === activeClearanceId) || clearances[0];
  const unresolvedItems = activeClearance.items.filter((i) => i.status === 'PENDING_RETURN').length;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 7 • Offboarding Asset Recovery & Legal Escalation
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Staff Exit Clearance & 10-Day Post-LWD Enforcement Gate
        </h1>
        <p className="text-xs text-[#607482]">
          Enforces a hard system block on final clearance sign-off while any assigned asset or accessory remains unreturned, with 3-stage Legal Demand Letter tracking (3 days per stage).
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-3">
        {clearances.map((clr) => (
          <button
            key={clr.id}
            onClick={() => onSelectClearanceId(clr.id)}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 sm:gap-6 flex-1 min-w-[260px] ${
              activeClearanceId === clr.id
                ? 'bg-white border-[#00C8E8] ring-2 ring-[#00C8E8]/30 shadow-xs'
                : 'bg-white/70 border-[#DCE5EA] hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#05253D]">{clr.displayName}</span>
                <span className="text-xs text-[#607482] tabular-nums">({clr.employeeId})</span>
              </div>
              <div className="text-xs text-[#607482] mt-0.5 tabular-nums">
                LWD: {clr.lastWorkingDay} • Deadline: {clr.returnDeadline}
              </div>
            </div>
            {clr.daysRemaining < 0 ? (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FDEDED] text-[#C83C3C] tabular-nums shrink-0">
                {Math.abs(clr.daysRemaining)}d OVERDUE
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FEF8EC] text-[#B7791F] tabular-nums shrink-0">
                {clr.daysRemaining}d Left
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Clearance Case Workspace */}
      <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#DCE5EA]">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#102A3A]">
                Case {activeClearance.id} — {activeClearance.displayName}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#EEF3F6] text-[#05253D] tabular-nums">
                {activeClearance.employeeId}
              </span>
            </div>
            <p className="text-xs text-[#607482] mt-1 tabular-nums leading-relaxed">
              {activeClearance.department} • {activeClearance.site} • Last Working Day: <strong>{activeClearance.lastWorkingDay}</strong> • Return Deadline (LWD + 10d): <strong>{activeClearance.returnDeadline}</strong>
            </p>
          </div>

          {/* Hard Clearance Gate Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {unresolvedItems > 0 && !activeClearance.waiverApproved ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold bg-[#F1F5F9] text-[#8797A2] border border-[#DCE5EA] cursor-not-allowed"
                >
                  <Lock className="w-4 h-4 text-[#C83C3C]" />
                  Blocked: {unresolvedItems} Unresolved
                </button>
                <button
                  onClick={onOpenWaiverModal}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#FEF8EC] text-[#B7791F] border border-[#B7791F]/30 hover:bg-[#FEF8EC]/80 transition-colors"
                >
                  Record Executive Waiver (VPQS)
                </button>
              </div>
            ) : (
              <button
                onClick={() => onApproveFinalClearance(activeClearance.displayName, activeClearance.employeeId)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#16834A]/90 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Final Clearance & Issue Certificate
              </button>
            )}
          </div>
        </div>

        {/* Hard Block Alert Banner */}
        {unresolvedItems > 0 && !activeClearance.waiverApproved && (
          <div className="p-4 rounded-xl bg-[#FDEDED] border border-[#C83C3C]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#C83C3C] shrink-0 mt-0.5" />
            <div className="text-xs text-[#102A3A] space-y-1">
              <div className="font-bold text-[#C83C3C]">
                HARD CLEARANCE BLOCK ACTIVE (`unresolved_items_count == {unresolvedItems}`)
              </div>
              <p className="leading-relaxed">
                Per SOP Process 7 (`CLR-03`), HR and FA Custodians cannot clear this employee while serialized assets or bundled accessories remain <code className="font-mono">PENDING_RETURN</code>. Mark items returned below or record an authorized VPQS executive exception waiver.
              </p>
            </div>
          </div>
        )}

        {activeClearance.waiverApproved && (
          <div className="p-4 rounded-xl bg-[#FEF8EC] border border-[#B7791F]/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#B7791F] shrink-0 mt-0.5" />
            <div className="text-xs text-[#102A3A]">
              <div className="font-bold text-[#B7791F]">
                CLOSED WITH EXECUTIVE EXCEPTION WAIVER — Approved by {activeClearance.waiverApprover}
              </div>
              <p className="mt-0.5">Reason logged in immutable audit trail: &ldquo;{activeClearance.waiverReason}&rdquo;</p>
            </div>
          </div>
        )}

        {/* Item-by-Item Recovery Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
            Assigned Equipment & Accessory Recovery Checklist
          </h3>
          <div className="divide-y divide-[#DCE5EA] border border-[#DCE5EA] rounded-xl overflow-hidden">
            {activeClearance.items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#05253D] tabular-nums w-28 shrink-0">{item.tag}</span>
                  <div>
                    <div className="font-semibold text-[#102A3A]">{item.desc}</div>
                    <div className="text-[11px] text-[#607482]">{item.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.status === 'RETURNED_GOOD' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EBF7F0] text-[#16834A] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Returned & Inspected
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FDEDED] text-[#C83C3C] font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Pending Return
                      </span>
                      <button
                        onClick={() => onMarkItemReturned(activeClearance.id, item.id, item.tag)}
                        className="px-3 py-1 rounded-md bg-[#05253D] hover:bg-[#092741] text-white font-semibold transition-colors"
                      >
                        Mark Returned
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Stage Legal Demand Letter Escalation */}
        <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#05253D] shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
                Legal Counsel Demand Letter Escalation (3-Day Turnaround per Stage)
              </h3>
            </div>
            <button
              onClick={() => onAdvanceLegalStage(activeClearance.id)}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-white border border-[#DCE5EA] text-[#05253D] hover:bg-[#EEF3F6] self-start sm:self-auto transition-colors"
            >
              Dispatch Next Demand Letter Stage
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { stage: 1, title: 'Stage 1: First Formal Demand', sla: 'LWD + 10 Days (3-Day SLA)' },
              { stage: 2, title: 'Stage 2: Second Legal Notice', sla: 'Stage 1 + 3 Days' },
              { stage: 3, title: 'Stage 3: Final Recovery / Litigation', sla: 'Stage 2 + 3 Days' }
            ].map((st) => {
              const reached = activeClearance.demandLetterStage >= st.stage;
              return (
                <div
                  key={st.stage}
                  className={`p-3 rounded-lg border ${
                    reached
                      ? 'bg-[#FDEDED]/60 border-[#C83C3C]/40 text-[#102A3A]'
                      : 'bg-white border-[#DCE5EA] text-[#607482]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{st.title}</span>
                    {reached && <span className="text-[#C83C3C] text-[10px]">DISPATCHED</span>}
                  </div>
                  <div className="text-[11px] mt-1 tabular-nums">{st.sla}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
