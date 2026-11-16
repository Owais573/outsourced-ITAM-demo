import React from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  UserCheck,
  RotateCcw,
  ArrowLeftRight,
  QrCode,
  UserMinus,
  Wrench,
  Trash2,
  AlertTriangle,
  FileBarChart,
  Settings,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  X,
  type LucideIcon
} from 'lucide-react';
import { OutsourcedBrandLogo } from '../branding/OutsourcedBrandLogo';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeDanger?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    label: 'Assets',
    items: [
      { id: 'assets', label: 'Asset Registry', icon: Package, badge: '4,820' },
      { id: 'deliveries', label: 'Deliveries & Tagging', icon: Truck, badge: '2' },
      { id: 'issuance', label: 'Issuance & Handover', icon: UserCheck },
      { id: 'returns', label: 'Returns & Inspection', icon: RotateCcw, badge: '1' },
      { id: 'transfers', label: 'Inter-Site Transfers', icon: ArrowLeftRight, badge: '1' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'audits', label: 'Physical Audits (QR)', icon: QrCode, badge: 'Live' },
      { id: 'clearances', label: 'Staff Exit Clearance', icon: UserMinus, badge: '1 Overdue', badgeDanger: true },
      { id: 'maintenance', label: 'Maintenance & Warranty', icon: Wrench, badge: '3' },
      { id: 'disposals', label: 'Disposals & Destruction', icon: Trash2, badge: '1' },
      { id: 'incidents', label: 'Incidents & Discrepancies', icon: AlertTriangle, badge: '2' }
    ]
  },
  {
    label: 'Insights',
    items: [
      { id: 'reports', label: 'Governed Reports & CSV', icon: FileBarChart }
    ]
  },
  {
    label: 'Administration',
    items: [
      { id: 'admin', label: 'Administration & Masters', icon: Settings }
    ]
  }
];

interface SidebarProps {
  activeModule: string;
  onSelectModule: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#05253D]/60 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Off-canvas drawer on mobile, fixed rail/panel on desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 bg-white border-r border-[#DCE5EA] flex flex-col shrink-0 transition-all duration-200 select-none ${
          mobileOpen ? 'translate-x-0 w-[270px]' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}`}
      >
        {/* Floating Expand Button on Border (Visible only when collapsed on desktop) */}
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            className="hidden lg:flex absolute -right-3 top-5 z-40 w-6 h-6 rounded-full bg-white border border-[#DCE5EA] text-[#05253D] hover:text-[#00B7D8] hover:bg-[#F5F8FA] shadow-md items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}

        {/* Brand Header with official logo / favicon */}
        <div
          className={`h-16 bg-[#05253D] border-b border-[#092741] shrink-0 flex items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-3.5 gap-2'
          }`}
        >
          <OutsourcedBrandLogo collapsed={collapsed} />

          {/* Desktop Collapse Toggle (Visible only when expanded) */}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              className="hidden lg:flex p-1.5 rounded-lg text-[#8797A2] hover:text-white hover:bg-[#092741] transition-colors shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-[#8797A2] hover:text-white ml-auto"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Operational Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-2.5 mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#607482]">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        onCloseMobile();
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center px-0' : 'justify-between px-2.5'
                      } py-2 rounded-lg text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#EAFBFD] text-[#05253D] font-semibold shadow-xs ring-1 ring-[#00C8E8]/40'
                          : 'text-[#102A3A] hover:bg-[#EEF3F6]'
                      }`}
                    >
                      <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'justify-center' : ''}`}>
                        {!collapsed && (
                          <span
                            className={`w-1 h-4 rounded-full transition-all ${
                              isActive ? 'bg-[#00C8E8]' : 'bg-transparent'
                            }`}
                          />
                        )}
                        <IconComp
                          className={`w-[18px] h-[18px] shrink-0 ${
                            isActive ? 'text-[#00B7D8]' : 'text-[#607482]'
                          }`}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[11px] font-semibold rounded tabular-nums ${
                            item.badgeDanger
                              ? 'bg-[#FDEDED] text-[#C83C3C]'
                              : isActive
                              ? 'bg-[#05253D] text-[#00C8E8]'
                              : 'bg-[#EEF3F6] text-[#607482]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* System Boundary & Security Footer */}
        <div className="p-3 border-t border-[#DCE5EA] bg-[#F5F8FA] shrink-0">
          {!collapsed ? (
            <div className="rounded-lg bg-[#05253D] text-white p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#00C8E8] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Corporate Private VPN
                </span>
                <span className="text-[10px] bg-[#092741] px-1.5 py-0.5 rounded text-[#8797A2] tabular-nums">
                  TLS 1.3
                </span>
              </div>
              <p className="text-[11px] text-[#DCE5EA]/80 leading-snug">
                Operational System of Record. Financial GL stays in NetSuite.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Corporate Private VPN — TLS 1.3 Verified">
              <ShieldCheck className="w-5 h-5 text-[#05253D]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
