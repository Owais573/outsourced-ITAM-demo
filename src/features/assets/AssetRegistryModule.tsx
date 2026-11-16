import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Plus,
  Printer,
  ArrowLeftRight,
  QrCode,
  AlertTriangle,
  ChevronRight,
  X
} from 'lucide-react';
import { Asset, Role, OwnershipType, LifecycleStatus, PhysicalCondition } from '../../types';
import { StatusBadge, ConditionBadge, OwnershipBadge } from '../../components/feedback/Badges';

interface AssetRegistryModuleProps {
  assets: Asset[];
  currentRole: Role;
  selectedSite: string;
  initialStatusFilter?: string;
  onSelectAsset: (asset: Asset) => void;
  onOpenPrintQrBatch: () => void;
  onNavigateTransfers: () => void;
  onNavigateDeliveries: () => void;
  onTriggerToast: (title: string, detail: string, type?: 'success' | 'warning' | 'info' | 'danger') => void;
}

export const AssetRegistryModule: React.FC<AssetRegistryModuleProps> = ({
  assets,
  currentRole,
  selectedSite,
  initialStatusFilter = 'ALL',
  onSelectAsset,
  onOpenPrintQrBatch,
  onNavigateTransfers,
  onNavigateDeliveries,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwnership, setFilterOwnership] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>(initialStatusFilter);
  const [filterCondition, setFilterCondition] = useState<string>('ALL');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Filtered Assets Memo
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (selectedSite !== 'ALL' && a.site !== selectedSite) return false;
      if (filterOwnership !== 'ALL' && a.ownership !== filterOwnership) return false;
      if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
      if (filterCondition !== 'ALL' && a.condition !== filterCondition) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          a.assetTag.toLowerCase().includes(q) ||
          a.serialNumber.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.assignee.toLowerCase().includes(q) ||
          (a.hubspotTicket && a.hubspotTicket.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [assets, selectedSite, filterOwnership, filterStatus, filterCondition, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A]">Unified Asset Registry</h1>
          <p className="text-xs text-[#607482] mt-0.5">
            Authoritative operational inventory across Company-Owned, Client-Owned, and Staff BYOD equipment. Status and Condition are strictly decoupled.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() =>
              onTriggerToast(
                'Governed CSV Export Generated',
                `Exported ${filteredAssets.length} records. Audit log recorded for actor ${currentRole.displayName || currentRole.user}.`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#DCE5EA] text-[#102A3A] hover:bg-[#EEF3F6]"
          >
            <Download className="w-3.5 h-3.5 text-[#607482]" />
            Export Scoped CSV
          </button>
          {currentRole.canEditRegistry && (
            <button
              onClick={onNavigateDeliveries}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Register New Asset
            </button>
          )}
        </div>
      </div>

      {/* Faceted Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#DCE5EA] p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#607482] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Asset Tag, Serial, Assignee..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg focus:outline-none focus:border-[#00C8E8] text-[#102A3A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#8797A2] hover:text-[#05253D] hover:bg-[#EEF3F6] transition-colors"
                title="Clear search filter"
                aria-label="Clear search filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="md:col-span-3">
            <select
              value={filterOwnership}
              onChange={(e) => setFilterOwnership(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg text-[#102A3A] font-medium"
            >
              <option value="ALL">All Ownership Types</option>
              <option value="COMPANY_OWNED">Company-Owned (Outsourced)</option>
              <option value="CLIENT_OWNED">Client-Owned (Consigned)</option>
              <option value="STAFF_OWNED">Staff-Owned (Approved BYOD)</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg text-[#102A3A] font-medium"
            >
              <option value="ALL">All Lifecycle Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="UNDER_INSPECTION">Under Inspection</option>
              <option value="UNDER_REPAIR">Under Repair</option>
              <option value="PENDING_DISPOSAL">Pending Disposal</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#F5F8FA] border border-[#DCE5EA] rounded-lg text-[#102A3A] font-medium"
            >
              <option value="ALL">All Conditions</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DEFECTIVE">Defective</option>
              <option value="BEYOND_REPAIR">Beyond Repair</option>
            </select>
          </div>
        </div>

        {/* Contextual Bulk Action Bar */}
        {selectedAssetIds.length > 0 && (
          <div className="pt-2 border-t border-[#DCE5EA] flex items-center justify-between bg-[#EAFBFD] px-3 py-2 rounded-lg">
            <span className="text-xs font-semibold text-[#05253D] tabular-nums">
              {selectedAssetIds.length} asset(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPrintQrBatch}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-[#DCE5EA] text-[#05253D] hover:bg-[#EEF3F6] flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print QR
              </button>
              <button
                onClick={onNavigateTransfers}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-[#05253D] text-white hover:bg-[#092741] flex items-center gap-1"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#00C8E8]" /> Transfer
              </button>
              <button
                onClick={() => setSelectedAssetIds([])}
                className="text-xs text-[#607482] hover:text-[#102A3A] ml-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Production Data Grid / Mobile Responsive Card Fallback */}
      <div className="bg-white rounded-xl border border-[#DCE5EA] overflow-hidden shadow-2xs">
        {/* Desktop / Tablet Table View (hidden on small phone viewports) */}
        <div className="hidden md:block overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-semibold uppercase tracking-wider text-[#607482]">
                <th className="py-3 px-4 w-9">
                  <input
                    type="checkbox"
                    aria-label="Select all visible assets"
                    checked={selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0}
                    onChange={(e) =>
                      setSelectedAssetIds(
                        e.target.checked ? filteredAssets.map((a) => a.id) : []
                      )
                    }
                    className="rounded border-[#DCE5EA]"
                  />
                </th>
                <th className="py-3 px-3">Asset Tag</th>
                <th className="py-3 px-3">Category & Model</th>
                <th className="py-3 px-3">Serial Number</th>
                <th className="py-3 px-3">Ownership</th>
                <th className="py-3 px-3">Lifecycle Status</th>
                <th className="py-3 px-3">Physical Condition</th>
                <th className="py-3 px-3">Assignee / Custody</th>
                <th className="py-3 px-3">Site & External Refs</th>
                {currentRole.canViewFinancials && (
                  <th className="py-3 px-3 text-right">Book Cost</th>
                )}
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5EA] text-[13px]">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-[#EAFBFD]/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${asset.assetTag}`}
                      checked={selectedAssetIds.includes(asset.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssetIds([...selectedAssetIds, asset.id]);
                        } else {
                          setSelectedAssetIds(selectedAssetIds.filter((id) => id !== asset.id));
                        }
                      }}
                      className="rounded border-[#DCE5EA]"
                    />
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#05253D] tabular-nums whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-[#00B7D8] shrink-0" />
                      {asset.assetTag}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-[#102A3A]">{asset.model}</div>
                    <div className="text-xs text-[#607482]">{asset.category}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs text-[#102A3A] tabular-nums whitespace-nowrap">
                    <div>{asset.serialNumber}</div>
                    {asset.duplicateSerialWarning && (
                      <span
                        title="Non-unique manufacturer serial warning (AST-04)"
                        className="inline-flex items-center gap-1 text-[10px] text-[#B7791F] font-sans font-medium"
                      >
                        <AlertTriangle className="w-3 h-3" /> Dup S/N Flagged
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <OwnershipBadge ownership={asset.ownership} />
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <ConditionBadge condition={asset.condition} />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-[#102A3A]">{asset.assignee}</div>
                    <div className="text-xs text-[#607482] tabular-nums">
                      {asset.employeeId !== '—' ? `${asset.employeeId} • ${asset.department}` : asset.department}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="text-xs font-medium text-[#102A3A]">{asset.siteName}</div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap tabular-nums">
                      {asset.hubspotTicket && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#EEF3F6] text-[#102A3A] rounded border border-[#DCE5EA]">
                          #{asset.hubspotTicket}
                        </span>
                      )}
                      {asset.netsuiteId && currentRole.canViewFinancials && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#EAFBFD] text-[#05253D] rounded border border-[#00C8E8]/40">
                          {asset.netsuiteId}
                        </span>
                      )}
                    </div>
                  </td>
                  {currentRole.canViewFinancials && (
                    <td className="py-3.5 px-3 text-right font-semibold tabular-nums whitespace-nowrap">
                      {asset.purchaseCost ? (
                        <span>
                          {asset.currency} {asset.purchaseCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8797A2] font-normal">
                          Excluded ({asset.ownership === 'CLIENT_OWNED' ? 'Client' : 'BYOD'})
                        </span>
                      )}
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#05253D] bg-[#EEF3F6] hover:bg-[#00C8E8] transition-colors"
                    >
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Viewport Card List (< 768px) */}
        <div className="md:hidden divide-y divide-[#DCE5EA]">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-4 hover:bg-[#EAFBFD]/40 transition-colors cursor-pointer space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#05253D] text-sm tabular-nums flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-[#00B7D8]" />
                  {asset.assetTag}
                </span>
                <StatusBadge status={asset.status} />
              </div>

              <div>
                <div className="font-semibold text-xs text-[#102A3A]">{asset.model}</div>
                <div className="text-[11px] text-[#607482] mt-0.5 font-mono">S/N: {asset.serialNumber}</div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F1F5F9]">
                <div className="text-[11px] text-[#607482]">
                  Custody: <strong className="text-[#102A3A] font-medium">{asset.assignee}</strong>
                </div>
                <ConditionBadge condition={asset.condition} />
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 bg-[#F5F8FA] border-t border-[#DCE5EA] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#607482] tabular-nums gap-1">
          <span>
            Showing <strong className="text-[#102A3A]">{filteredAssets.length}</strong> of{' '}
            <strong className="text-[#102A3A]">{assets.length}</strong> primary records (Fleet: 4,820 units)
          </span>
          <span>Click any row to open the complete Custody & Evidence Drawer</span>
        </div>
      </div>
    </div>
  );
};
