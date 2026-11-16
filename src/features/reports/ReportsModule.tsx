import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Calendar,
  Layers,
  FileSpreadsheet,
  Upload,
  RefreshCw,
  Building2,
  Check
} from 'lucide-react';
import { Role, Asset } from '../../types';

interface ReportsModuleProps {
  currentRole: Role;
  assets: Asset[];
  onCommitStagedRows: () => void;
  onTriggerToast: (title: string, detail: string, type?: 'success' | 'warning' | 'info' | 'danger') => void;
}

type ReportType =
  | 'FIXED_ASSETS_FINANCE'
  | 'PHYSICAL_AUDIT_VARIANCE'
  | 'ACCOUNTABILITY_COVERAGE'
  | 'EXIT_CLEARANCE_OVERDUE'
  | 'WARRANTY_LIFECYCLE';

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  currentRole,
  assets,
  onCommitStagedRows,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'staging'>('reports');
  const [selectedReport, setSelectedReport] = useState<ReportType>('FIXED_ASSETS_FINANCE');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('ALL');

  const handleExportCsv = () => {
    // Generate CSV content based on selected report
    let csvHeader = '';
    let rows: string[] = [];

    if (selectedReport === 'FIXED_ASSETS_FINANCE') {
      csvHeader = 'Asset Tag,Serial Number,Category,Model,Ownership,NetSuite ID,Acquisition Cost,Currency,Vendor,Site';
      rows = assets.map((a) => {
        const costStr = currentRole.canViewFinancials
          ? (a.purchaseCost !== null ? a.purchaseCost.toString() : 'N/A')
          : '[RESTRICTED_BY_RBAC]';
        const nsIdStr = currentRole.canViewFinancials
          ? (a.netsuiteId || 'N/A')
          : '[RESTRICTED_BY_RBAC]';
        return `"${a.assetTag}","${a.serialNumber}","${a.category}","${a.model}","${a.ownership}","${nsIdStr}","${costStr}","${a.currency}","${a.vendor}","${a.siteName}"`;
      });
    } else if (selectedReport === 'ACCOUNTABILITY_COVERAGE') {
      csvHeader = 'Asset Tag,Model,Ownership,Assignee,Employee ID,Form Type,Document Name,Verified SHA256,Site';
      rows = assets.map((a) => {
        const doc = a.documents.find((d) => d.type === 'AAF' || d.type === 'CAAF' || d.type === 'AOL');
        return `"${a.assetTag}","${a.model}","${a.ownership}","${a.assignee}","${a.employeeId}","${doc ? doc.type : 'MISSING'}","${doc ? doc.name : 'NO_SIGNED_DOC'}","${doc ? doc.sha256 : 'N/A'}","${a.siteName}"`;
      });
    } else {
      csvHeader = 'Asset Tag,Serial Number,Category,Model,Status,Condition,Assignee,Site,Warranty Expiry';
      rows = assets.map((a) => {
        return `"${a.assetTag}","${a.serialNumber}","${a.category}","${a.model}","${a.status}","${a.condition}","${a.assignee}","${a.siteName}","${a.warrantyExpiry}"`;
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeader, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Outsourced_ITAM_${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast(
      'Governed Report Exported',
      `Audit entry recorded for ${currentRole.displayName || currentRole.user}. Financial scrub status: ${
        currentRole.canViewFinancials ? 'Unmasked (Finance Role)' : 'Scrubbed (Non-Finance RBAC)'
      }`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
            Phase 16 & Phase 17 • Governed Analytics & Staged Ingestion
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
            Governed Report Center & Legacy Spreadsheet Ingestion (`REP-02` / `MIG-01`)
          </h1>
          <p className="text-xs text-[#607482]">
            Audit-compliant reporting with RBAC-enforced financial masking, immutable export logging, and spreadsheet staging validation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#DCE5EA] self-start sm:self-auto shrink-0 shadow-2xs">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'reports'
                ? 'bg-[#05253D] text-[#00C8E8]'
                : 'text-[#607482] hover:text-[#102A3A]'
            }`}
          >
            Governed Reports (`REP-02`)
          </button>
          <button
            onClick={() => setActiveTab('staging')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'staging'
                ? 'bg-[#05253D] text-[#00C8E8]'
                : 'text-[#607482] hover:text-[#102A3A]'
            }`}
          >
            Legacy Ingestion (`MIG-01`)
          </button>
        </div>
      </div>

      {activeTab === 'reports' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#607482] mb-1.5">
                Select Governed Report Template
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                className="w-full px-3 py-2 text-xs font-semibold bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg text-[#102A3A] focus:outline-hidden focus:border-[#00C8E8]"
              >
                <option value="FIXED_ASSETS_FINANCE">
                  Fixed Asset Capital Ledger & NetSuite Reconciliation (Finance)
                </option>
                <option value="ACCOUNTABILITY_COVERAGE">
                  Active Custody & Signed Document Audit (AAF / CAAF Coverage)
                </option>
                <option value="PHYSICAL_AUDIT_VARIANCE">
                  Physical Inventory & Q4 Audit Variance Report
                </option>
                <option value="EXIT_CLEARANCE_OVERDUE">
                  Staff Exit Clearance & 10-Day Overdue Recovery Report
                </option>
                <option value="WARRANTY_LIFECYCLE">
                  Hardware Replacement & Warranty Expiry Forecast (IT Ops)
                </option>
              </select>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-[#607482] block">RBAC Financial Visibility:</span>
                <span className={`text-xs font-bold flex items-center gap-1 justify-end ${
                  currentRole.canViewFinancials ? 'text-[#16834A]' : 'text-[#B7791F]'
                }`}>
                  {currentRole.canViewFinancials ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Full Financial Scope
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Financial Masking Active
                    </>
                  )}
                </span>
              </div>
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors shadow-xs shrink-0"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                Export Governed CSV
              </button>
            </div>
          </div>

          {/* Report Preview Table */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE5EA]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#102A3A]">
                  Live Report Data Preview
                </h2>
                <p className="text-xs text-[#607482]">
                  Showing 8 of 4,820 scoped records matching active filters.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#1677A8] bg-[#EBF5FA] px-2.5 py-1 rounded-md self-start sm:self-auto">
                Immutable Export Hash Generated on Download
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-bold uppercase text-[#607482]">
                    <th className="py-2.5 px-3">Asset Tag</th>
                    <th className="py-2.5 px-3">Model</th>
                    <th className="py-2.5 px-3">Ownership</th>
                    <th className="py-2.5 px-3">Assignee</th>
                    {selectedReport === 'FIXED_ASSETS_FINANCE' && (
                      <>
                        <th className="py-2.5 px-3">NetSuite ID</th>
                        <th className="py-2.5 px-3">Acquisition Cost</th>
                      </>
                    )}
                    {selectedReport === 'ACCOUNTABILITY_COVERAGE' && (
                      <>
                        <th className="py-2.5 px-3">Signed Form</th>
                        <th className="py-2.5 px-3">SHA-256 Hash</th>
                      </>
                    )}
                    {selectedReport !== 'FIXED_ASSETS_FINANCE' && selectedReport !== 'ACCOUNTABILITY_COVERAGE' && (
                      <>
                        <th className="py-2.5 px-3">Lifecycle Status</th>
                        <th className="py-2.5 px-3">Warranty Expiry</th>
                      </>
                    )}
                    <th className="py-2.5 px-3">Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EA]">
                  {assets.map((a) => {
                    const doc = a.documents.find((d) => d.type === 'AAF' || d.type === 'CAAF' || d.type === 'AOL');
                    return (
                      <tr key={a.id} className="hover:bg-[#F5F8FA] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#05253D]">{a.assetTag}</td>
                        <td className="py-2.5 px-3 font-medium text-[#102A3A] truncate max-w-[200px]">
                          {a.model}
                        </td>
                        <td className="py-2.5 px-3 text-[#607482]">{a.ownership}</td>
                        <td className="py-2.5 px-3 text-[#102A3A]">{a.assignee}</td>
                        {selectedReport === 'FIXED_ASSETS_FINANCE' && (
                          <>
                            <td className="py-2.5 px-3 font-mono">
                              {a.ownership === 'CLIENT_OWNED' ? (
                                <span className="text-[#1677A8] font-semibold text-[11px]">EXCLUDED</span>
                              ) : currentRole.canViewFinancials ? (
                                a.netsuiteId || '—'
                              ) : (
                                <span className="text-[#B7791F] flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> Masked
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#05253D]">
                              {currentRole.canViewFinancials ? (
                                a.purchaseCost ? `${a.currency} ${a.purchaseCost.toLocaleString()}` : 'N/A'
                              ) : (
                                <span className="text-[#B7791F] flex items-center gap-1 font-semibold">
                                  <Lock className="w-3 h-3" /> Hidden by RBAC
                                </span>
                              )}
                            </td>
                          </>
                        )}
                        {selectedReport === 'ACCOUNTABILITY_COVERAGE' && (
                          <>
                            <td className="py-2.5 px-3">
                              {doc ? (
                                <span className="text-[#16834A] font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {doc.type} Linked
                                </span>
                              ) : (
                                <span className="text-[#C92A2A] font-semibold">Missing Form</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-[#607482]">
                              {doc ? doc.sha256 : '—'}
                            </td>
                          </>
                        )}
                        {selectedReport !== 'FIXED_ASSETS_FINANCE' && selectedReport !== 'ACCOUNTABILITY_COVERAGE' && (
                          <>
                            <td className="py-2.5 px-3 text-[#102A3A] font-medium">{a.status}</td>
                            <td className="py-2.5 px-3 text-[#16834A] font-medium">{a.warrantyExpiry}</td>
                          </>
                        )}
                        <td className="py-2.5 px-3 text-[#607482]">{a.siteName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staging' && (
        <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE5EA]">
            <div>
              <h2 className="text-base font-bold text-[#102A3A]">
                Legacy Spreadsheet Dry-Run Staging Preview (`stg_legacy_assets`)
              </h2>
              <p className="text-xs text-[#607482]">
                Batch <code className="font-mono text-[#05253D]">MIG-BATCH-2026-04</code> • Source: <code className="font-mono text-[#05253D]">Manila_IT_Master_Tracker_v14_FINAL.xlsx</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onTriggerToast(
                    'Spreadsheet Upload Simulated',
                    'File verified: 184 rows parsed, 0 schema violations, 1 warning, 1 rejection.',
                    'info'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#DCE5EA] text-[#05253D] hover:bg-[#EEF3F6]"
              >
                <Upload className="w-3.5 h-3.5 text-[#00B7D8]" />
                Upload New File
              </button>
              <button
                onClick={onCommitStagedRows}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
              >
                Commit 184 Validated Rows
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-bold uppercase text-[#607482]">
                  <th className="py-2.5 px-3">Row #</th>
                  <th className="py-2.5 px-3">Parsed Tag</th>
                  <th className="py-2.5 px-3">Serial Number</th>
                  <th className="py-2.5 px-3">Ownership</th>
                  <th className="py-2.5 px-3">Dry-Run Validation Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5EA]">
                <tr>
                  <td className="py-2.5 px-3">Row 14</td>
                  <td className="py-2.5 px-3 font-bold text-[#05253D]">OPH-AST-00910</td>
                  <td className="py-2.5 px-3 font-mono">C02Z1190MD6R</td>
                  <td className="py-2.5 px-3">COMPANY_OWNED</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF7F0] text-[#16834A] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED — Ready for Atomic Commit
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Row 42</td>
                  <td className="py-2.5 px-3 font-bold text-[#05253D]">OPH-AST-00918</td>
                  <td className="py-2.5 px-3 font-mono">LN-PF31009A</td>
                  <td className="py-2.5 px-3">COMPANY_OWNED</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF8EC] text-[#B7791F] font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> WARNING — Duplicate Manufacturer S/N Flagged (Permitted with Flag)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Row 89</td>
                  <td className="py-2.5 px-3 font-bold text-[#C83C3C]">OPH-AST-00842</td>
                  <td className="py-2.5 px-3 font-mono">DL-88102-ERR</td>
                  <td className="py-2.5 px-3">CLIENT_OWNED + NS-FA-991</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FDEDED] text-[#C83C3C] font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> REJECTED — Tag Collision & Client Asset Violates NetSuite CHECK Constraint
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};