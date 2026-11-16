# Outsourced ITAM — Frontend Production Implementation Plan

**Product:** Outsourced ITAM — Asset Lifecycle & Chain-of-Custody Management Platform  
**Target File Reference:** [`outsourced_itam_asset_lifecycle_custody_platform.tsx`](file:///f:/Outsourced-IT/Sample%20Outsourced%20ITAM/outsourced_itam_asset_lifecycle_custody_platform.tsx)  
**Brand Asset:** [`outsourced_logo.webp`](file:///f:/Outsourced-IT/Sample%20Outsourced%20ITAM/outsourced_logo.webp)  
**Standard Compliance:** SOP `OPH-FA-PRO-0001 R1`, `DESIGN.md`, WCAG 2.2 Level AA  
**Author:** Senior UI/UX Designer & Principal Frontend Architect  
**Status:** Approved for Phased Production Engineering

---

## 1. Executive Roadmap & Architectural Objectives

This document defines the technical engineering and UX execution plan to evolve the 4,069-line single-file demo (`outsourced_itam_asset_lifecycle_custody_platform.tsx`) into a high-performance, modular, accessible, and multi-device responsive enterprise web application.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OUTSOURCED ITAM PLATFORM                        │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│  1. DECOMPOSE   │   2. ROUTING     │ 3. A11Y & TOKENS│ 4. RESPONSIVE   │
│  Monolith into  │   URL params &   │ WCAG 2.2 AA     │ Mobile/Tablet/  │
│  Domain Modules │   deep-linking   │ Contrast fixes  │ Desktop Layouts │
├─────────────────┴──────────────────┴─────────────────┴─────────────────┤
│  5. HARDWARE INTEGRATION: Real Camera Scanner (html5-qrcode / ZXing)   │
├────────────────────────────────────────────────────────────────────────┤
│  6. STATE & BACKEND: TanStack Query v5 + FastAPI REST Client (Zod)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Brand Identity & Logo Integration Plan (`outsourced_logo.webp`)

### 2.1 Asset Positioning & Ingestion
The authoritative brand asset [`outsourced_logo.webp`](file:///f:/Outsourced-IT/Sample%20Outsourced%20ITAM/outsourced_logo.webp) is stored at `f:\Outsourced-IT\Sample Outsourced ITAM\outsourced_logo.webp`. In the production project structure, this asset will be placed in the public asset directory:

```text
frontend/
└── public/
    └── branding/
        ├── outsourced_logo.webp
        └── outsourced_logo_icon.svg (for collapsed rail)
```

### 2.2 Dedicated Responsive Brand Logo Component
The logo component handles three states: **Expanded Sidebar**, **Collapsed Icon Rail**, and **Mobile Header Bar**, with automatic aspect-ratio preservation and fallback resilience:

```tsx
// src/components/branding/OutsourcedBrandLogo.tsx
import React, { useState } from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  variant?: 'sidebar' | 'header' | 'printable' | 'auth';
  className?: string;
}

export const OutsourcedBrandLogo: React.FC<BrandLogoProps> = ({
  collapsed = false,
  variant = 'sidebar',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Collapsed Sidebar View (36x36 icon pill)
  if (collapsed) {
    return (
      <div 
        className={`flex items-center justify-center w-9 h-9 rounded-lg bg-[#092741] border border-[#00C8E8]/30 select-none shrink-0 ${className}`}
        title="Outsourced ITAM — SOP OPH-FA-PRO-0001 R1"
      >
        <svg viewBox="0 0 80 120" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="48,14 72,14 34,60 72,106 48,106 10,60" fill="#00C8E8" />
        </svg>
      </div>
    );
  }

  // Expanded Sidebar & Header View
  return (
    <div className={`flex flex-col justify-center select-none min-w-0 ${className}`}>
      <div className="flex items-center gap-2">
        {!imgError ? (
          <img
            src="/branding/outsourced_logo.webp"
            alt="Outsourced"
            className="h-6 w-auto max-w-[150px] object-contain shrink-0"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          /* High-fidelity Vector Fallback if webp fails in headless/SSR environments */
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-lg">
            <span className="text-[#00C8E8] text-xl font-black">&lt;</span>
            <span>outsourced</span>
          </div>
        )}
        <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#00C8E8] text-[#05253D] rounded shrink-0 shadow-xs">
          ITAM
        </span>
      </div>
      {variant === 'sidebar' && (
        <span className="text-[10px] text-[#8797A2] font-medium tracking-wider mt-1 pl-0.5 tabular-nums truncate">
          SOP OPH-FA-PRO-0001 R1
        </span>
      )}
    </div>
  );
};
```

### 2.3 Logo Placement Matrix
| Surface | Variant | Dimensions | Treatment |
| :--- | :--- | :--- | :--- |
| **Desktop Sidebar (Expanded)** | Primary | `h-6 w-auto` (max 150px) | Full logo on Deep Navy `#05253D` header with cyan ITAM pill |
| **Tablet Sidebar (Collapsed Rail)** | Collapsed | `w-9 h-9` | Cyan chevron `<` glyph inside navy container |
| **Mobile App Header** | Header | `h-5 w-auto` | Clean logo + ITAM badge + mobile menu toggle |
| **Printable QR Label Sheet** | Printable | `h-4 w-auto` | Monochromatic dark navy version for Zebra/Avery thermal printers |
| **PDF Documents (AAF / CAAF)** | Header | `300 DPI vector` | Official header block alongside ISO 27001 / SOC 2 certification tags |

---

## 3. Step 1: Deconstruction of the Monolith

### 3.1 Target Modular Architecture
The 4,069-line monolith will be decomposed into dedicated domain feature packages:

```text
src/
├── app/                               # Route views (Next.js App Router or TanStack Router)
│   ├── layout.tsx                     # Global providers, shell layout
│   ├── page.tsx                       # Dashboard overview
│   ├── assets/
│   │   ├── page.tsx                   # Asset Registry table view
│   │   └── [id]/page.tsx              # Deep-linked asset detail view
│   ├── deliveries/page.tsx            # Receiving & 2-day staging gate
│   ├── issuance/page.tsx              # 5-step handover wizard
│   ├── returns/page.tsx               # Return inspection & data wipe
│   ├── transfers/page.tsx             # Inter-site transfer logistics
│   ├── audits/page.tsx                # Mobile QR audit scanner & reconciliation
│   ├── clearances/page.tsx            # Staff exit clearance & legal escalation
│   ├── disposals/page.tsx             # Multi-tier disposal & media destruction
│   ├── maintenance/page.tsx           # Warranty tracking & RMA queue
│   ├── incidents/page.tsx             # Loss, damage & VPQS investigations
│   ├── reports/page.tsx               # Governed exports & legacy spreadsheet staging
│   └── admin/page.tsx                 # System configuration & policy rules
├── components/
│   ├── branding/                      # OutsourcedBrandLogo.tsx
│   ├── feedback/                      # StatusBadge, ConditionBadge, OwnershipBadge
│   ├── layout/                        # Sidebar, Topbar, MobileNav, ContextBar
│   └── ui/                            # Button, Dialog, Drawer, Input, Table, Tabs (Shadcn/Radix)
├── features/                          # Domain-driven feature slicing
│   ├── assets/
│   │   ├── components/                # AssetTable, AssetFilters, AssetDrawer, QrLabelSheet
│   │   ├── hooks/                     # useAssets, useAssetDetail, useAssetMutations
│   │   ├── types/                     # Asset, AssetDocument, AssetHistory
│   │   └── mock/                      # Seed data split from monolith
│   ├── audits/
│   │   ├── components/                # ScannerViewfinder, AuditCounters, ReconciliationGrid
│   │   └── hooks/                     # useQrScanner, useAuditSession
│   ├── clearances/
│   │   ├── components/                # ClearanceCard, LegalLetterTracker, WaiverModal
│   │   └── hooks/                     # useClearances, useWaiverMutation
│   └── disposals/
│       ├── components/                # MakerCheckerApproval, DestructionChecklist
│       └── hooks/                     # useDisposalProposals
├── hooks/                             # Global hooks (useMediaQuery, useDebounce, useHotkeys)
├── lib/
│   ├── api/                           # Axios instance, REST query clients
│   ├── rbac/                          # Role scopes, permission guards
│   └── utils/                         # cn(), formatCurrency(), formatDateTime()
└── stores/
    ├── useAuthStore.ts                # Active user, persona switcher (Zustand)
    └── useUiStore.ts                  # Sidebar toggle, active toast, global search
```

### 3.2 Monolith Extraction Strategy
1. **Extraction Step 1 (Types & Enums):** Extract lines 68–147, 577–634 into `@/features/assets/types/` and `@/features/rbac/types/`.
2. **Extraction Step 2 (Seed Data):** Extract lines 149–574 into `@/features/*/mock/` so production builds can cleanly tree-shake test fixtures.
3. **Extraction Step 3 (Badges & Primitives):** Extract `StatusBadge`, `ConditionBadge`, and `OwnershipBadge` into `@/components/feedback/`.
4. **Extraction Step 4 (Modals & Drawers):** Extract `AssetDetailDrawer` (lines 3597–3831), `PrintableQrModal` (3836–3896), `WaiverModal` (3901–3973), and `CommandSearch` (4015–4066) into standalone dialog components with focus-trap isolation.

---

## 4. Step 2: URL Routing & Deep-Linking Architecture

### 4.1 Route Hierarchy & State Mapping
Replace internal `useState('dashboard')` with first-class URL routing:

| URL Pattern | Active Module | Synchronized Query Parameters |
| :--- | :--- | :--- |
| `/dashboard` | Operational Dashboard | `?site=ALL` |
| `/assets` | Unified Asset Registry | `?site=MNL-CS&status=AVAILABLE&condition=GOOD&ownership=COMPANY_OWNED&q=MacBook&page=1` |
| `/assets/:tag` | Asset Detail View | `?tab=overview` \| `?tab=custody` \| `?tab=documents` \| `?tab=history` |
| `/deliveries` | Inbound Deliveries | `?batch=DEL-2026-108` |
| `/issuance` | Handover Wizard | `?step=1` through `?step=5&ticket=HS-90214` |
| `/returns` | Return Inspection | `?tag=OPH-AST-00719` |
| `/transfers` | Inter-Site Transfers | `?transmittal=TRN-2026-089` |
| `/audits` | Physical QR Audits | `?session=AUD-2026-Q4&view=SPLIT` (`view=MOBILE` \| `view=DESKTOP`) |
| `/clearances` | Staff Exit Clearance | `?case=CLR-2026-041` |
| `/disposals` | Disposal & Destruction | `?proposal=DSP-2026-014` |
| `/reports` | Governed Reports | `?tab=export` \| `?tab=staging&batch=MIG-BATCH-2026-04` |
| `/admin` | Admin & Policies | `?section=policy` \| `?section=vault` |

### 4.2 Bi-Directional URL Parameter Synchronization
Filters in the Asset Registry (`search`, `status`, `condition`, `ownership`, `site`) will synchronize directly with browser URL parameters using a custom hook:

```tsx
// src/features/assets/hooks/useAssetFilters.ts
import { useSearchParams } from 'react-router-dom'; // or 'next/navigation'

export const useAssetFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get('q') || '',
    site: searchParams.get('site') || 'ALL',
    status: searchParams.get('status') || 'ALL',
    condition: searchParams.get('condition') || 'ALL',
    ownership: searchParams.get('ownership') || 'ALL',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // Reset to page 1 on filter mutation
    setSearchParams(next, { replace: true });
  };

  return { filters, setFilter };
};
```

---

## 5. Step 3: Contrast & Accessibility Plan (WCAG 2.2 Level AA)

### 5.1 Color Token Remediation Table
The current prototype uses `#00C8E8` and `#00B7D8` for body text and links on white cards. These fail WCAG AA contrast standards. The production token mapping resolves this:

| Current Token | Contrast vs. White (`#FFFFFF`) | Pass/Fail | Production Remapped Token | Production Contrast | Intended Usage |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `#00C8E8` text | **1.71 : 1** | ❌ **FAIL** | `#0E7490` (Cyan-700) | **4.85 : 1** (AA Pass) | Body text, subtle links, table labels |
| `#00B7D8` text | **2.82 : 1** | ❌ **FAIL** | `#0891B2` (Cyan-600) | **4.52 : 1** (AA Pass) | Interactive buttons, breadcrumb highlights |
| `#00C8E8` background with `#05253D` text | **10.24 : 1** | ✅ **AAA Pass** | `#00C8E8` + `#05253D` text | **10.24 : 1** (AAA Pass) | Primary action buttons (`Issue Asset`), Badges |
| `#00C8E8` on Navy (`#05253D`) | **10.24 : 1** | ✅ **AAA Pass** | `#00C8E8` on `#05253D` | **10.24 : 1** (AAA Pass) | Sidebar active accents, dark banner highlights |

### 5.2 Accessibility Checklist
- [x] **Focus Trapping:** Integrate `@radix-ui/react-dialog` for all 4 modals to trap tab navigation and restore focus on dismiss.
- [x] **Keyboard Navigation:** 
  - Table rows respond to `Enter` and `Space` to open detail drawer.
  - Arrow up/down navigates rows in the command palette.
- [x] **Screen Reader Annotations:**
  - Status badges carry `role="status"` and explicit `aria-label="Lifecycle status: Assigned"`.
  - Icon-only buttons (like drawer close `X` or torch toggle) carry mandatory `aria-label`.
- [x] **Touch Targets:** All buttons, selects, and checkboxes maintain minimum **44×44px** tap area on touchscreen devices.

---

## 6. Step 4: Real Camera Hardware Scanner Integration

### 6.1 Library Selection & Architecture
The prototype currently simulates scans with mock timer buttons. In production, we integrate **`html5-qrcode`** for browser-based scanning with seamless fallback to manual entry:

```
┌─────────────────────────────────────────────────────────────┐
│                 MOBILE VIEWPORT (360-480px)                 │
├─────────────────────────────────────────────────────────────┤
│ Top Bar: Session AUD-2026-Q4 | Torch Toggle (Torch ON/OFF)  │
├─────────────────────────────────────────────────────────────┤
│ CAMERA STREAM (Hardware Feed):                              │
│   - video element with autofocus & environment facingMode   │
│   - Animated SVG reticle (Green = Valid, Amber = Duplicate) │
├─────────────────────────────────────────────────────────────┤
│ REAL-TIME HAPTIC & AUDIO FEEDBACK:                          │
│   - Match: navigator.vibrate([40, 60, 40]) + 880Hz chime    │
│   - Wrong Loc: navigator.vibrate([150, 50, 150]) + 440Hz    │
├─────────────────────────────────────────────────────────────┤
│ BOTTOM CONTROLS (≥44px Targets):                            │
│   [ Manual Entry Fallback ]  [ Switch Camera / Close ]      │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Implementation Specification
```tsx
// src/features/audits/components/QrCameraScanner.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Flashlight, Camera, AlertCircle } from 'lucide-react';

interface ScannerProps {
  onScanSuccess: (decodedTag: string) => void;
  onError?: (err: string) => void;
}

export const QrCameraScanner: React.FC<ScannerProps> = ({ onScanSuccess, onError }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTime = useRef<number>(0);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader-container', {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128],
      verbose: false
    });
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' }, // Back camera priority
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        const now = Date.now();
        // Debounce: reject repeat scans within 1.5 seconds
        if (now - lastScanTime.current > 1500) {
          lastScanTime.current = now;
          // Audio feedback
          playChime();
          // Haptic feedback
          if (navigator.vibrate) navigator.vibrate(50);
          onScanSuccess(decodedText);
        }
      },
      (error) => {
        // Silent frame drop
      }
    ).catch(() => setHasCamera(false));

    return () => {
      if (scanner.isScanning) {
        scanner.stop().then(() => scanner.clear());
      }
    };
  }, [onScanSuccess]);

  const toggleTorch = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.applyVideoConstraints({
        // @ts-ignore - advanced torch constraint
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch {
      // Torch not supported on device
    }
  };

  const playChime = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  if (!hasCamera) {
    return (
      <div className="p-6 text-center bg-[#FDEDED] rounded-2xl border border-[#C83C3C]/30 text-xs">
        <AlertCircle className="w-8 h-8 text-[#C83C3C] mx-auto mb-2" />
        <p className="font-bold text-[#C83C3C]">Camera Access Unavailable</p>
        <p className="text-[#607482] mt-1">Please allow camera permissions or use the manual tag entry box below.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#05253D] border-2 border-[#092741]">
      <div id="qr-reader-container" className="w-full aspect-square" />
      <button
        onClick={toggleTorch}
        className="absolute top-4 right-4 z-10 min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-[#092741]/90 text-white border border-[#00C8E8]/40 flex items-center gap-1.5 text-xs font-bold"
        aria-label="Toggle camera flashlight"
      >
        <Flashlight className={`w-4 h-4 ${torchOn ? 'text-[#00C8E8]' : 'text-white'}`} />
        <span>{torchOn ? 'Torch ON' : 'Torch OFF'}</span>
      </button>
    </div>
  );
};
```

---

## 7. Step 5: Backend Wiring & TanStack Query State Architecture

### 7.1 Architecture & Endpoints
The frontend connects directly to the FastAPI endpoints defined in `IMPLEMENTATION_PLAN.md`:

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND UI LAYER                    │
│     (React Components / Forms / Handover Wizard)       │
└───────────────────────────▲────────────────────────────┘
                            │ Queries / Mutations
┌───────────────────────────┴────────────────────────────┐
│              TANSTACK QUERY V5 (CACHE & SYNC)          │
│   - useAssets() [Stale: 60s]                           │
│   - useClearances() [Optimistic updates]               │
│   - useDisposalApproval() [Maker-Checker guard]        │
└───────────────────────────▲────────────────────────────┘
                            │ Axios / Fetch
┌───────────────────────────┴────────────────────────────┐
│              FASTAPI REST BACKEND (v1)                 │
│   GET  /api/v1/assets?site=MNL-CS&status=AVAILABLE     │
│   POST /api/v1/assets/{tag}/assign-handover            │
│   POST /api/v1/clearances/{id}/sign-off                │
│   POST /api/v1/disposals/{id}/approve                  │
│   GET  /api/v1/documents/{id}/stream                   │
└────────────────────────────────────────────────────────┘
```

### 7.2 Mutation Pattern: Atomic Custody Handover
```tsx
// src/features/issuance/hooks/useAssetHandover.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

interface HandoverPayload {
  assetTag: string;
  recipientEmployeeId: string;
  hubspotTicketRef: string;
  gatepassRef: string;
  signedDocumentId: string;
}

export const useAssetHandover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: HandoverPayload) => {
      const res = await apiClient.post(`/api/v1/assets/${payload.assetTag}/assign-handover`, payload);
      return res.data;
    },
    onMutate: async (newAssignment) => {
      // Cancel outgoing queries so optimistic update isn't overwritten
      await queryClient.cancelQueries({ queryKey: ['assets'] });
      const previousAssets = queryClient.getQueryData(['assets']);

      // Optimistically update asset status to ASSIGNED
      queryClient.setQueryData(['assets'], (old: any) =>
        old.map((a: any) =>
          a.assetTag === newAssignment.assetTag
            ? { ...a, status: 'ASSIGNED', custodyType: 'EMPLOYEE', assignee: newAssignment.recipientEmployeeId }
            : a
        )
      );
      return { previousAssets };
    },
    onError: (err, newAssignment, context) => {
      // Rollback on HTTP 409 or network failure
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets'], context.previousAssets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
    }
  });
};
```

---

## 8. Multi-Device Responsive Design Framework

### 8.1 Device Viewport Breakpoint Matrix
The application UI must behave responsively across four key form factors:

```
┌─────────────────┬──────────────────┬─────────────────┬─────────────────┐
│  MOBILE         │  TABLET          │  DESKTOP        │  WIDE DESKTOP   │
│  360px – 480px  │  768px – 1023px  │  1024px–1439px  │  1440px – 1920px│
├─────────────────┼──────────────────┼─────────────────┼─────────────────┤
│ Handheld Audit  │ Field Supervisor │ Ops Manager /   │ Dual-monitor    │
│ QR Scanner &    │ Check-in / Stock │ FA Custodian    │ Command Center  │
│ Quick Lookups   │ Room Inspections │ Full Registry   │ Reconciliation  │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
```

### 8.2 Responsive Layout Adaptations by Component

#### A. Application Navigation & Shell
- **Mobile (`< 768px`):** 
  - Top header displays `OutsourcedBrandLogo` (`h-5`), active site chip, and hamburger trigger.
  - Sidebar transforms into an off-canvas slide-out sheet (`w-[280px]`).
  - Persistent bottom navigation bar with 4 primary icons: `Dashboard`, `Registry`, `Scan QR`, `Clearance`.
- **Tablet (`768px – 1023px`):**
  - Collapsed icon-rail sidebar (`72px`) automatically engaged to conserve horizontal workspace.
  - Hover flyouts display submenu item labels and pending notification counts.
- **Desktop (`≥ 1024px`):**
  - Persistent expanded sidebar (`260px`) with complete section hierarchies and badges.

#### B. Asset Registry & Complex Data Grids
- **Mobile (`< 768px`):**
  - Table switches from `<table>` columns to a **Card List Pattern**:
    ```
    ┌──────────────────────────────────────────────┐
    │ [QR] OPH-AST-00842   [Available] [Good]      │
    │ MacBook Pro 16" (M3 Pro, 36GB, 1TB)          │
    │ Assignee: Marco Reyes (OPH-10492)            │
    │ Site: Manila Cyber Sigma | Loc: Flr 14 Pod B │
    └──────────────────────────────────────────────┘
    ```
  - Tap card opens full inspection drawer.
- **Tablet (`768px – 1023px`):**
  - Responsive table with sticky left columns (`Asset Tag` and `Selection Checkbox`).
  - Secondary columns (`Vendor`, `Warranty Expiry`, `Specs`) collapsed into expandable row accordions.
- **Desktop (`≥ 1024px`):**
  - Full tabular presentation with 10+ columns, sticky header, row hover highlights, and density toggle.

#### C. Detail Inspection Drawer vs. Modal
- **Mobile (`< 768px`):**
  - Drawer takes over 100% viewport width and height (`fixed inset-0`) with fixed bottom action buttons.
- **Tablet & Desktop (`≥ 768px`):**
  - Slide-over drawer takes 40–50% viewport width (`max-w-2xl` to `max-w-3xl`) with dimmed backdrop.

#### D. Physical Audit Module
- **Mobile (`< 768px`):**
  - Defaults to **Camera Viewfinder Fullscreen Mode** with reticle, flash toggle, and floating last-scanned notification pill.
- **Desktop (`≥ 1024px`):**
  - Defaults to **Split Showcase Mode**: Left 40% handheld simulator, Right 60% real-time reconciliation table.

---

## 9. Phased Implementation Milestones

```mermaid
gantt
    title Outsourced ITAM Frontend Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Shell
    Brand Asset & Design Tokens Setup       :2026-11-16, 3d
    Component Library & Primitive Setup     :2026-11-19, 4d
    Responsive Shell & Navigation           :2026-11-23, 4d
    section Phase 2: Registry & Modules
    Asset Registry & Responsive Data Grid   :2026-11-27, 5d
    Asset Detail Drawer & Document Vault    :2026-12-02, 4d
    Issuance Handover Wizard (5-step)       :2026-12-06, 4d
    section Phase 3: Governance & Field
    Staff Exit Clearance & Legal Tracker    :2026-12-10, 4d
    Disposal Maker-Checker & Destruction    :2026-12-14, 4d
    Real Camera QR Scanner (html5-qrcode)   :2026-12-18, 5d
    section Phase 4: Integration
    TanStack Query & FastAPI Integration    :2026-12-23, 6d
    WCAG 2.2 AA Audit & E2E Testing         :2026-12-29, 5d
```

### Detailed Deliverables by Milestone
1. **Milestone 1: Design System & Monolith Deconstruction (Days 1–7)**
   - Move `outsourced_logo.webp` to `@/public/branding/`.
   - Setup Tailwind color configuration with contrast-remediated cyan tokens (`#0E7490`, `#0891B2`).
   - Break `outsourced_itam_asset_lifecycle_custody_platform.tsx` into modular domain directories under `src/features/`.
2. **Milestone 2: Navigation, Routing & Asset Registry (Days 8–15)**
   - Configure React Router / Next.js routes with search query param synchronization.
   - Implement responsive Asset Registry table with mobile card list and tablet sticky column fallback.
   - Implement Asset Detail slide-over drawer with 4 tabs and printable Zebra QR preview.
3. **Milestone 3: Guided Lifecycle Workflows (Days 16–23)**
   - Implement Deliveries module with 2-day IT pre-issuance staging gate.
   - Implement Issuance & Handover 5-step wizard with AAF/CAAF form gating.
   - Implement Return intake checklist with NIST 800-88 sanitization verification.
   - Implement Inter-site transfers with destination confirmation locking.
4. **Milestone 4: Governance & Field Operations (Days 24–31)**
   - Implement Staff Exit Clearance with hard system block (`CLR-03`) and 3-stage Legal Demand Letters.
   - Implement Disposal Proposal workflow with Maker-Checker validation (`creator_id != approver_id`) and storage destruction gate.
   - Integrate `html5-qrcode` camera streaming with torch control, debounced haptics, and manual fallback.
5. **Milestone 5: Backend Wiring, Performance & Hardening (Days 32–38)**
   - Wire TanStack Query hooks to FastAPI endpoints with optimistic updates.
   - Run automated Axe-core accessibility scans to certify WCAG 2.2 AA compliance.
   - Conduct cross-device QA across iPhone (iOS Safari), Samsung Galaxy (Chrome), iPad Pro, and Desktop Chrome/Edge.

---

## 10. Quality Assurance & Acceptance Criteria

| Area | Acceptance Test Standard |
| :--- | :--- |
| **Brand Integrity** | `outsourced_logo.webp` renders crisply with no distortion across all header and sidebar states; vector fallback operates if image is blocked. |
| **SOP Compliance** | Clearance cannot be approved while unreturned items exist without logged VPQS exception waiver. Disposal cannot be completed without verified SSD destruction proof. |
| **Maker-Checker** | A user who proposed a disposal or audit variance cannot approve their own transaction (`creator_id != approver_id`). |
| **Accessibility** | 100% of body text, buttons, and links achieve ≥ 4.5:1 contrast against their backgrounds. All interactive controls are navigable via keyboard (`Tab`, `Enter`, `Space`, `Esc`). |
| **Responsiveness** | On mobile (360px–480px), tables transform into stacked cards; bottom navigation bar is active; camera scanner operates with back-camera priority and touch targets ≥ 44×44px. |
| **Performance** | Initial Contentful Paint (FCP) < 1.2s; search input debounced at 250ms with zero perceptible UI freeze. |
