import React from 'react';
import { QrCode, X, Printer } from 'lucide-react';
import { Delivery } from '../../types';

interface PrintableQrModalProps {
  delivery: Delivery | null;
  onClose: () => void;
  onPrint: () => void;
}

export const PrintableQrModal: React.FC<PrintableQrModalProps> = ({ delivery, onClose, onPrint }) => {
  if (!delivery) return null;

  const sampleTags = [
    'OPH-AST-00890',
    'OPH-AST-00891',
    'OPH-AST-00892',
    'OPH-AST-00893'
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 bg-[#05253D]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#DCE5EA] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#05253D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#00C8E8]" />
            <h2 id="qr-modal-title" className="text-sm font-bold truncate">
              Printable Tamper-Evident QR / Barcode Labels (Zebra ZT230 / Avery)
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8797A2] hover:text-white p-1" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="text-xs text-[#607482]">
            Batch Ref: <strong className="text-[#102A3A]">{delivery.id}</strong> • Tag Range: <strong className="text-[#05253D]">{delivery.tagRange}</strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {sampleTags.map((tag, idx) => (
              <div
                key={tag}
                className="p-3.5 rounded-xl border-2 border-dashed border-[#05253D]/40 bg-[#F5F8FA] flex items-center gap-3.5"
              >
                <div className="w-16 h-16 bg-white p-1.5 rounded border border-[#DCE5EA] flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-[#05253D]" />
                </div>
                <div className="text-xs space-y-0.5 tabular-nums min-w-0">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#05253D]">
                    PROPERTY OF OUTSOURCED
                  </div>
                  <div className="text-sm font-bold text-[#05253D]">{tag}</div>
                  <div className="text-[10px] text-[#607482] font-mono">S/N: C02M3PRO-00{idx + 1}</div>
                  <div className="text-[9px] text-[#00B7D8] font-semibold truncate">
                    itam.corp.outsourced.com/a/{tag}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE5EA]">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#DCE5EA] hover:bg-[#F5F8FA]"
            >
              Cancel
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#00C8E8] hover:bg-[#00B7D8] text-[#05253D] transition-colors"
            >
              <Printer className="w-4 h-4" /> Download Vector PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
