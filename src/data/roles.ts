import { Role, Site } from '../types';

export const ROLES: Role[] = [
  {
    id: 'FA_CUSTODIAN',
    name: 'FA Custodian',
    user: 'Clarisse Bautista',
    dept: 'Stock Control & Asset Ops',
    canViewFinancials: false,
    canApproveDisposal: false,
    canApproveClearanceWaiver: false,
    canEditRegistry: true,
    description: 'Asset master stewardship, tagging, audits, custody transfers & documentation enforcement.'
  },
  {
    id: 'IT_STAFF',
    name: 'IT Staff',
    user: 'miguel.santos@outsourced.ph',
    displayName: 'Miguel Santos',
    dept: 'IT Systems & Staging',
    canViewFinancials: false,
    canApproveDisposal: false,
    canApproveClearanceWaiver: false,
    canEditRegistry: true,
    description: '2-day pre-issuance technical staging, diagnostics, OS reformatting & return inspection.'
  },
  {
    id: 'HR_SPECIALIST',
    name: 'HR Specialist',
    user: 'andrea.lim@outsourced.ph',
    displayName: 'Andrea Lim',
    dept: 'Human Resources',
    canViewFinancials: false,
    canApproveDisposal: false,
    canApproveClearanceWaiver: false,
    canEditRegistry: false,
    description: 'Offboarding initiation & Staff Exit Clearance tracking. Restricted from financial data.'
  },
  {
    id: 'FINANCE_OFFICER',
    name: 'Finance Officer',
    user: 'carlo.mendoza@outsourced.ph',
    displayName: 'Carlo Mendoza',
    dept: 'Finance & Accounting',
    canViewFinancials: true,
    canApproveDisposal: true,
    canApproveClearanceWaiver: false,
    canEditRegistry: false,
    description: 'Capital asset valuation, NetSuite fixed-asset reconciliation & disposal pricing.'
  },
  {
    id: 'VPQS_APPROVER',
    name: 'VPQS Approver',
    user: 'elena.rodriguez@outsourced.ph',
    displayName: 'Elena Rodriguez (VPQS)',
    dept: 'Quality & Standards Executive',
    canViewFinancials: true,
    canApproveDisposal: true,
    canApproveClearanceWaiver: true,
    canEditRegistry: false,
    description: 'High-value disposal sign-off, audit reconciliation freeze, loss escalation & policy waivers.'
  },
  {
    id: 'SYSTEM_ADMIN',
    name: 'System Admin',
    user: 'admin.ops@outsourced.ph',
    displayName: 'Rafael Villanueva',
    dept: 'Enterprise IT Infrastructure',
    canViewFinancials: true,
    canApproveDisposal: false,
    canApproveClearanceWaiver: false,
    canEditRegistry: true,
    description: 'Platform configuration, RBAC scope management & audit log review. No self-approval overrides.'
  }
];

export const SITES: Site[] = [
  { id: 'ALL', name: 'All Sites (Global Operations)', short: 'All Sites' },
  { id: 'MNL-CS', name: 'Manila — Cyber Sigma (McKinley West)', short: 'Manila - Cyber Sigma' },
  { id: 'CEB-IT', name: 'Cebu — Cebu IT Park (Apas)', short: 'Cebu - IT Park' },
  { id: 'CLK-GG', name: 'Clark — Global Gateway (Pampanga)', short: 'Clark - Global Gateway' }
];
