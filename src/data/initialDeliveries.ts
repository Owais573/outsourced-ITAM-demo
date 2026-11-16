import { Delivery } from '../types';

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'DEL-2026-108',
    poNumber: 'PO-OPH-2026-0419',
    vendor: 'Power Mac Center Enterprise',
    site: 'Manila - Cyber Sigma',
    receivedDate: '2026-11-14',
    ownership: 'COMPANY_OWNED',
    model: 'Apple MacBook Pro 14" (M3 Pro, 18GB, 512GB)',
    qtyDelivered: 6,
    tagRange: 'OPH-AST-00890 to OPH-AST-00895',
    netsuiteBatchRef: 'NS-FA-BATCH-5210',
    hubspotTicket: 'HS-90310',
    custodianVerified: true,
    itEndorsementStatus: 'PENDING_IT_SETUP', // Requires 2-day pre-issuance technical endorsement
    scheduledIssuanceDate: '2026-11-18',
    checklist: {
      physicalInspection: true,
      serialsVerified: true,
      qrLabelsPrinted: true,
      osImaged: true,
      mdmEnrolled: false,
      edrAgentInstalled: false
    }
  },
  {
    id: 'DEL-2026-109',
    poNumber: 'CLIENT-CONSIGN-AU-88',
    vendor: 'FinTech Holdings Pty Ltd (Client Consignment)',
    site: 'Cebu - IT Park',
    receivedDate: '2026-11-13',
    ownership: 'CLIENT_OWNED',
    model: 'Dell Latitude 5540 (Core i7, 32GB, 512GB)',
    qtyDelivered: 10,
    tagRange: 'OPH-AST-00896 to OPH-AST-00905',
    netsuiteBatchRef: 'EXCLUDED (Client-Owned)',
    hubspotTicket: 'HS-90288',
    custodianVerified: true,
    itEndorsementStatus: 'READY_AVAILABLE',
    scheduledIssuanceDate: '2026-11-16',
    checklist: {
      physicalInspection: true,
      serialsVerified: true,
      qrLabelsPrinted: true,
      osImaged: true,
      mdmEnrolled: true,
      edrAgentInstalled: true
    }
  }
];
