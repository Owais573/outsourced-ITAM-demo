import { Clearance, Transfer, AuditItem } from '../types';

export const INITIAL_CLEARANCES: Clearance[] = [
  {
    id: 'CLR-2026-041',
    employeeName: 'restituto.navarro@outsourced.ph',
    displayName: 'Restituto Navarro',
    employeeId: 'OPH-10219',
    department: 'Customer Success — Retail UK',
    site: 'Manila - Cyber Sigma',
    noticeDate: '2026-10-15',
    lastWorkingDay: '2026-11-03',
    returnDeadline: '2026-11-13', // 10 days post-LWD
    daysRemaining: -2, // 2 days OVERDUE
    status: 'PENDING_LEGAL',
    demandLetterStage: 2, // Stage 1 sent Nov 13, Stage 2 active (3-day timer)
    stageUpdatedDate: '2026-11-14',
    waiverApproved: false,
    waiverReason: '',
    waiverApprover: null,
    items: [
      { id: 'ci-1', tag: 'OPH-AST-00512', desc: 'Dell Latitude 5430 Laptop (S/N: DL-55192-A)', type: 'SERIALIZED_ASSET', status: 'PENDING_RETURN' },
      { id: 'ci-2', tag: 'OPH-AST-00588', desc: 'Dell 24" P2422H Monitor', type: 'SERIALIZED_ASSET', status: 'RETURNED_GOOD' },
      { id: 'ci-3', tag: 'ACC-PWR-512', desc: 'Dell 65W USB-C Power Adapter', type: 'ACCESSORY', status: 'PENDING_RETURN' },
      { id: 'ci-4', tag: 'ACC-HDS-109', desc: 'Jabra Evolve2 40 USB Headset', type: 'PERIPHERAL', status: 'RETURNED_GOOD' }
    ]
  },
  {
    id: 'CLR-2026-044',
    employeeName: 'camille.soriano@outsourced.ph',
    displayName: 'Camille Soriano',
    employeeId: 'OPH-10644',
    department: 'Full-Stack Engineering',
    site: 'Cebu - IT Park',
    noticeDate: '2026-10-28',
    lastWorkingDay: '2026-11-12',
    returnDeadline: '2026-11-22', // 10 days post-LWD
    daysRemaining: 7,
    status: 'IN_PROGRESS',
    demandLetterStage: 0,
    stageUpdatedDate: null,
    waiverApproved: false,
    waiverReason: '',
    waiverApprover: null,
    items: [
      { id: 'ci-5', tag: 'OPH-AST-00791', desc: 'MacBook Pro 14" M2 Pro (S/N: C02Y8119J)', type: 'SERIALIZED_ASSET', status: 'RETURNED_GOOD' },
      { id: 'ci-6', tag: 'ACC-MAG-791', desc: 'Apple 96W USB-C Power Adapter & MagSafe', type: 'ACCESSORY', status: 'RETURNED_GOOD' },
      { id: 'ci-7', tag: 'BDG-CEB-419', desc: 'Cebu IT Park Proximity Access Badge', type: 'SECURITY_BADGE', status: 'PENDING_RETURN' }
    ]
  }
];

export const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: 'TRN-2026-089',
    fromSite: 'Manila - Cyber Sigma',
    toSite: 'Cebu - IT Park',
    sendingCustodian: 'Clarisse Bautista',
    receivingCustodian: 'Jomar Quijano (Cebu FA Custodian)',
    dispatchDate: '2026-11-13 11:00 UTC',
    gatepassRef: 'GP-MNL-2026-1098',
    transmittalDoc: 'TRN-2026-089_Manila_to_Cebu.pdf',
    status: 'IN_TRANSIT',
    items: [
      { tag: 'OPH-AST-00879', model: 'Dell UltraSharp 27" 4K Monitor (U2723QE)', serial: 'DL-MON-88219', state: 'IN_TRANSIT' },
      { tag: 'OPH-AST-00880', model: 'Dell UltraSharp 27" 4K Monitor (U2723QE)', serial: 'DL-MON-88220', state: 'IN_TRANSIT' },
      { tag: 'OPH-AST-00881', model: 'Lenovo ThinkPad T14 Gen 4', serial: 'LN-PF49290M', state: 'IN_TRANSIT' }
    ]
  },
  {
    id: 'TRN-2026-085',
    fromSite: 'Manila - Cyber Sigma',
    toSite: 'Clark - Global Gateway',
    sendingCustodian: 'Clarisse Bautista',
    receivingCustodian: 'Dianne Mercado (Clark FA Custodian)',
    dispatchDate: '2026-11-08 09:30 UTC',
    gatepassRef: 'GP-MNL-2026-1071',
    transmittalDoc: 'TRN-2026-085_Manila_to_Clark.pdf',
    status: 'RECEIVED_COMPLETED',
    items: [
      { tag: 'OPH-AST-00810', model: 'HP EliteBook 840 G10', serial: 'HP-99102-A', state: 'RECEIVED' },
      { tag: 'OPH-AST-00811', model: 'HP EliteBook 840 G10', serial: 'HP-99103-B', state: 'RECEIVED' }
    ]
  }
];

export const INITIAL_AUDIT_ITEMS: AuditItem[] = [
  { tag: 'OPH-AST-00842', model: 'MacBook Pro 16" M3 Pro', expectedLoc: 'Manila — Floor 14 Pod B', scannedLoc: 'Manila — Floor 14 Pod B', scanState: 'MATCHED', scannedAt: '10:14:22 AM', custodian: 'Marco Reyes' },
  { tag: 'OPH-AST-00871', model: 'Lenovo ThinkPad T14 Gen 4', expectedLoc: 'Manila — Floor 12 Vault A', scannedLoc: 'Manila — Floor 12 Vault A', scanState: 'MATCHED', scannedAt: '10:16:05 AM', custodian: 'Stockroom' },
  { tag: 'OPH-AST-00765', model: 'Dell Latitude 5540', expectedLoc: 'Cebu — Floor 8 Suite', scannedLoc: 'Manila — Floor 14 Pod C', scanState: 'WRONG_LOCATION', scannedAt: '10:19:41 AM', custodian: 'Ramon Diaz (Visiting)' },
  { tag: 'OPH-AST-00999', model: 'Logitech Rally Bar Conference Cam', expectedLoc: 'Not in Session Scope (Floor 10)', scannedLoc: 'Manila — Floor 14 Boardroom', scanState: 'UNEXPECTED', scannedAt: '10:22:10 AM', custodian: 'AV Shared Pool' },
  { tag: 'OPH-AST-00849', model: 'MacBook Pro 14" M3', expectedLoc: 'Manila — Floor 14 Pod A', scannedLoc: '—', scanState: 'UNVERIFIED', scannedAt: 'Not yet scanned', custodian: 'Bea Alonzo (Hybrid)' },
  { tag: 'OPH-AST-00851', model: 'Dell UltraSharp 27" Monitor', expectedLoc: 'Manila — Floor 14 Pod D', scannedLoc: '—', scanState: 'UNVERIFIED', scannedAt: 'Not yet scanned', custodian: 'Paolo Contis' }
];
