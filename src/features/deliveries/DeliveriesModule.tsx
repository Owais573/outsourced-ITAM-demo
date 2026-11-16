import React from 'react';
import { Truck, Printer, Check, CheckCircle2, Clock, QrCode } from 'lucide-react';
import { Delivery, Role } from '../../types';
import { OwnershipBadge } from '../../components/feedback/Badges';

interface DeliveriesModuleProps {
  deliveries: Delivery[];
  currentRole: Role;
  onCompleteItEndorsement: (id: string) => void;
  onOpenQrModal: (delivery: Delivery) => void;
}

export const DeliveriesModule: React.FC<DeliveriesModuleProps> = ({
  deliveries,
  currentRole,
  onCompleteItEndorsement,
  onOpenQrModal
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
            SOP Process 6 • Delivery, Receiving & Tagging
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
            Inbound Deliveries, QR Tagging & 2-Day IT Staging Gate
          </h1>
          <p className="text-xs text-[#607482]">
            Assets remain in <code className="font-mono text-[#B7791F]">PENDING_TAGGING</code> and are strictly blocked from issuance until FA Custodian receiving sign-off and IT 2-day pre-issuance technical setup are verified.
          </p>
        </div>
        <button
          onClick={() => onOpenQrModal(deliveries[0])}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#05253D] text-white hover:bg-[#092741] transition-colors shrink-0"
        >
          <Printer className="w-4 h-4 text-[#00C8E8]" />
          Preview Printable QR Sheet (Avery/Zebra)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deliveries.map((del) => (
          <div
            key={del.id}
            className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DCE5EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#05253D] tabular-nums">{del.id}</span>
                    <OwnershipBadge ownership={del.ownership} />
                  </div>
                  <div className="text-sm font-semibold text-[#102A3A] mt-1">{del.model}</div>
                  <div className="text-xs text-[#607482] tabular-nums mt-0.5">
                    PO: {del.poNumber} • Vendor: {del.vendor}
                  </div>
                </div>
                {del.itEndorsementStatus === 'READY_AVAILABLE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#EBF7F0] text-[#16834A] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> IT Staged & Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#FEF8EC] text-[#B7791F] shrink-0">
                    <Clock className="w-3.5 h-3.5" /> Awaiting 2-Day IT Setup
                  </span>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 my-4 text-xs bg-[#F5F8FA] p-3.5 rounded-lg border border-[#DCE5EA] tabular-nums">
                <div>
                  <span className="text-[#607482] block text-[11px]">Deterministic Tag Range:</span>
                  <span className="font-bold text-[#05253D] truncate block">{del.tagRange}</span>
                </div>
                <div>
                  <span className="text-[#607482] block text-[11px]">Quantity Delivered:</span>
                  <span className="font-bold text-[#102A3A]">{del.qtyDelivered} serialized units</span>
                </div>
                <div>
                  <span className="text-[#607482] block text-[11px]">Receiving Site:</span>
                  <span className="font-semibold text-[#102A3A]">{del.site}</span>
                </div>
                <div>
                  <span className="text-[#607482] block text-[11px]">NetSuite Fixed Asset Ref:</span>
                  <span className="font-semibold text-[#102A3A]">
                    {currentRole.canViewFinancials ? del.netsuiteBatchRef : 'Restricted (Finance Only)'}
                  </span>
                </div>
              </div>

              {/* Mandatory 6-Point Receiving & 2-Day IT Staging Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#607482]">
                  Receiving & Mandatory 2-Day Pre-Issuance IT Checklist
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'physicalInspection', label: '1. Physical Chassis Inspection (FA Custodian)' },
                    { key: 'serialsVerified', label: '2. Serial Numbers Matched to Delivery Receipt' },
                    { key: 'qrLabelsPrinted', label: '3. Tamper-Evident QR Tags Printed & Affixed' },
                    { key: 'osImaged', label: '4. Approved SOE OS Image Deployed (IT)' },
                    { key: 'mdmEnrolled', label: '5. Corporate MDM / Intune / Kandji Enrolled' },
                    { key: 'edrAgentInstalled', label: '6. Bitdefender GravityZone EDR Verified' }
                  ].map((chk) => {
                    const done = (del.checklist as any)[chk.key];
                    return (
                      <div
                        key={chk.key}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          done
                            ? 'bg-[#EBF7F0]/60 border-[#16834A]/30 text-[#102A3A]'
                            : 'bg-[#FEF8EC]/60 border-[#B7791F]/30 text-[#B7791F]'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-[#16834A] shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-[#B7791F] shrink-0" />
                        )}
                        <span className="font-medium text-[11px] leading-tight">{chk.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCE5EA] flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onOpenQrModal(del)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EEF3F6] text-[#05253D] hover:bg-[#DCE5EA]"
              >
                <QrCode className="w-3.5 h-3.5" /> View QR Labels ({del.qtyDelivered})
              </button>

              {del.itEndorsementStatus !== 'READY_AVAILABLE' && (
                <button
                  onClick={() => onCompleteItEndorsement(del.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Endorse IT Staging & Release Stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
