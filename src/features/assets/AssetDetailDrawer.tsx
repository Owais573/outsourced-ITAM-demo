import React, { useState } from 'react';
import { X, QrCode, FileText, CheckCircle2, Lock } from 'lucide-react';
import { Asset, Role, AssetDocument } from '../../types';
import { StatusBadge, ConditionBadge, OwnershipBadge } from '../../components/feedback/Badges';
import { AssetConfigurationView } from './AssetConfigurationView';

interface AssetDetailDrawerProps {
  asset: Asset | null;
  onClose: () => void;
  currentRole: Role;
  onOpenDocumentPreview: (doc: AssetDocument) => void;
  onOpenPrintQr: () => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  asset,
  onClose,
  currentRole,
  onOpenDocumentPreview,
  onOpenPrintQr
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'custody' | 'documents' | 'history'>('overview');

  if (!asset) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Asset Detail for ${asset.assetTag}`}
      className="fixed inset-0 z-50 bg-[#05253D]/60 backdrop-blur-2xs flex justify-end animate-fadeIn"
    >
      <div className="w-full max-w-3xl bg-white h-full flex flex-col shadow-2xl border-l border-[#DCE5EA]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#05253D] text-white flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg sm:text-xl font-bold text-[#00C8E8] tabular-nums">
                {asset.assetTag}
              </span>
              <StatusBadge status={asset.status} />
              <ConditionBadge condition={asset.condition} />
              <OwnershipBadge ownership={asset.ownership} />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white mt-1.5 truncate">
              {asset.model}
            </h2>
            <p className="text-xs text-[#DCE5EA]/80 mt-0.5 tabular-nums truncate">
              Serial Number: <span className="font-mono text-white">{asset.serialNumber}</span> • {asset.siteName} ({asset.location})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#092741] text-[#DCE5EA] hover:text-white shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-5 bg-[#EEF3F6] border-b border-[#DCE5EA] flex gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Overview & Specs' },
            { id: 'custody', label: `Custody & Components (${asset.accessories.length})` },
            { id: 'documents', label: `Document Vault (${asset.documents.length})` },
            { id: 'history', label: `Immutable Timeline (${asset.history.length})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-[#00C8E8] text-[#05253D] bg-white'
                  : 'border-transparent text-[#607482] hover:text-[#102A3A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Detailed Hardware Configuration & IT Staging Record (AssetTiger / Snipe-IT Standard) */}
              <AssetConfigurationView 
                asset={asset} 
                currentRole={currentRole}
                onUpdateSpecs={(updated) => {
                  asset.technicalSpecs = updated;
                  if (updated.processor && updated.ram) {
                    asset.specs = `${updated.processor}, ${updated.ram}, ${updated.storageCapacity || ''} ${updated.storageType || ''}, ${updated.osName || ''} (${updated.mdmEnrollmentRecord || 'IT Staged'})`;
                  }
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs tabular-nums">
                <div className="p-4 rounded-xl border border-[#DCE5EA] space-y-2 bg-white">
                  <div className="font-bold uppercase tracking-wider text-[#05253D]">
                    Operational Custody & Location
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Current Assignee:</span>
                    <span className="font-semibold text-[#102A3A] truncate">{asset.assignee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Employee ID:</span>
                    <span className="font-semibold text-[#102A3A]">{asset.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Steward Custodian:</span>
                    <span className="font-semibold text-[#102A3A]">{asset.custodian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Warranty Expiry:</span>
                    <span className="font-semibold text-[#16834A]">{asset.warrantyExpiry}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#DCE5EA] space-y-2 bg-white">
                  <div className="font-bold uppercase tracking-wider text-[#05253D]">
                    External System Boundaries (`EXT-01`)
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">HubSpot Ticket:</span>
                    <span className="font-semibold text-[#00B7D8]">#{asset.hubspotTicket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">NetSuite Fixed Asset:</span>
                    {asset.ownership === 'CLIENT_OWNED' ? (
                      <span className="font-semibold text-[#1677A8]">
                        EXCLUDED (Client-Owned)
                      </span>
                    ) : currentRole.canViewFinancials ? (
                      <span className="font-semibold text-[#102A3A]">{asset.netsuiteId || '—'}</span>
                    ) : (
                      <span className="text-[#B7791F] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Restricted
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Acquisition Cost:</span>
                    {currentRole.canViewFinancials ? (
                      <span className="font-bold text-[#05253D]">
                        {asset.purchaseCost
                          ? `${asset.currency} ${asset.purchaseCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          : 'N/A (Non-Capitalized)'}
                      </span>
                    ) : (
                      <span className="text-[#B7791F] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Hidden by RBAC
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#607482]">Supplier / Vendor:</span>
                    <span className="font-medium text-[#102A3A] truncate">{asset.vendor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'custody' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
                Bundled Tracked Accessories & Components (`asset_components`)
              </h3>
              {asset.accessories.length === 0 ? (
                <p className="text-xs text-[#607482]">No bundled accessories recorded for this unit.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {asset.accessories.map((acc) => (
                    <div
                      key={acc}
                      className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA] flex items-center gap-2 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                      <span>{acc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
                  Immutable Document & Evidence Vault (`asset_documents`)
                </h3>
                <p className="text-[11px] text-[#607482]">
                  Signed forms cannot be deleted; replacements create superseding versions (`DOC-02`).
                </p>
              </div>
              <div className="space-y-2.5">
                {asset.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-[#DCE5EA] bg-[#F5F8FA] flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-[#00B7D8] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-[#102A3A] flex items-center gap-2 truncate">
                          <span className="truncate">{doc.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#05253D] text-[#00C8E8] text-[10px] shrink-0">
                            v{doc.version}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#607482] tabular-nums mt-0.5 truncate">
                          Type: {doc.type} • Uploaded: {doc.date} by {doc.uploader}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenDocumentPreview(doc)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#DCE5EA] font-semibold text-[#05253D] hover:bg-[#EEF3F6] shrink-0 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#05253D]">
                Chronological Lifecycle & Custody Audit Trail
              </h3>
              <div className="space-y-3.5 border-l-2 border-[#00C8E8] pl-4 ml-2">
                {asset.history.map((h, i) => (
                  <div key={i} className="relative text-xs space-y-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#05253D] border-2 border-[#00C8E8] absolute -left-[21.5px] top-1" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#05253D] bg-[#EAFBFD] px-1.5 py-0.5 rounded text-[11px]">
                        {h.action}
                      </span>
                      <span className="text-[#607482] font-medium">{h.actor}</span>
                      <span className="text-[#8797A2] tabular-nums ml-auto text-[11px]">{h.date}</span>
                    </div>
                    <p className="text-[#102A3A]">{h.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F8FA] border-t border-[#DCE5EA] flex items-center justify-between shrink-0">
          <button
            onClick={onOpenPrintQr}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#DCE5EA] text-[#05253D] hover:bg-[#EEF3F6]"
          >
            <QrCode className="w-4 h-4 text-[#00B7D8]" /> Print QR Tag
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#05253D] hover:bg-[#092741] text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
