import React from 'react';
import { StatusBadge } from '../../components/feedback/Badges';

export const MaintenanceModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#00B7D8]">
          SOP-Aligned • Hardware Defect, Vendor RMA & Warranty Registry
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A3A] mt-0.5">
          Maintenance Queue & Warranty Expiration Alerts
        </h1>
        <p className="text-xs text-[#607482]">
          Assets in <code className="font-mono text-[#C83C3C]">UNDER_REPAIR</code> are automatically excluded from issuance pick-lists. Links directly to authoritative HubSpot repair tickets.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#DCE5EA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#EEF3F6] border-b border-[#DCE5EA] text-[11px] font-semibold uppercase text-[#607482]">
                <th className="py-3 px-4">Case & Asset Tag</th>
                <th className="py-3 px-3">Equipment & Issue</th>
                <th className="py-3 px-3">HubSpot Ticket Ref</th>
                <th className="py-3 px-3">Vendor & Warranty Coverage</th>
                <th className="py-3 px-3">Downtime</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5EA] tabular-nums">
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#05253D] whitespace-nowrap">
                  MNT-2026-019
                  <span className="block text-[#00B7D8]">OPH-AST-00612</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#102A3A]">HP EliteBook 840 G9</div>
                  <div className="text-[#607482]">System board power rail failure</div>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-[#EEF3F6] border border-[#DCE5EA] font-medium">
                    #HS-89912 (External Ref)
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-medium text-[#102A3A]">HP Inc. Commercial Care Pack</div>
                  <div className="text-[#16834A]">Covered until 2027-01-20</div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-[#B7791F]">6 Days</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <StatusBadge status="UNDER_REPAIR" />
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#05253D] whitespace-nowrap">
                  WRN-ALERT-088
                  <span className="block text-[#00B7D8]">OPH-AST-00410</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-[#102A3A]">Dell Latitude 5430 (Batch of 18)</div>
                  <div className="text-[#607482]">ProSupport 30-Day Expiration Reminder</div>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-[#EEF3F6] border border-[#DCE5EA] font-medium">
                    #HS-90105
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-medium text-[#102A3A]">Dell Philippines Commercial</div>
                  <div className="text-[#B7791F] font-semibold">Expires in 28 Days (2026-12-13)</div>
                </td>
                <td className="py-3.5 px-3 text-[#607482]">0 Days (Active)</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <StatusBadge status="ASSIGNED" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
