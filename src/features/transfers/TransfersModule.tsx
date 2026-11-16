import React from 'react';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Transfer } from '../../types';
import { StatusBadge } from '../../components/feedback/Badges';

interface TransfersModuleProps {
  transfers: Transfer[];
  onConfirmReceipt: (transferId: string) => void;
}

export const TransfersModule: React.FC<TransfersModuleProps> = ({ transfers, onConfirmReceipt }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP Process 5 • Inter-Site & Custodian Transfers
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Asset Transfers, Transmittals & Destination Receipt Verification
        </h1>
        <p className="text-xs text-[#607482]">
          Creating a transfer request or dispatching items sets status to <code className="font-mono text-[#B7791F]">IN_TRANSIT</code>. Asset site and custody do <strong>not</strong> change until the destination custodian confirms physical receipt.
        </p>
      </div>

      <div className="space-y-4">
        {transfers.map((trn) => (
          <div key={trn.id} className="bg-white rounded-xl border border-[#DCE5EA] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#DCE5EA]">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-bold text-[#05253D] tabular-nums">{trn.id}</span>
                  <StatusBadge status={trn.status === 'IN_TRANSIT' ? 'IN_TRANSIT' : 'AVAILABLE'} />
                  <span className="px-2 py-0.5 rounded bg-[#EEF3F6] text-xs font-medium tabular-nums">
                    Gatepass: {trn.gatepassRef}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#102A3A] mt-1.5">
                  <span>{trn.fromSite}</span>
                  <ArrowLeftRight className="w-4 h-4 text-[#00B7D8]" />
                  <span>{trn.toSite}</span>
                </div>
                <div className="text-xs text-[#607482] mt-0.5 tabular-nums">
                  Dispatched: {trn.dispatchDate} • From: {trn.sendingCustodian} → To: {trn.receivingCustodian}
                </div>
              </div>

              {trn.status === 'IN_TRANSIT' ? (
                <button
                  onClick={() => onConfirmReceipt(trn.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Confirm Receipt at Destination
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#16834A] flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Physical Receipt Confirmed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {trn.items.map((it) => (
                <div
                  key={it.tag}
                  className="p-3 rounded-lg bg-[#F5F8FA] border border-[#DCE5EA] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 mr-2">
                    <div className="font-bold text-[#05253D] tabular-nums">{it.tag}</div>
                    <div className="text-[#102A3A] font-medium truncate">{it.model}</div>
                    <div className="text-[#607482] font-mono text-[11px] tabular-nums">S/N: {it.serial}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] shrink-0 ${
                      it.state === 'RECEIVED'
                        ? 'bg-[#EBF7F0] text-[#16834A]'
                        : 'bg-[#FEF8EC] text-[#B7791F]'
                    }`}
                  >
                    {it.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
