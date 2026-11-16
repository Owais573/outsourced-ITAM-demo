import React from 'react';
import {
  Truck,
  QrCode,
  Plus,
  Package,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Role } from '../../types';
import { SITES } from '../../data/roles';

interface DashboardModuleProps {
  currentRole: Role;
  selectedSite: string;
  onNavigate: (module: string) => void;
  onFilterRegistry: (status: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  currentRole,
  selectedSite,
  onNavigate,
  onFilterRegistry
}) => {
  const currentSiteName = SITES.find((s) => s.id === selectedSite)?.name || 'All Sites';
  const userFirstName = (currentRole.displayName || currentRole.user).split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Operational Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#102A3A] tracking-tight">
            Good morning, {userFirstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#607482] mt-0.5">
            Outsourced ITAM Operational Overview •{' '}
            <span className="font-medium text-[#102A3A]">{currentSiteName}</span>{' '}
            • Sunday, 15 Nov 2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('deliveries')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-[#05253D] border border-[#DCE5EA] hover:bg-[#EEF3F6] transition-colors shadow-2xs"
          >
            <Truck className="w-4 h-4 text-[#00B7D8]" />
            Receive Delivery Batch
          </button>
          <button
            onClick={() => onNavigate('audits')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-[#05253D] border border-[#DCE5EA] hover:bg-[#EEF3F6] transition-colors shadow-2xs"
          >
            <QrCode className="w-4 h-4 text-[#00B7D8]" />
            Launch Mobile QR Audit
          </button>
          <button
            onClick={() => onNavigate('issuance')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Issue Asset (Handover)
          </button>
        </div>
      </div>

      {/* 4-Metric KPI Row (Interactive click-through to filtered Registry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          onClick={() => {
            onFilterRegistry('ALL');
            onNavigate('assets');
          }}
          className="bg-white rounded-xl p-5 border border-[#DCE5EA] border-t-4 border-t-[#05253D] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#607482]">
              Total Tracked Assets
            </span>
            <div className="p-2 rounded-lg bg-[#EEF3F6] text-[#05253D] group-hover:bg-[#05253D] group-hover:text-[#00C8E8] transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#102A3A] mt-2 tabular-nums">
            {selectedSite === 'ALL' ? '4,820' : selectedSite === 'MNL-CS' ? '2,940' : selectedSite === 'CEB-IT' ? '1,290' : '590'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#607482]">
            <span>3,410 Company • 1,280 Client • 130 BYOD</span>
            <span className="text-[#00B7D8] font-semibold flex items-center gap-0.5">
              Registry <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            onFilterRegistry('ASSIGNED');
            onNavigate('assets');
          }}
          className="bg-white rounded-xl p-5 border border-[#DCE5EA] border-t-4 border-t-[#00C8E8] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#607482]">
              Assigned in Custody
            </span>
            <div className="p-2 rounded-lg bg-[#EAFBFD] text-[#00B7D8]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#102A3A] mt-2 tabular-nums">
            {selectedSite === 'ALL' ? '3,912' : selectedSite === 'MNL-CS' ? '2,410' : selectedSite === 'CEB-IT' ? '1,052' : '450'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#607482]">
            <span className="text-[#16834A] font-medium">100% Signed AAF/CAAF Linked</span>
            <span className="text-[#00B7D8] font-semibold flex items-center gap-0.5">
              View <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            onFilterRegistry('AVAILABLE');
            onNavigate('assets');
          }}
          className="bg-white rounded-xl p-5 border border-[#DCE5EA] border-t-4 border-t-[#16834A] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#607482]">
              Available Stock (IT Staged)
            </span>
            <div className="p-2 rounded-lg bg-[#EBF7F0] text-[#16834A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#102A3A] mt-2 tabular-nums">
            {selectedSite === 'ALL' ? '645' : selectedSite === 'MNL-CS' ? '385' : selectedSite === 'CEB-IT' ? '170' : '90'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#607482]">
            <span>+16 in 2-day IT setup queue</span>
            <span className="text-[#16834A] font-semibold flex items-center gap-0.5">
              Issue <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('clearances')}
          className="bg-white rounded-xl p-5 border border-[#DCE5EA] border-t-4 border-t-[#C83C3C] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C83C3C]">
              Attention Required
            </span>
            <div className="p-2 rounded-lg bg-[#FDEDED] text-[#C83C3C]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-[#C83C3C] mt-2 tabular-nums">18</div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#607482]">
            <span>1 Overdue LWD • 3 Audit Variances</span>
            <span className="text-[#C83C3C] font-semibold flex items-center gap-0.5">
              Resolve <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Operational Split (Left 60% Analytics & Activity, Right 40% Work Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {/* Fleet Distribution Card */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#DCE5EA]">
              <div>
                <h2 className="text-base font-semibold text-[#102A3A]">
                  Fleet Distribution by Lifecycle State & Ownership
                </h2>
                <p className="text-xs text-[#607482]">
                  Real-time operational counts across Company-Owned, Client-Owned, and Staff BYOD equipment
                </p>
              </div>
              <span className="text-xs font-medium text-[#607482] tabular-nums">
                Total: 4,820 units
              </span>
            </div>

            {/* Stacked Horizontal Bar */}
            <div className="mt-5 space-y-4">
              <div className="h-4 w-full rounded-full bg-[#EEF3F6] overflow-hidden flex">
                <div style={{ width: '81%' }} className="bg-[#05253D]" title="Assigned: 3,912 (81.1%)" />
                <div style={{ width: '13.4%' }} className="bg-[#00C8E8]" title="Available: 645 (13.4%)" />
                <div style={{ width: '3.2%' }} className="bg-[#B7791F]" title="In Transit / Inspection: 154 (3.2%)" />
                <div style={{ width: '2.4%' }} className="bg-[#C83C3C]" title="Repair / Disposal / Variance: 109 (2.3%)" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
                  <div className="flex items-center gap-2 text-xs text-[#607482]">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#05253D]" />
                    Assigned Custody
                  </div>
                  <div className="text-lg font-bold text-[#102A3A] mt-1 tabular-nums">3,912</div>
                  <div className="text-[11px] text-[#607482] tabular-nums">81.1% of fleet</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
                  <div className="flex items-center gap-2 text-xs text-[#607482]">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#00C8E8]" />
                    Available Stock
                  </div>
                  <div className="text-lg font-bold text-[#102A3A] mt-1 tabular-nums">645</div>
                  <div className="text-[11px] text-[#607482] tabular-nums">13.4% of fleet</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
                  <div className="flex items-center gap-2 text-xs text-[#607482]">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#B7791F]" />
                    Transit / Staging
                  </div>
                  <div className="text-lg font-bold text-[#102A3A] mt-1 tabular-nums">154</div>
                  <div className="text-[11px] text-[#607482] tabular-nums">3.2% of fleet</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA]">
                  <div className="flex items-center gap-2 text-xs text-[#607482]">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#C83C3C]" />
                    Repair / Disposal
                  </div>
                  <div className="text-lg font-bold text-[#102A3A] mt-1 tabular-nums">109</div>
                  <div className="text-[11px] text-[#607482] tabular-nums">2.3% of fleet</div>
                </div>
              </div>

              {/* Multi-Site Progress */}
              <div className="pt-4 border-t border-[#DCE5EA]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#607482] mb-3">
                  Multi-Site Inventory & Q4 Physical Audit Progress
                </h3>
                <div className="space-y-3">
                  {[
                    { site: 'Manila — Cyber Sigma (HQ)', assets: '2,940', auditPct: 94, status: 'Active Audit (Floor 14)' },
                    { site: 'Cebu — Cebu IT Park', assets: '1,290', auditPct: 100, status: 'Q4 Verified & Frozen' },
                    { site: 'Clark — Global Gateway', assets: '590', auditPct: 88, status: 'Reconciling 2 Variances' }
                  ].map((row) => (
                    <div key={row.site} className="flex items-center justify-between gap-4 text-xs">
                      <div className="min-w-[180px] sm:min-w-[200px]">
                        <div className="font-semibold text-[#102A3A]">{row.site}</div>
                        <div className="text-[#607482] tabular-nums">{row.assets} tracked assets • {row.status}</div>
                      </div>
                      <div className="flex-1 max-w-xs">
                        <div className="h-2 rounded-full bg-[#EEF3F6] overflow-hidden">
                          <div
                            style={{ width: `${row.auditPct}%` }}
                            className={`h-full rounded-full ${
                              row.auditPct === 100 ? 'bg-[#16834A]' : 'bg-[#00C8E8]'
                            }`}
                          />
                        </div>
                      </div>
                      <span className="font-bold text-[#05253D] tabular-nums w-12 text-right">
                        {row.auditPct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5EA]">
              <div>
                <h2 className="text-base font-semibold text-[#102A3A]">
                  Recent Immutable Lifecycle Activity (`activity_logs`)
                </h2>
                <p className="text-xs text-[#607482]">
                  Append-only audit trail with correlation IDs and actor verification
                </p>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-[#00B7D8] hover:underline"
              >
                Export Audit Trail
              </button>
            </div>
            <div className="divide-y divide-[#DCE5EA] mt-2">
              {[
                {
                  time: '14 mins ago',
                  actor: 'Miguel Santos (IT Staff)',
                  action: 'IT_STAGING_ENDORSED',
                  target: 'OPH-AST-00871',
                  desc: 'Completed 2-day pre-issuance technical check. Status -> AVAILABLE.',
                  badge: 'SUCCESS'
                },
                {
                  time: '2 hours ago',
                  actor: 'Clarisse Bautista (FA Custodian)',
                  action: 'RETURN_INTAKE_LOGGED',
                  target: 'OPH-AST-00719',
                  desc: 'Retrieved ThinkPad T14 from Kevin Tan. Status -> UNDER_INSPECTION.',
                  badge: 'WARNING'
                },
                {
                  time: 'Yesterday 11:00 UTC',
                  actor: 'Clarisse Bautista (FA Custodian)',
                  action: 'TRANSFER_DISPATCHED',
                  target: 'TRN-2026-089',
                  desc: 'Dispatched 3 assets from Manila to Cebu. Custody locked IN_TRANSIT.',
                  badge: 'INFO'
                },
                {
                  time: '13 Nov 2026',
                  actor: 'Legal Counsel / System Outbox',
                  action: 'DEMAND_LETTER_STAGE_2',
                  target: 'CLR-2026-041',
                  desc: '10-day post-LWD deadline breached for Restituto Navarro. Stage 2 Demand Letter issued.',
                  badge: 'DANGER'
                }
              ].map((ev, i) => (
                <div key={i} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        ev.badge === 'SUCCESS'
                          ? 'bg-[#16834A]'
                          : ev.badge === 'WARNING'
                          ? 'bg-[#B7791F]'
                          : ev.badge === 'DANGER'
                          ? 'bg-[#C83C3C]'
                          : 'bg-[#1677A8]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#05253D] tabular-nums">{ev.target}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#EEF3F6] text-[#102A3A] font-mono text-[10px]">
                          {ev.action}
                        </span>
                        <span className="text-[#607482]">by {ev.actor}</span>
                      </div>
                      <p className="text-[#102A3A] mt-0.5">{ev.desc}</p>
                    </div>
                  </div>
                  <span className="text-[#8797A2] whitespace-nowrap tabular-nums text-[11px]">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Prioritized Actionable Work Queue */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5EA]">
              <div>
                <h2 className="text-base font-semibold text-[#102A3A]">
                  Prioritized Operational Work Queue
                </h2>
                <p className="text-xs text-[#607482]">
                  Ordered by SLA risk, 10-day LWD deadlines & maker-checker approvals
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FDEDED] text-[#C83C3C] tabular-nums">
                5 Urgent
              </span>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              {[
                {
                  title: 'Overdue Staff Exit Return (LWD + 12 Days)',
                  subtitle: 'Restituto Navarro (OPH-10219) • 1 Laptop + 1 Charger unreturned',
                  meta: 'Stage 2 Legal Demand Letter active • Hard clearance block engaged',
                  severity: 'CRITICAL',
                  cta: 'Open Clearance Case',
                  targetModule: 'clearances'
                },
                {
                  title: '2-Day Pre-Issuance IT Setup Endorsement Due',
                  subtitle: 'Delivery DEL-2026-108 • 6x MacBook Pro 14" M3 Pro (PO-OPH-2026-0419)',
                  meta: 'Scheduled issuance in 3 days • Requires MDM & EDR verification',
                  severity: 'WARNING',
                  cta: 'Complete IT Checklist',
                  targetModule: 'deliveries'
                },
                {
                  title: 'Disposal Proposal Awaiting Finance & Destruction Gate',
                  subtitle: 'DSP-2026-014 • Dell Latitude 5420 (OPH-AST-00304)',
                  meta: 'VPQS approved • Pending Finance valuation & SSD destruction proof',
                  severity: 'WARNING',
                  cta: 'Review Disposal Gate',
                  targetModule: 'disposals'
                },
                {
                  title: 'Inter-Site Transfer Awaiting Destination Receipt',
                  subtitle: 'TRN-2026-089 • 3 Assets dispatched Manila -> Cebu IT Park',
                  meta: 'Gatepass GP-MNL-2026-1098 • Custody remains in Manila until confirmed',
                  severity: 'INFO',
                  cta: 'Confirm Receipt',
                  targetModule: 'transfers'
                },
                {
                  title: 'Returned Laptop Awaiting Diagnostic & Wipe Sign-Off',
                  subtitle: 'OPH-AST-00719 • Lenovo ThinkPad T14 Gen 3 (from Kevin Tan)',
                  meta: 'Currently UNDER_INSPECTION • Cannot re-issue until cleared',
                  severity: 'INFO',
                  cta: 'Inspect Return',
                  targetModule: 'returns'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#DCE5EA] hover:border-[#00C8E8] bg-[#F5F8FA]/60 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.severity === 'CRITICAL'
                          ? 'bg-[#FDEDED] text-[#C83C3C]'
                          : item.severity === 'WARNING'
                          ? 'bg-[#FEF8EC] text-[#B7791F]'
                          : 'bg-[#EBF5FA] text-[#1677A8]'
                      }`}
                    >
                      {item.severity === 'CRITICAL' ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.severity}
                    </span>
                    <button
                      onClick={() => onNavigate(item.targetModule)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#05253D] bg-[#00C8E8] hover:bg-[#00B7D8] px-2.5 py-1 rounded-md transition-colors"
                    >
                      {item.cta}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#102A3A]">{item.title}</div>
                    <div className="text-xs text-[#102A3A]/80 mt-0.5 tabular-nums">{item.subtitle}</div>
                    <div className="text-[11px] text-[#607482] mt-1">{item.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
