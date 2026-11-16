import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ROLES, SITES } from './data/roles';
import { INITIAL_ASSETS } from './data/initialAssets';
import { INITIAL_DELIVERIES } from './data/initialDeliveries';
import { INITIAL_CLEARANCES, INITIAL_TRANSFERS, INITIAL_AUDIT_ITEMS } from './data/initialData';
import {
  Asset,
  Delivery,
  Clearance,
  Transfer,
  AuditItem,
  DisposalState,
  AssetDocument,
  ToastNotification
} from './types';

// Layout & Navigation Components
import { Sidebar, NAV_GROUPS } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { RbacContextBanner } from './components/layout/RbacContextBanner';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Modals
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { PrintableQrModal } from './components/modals/PrintableQrModal';
import { ExecutiveWaiverModal } from './components/modals/ExecutiveWaiverModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';

// Feature Modules
import { DashboardModule } from './features/dashboard/DashboardModule';
import { AssetRegistryModule } from './features/assets/AssetRegistryModule';
import { AssetDetailDrawer } from './features/assets/AssetDetailDrawer';
import { DeliveriesModule } from './features/deliveries/DeliveriesModule';
import { IssuanceWizardModule } from './features/issuance/IssuanceWizardModule';
import { ReturnsInspectionModule } from './features/returns/ReturnsInspectionModule';
import { TransfersModule } from './features/transfers/TransfersModule';
import { PhysicalAuditModule } from './features/audits/PhysicalAuditModule';
import { ClearancesModule } from './features/clearances/ClearancesModule';
import { DisposalsModule } from './features/disposals/DisposalsModule';
import { MaintenanceModule } from './features/maintenance/MaintenanceModule';
import { IncidentsModule } from './features/incidents/IncidentsModule';
import { ReportsModule } from './features/reports/ReportsModule';
import { AdminModule } from './features/admin/AdminModule';

