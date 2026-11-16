export type RoleId = 
  | 'FA_CUSTODIAN' 
  | 'IT_STAFF' 
  | 'HR_SPECIALIST' 
  | 'FINANCE_OFFICER' 
  | 'VPQS_APPROVER' 
  | 'SYSTEM_ADMIN';

export interface Role {
  id: RoleId;
  name: string;
  user: string;
  displayName?: string;
  dept: string;
  canViewFinancials: boolean;
  canApproveDisposal: boolean;
  canApproveClearanceWaiver: boolean;
  canEditRegistry: boolean;
  description: string;
}

export interface Site {
  id: string;
  name: string;
  short: string;
}

export type OwnershipType = 'COMPANY_OWNED' | 'CLIENT_OWNED' | 'STAFF_OWNED';

export type LifecycleStatus = 
  | 'AVAILABLE' 
  | 'ASSIGNED' 
  | 'IN_TRANSIT' 
  | 'UNDER_INSPECTION' 
  | 'UNDER_REPAIR' 
  | 'PENDING_DISPOSAL' 
  | 'PENDING_TAGGING' 
  | 'MISSING' 
  | 'DISPOSED';

export type PhysicalCondition = 
  | 'BRAND_NEW' 
  | 'GOOD' 
  | 'FAIR' 
  | 'DAMAGED' 
  | 'DEFECTIVE' 
  | 'BEYOND_REPAIR';

export interface AssetDocument {
  id: string;
  type: 'AAF' | 'CAAF' | 'GATEPASS' | 'INVOICE' | 'PURCHASE_RECEIPT' | 'TRANSMITTAL' | 'WARRANTY_DOC' | 'INCIDENT_REPORT' | 'AOL';
  name: string;
  version: number;
  date: string;
  uploader: string;
  sha256: string;
  size: string;
  verified: boolean;
}

export interface AssetHistoryItem {
  date: string;
  actor: string;
  action: string;
  detail: string;
}

export interface AssetTechnicalSpecs {
  // 1. Hardware Inventory Specifications (Manual Entry / PO Delivery Specs)
  processor?: string;
  cores?: string;
  ram?: string;
  ramType?: string;
  graphics?: string;
  displaySize?: string;
  resolution?: string;

  // 2. Storage Media & Drive Serial (Crucial for NIST SP 800-88 Disposal Gate DSP-02)
  storageCapacity?: string;
  storageType?: string;
  driveSerial?: string;

  // 3. Operating System & Device Identity
  osName?: string;
  osVersion?: string;
  osBuild?: string;
  hostname?: string;
  systemArchitecture?: string;
  macAddress?: string;

  // 4. 2-Day Pre-Issuance IT Staging Endorsement (SOP Process 6 / DEL-03)
  itSetupStatus?: 'COMPLETED' | 'AWAITING_SETUP' | 'EXEMPT';
  itSetupDate?: string;
  itTechnician?: string;
  soeImage?: string;
  mdmEnrollmentRecord?: string; // Inventory tag: Kandji Enrolled, Intune Enrolled, BYOD Profile, or Exempt
  encryptionStatus?: string;    // Inventory tag: FileVault 2 Confirmed, BitLocker AES-256 Confirmed
  biosLockVerified?: boolean;   // Inventory tag: Corporate BIOS Password Locked

  // 5. Decommissioning & Data Sanitization State (Process 2 / RET-02 & Process 3 / DSP-02)
  dataSanitizationStatus?: 'CERTIFIED_PURGED' | 'PENDING_NIST_WIPE' | 'PHYSICAL_DESTRUCTION_REQUIRED' | 'ACTIVE_RECORD' | 'NOT_APPLICABLE';
  dataSanitizationMethod?: string;

  // 6. Display Panel & Hub Specifications (For Monitors / Display Peripherals)
  panelType?: string;
  refreshRate?: string;
  colorGamut?: string;
  ports?: string[];
  powerDelivery?: string;
  firmwareVersion?: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  serialNumber: string;
  duplicateSerialWarning?: boolean;
  category: string;
  model: string;
  ownership: OwnershipType;
  status: LifecycleStatus;
  condition: PhysicalCondition;
  site: string;
  siteName: string;
  location: string;
  custodyType: string;
  assignee: string;
  employeeId: string;
  department: string;
  custodian: string;
  purchaseDate: string | null;
  purchaseCost: number | null;
  currency: string;
  vendor: string;
  netsuiteId: string | null;
  hubspotTicket: string;
  warrantyExpiry: string;
  updatedAt: string;
  accessories: string[];
  specs: string;
  technicalSpecs?: AssetTechnicalSpecs;
  documents: AssetDocument[];
  history: AssetHistoryItem[];
}

export interface DeliveryChecklist {
  physicalInspection: boolean;
  serialsVerified: boolean;
  qrLabelsPrinted: boolean;
  osImaged: boolean;
  mdmEnrolled: boolean;
  edrAgentInstalled: boolean;
}

export interface Delivery {
  id: string;
  poNumber: string;
  vendor: string;
  site: string;
  receivedDate: string;
  ownership: OwnershipType;
  model: string;
  qtyDelivered: number;
  tagRange: string;
  netsuiteBatchRef: string;
  hubspotTicket: string;
  custodianVerified: boolean;
  itEndorsementStatus: 'PENDING_IT_SETUP' | 'READY_AVAILABLE';
  scheduledIssuanceDate: string;
  checklist: DeliveryChecklist;
}

export interface ClearanceItem {
  id: string;
  tag: string;
  desc: string;
  type: string;
  status: 'PENDING_RETURN' | 'RETURNED_GOOD';
}

export interface Clearance {
  id: string;
  employeeName: string;
  displayName: string;
  employeeId: string;
  department: string;
  site: string;
  noticeDate: string;
  lastWorkingDay: string;
  returnDeadline: string;
  daysRemaining: number;
  status: string;
  demandLetterStage: number;
  stageUpdatedDate: string | null;
  waiverApproved: boolean;
  waiverReason: string;
  waiverApprover: string | null;
  items: ClearanceItem[];
}

export interface TransferItem {
  tag: string;
  model: string;
  serial: string;
  state: 'IN_TRANSIT' | 'RECEIVED';
}

export interface Transfer {
  id: string;
  fromSite: string;
  toSite: string;
  sendingCustodian: string;
  receivingCustodian: string;
  dispatchDate: string;
  gatepassRef: string;
  transmittalDoc: string;
  status: 'IN_TRANSIT' | 'RECEIVED_COMPLETED';
  items: TransferItem[];
}

export interface AuditItem {
  tag: string;
  model: string;
  expectedLoc: string;
  scannedLoc: string;
  scanState: 'MATCHED' | 'WRONG_LOCATION' | 'UNEXPECTED' | 'UNVERIFIED';
  scannedAt: string;
  custodian: string;
}

export interface DisposalApproval {
  approved: boolean;
  actor: string | null;
  date: string | null;
}

export interface DisposalState {
  proposalId: string;
  assetTag: string;
  proposedBy: string;
  ProposedByName: string;
  approvals: {
    custodian: DisposalApproval;
    vpqs: DisposalApproval;
    finance: DisposalApproval;
    ceo: DisposalApproval;
  };
  ssdSerialVerified: boolean;
  degaussedAndShredded: boolean;
  destructionCertUploaded: boolean;
  destructionPhotoUploaded: boolean;
  completed: boolean;
}

export interface ToastNotification {
  title: string;
  detail: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}
