import React, { useState } from 'react';
import {
  Settings,
  FileText,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  ExternalLink,
  Eye,
  Database,
  FileCheck2,
  HardDrive
} from 'lucide-react';
import { Asset, Role, AssetDocument } from '../../types';
import { ROLES, SITES } from '../../data/roles';

interface AdminModuleProps {
  currentRole: Role;
  assets: Asset[];
  onOpenDocumentPreview: (doc: AssetDocument) => void;
  onTriggerToast: (title: string, detail: string, type?: 'success' | 'warning' | 'info' | 'danger') => void;
}

type AdminTab = 'policies' | 'documents' | 'organization' | 'roles';

export const AdminModule: React.FC<AdminModuleProps> = ({
  currentRole,
  assets,
  onOpenDocumentPreview,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('policies');

  // Flatten all documents across assets
  const allDocuments = assets.flatMap((a) =>
    a.documents.map((d) => ({
      ...d,
      assetTag: a.assetTag,
      model: a.model,
      ownership: a.ownership
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
            Administration Tier • Section 8.4 & Governance Baseline
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
            Administration, Master Catalog & Policy Governance
          </h1>
          <p className="text-xs text-[#607482]">
            Versioned SOP rules (`OPH-FA-PRO-0001 R1`), document evidence vault, organization masters, and RBAC matrix.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#DCE5EA] self-start sm:self-auto shrink-0 shadow-2xs overflow-x-auto">
          {[
            { id: 'policies', label: 'SOP Policies & Storage' },
            { id: 'documents', label: `Document Vault (${allDocuments.length})` },
            { id: 'organization', label: 'Organization Masters' },
            { id: 'roles', label: 'RBAC & Roles Matrix' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as AdminTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#05253D] text-[#00C8E8]'
                  : 'text-[#607482] hover:text-[#102A3A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SOP POLICIES & STORAGE PROVIDER */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
              <h2 className="text-sm font-bold text-[#05253D] uppercase tracking-wider">
                Active Versioned Policy Parameters
              </h2>
              <span className="text-[11px] font-semibold text-[#16834A] bg-[#EBF7F0] px-2 py-0.5 rounded-md">
                OPH-FA-PRO-0001 R1
              </span>
            </div>
            <div className="divide-y divide-[#DCE5EA] text-xs tabular-nums">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Pre-Issuance IT Setup Lead Time:</span>
                <span className="font-bold text-[#102A3A]">2 Business Days Prior (Process 6 / DEL-03)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Unclaimed Issuance Auto-Cancellation:</span>
                <span className="font-bold text-[#102A3A]">7 Calendar Days (Process 1 / ISS-04)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Staff Exit Clearance Return Window:</span>
                <span className="font-bold text-[#102A3A]">LWD + 10 Days (Process 7 / CLR-01)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Legal Demand Letter Cadence:</span>
                <span className="font-bold text-[#102A3A]">3 Days per Stage (Stages 1, 2, 3)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Standard Disposal Age Threshold:</span>
                <span className="font-bold text-[#102A3A]">≥ 3 Years or Beyond Economic Repair (BER)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Storage Media Destruction Gate:</span>
                <span className="font-bold text-[#C83C3C]">Mandatory NIST SP 800-88 Proof (`DSP-02`)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
              <h2 className="text-sm font-bold text-[#05253D] uppercase tracking-wider">
                Document Vault & Storage Abstraction (`DOC-01`)
              </h2>
              <span className="text-[11px] font-semibold text-[#0E7490] bg-[#E0F7FA] px-2 py-0.5 rounded-md font-mono">
                LocalFilesystem
              </span>
            </div>
            <div className="divide-y divide-[#DCE5EA] text-xs tabular-nums">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Active Storage Provider:</span>
                <span className="font-mono font-bold text-[#00B7D8]">LocalFilesystemStorageProvider</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Isolated Mount Root (0700/0600):</span>
                <span className="font-mono text-[#102A3A] truncate max-w-[200px]">/var/lib/itam/documents/</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Provisioned Volume Capacity:</span>
                <span className="font-bold text-[#102A3A]">142.8 GB used of 500.0 GB</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Magic Byte Signature Inspection:</span>
                <span className="font-bold text-[#16834A]">Enforced (%PDF, PNG, JPEG • Max 25 MB)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#607482]">Petty Cash Fund (PCF) Policy:</span>
                <span className="font-medium text-[#102A3A]">Tuesday Request / Wednesday Liquidation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT & EVIDENCE VAULT */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE5EA]">
            <div>
              <h2 className="text-base font-bold text-[#102A3A]">
                Authoritative Document Evidence Vault (`DOC-01` / `DOC-02`)
              </h2>
              <p className="text-xs text-[#607482]">
                Immutable store of signed AAF, CAAF, Gatepasses, Transmittals, and Disposal Destruction Certificates with SHA-256 integrity verification.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#16834A] bg-[#EBF7F0] px-3 py-1 rounded-full self-start sm:self-auto">
              100% SHA-256 Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-bold uppercase text-[#607482]">
                  <th className="py-2.5 px-3">Form Type</th>
                  <th className="py-2.5 px-3">Document Filename</th>
                  <th className="py-2.5 px-3">Related Asset</th>
                  <th className="py-2.5 px-3">SHA-256 Checksum</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Uploader</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5EA]">
                {allDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#F5F8FA] transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-[#05253D] px-2 py-0.5 rounded bg-[#EEF3F6] border border-[#DCE5EA]">
                        <FileText className="w-3.5 h-3.5 text-[#00B7D8]" />
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#102A3A] truncate max-w-[200px]" title={doc.name}>
                      {doc.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#05253D] font-bold">
                      {doc.assetTag}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#607482] truncate max-w-[140px]" title={doc.sha256}>
                      {doc.sha256}
                    </td>
                    <td className="py-2.5 px-3 text-[#607482]">{doc.date}</td>
                    <td className="py-2.5 px-3 text-[#102A3A] truncate max-w-[120px]">{doc.uploader}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenDocumentPreview(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-[#DCE5EA] text-[#05253D] hover:bg-[#EEF3F6] hover:text-[#00B7D8] font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION & PEOPLE MASTERS */}
      {activeTab === 'organization' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sites & Locations */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
              <div>
                <h2 className="text-sm font-bold text-[#05253D] uppercase tracking-wider">
                  Operating Facilities & Sites (`MAST-01`)
                </h2>
                <p className="text-xs text-[#607482]">Authoritative multi-office physical locations</p>
              </div>
              <Building2 className="w-4 h-4 text-[#00B7D8]" />
            </div>

            <div className="space-y-3">
              {SITES.filter((s) => s.id !== 'ALL').map((site) => (
                <div key={site.id} className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#05253D]">{site.name}</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#DCE5EA] text-[#0E7490]">
                      {site.id}
                    </span>
                  </div>
                  <div className="text-xs text-[#607482]">
                    Short Code: <strong className="text-[#102A3A]">{site.short}</strong> • Tracked Fleet:{' '}
                    <strong className="text-[#102A3A]">
                      {site.id === 'MNL-CS' ? '2,940 units' : site.id === 'CEB-IT' ? '1,290 units' : '590 units'}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Employee Directory Reference */}
          <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
              <div>
                <h2 className="text-sm font-bold text-[#05253D] uppercase tracking-wider">
                  Minimal Employee Directory (`MAST-02`)
                </h2>
                <p className="text-xs text-[#607482]">Workplace PII strictly minimized per AGENTS.md</p>
              </div>
              <Users className="w-4 h-4 text-[#00B7D8]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-bold uppercase text-[#607482]">
                    <th className="py-2 px-2.5">Name</th>
                    <th className="py-2 px-2.5">Employee ID</th>
                    <th className="py-2 px-2.5">Department</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EA]">
                  {[
                    { name: 'Marco Reyes', id: 'OPH-10492', dept: 'Cloud Engineering', status: 'ACTIVE' },
                    { name: 'Patricia Gomez', id: 'OPH-10815', dept: 'FinTech AU Ops', status: 'ACTIVE' },
                    { name: 'Restituto Navarro', id: 'OPH-10219', dept: 'Client Operations', status: 'RESIGNED (LWD+12)' },
                    { name: 'Kevin Tan', id: 'OPH-10184', dept: 'Digital Studio', status: 'OFFBOARDED' },
                    { name: 'Liam O’Connor', id: 'OPH-10940', dept: 'Creative Contractor', status: 'ACTIVE (BYOD)' }
                  ].map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#F5F8FA]">
                      <td className="py-2 px-2.5 font-semibold text-[#102A3A]">{emp.name}</td>
                      <td className="py-2 px-2.5 font-mono text-[#05253D]">{emp.id}</td>
                      <td className="py-2 px-2.5 text-[#607482]">{emp.dept}</td>
                      <td className="py-2 px-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'ACTIVE' || emp.status.includes('ACTIVE')
                            ? 'bg-[#EBF7F0] text-[#16834A]'
                            : emp.status.includes('LWD')
                            ? 'bg-[#FDEDED] text-[#C83C3C]'
                            : 'bg-[#FEF8EC] text-[#B7791F]'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC & ROLES MATRIX */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE5EA]">
            <div>
              <h2 className="text-base font-bold text-[#102A3A]">
                Role-Based Access Control Matrix (`RBAC-01` / `RBAC-02`)
              </h2>
              <p className="text-xs text-[#607482]">
                Enforces least privilege and Maker-Checker separation of duties (`creator_id != approver_id`).
              </p>
            </div>
            <span className="text-xs font-semibold text-[#05253D] bg-[#EEF3F6] px-3 py-1 rounded-full self-start sm:self-auto">
              6 Persona Definitions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition-all ${
                  currentRole.id === r.id
                    ? 'border-[#00C8E8] bg-[#EAFBFD] ring-2 ring-[#00C8E8]/30 shadow-xs'
                    : 'border-[#DCE5EA] bg-white'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
                  <div>
                    <span className="text-sm font-bold text-[#05253D] block">{r.name}</span>
                    <span className="text-[11px] text-[#607482]">{r.dept}</span>
                  </div>
                  {currentRole.id === r.id && (
                    <span className="text-[10px] font-bold bg-[#05253D] text-[#00C8E8] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#607482]">Financial Cost Visibility:</span>
                    <span className={r.canViewFinancials ? 'font-bold text-[#16834A]' : 'font-medium text-[#B7791F]'}>
                      {r.canViewFinancials ? 'Full Visibility' : 'Masked / Restricted'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#607482]">Approve Disposal (`DSP-01`):</span>
                    <span className={r.canApproveDisposal ? 'font-bold text-[#16834A]' : 'text-[#607482]'}>
                      {r.canApproveDisposal ? 'Authorized' : 'Unauthorized'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#607482]">Approve Exit Waiver (`CLR-03`):</span>
                    <span className={r.canApproveClearanceWaiver ? 'font-bold text-[#16834A]' : 'text-[#607482]'}>
                      {r.canApproveClearanceWaiver ? 'Authorized' : 'Unauthorized'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#607482]">Edit Asset Registry:</span>
                    <span className={r.canEditRegistry ? 'font-bold text-[#16834A]' : 'text-[#607482]'}>
                      {r.canEditRegistry ? 'Authorized' : 'Read-Only'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#607482] mt-3 pt-2 border-t border-[#EEF3F6] italic leading-relaxed">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};