export default function App() {
  // Navigation & Shell State
  const [activeModule, setActiveModule] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module') || 'dashboard';
      if (mod === 'registry') return 'assets';
      return mod;
    } catch {
      return 'dashboard';
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('ALL');
  const [currentRole, setCurrentRole] = useState(ROLES[0]);
  const [toastMessage, setToastMessage] = useState<ToastNotification | null>(null);

  // Modals & Drawers
  const [commandModalOpen, setCommandModalOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') === 'true' || params.get('cmd') === 'true';
    } catch {
      return false;
    }
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tagParam = params.get('asset') || params.get('tag');
      if (tagParam) {
        return INITIAL_ASSETS.find(a => a.assetTag === tagParam || a.id === tagParam) || INITIAL_ASSETS[0];
      }
    } catch {}
    return null;
  });
  const [qrModalDelivery, setQrModalDelivery] = useState<Delivery | null>(null);
  const [waiverModalOpen, setWaiverModalOpen] = useState(false);
  const [documentPreviewModal, setDocumentPreviewModal] = useState<AssetDocument | null>(null);

  // Core Data State (Preserved 100% per SOP guidelines)
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [clearances, setClearances] = useState<Clearance[]>(INITIAL_CLEARANCES);
  const [activeClearanceId, setActiveClearanceId] = useState('CLR-2026-041');
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [auditItems, setAuditItems] = useState<AuditItem[]>(INITIAL_AUDIT_ITEMS);
  const [lastScanFeedback, setLastScanFeedback] = useState({
    type: 'MATCHED',
    tag: 'OPH-AST-00842',
    message: 'MATCH VERIFIED — MacBook Pro 16" M3 Pro at Manila Floor 14 Pod B',
    time: '10:14:22 AM'
  });

  // Disposal State
  const [disposalState, setDisposalState] = useState<DisposalState>({
    proposalId: 'DSP-2026-014',
    assetTag: 'OPH-AST-00304',
    proposedBy: 'FA_CUSTODIAN',
    ProposedByName: 'Clarisse Bautista',
    approvals: {
      custodian: { approved: true, actor: 'Clarisse Bautista', date: '2026-11-11 13:15 UTC' },
      vpqs: { approved: true, actor: 'Elena Rodriguez (VPQS)', date: '2026-11-12 09:40 UTC' },
      finance: { approved: false, actor: null, date: null },
      ceo: { approved: false, actor: null, date: null }
    },
    ssdSerialVerified: false,
    degaussedAndShredded: false,
    destructionCertUploaded: false,
    destructionPhotoUploaded: false,
    completed: false
  });

  // Non-blocking Toast notification helper
  const triggerToast = (title: string, detail: string, type: 'success' | 'warning' | 'info' | 'danger' = 'success') => {
    setToastMessage({ title, detail, type });
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Interactive SOP Workflows
  const handleCompleteItEndorsement = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? {
              ...d,
              itEndorsementStatus: 'READY_AVAILABLE',
              checklist: { ...d.checklist, mdmEnrolled: true, edrAgentInstalled: true }
            }
          : d
      )
    );
    triggerToast(
      '2-Day Pre-Issuance IT Setup Endorsed',
      `Batch ${deliveryId} passed MDM & EDR checks. 6 MacBook Pro units transitioned from PENDING_TAGGING to AVAILABLE.`
    );
  };

  const handleConfirmHandover = (
    assetTag: string,
    employeeId: string,
    employeeName: string,
    gatepassRef: string
  ) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.assetTag === assetTag
          ? {
              ...a,
              status: 'ASSIGNED',
              custodyType: 'EMPLOYEE',
              assignee: employeeName,
              employeeId: employeeId,
              updatedAt: '2026-11-15 09:00 UTC'
            }
          : a
      )
    );
    triggerToast(
      'Atomic Custody Handover Recorded',
      `Asset ${assetTag} assigned to ${employeeName} (${employeeId}) with verified signed document & Gatepass ${gatepassRef}.`
    );
  };

  const handleCompleteReturnInspection = (outcome: 'GOOD_AVAILABLE' | 'DEFECTIVE_REPAIR') => {
    const newStatus = outcome === 'GOOD_AVAILABLE' ? 'AVAILABLE' : 'UNDER_REPAIR';
    const newCondition = outcome === 'GOOD_AVAILABLE' ? 'GOOD' : 'DEFECTIVE';
    setAssets((prev) =>
      prev.map((a) =>
        a.assetTag === 'OPH-AST-00719'
          ? {
              ...a,
              status: newStatus,
              condition: newCondition,
              assignee: newStatus === 'AVAILABLE' ? 'Unassigned (Ready for Issuance)' : 'IT Repair Bench',
              updatedAt: '2026-11-15 09:12 UTC'
            }
          : a
      )
    );
    triggerToast(
      `Return Inspection Completed -> ${newStatus}`,
      `Asset OPH-AST-00719 data wipe verified and transitioned atomically from UNDER_INSPECTION to ${newStatus}.`
    );
  };

  const handleConfirmTransferReceipt = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? {
              ...t,
              status: 'RECEIVED_COMPLETED',
              items: t.items.map((it) => ({ ...it, state: 'RECEIVED' }))
            }
          : t
      )
    );
    setAssets((prev) =>
      prev.map((a) =>
        a.assetTag === 'OPH-AST-00879'
          ? {
              ...a,
              status: 'AVAILABLE',
              site: 'CEB-IT',
              siteName: 'Cebu - IT Park',
              location: 'Cebu IT Park — Floor 8 Stockroom',
              custodyType: 'STOCKROOM',
              assignee: 'Unassigned (Received at Cebu IT Park)'
            }
          : a
      )
    );
    triggerToast(
      'Destination Receipt Confirmed',
      `Transmittal ${transferId} verified by receiving custodian. Asset location & custody updated to Cebu IT Park.`
    );
  };

  const handleSimulateScan = (mode: 'MATCH' | 'WRONG_LOC' | 'DUPLICATE') => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (mode === 'MATCH') {
      setAuditItems((prev) =>
        prev.map((item) =>
          item.tag === 'OPH-AST-00849'
            ? { ...item, scannedLoc: 'Manila — Floor 14 Pod A', scanState: 'MATCHED', scannedAt: now }
            : item
        )
      );
      setLastScanFeedback({
        type: 'MATCHED',
        tag: 'OPH-AST-00849',
        message: 'CHIME: MATCHED — MacBook Pro 14" M3 verified at expected Floor 14 Pod A.',
        time: now
      });
    } else if (mode === 'WRONG_LOC') {
      setAuditItems((prev) =>
        prev.map((item) =>
          item.tag === 'OPH-AST-00851'
            ? { ...item, scannedLoc: 'Manila — Floor 12 Pantry', scanState: 'WRONG_LOCATION', scannedAt: now }
            : item
        )
      );
      setLastScanFeedback({
        type: 'WRONG_LOCATION',
        tag: 'OPH-AST-00851',
        message: 'WARNING BUZZ: WRONG LOCATION — Expected Floor 14 Pod D, scanned at Floor 12 Pantry.',
        time: now
      });
    } else if (mode === 'DUPLICATE') {
      setLastScanFeedback({
        type: 'DUPLICATE',
        tag: 'OPH-AST-00842',
        message: 'DEBOUNCED: Asset OPH-AST-00842 was already scanned in this session at 10:14:22 AM.',
        time: now
      });
    }
  };

  const handleMarkItemReturned = (clearanceId: string, itemId: string, itemTag: string) => {
    setClearances((prev) =>
      prev.map((c) =>
        c.id === clearanceId
          ? {
              ...c,
              items: c.items.map((i) => (i.id === itemId ? { ...i, status: 'RETURNED_GOOD' } : i))
            }
          : c
      )
    );
    triggerToast(
      `Item ${itemTag} Verified Returned`,
      `Accountability checklist updated.`
    );
  };

  const handleAdvanceLegalStage = (clearanceId: string) => {
    setClearances((prev) =>
      prev.map((c) =>
        c.id === clearanceId
          ? { ...c, demandLetterStage: Math.min(3, c.demandLetterStage + 1) }
          : c
      )
    );
    triggerToast(
      'Legal Demand Letter Stage Advanced',
      'Immutable demand letter dispatch logged with 3-day turnaround SLA timer.'
    );
  };

  const handleConfirmWaiver = (reason: string) => {
    setClearances((prev) =>
      prev.map((c) =>
        c.id === activeClearanceId
          ? {
              ...c,
              waiverApproved: true,
              waiverReason: reason,
              waiverApprover: 'Elena Rodriguez (VPQS)'
            }
          : c
      )
    );
    triggerToast(
      'Executive Clearance Exception Recorded',
      'Hard clearance block lifted with immutable VPQS audit trail entry.'
    );
  };

  const handleApproveFinalClearance = (name: string, id: string) => {
    triggerToast(
      'Staff Exit Clearance Signed Off',
      `Employee ${name} (${id}) final exit clearance certificate generated.`
    );
  };

  const handleApproveDisposalStage = () => {
    setDisposalState((prev) => ({
      ...prev,
      approvals: {
        ...prev.approvals,
        finance: { approved: true, actor: currentRole.displayName || currentRole.user, date: 'Now' },
        ceo: { approved: true, actor: currentRole.displayName || currentRole.user, date: 'Now' }
      }
    }));
    triggerToast(
      'Independent Maker-Checker Approval Recorded',
      `Approved by ${currentRole.displayName || currentRole.user}.`
    );
  };

  const handleToggleDestructionCheck = (key: string, checked: boolean) => {
    setDisposalState((prev) => ({ ...prev, [key]: checked }));
  };

  const handleCompleteDisposal = () => {
    setDisposalState((prev) => ({ ...prev, completed: true }));
    triggerToast(
      'Irreversible Asset Disposal Completed',
      'Storage media destruction proof locked in vault. Asset OPH-AST-00304 retired to DISPOSED.'
    );
  };

  const activeModuleTitle =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === activeModule)?.label || 'Dashboard';

  const activeClearance = clearances.find((c) => c.id === activeClearanceId) || clearances[0];

  return (
    <div className="h-screen overflow-hidden flex bg-[#F5F8FA] text-[#102A3A] font-sans antialiased selection:bg-[#00C8E8]/20">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Shell */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          activeModuleTitle={activeModuleTitle}
          selectedSite={selectedSite}
          onSelectSite={setSelectedSite}
          currentRole={currentRole}
          onSelectRole={(id) => {
            const found = ROLES.find((r) => r.id === id);
            if (found) {
              setCurrentRole(found);
              triggerToast(
                `Switched RBAC Persona: ${found.name}`,
                found.canViewFinancials
                  ? 'NetSuite financial valuation & cost columns are now VISIBLE.'
                  : 'NetSuite financial valuation & cost columns are now HIDDEN per least-privilege RBAC.',
                'info'
              );
            }
          }}
          roles={ROLES}
          onOpenCommandSearch={() => setCommandModalOpen(true)}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        {/* RBAC Enforcement Banner */}
        <RbacContextBanner currentRole={currentRole} />

        {/* Floating Toast Notification Banner */}
        {toastMessage && (
          <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-xl bg-[#05253D] text-white border-l-4 border-[#00C8E8] shadow-lg flex items-center justify-between gap-4 shrink-0 animate-fadeIn z-20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00C8E8] shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-semibold">{toastMessage.title}</div>
                <div className="text-[11px] sm:text-xs text-[#DCE5EA]">{toastMessage.detail}</div>
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-[#8797A2] hover:text-white rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-16 lg:pb-8">
          <div className="max-w-[1600px] w-full mx-auto space-y-6">
            {activeModule === 'dashboard' && (
              <DashboardModule
                currentRole={currentRole}
                selectedSite={selectedSite}
                onNavigate={setActiveModule}
                onFilterRegistry={(status) => {
                  setActiveModule('assets');
                }}
              />
            )}

            {activeModule === 'assets' && (
              <AssetRegistryModule
                assets={assets}
                currentRole={currentRole}
                selectedSite={selectedSite}
                onSelectAsset={setSelectedAsset}
                onOpenPrintQrBatch={() => setQrModalDelivery(deliveries[0])}
                onNavigateTransfers={() => setActiveModule('transfers')}
                onNavigateDeliveries={() => setActiveModule('deliveries')}
                onTriggerToast={triggerToast}
              />
            )}

            {activeModule === 'deliveries' && (
              <DeliveriesModule
                deliveries={deliveries}
                currentRole={currentRole}
                onCompleteItEndorsement={handleCompleteItEndorsement}
                onOpenQrModal={setQrModalDelivery}
              />
            )}

            {activeModule === 'issuance' && (
              <IssuanceWizardModule onConfirmHandover={handleConfirmHandover} />
            )}

            {activeModule === 'returns' && (
              <ReturnsInspectionModule
                assets={assets}
                onCompleteInspection={handleCompleteReturnInspection}
              />
            )}

            {activeModule === 'transfers' && (
              <TransfersModule
                transfers={transfers}
                onConfirmReceipt={handleConfirmTransferReceipt}
              />
            )}

            {activeModule === 'audits' && (
              <PhysicalAuditModule
                auditItems={auditItems}
                onSimulateScan={handleSimulateScan}
                lastScanFeedback={lastScanFeedback}
                onRequestVpqsSignoff={() =>
                  triggerToast(
                    'Audit Reconciliation Submitted to VPQS',
                    'Session AUD-2026-Q4 variance report routed to Elena Rodriguez (VPQS) for immutable sign-off.'
                  )
                }
              />
            )}

            {activeModule === 'clearances' && (
              <ClearancesModule
                clearances={clearances}
                activeClearanceId={activeClearanceId}
                onSelectClearanceId={setActiveClearanceId}
                currentRole={currentRole}
                onMarkItemReturned={handleMarkItemReturned}
                onAdvanceLegalStage={handleAdvanceLegalStage}
                onOpenWaiverModal={() => setWaiverModalOpen(true)}
                onApproveFinalClearance={handleApproveFinalClearance}
              />
            )}

            {activeModule === 'disposals' && (
              <DisposalsModule
                disposalState={disposalState}
                currentRole={currentRole}
                onApproveStage={handleApproveDisposalStage}
                onToggleCheck={handleToggleDestructionCheck}
                onCompleteDisposal={handleCompleteDisposal}
              />
            )}

            {activeModule === 'maintenance' && <MaintenanceModule />}

            {activeModule === 'incidents' && <IncidentsModule />}

            {activeModule === 'reports' && (
              <ReportsModule
                currentRole={currentRole}
                assets={assets}
                onCommitStagedRows={() =>
                  triggerToast(
                    'Clean Staged Rows Committed',
                    '184 validated rows committed atomically to assets table. 3 rejected rows exported to remediation queue.'
                  )
                }
                onTriggerToast={triggerToast}
              />
            )}

            {activeModule === 'admin' && (
              <AdminModule
                currentRole={currentRole}
                assets={assets}
                onOpenDocumentPreview={setDocumentPreviewModal}
                onTriggerToast={triggerToast}
              />
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar (Active on Viewports < 1024px) */}
        <MobileBottomNav activeModule={activeModule} onSelectModule={setActiveModule} />
      </div>

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        currentRole={currentRole}
        onOpenDocumentPreview={setDocumentPreviewModal}
        onOpenPrintQr={() => setQrModalDelivery(deliveries[0])}
      />

      {/* Printable QR Sheet Modal */}
      <PrintableQrModal
        delivery={qrModalDelivery}
        onClose={() => setQrModalDelivery(null)}
        onPrint={() => {
          setQrModalDelivery(null);
          triggerToast(
            'QR Label Sheet Sent to Spooler',
            'Vector PDF label sheet generated for Zebra ZT230 / Avery template.'
          );
        }}
      />

      {/* VPQS Executive Waiver Modal */}
      <ExecutiveWaiverModal
        isOpen={waiverModalOpen}
        onClose={() => setWaiverModalOpen(false)}
        activeClearance={activeClearance}
        currentRole={currentRole}
        onConfirmWaiver={handleConfirmWaiver}
      />

      {/* Authenticated Streaming Document Preview Modal */}
      <DocumentPreviewModal
        document={documentPreviewModal}
        onClose={() => setDocumentPreviewModal(null)}
      />

      {/* Global Command Palette Search (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={commandModalOpen}
        onClose={() => setCommandModalOpen(false)}
        assets={assets}
        onSelectAsset={setSelectedAsset}
      />
    </div>
  );
}
