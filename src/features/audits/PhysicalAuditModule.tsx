import React, { useState } from 'react';
import {
  Camera,
  Flashlight,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Info,
  Clock
} from 'lucide-react';
import { AuditItem } from '../../types';

interface PhysicalAuditModuleProps {
  auditItems: AuditItem[];
  onSimulateScan: (mode: 'MATCH' | 'WRONG_LOC' | 'DUPLICATE') => void;
  lastScanFeedback: {
    type: string;
    tag: string;
    message: string;
    time: string;
  };
  onRequestVpqsSignoff: () => void;
}

export const PhysicalAuditModule: React.FC<PhysicalAuditModuleProps> = ({
  auditItems,
  onSimulateScan,
  lastScanFeedback,
  onRequestVpqsSignoff
}) => {
  const [viewMode, setViewMode] = useState<'SPLIT' | 'MOBILE' | 'DESKTOP'>('SPLIT');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualInput, setManualInput] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
            SOP Process 4 • Mobile-First Physical Inventory & Variance Reconciliation
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
            Audit Session AUD-2026-Q4 — Manila Cyber Sigma (Floor 14)
          </h1>
          <p className="text-xs text-[#607482]">
            Population snapshot locked at session start. Unscanned items remain <code className="font-mono text-[#B7791F]">UNVERIFIED</code> and are never automatically marked as lost without investigation.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#DCE5EA] self-start md:self-auto">
          {[
            { id: 'SPLIT', label: 'Split Showcase' },
            { id: 'MOBILE', label: 'Mobile Scanner' },
            { id: 'DESKTOP', label: 'Reconciliation Table' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === m.id
                  ? 'bg-[#05253D] text-white'
                  : 'text-[#607482] hover:text-[#102A3A]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Audit Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 tabular-nums">
        {[
          { label: 'Expected Baseline', val: 142, color: 'text-[#05253D]', bg: 'bg-white' },
          { label: 'Scanned Total', val: auditItems.filter((i) => i.scanState !== 'UNVERIFIED').length + 130, color: 'text-[#00B7D8]', bg: 'bg-white' },
          { label: 'Matched On-Site', val: auditItems.filter((i) => i.scanState === 'MATCHED').length + 129, color: 'text-[#16834A]', bg: 'bg-[#EBF7F0]/40' },
          { label: 'Variance', val: auditItems.filter((i) => i.scanState === 'WRONG_LOCATION' || i.scanState === 'UNEXPECTED').length + 1, color: 'text-[#B7791F]', bg: 'bg-[#FEF8EC]/50' },
          { label: 'Unverified', val: auditItems.filter((i) => i.scanState === 'UNVERIFIED').length + 6, color: 'text-[#C83C3C]', bg: 'bg-[#FDEDED]/40' }
        ].map((c) => (
          <div key={c.label} className={`${c.bg} p-3 sm:p-4 rounded-xl border border-[#DCE5EA]`}>
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#607482] truncate">
              {c.label}
            </div>
            <div className={`text-xl sm:text-2xl font-bold mt-1 ${c.color}`}>{c.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile-First Handheld QR Scanner Simulator */}
        {(viewMode === 'SPLIT' || viewMode === 'MOBILE') && (
          <div className={`${viewMode === 'MOBILE' ? 'lg:col-span-6 lg:col-start-4' : 'lg:col-span-5'} bg-[#05253D] text-white rounded-3xl p-5 border-4 border-[#092741] shadow-xl space-y-4`}>
            <div className="flex items-center justify-between border-b border-[#092741] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#00C8E8]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#00C8E8]">
                  Mobile QR Audit Scanner (html5-qrcode)
                </span>
              </div>
              <button
                onClick={() => setFlashlightOn(!flashlightOn)}
                className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  flashlightOn
                    ? 'bg-[#00C8E8] text-[#05253D]'
                    : 'bg-[#092741] text-[#DCE5EA] border border-[#DCE5EA]/20'
                }`}
              >
                <Flashlight className="w-4 h-4" />
                {flashlightOn ? 'Torch ON' : 'Torch OFF'}
              </button>
            </div>

            {/* Viewfinder reticle */}
            <div className="relative h-48 sm:h-52 rounded-2xl bg-[#092741] border border-[#00C8E8]/40 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-32 sm:w-36 h-32 sm:h-36 border-2 border-dashed border-[#00C8E8] rounded-xl flex items-center justify-center relative">
                <QrCode className="w-14 sm:w-16 h-14 sm:h-16 text-[#00C8E8]/40" />
                <div className="absolute inset-x-2 top-1/2 h-0.5 bg-[#00C8E8] shadow-[0_0_8px_#00C8E8]" />
              </div>
              <span className="text-[11px] text-[#DCE5EA] mt-2 text-center px-2">
                Align asset QR label inside reticle • Debounce active (&lt;200ms)
              </span>
            </div>

            {/* Readout Feedback */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                lastScanFeedback.type === 'MATCHED'
                  ? 'bg-[#16834A]/20 border-[#16834A] text-white'
                  : lastScanFeedback.type === 'WRONG_LOCATION'
                  ? 'bg-[#B7791F]/25 border-[#B7791F] text-white'
                  : 'bg-[#1677A8]/25 border-[#00C8E8] text-white'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>FEEDBACK ({lastScanFeedback.tag})</span>
                <span className="tabular-nums">{lastScanFeedback.time}</span>
              </div>
              <p className="mt-1 text-[#DCE5EA] leading-relaxed">{lastScanFeedback.message}</p>
            </div>

            {/* Scan Simulation Controls (≥44px Touch Targets) */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8797A2] font-semibold block">
                Field Scan Simulation (Touch Targets ≥ 44×44px)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onSimulateScan('MATCH')}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-[#16834A] hover:bg-[#16834A]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Scan Match
                </button>
                <button
                  onClick={() => onSimulateScan('WRONG_LOC')}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-[#B7791F] hover:bg-[#B7791F]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" /> Wrong Location
                </button>
                <button
                  onClick={() => onSimulateScan('DUPLICATE')}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-[#092741] hover:bg-[#102A3A] border border-[#00C8E8]/40 text-[#00C8E8] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
              </div>
            </div>

            {/* Manual Tag Entry */}
            <div className="pt-2 border-t border-[#092741] flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Manual tag (e.g. OPH-AST-00849)"
                className="flex-1 min-h-[44px] px-3 rounded-xl bg-[#092741] border border-[#DCE5EA]/20 text-xs text-white placeholder-[#8797A2] tabular-nums"
              />
              <button
                onClick={() => {
                  if (!manualInput.trim()) return;
                  onSimulateScan('MATCH');
                  setManualInput('');
                }}
                className="min-h-[44px] px-4 rounded-xl bg-[#00C8E8] text-[#05253D] text-xs font-bold hover:bg-[#00B7D8] transition-colors"
              >
                Record
              </button>
            </div>
          </div>
        )}

        {/* Desktop / Tablet Reconciliation Table */}
        {(viewMode === 'SPLIT' || viewMode === 'DESKTOP') && (
          <div className={`${viewMode === 'DESKTOP' ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white rounded-xl border border-[#DCE5EA] overflow-hidden`}>
            <div className="p-4 border-b border-[#DCE5EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#102A3A]">
                  Real-Time Audit Population & Variance Classification
                </h3>
                <p className="text-xs text-[#607482]">
                  Classifications: MATCHED, WRONG_LOCATION, UNEXPECTED, UNVERIFIED
                </p>
              </div>
              <button
                onClick={onRequestVpqsSignoff}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#05253D] text-white hover:bg-[#092741] transition-colors self-start sm:self-auto"
              >
                Request VPQS Sign-Off
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-semibold uppercase text-[#607482]">
                    <th className="py-2.5 px-3">Asset Tag</th>
                    <th className="py-2.5 px-3">Model & Custodian</th>
                    <th className="py-2.5 px-3">Expected Location</th>
                    <th className="py-2.5 px-3">Scanned Location</th>
                    <th className="py-2.5 px-3">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5EA] tabular-nums">
                  {auditItems.map((item) => (
                    <tr key={item.tag} className="hover:bg-[#F5F8FA]">
                      <td className="py-3 px-3 font-bold text-[#05253D] whitespace-nowrap">{item.tag}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#102A3A]">{item.model}</div>
                        <div className="text-[#607482]">{item.custodian}</div>
                      </td>
                      <td className="py-3 px-3 text-[#607482]">{item.expectedLoc}</td>
                      <td className="py-3 px-3 font-medium text-[#102A3A]">{item.scannedLoc}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.scanState === 'MATCHED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF7F0] text-[#16834A] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> MATCHED ({item.scannedAt})
                          </span>
                        )}
                        {item.scanState === 'WRONG_LOCATION' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF8EC] text-[#B7791F] font-semibold">
                            <AlertTriangle className="w-3 h-3" /> WRONG_LOCATION
                          </span>
                        )}
                        {item.scanState === 'UNEXPECTED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EBF5FA] text-[#1677A8] font-semibold">
                            <Info className="w-3 h-3" /> UNEXPECTED_IN_SCOPE
                          </span>
                        )}
                        {item.scanState === 'UNVERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] font-semibold">
                            <Clock className="w-3 h-3" /> UNVERIFIED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
