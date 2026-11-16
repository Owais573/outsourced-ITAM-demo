import React from 'react';
import { LayoutDashboard, Package, QrCode, UserMinus } from 'lucide-react';

interface MobileBottomNavProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeModule, onSelectModule }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Registry', icon: Package },
    { id: 'audits', label: 'Scan Audit', icon: QrCode },
    { id: 'clearances', label: 'Clearance', icon: UserMinus },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#DCE5EA] z-30 flex items-center justify-around h-14 px-2 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeModule === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectModule(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#00B7D8]' : 'text-[#607482]'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="mt-0.5 leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
