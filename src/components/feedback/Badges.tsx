import React from 'react';
import {
  CheckCircle2,
  UserCheck,
  Truck,
  Eye,
  Wrench,
  Trash2,
  Tag,
  AlertTriangle,
  Lock,
  Info,
  Building2,
  Briefcase,
  User,
  type LucideIcon
} from 'lucide-react';
import { LifecycleStatus, PhysicalCondition, OwnershipType } from '../../types';

export const StatusBadge: React.FC<{ status: LifecycleStatus; className?: string }> = ({ status, className = '' }) => {
  const config: Record<LifecycleStatus, { label: string; bg: string; text: string; border: string; Icon: LucideIcon }> = {
    AVAILABLE: { label: 'Available', bg: 'bg-[#EBF7F0]', text: 'text-[#16834A]', border: 'border-[#16834A]/25', Icon: CheckCircle2 },
    ASSIGNED: { label: 'Assigned', bg: 'bg-[#EBF5FA]', text: 'text-[#1677A8]', border: 'border-[#1677A8]/25', Icon: UserCheck },
    IN_TRANSIT: { label: 'In Transit', bg: 'bg-[#FEF8EC]', text: 'text-[#B7791F]', border: 'border-[#B7791F]/25', Icon: Truck },
    UNDER_INSPECTION: { label: 'Under Inspection', bg: 'bg-[#FEF8EC]', text: 'text-[#B7791F]', border: 'border-[#B7791F]/25', Icon: Eye },
    UNDER_REPAIR: { label: 'Under Repair', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', border: 'border-[#C83C3C]/25', Icon: Wrench },
    PENDING_DISPOSAL: { label: 'Pending Disposal', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', border: 'border-[#C83C3C]/25', Icon: Trash2 },
    PENDING_TAGGING: { label: 'Pending Tagging', bg: 'bg-[#FEF8EC]', text: 'text-[#B7791F]', border: 'border-[#B7791F]/25', Icon: Tag },
    MISSING: { label: 'Missing / Unverified', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', border: 'border-[#C83C3C]/25', Icon: AlertTriangle },
    DISPOSED: { label: 'Disposed (Retired)', bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', border: 'border-[#64748B]/25', Icon: Lock }
  };

  const current = config[status] || { label: status, bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', border: 'border-[#64748B]/25', Icon: Info };
  const IconComp = current.Icon;

  return (
    <span
      role="status"
      aria-label={`Lifecycle status: ${current.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      <IconComp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};

export const ConditionBadge: React.FC<{ condition: PhysicalCondition; className?: string }> = ({ condition, className = '' }) => {
  const config: Record<PhysicalCondition, { label: string; bg: string; text: string; dot: string }> = {
    BRAND_NEW: { label: 'Brand New', bg: 'bg-[#EBF7F0]', text: 'text-[#16834A]', dot: 'bg-[#16834A]' },
    GOOD: { label: 'Good Condition', bg: 'bg-[#F1F5F9]', text: 'text-[#102A3A]', dot: 'bg-[#16834A]' },
    FAIR: { label: 'Fair (Minor Wear)', bg: 'bg-[#FEF8EC]', text: 'text-[#B7791F]', dot: 'bg-[#B7791F]' },
    DAMAGED: { label: 'Damaged', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', dot: 'bg-[#C83C3C]' },
    DEFECTIVE: { label: 'Defective Hardware', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', dot: 'bg-[#C83C3C]' },
    BEYOND_REPAIR: { label: 'Beyond Economic Repair', bg: 'bg-[#FDEDED]', text: 'text-[#C83C3C]', dot: 'bg-[#C83C3C]' }
  };

  const current = config[condition] || { label: condition, bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', dot: 'bg-[#64748B]' };

  return (
    <span
      role="status"
      aria-label={`Physical condition: ${current.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#DCE5EA] ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};

export const OwnershipBadge: React.FC<{ ownership: OwnershipType; className?: string }> = ({ ownership, className = '' }) => {
  const config: Record<OwnershipType, { label: string; bg: string; text: string; Icon: LucideIcon }> = {
    COMPANY_OWNED: { label: 'Company-Owned', bg: 'bg-[#05253D]/10', text: 'text-[#05253D]', Icon: Building2 },
    CLIENT_OWNED: { label: 'Client-Owned', bg: 'bg-[#EBF5FA]', text: 'text-[#1677A8]', Icon: Briefcase },
    STAFF_OWNED: { label: 'Staff-Owned (BYOD)', bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', Icon: User }
  };

  const current = config[ownership] || { label: ownership, bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]', Icon: Info };
  const IconComp = current.Icon;

  return (
    <span
      role="status"
      aria-label={`Ownership: ${current.label}`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${current.bg} ${current.text} ${className}`}
    >
      <IconComp className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};
