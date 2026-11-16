import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Layers,
  Laptop,
  Monitor,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Copy,
  Check,
  Terminal,
  Network,
  Zap,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  X,
  FileCheck2,
  Database
} from 'lucide-react';
import { Asset, Role, AssetTechnicalSpecs } from '../../types';

interface AssetConfigurationViewProps {
  asset: Asset;
  currentRole: Role;
  onUpdateSpecs?: (updatedSpecs: AssetTechnicalSpecs) => void;
}

export const AssetConfigurationView: React.FC<AssetConfigurationViewProps> = ({
  asset,
  currentRole,
  onUpdateSpecs
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const specs = asset.technicalSpecs;
  const isDisplayOrPeripheral =
    asset.category.toLowerCase().includes('monitor') ||
    asset.category.toLowerCase().includes('display');

  // Local form state for manual editing
  const [formData, setFormData] = useState<AssetTechnicalSpecs>({
    processor: specs?.processor || '',
    cores: specs?.cores || '',
    ram: specs?.ram || '',
    ramType: specs?.ramType || '',
    graphics: specs?.graphics || '',
    storageCapacity: specs?.storageCapacity || '',
    storageType: specs?.storageType || '',
    driveSerial: specs?.driveSerial || '',
    osName: specs?.osName || '',
    osVersion: specs?.osVersion || '',
    osBuild: specs?.osBuild || '',
    hostname: specs?.hostname || '',
    systemArchitecture: specs?.systemArchitecture || '',
    macAddress: specs?.macAddress || '',
    itSetupStatus: specs?.itSetupStatus || 'COMPLETED',
    itSetupDate: specs?.itSetupDate || '',
    itTechnician: specs?.itTechnician || '',
    soeImage: specs?.soeImage || '',
    mdmEnrollmentRecord: specs?.mdmEnrollmentRecord || '',
    encryptionStatus: specs?.encryptionStatus || '',
    biosLockVerified: specs?.biosLockVerified ?? true,
    displaySize: specs?.displaySize || '',
    resolution: specs?.resolution || '',
    panelType: specs?.panelType || '',
    powerDelivery: specs?.powerDelivery || '',
    firmwareVersion: specs?.firmwareVersion || ''
  });

  const copyToClipboard = (text: string, key: string) => {
    if (!text || text === '—') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSpecs) {
      onUpdateSpecs(formData);
    }
    setIsEditing(false);
  };

  // Fallback if technicalSpecs is missing
  if (!specs) {
    return (
      <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#607482]">
          <Cpu className="w-4 h-4 text-[#00B7D8]" />
          <span>Hardware Configuration (Inventory Record)</span>
        </div>
        <p className="text-sm font-medium text-[#102A3A] leading-relaxed">{asset.specs}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Platform & Data Governance Header Banner */}
      <div className="p-3.5 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#05253D] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#00B7D8]" />
              Hardware Specifications & IT Staging Record (`DEL-03`)
            </span>
            <span className="text-[10px] font-semibold bg-[#EBF7F0] text-[#16834A] border border-[#B2F2BB] px-2 py-0.5 rounded-full">
              Manual Entry / CSV Import
            </span>
            <span className="text-[10px] font-semibold bg-[#EEF3F6] text-[#607482] px-2 py-0.5 rounded-full">
              SOP OPH-FA-PRO-0001 R1
            </span>
          </div>
          <p className="text-[11px] text-[#607482] mt-0.5">
            Operational asset attributes recorded at PO intake or legacy migration. Verified during 2-day IT pre-issuance technical endorsement.
          </p>
        </div>

        {/* Quick Manual Edit Trigger (For IT Staff & FA Custodians) */}
        {currentRole.canEditRegistry && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#05253D] bg-white border border-[#DCE5EA] rounded-lg hover:border-[#00C8E8] hover:text-[#00B7D8] transition-colors shrink-0 shadow-2xs"
            title="Edit hardware configuration attributes"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Specs</span>
          </button>
        )}
      </div>

      {/* 1. Executive Quick Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white border border-[#DCE5EA] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#607482] mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#00B7D8]" />
            <span>Processor</span>
          </div>
          <div className="text-xs font-bold text-[#102A3A] truncate" title={specs.processor || 'N/A'}>
            {specs.processor || (isDisplayOrPeripheral ? 'Display Hub' : '—')}
          </div>
          <div className="text-[10px] text-[#607482] truncate">
            {specs.cores ? specs.cores.split(',')[0] : (isDisplayOrPeripheral ? specs.resolution : 'Hardware')}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DCE5EA] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#607482] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#00B7D8]" />
            <span>Memory (RAM)</span>
          </div>
          <div className="text-xs font-bold text-[#102A3A] truncate">
            {specs.ram || (isDisplayOrPeripheral ? 'N/A (Passive)' : '—')}
          </div>
          <div className="text-[10px] text-[#607482] truncate">
            {specs.ramType ? specs.ramType.split(' ')[0] : 'Installed'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DCE5EA] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#607482] mb-1">
            <HardDrive className="w-3.5 h-3.5 text-[#00B7D8]" />
            <span>Primary Storage</span>
          </div>
          <div className="text-xs font-bold text-[#102A3A] truncate">
            {specs.storageCapacity || (isDisplayOrPeripheral ? 'N/A (Display)' : '—')}
          </div>
          <div className="text-[10px] text-[#607482] truncate">
            {specs.storageType ? specs.storageType.split(' ')[0] : 'Solid State'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#DCE5EA] shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#607482] mb-1">
            {isDisplayOrPeripheral ? (
              <Monitor className="w-3.5 h-3.5 text-[#00B7D8]" />
            ) : (
              <Laptop className="w-3.5 h-3.5 text-[#00B7D8]" />
            )}
            <span>OS & Build</span>
          </div>
          <div className="text-xs font-bold text-[#102A3A] truncate" title={specs.osName || 'Firmware'}>
            {specs.osName ? `${specs.osName} ${specs.osVersion || ''}` : (specs.firmwareVersion || 'Firmware')}
          </div>
          <div className="text-[10px] text-[#607482] truncate">
            {specs.osBuild ? specs.osBuild.split(' ')[0] : (specs.panelType || 'Catalog Record')}
          </div>
        </div>
      </div>

      {/* Critical Sanitization / Decommissioning Gate Alert (Process 3 / DSP-02 & Process 2 / RET-02) */}
      {specs.dataSanitizationStatus === 'PHYSICAL_DESTRUCTION_REQUIRED' && (
        <div className="p-3.5 rounded-xl bg-[#FFF5F5] border-2 border-[#E03131] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#C92A2A] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-[#C92A2A] uppercase tracking-wide flex items-center gap-1.5">
              <span>Mandatory Storage Media Physical Destruction Gate (`DSP-02`)</span>
            </div>
            <p className="text-[#491217] leading-relaxed">
              Storage drive serial <span className="font-mono font-bold bg-[#FFE3E3] px-1 py-0.5 rounded text-[#900]">{specs.driveSerial}</span> must be physically punched or mechanically shredded per NIST SP 800-88 before NetSuite GL retirement.
            </p>
            {specs.dataSanitizationMethod && (
              <div className="text-[11px] font-semibold text-[#C92A2A]">
                Required Protocol: {specs.dataSanitizationMethod}
              </div>
            )}
          </div>
        </div>
      )}

      {specs.dataSanitizationStatus === 'PENDING_NIST_WIPE' && (
        <div className="p-3.5 rounded-xl bg-[#FFF9DB] border border-[#F59F00] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-[#B7791F] uppercase tracking-wide flex items-center gap-1.5">
              <span>Data Sanitization Pending (`Process 2 / RET-02 Checklist`)</span>
            </div>
            <p className="text-[#5C3B00] leading-relaxed">
              This returned workstation holds residual employee data. IT staff must execute cryptographic wipe & 3-pass overwrite before transitioning to Available Stock.
            </p>
          </div>
        </div>
      )}

      {/* 2. Monitor / Display Specific Configuration (when applicable) */}
      {isDisplayOrPeripheral && (
        <div className="p-4 rounded-xl border border-[#DCE5EA] bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05253D]">
              <Monitor className="w-4 h-4 text-[#00B7D8]" />
              <span>Display Panel & Hub Specifications</span>
            </div>
            <span className="text-[11px] font-semibold text-[#16834A] bg-[#EBFBEE] px-2 py-0.5 rounded-md">
              Catalog Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs tabular-nums">
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Screen Size & Format:</span>
              <span className="font-semibold text-[#102A3A]">{specs.displaySize || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Native Resolution:</span>
              <span className="font-semibold text-[#102A3A]">{specs.resolution || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Panel Technology:</span>
              <span className="font-medium text-[#102A3A]">{specs.panelType || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Color Accuracy:</span>
              <span className="font-medium text-[#102A3A]">{specs.colorGamut || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Power Delivery Hub:</span>
              <span className="font-semibold text-[#16834A] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#00B7D8]" /> {specs.powerDelivery || '90W PD'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Firmware Version:</span>
              <span className="font-mono text-[#102A3A]">{specs.firmwareVersion || '—'}</span>
            </div>
          </div>

          {specs.ports && specs.ports.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#607482] block mb-1.5">
                Integrated I/O & Hub Ports:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specs.ports.map((port, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#F5F8FA] border border-[#DCE5EA] text-[#102A3A] px-2 py-0.5 rounded-md font-mono"
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Compute & Architecture Card */}
      {!isDisplayOrPeripheral && (
        <div className="p-4 rounded-xl border border-[#DCE5EA] bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05253D]">
              <Cpu className="w-4 h-4 text-[#00B7D8]" />
              <span>Compute Hardware & Architecture</span>
            </div>
            <span className="text-[11px] font-semibold text-[#0E7490] bg-[#E0F7FA] px-2 py-0.5 rounded-md font-mono">
              {specs.systemArchitecture || 'x86_64'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs tabular-nums">
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Processor / CPU:</span>
              <span className="font-bold text-[#102A3A]">{specs.processor || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Cores & Configuration:</span>
              <span className="font-medium text-[#102A3A]">{specs.cores || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Installed RAM:</span>
              <span className="font-bold text-[#102A3A]">{specs.ram || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Memory Architecture:</span>
              <span className="font-medium text-[#102A3A]">{specs.ramType || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Graphics / GPU:</span>
              <span className="font-medium text-[#102A3A] truncate max-w-[220px]" title={specs.graphics || '—'}>
                {specs.graphics || 'Integrated'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Built-in Display:</span>
              <span className="font-medium text-[#102A3A] truncate max-w-[220px]" title={specs.displaySize || '—'}>
                {specs.displaySize || '—'} {specs.resolution ? `(${specs.resolution})` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Storage Media & Drive Serial Number (`DSP-02` Mandatory Chain of Custody) */}
      {!isDisplayOrPeripheral && (
        <div className="p-4 rounded-xl border border-[#DCE5EA] bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05253D]">
              <HardDrive className="w-4 h-4 text-[#00B7D8]" />
              <span>Storage Media & Drive Serial Number (`DSP-02`)</span>
            </div>
            <span className="text-[11px] font-semibold text-[#05253D] bg-[#F5F8FA] border border-[#DCE5EA] px-2 py-0.5 rounded-md">
              Tracked Physical Component
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs tabular-nums">
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Storage Capacity:</span>
              <span className="font-bold text-[#102A3A]">{specs.storageCapacity || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Drive Media Type:</span>
              <span className="font-medium text-[#102A3A]">{specs.storageType || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Drive Serial Number:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-[#05253D] bg-[#F5F8FA] px-1.5 py-0.5 rounded border border-[#DCE5EA]">
                  {specs.driveSerial || '—'}
                </span>
                {specs.driveSerial && (
                  <button
                    onClick={() => copyToClipboard(specs.driveSerial!, 'driveSerial')}
                    className="p-1 text-[#607482] hover:text-[#00B7D8] transition-colors rounded hover:bg-[#EEF3F6]"
                    title="Copy Drive Serial"
                  >
                    {copiedKey === 'driveSerial' ? (
                      <Check className="w-3.5 h-3.5 text-[#16834A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Disk Encryption (Tag):</span>
              {specs.encryptionStatus ? (
                <span className="font-semibold text-[#16834A] flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3" />
                  {specs.encryptionStatus}
                </span>
              ) : (
                <span className="text-[#607482]">—</span>
              )}
            </div>
          </div>
          <p className="text-[10px] text-[#607482] italic pt-1">
            * Drive serial is logged in the ITAM asset master to enforce NIST SP 800-88 physical destruction certification prior to disposal sign-off.
          </p>
        </div>
      )}

      {/* 5. Operating System & Device Identity */}
      {!isDisplayOrPeripheral && (
        <div className="p-4 rounded-xl border border-[#DCE5EA] bg-white space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05253D]">
              <Terminal className="w-4 h-4 text-[#00B7D8]" />
              <span>Operating System & Device Identity</span>
            </div>
            <span className="text-[11px] font-semibold text-[#607482] bg-[#F5F8FA] px-2 py-0.5 rounded-md font-mono">
              Inventory Identification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs tabular-nums">
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Operating System:</span>
              <span className="font-bold text-[#102A3A]">{specs.osName || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">OS Release & Version:</span>
              <span className="font-semibold text-[#102A3A]">{specs.osVersion || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">OS Build Number:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[#102A3A]">{specs.osBuild || '—'}</span>
                {specs.osBuild && (
                  <button
                    onClick={() => copyToClipboard(specs.osBuild!, 'osBuild')}
                    className="p-1 text-[#607482] hover:text-[#00B7D8] transition-colors rounded hover:bg-[#EEF3F6]"
                    title="Copy OS Build"
                  >
                    {copiedKey === 'osBuild' ? (
                      <Check className="w-3.5 h-3.5 text-[#16834A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Assigned Hostname:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[#0E7490] font-semibold truncate max-w-[170px]" title={specs.hostname}>
                  {specs.hostname || '—'}
                </span>
                {specs.hostname && (
                  <button
                    onClick={() => copyToClipboard(specs.hostname!, 'hostname')}
                    className="p-1 text-[#607482] hover:text-[#00B7D8] transition-colors rounded hover:bg-[#EEF3F6]"
                    title="Copy Hostname"
                  >
                    {copiedKey === 'hostname' ? (
                      <Check className="w-3.5 h-3.5 text-[#16834A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
              <span className="text-[#607482]">Hardware Label MAC:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-[#05253D] bg-[#F5F8FA] px-1.5 py-0.5 rounded border border-[#DCE5EA]">
                  {specs.macAddress || '—'}
                </span>
                {specs.macAddress && (
                  <button
                    onClick={() => copyToClipboard(specs.macAddress!, 'macAddress')}
                    className="p-1 text-[#607482] hover:text-[#00B7D8] transition-colors rounded hover:bg-[#EEF3F6]"
                    title="Copy MAC Address"
                  >
                    {copiedKey === 'macAddress' ? (
                      <Check className="w-3.5 h-3.5 text-[#16834A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 2-Day Pre-Issuance IT Staging Endorsement (Process 6 / DEL-03 Verification) */}
      <div className="p-4 rounded-xl border border-[#DCE5EA] bg-white space-y-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#EEF3F6]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#05253D]">
            <FileCheck2 className="w-4 h-4 text-[#16834A]" />
            <span>2-Day Pre-Issuance IT Staging Endorsement (`DEL-03`)</span>
          </div>
          <div>
            {specs.itSetupStatus === 'COMPLETED' ? (
              <span className="text-[10px] font-bold bg-[#EBFBEE] text-[#16834A] border border-[#B2F2BB] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Endorsement Verified
              </span>
            ) : specs.itSetupStatus === 'AWAITING_SETUP' ? (
              <span className="text-[10px] font-bold bg-[#FEF8EC] text-[#B7791F] border border-[#FDE3B0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" /> Awaiting 2-Day IT Setup
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-[#EEF3F6] text-[#607482] px-2 py-0.5 rounded-full">
                Exempt / Peripheral
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs tabular-nums">
          <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
            <span className="text-[#607482]">SOE Image Baseline:</span>
            <span className="font-semibold text-[#102A3A] truncate max-w-[210px]" title={specs.soeImage}>
              {specs.soeImage || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
            <span className="text-[#607482]">MDM Enrollment Tag:</span>
            <span className="font-semibold text-[#0E7490] truncate max-w-[210px]" title={specs.mdmEnrollmentRecord}>
              {specs.mdmEnrollmentRecord || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
            <span className="text-[#607482]">BIOS / Firmware Lock:</span>
            <span className="font-medium text-[#102A3A]">
              {specs.biosLockVerified ? 'Corporate Password Enforced' : 'Not Enforced / Open'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
            <span className="text-[#607482]">IT Endorsed By:</span>
            <span className="font-semibold text-[#102A3A] truncate max-w-[210px]">
              {specs.itTechnician || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[#F5F8FA]">
            <span className="text-[#607482]">Staging Endorsement Date:</span>
            <span className="font-medium text-[#102A3A]">
              {specs.itSetupDate || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Hardware Specs Editing Modal */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-[#05253D]/70 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DCE5EA] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#05253D] text-white rounded-t-2xl flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#00C8E8]" />
                  Edit Hardware Specifications ({asset.assetTag})
                </h3>
                <p className="text-xs text-[#DCE5EA]/80 mt-0.5">
                  Update manual inventory records or technical staging endorsement attributes.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg bg-[#092741] text-[#DCE5EA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Processor / CPU</label>
                  <input
                    type="text"
                    value={formData.processor || ''}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. Apple M3 Pro / Intel Core i7-1365U"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Cores / Configuration</label>
                  <input
                    type="text"
                    value={formData.cores || ''}
                    onChange={(e) => setFormData({ ...formData, cores: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. 12-Core (6P + 6E)"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Installed RAM</label>
                  <input
                    type="text"
                    value={formData.ram || ''}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. 36 GB / 32 GB"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">RAM Architecture / Speed</label>
                  <input
                    type="text"
                    value={formData.ramType || ''}
                    onChange={(e) => setFormData({ ...formData, ramType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. Unified LPDDR5X / DDR5-5200 SODIMM"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Storage Capacity</label>
                  <input
                    type="text"
                    value={formData.storageCapacity || ''}
                    onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. 1 TB / 512 GB"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Storage Media Type</label>
                  <input
                    type="text"
                    value={formData.storageType || ''}
                    onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. PCIe 4.0 NVMe SSD"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">
                    Storage Drive Serial <span className="text-[#C92A2A]">* (NIST Gate)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.driveSerial || ''}
                    onChange={(e) => setFormData({ ...formData, driveSerial: e.target.value })}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. APFS-00842-SSD-01"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Hardware Label MAC Address</label>
                  <input
                    type="text"
                    value={formData.macAddress || ''}
                    onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. F0:18:98:3A:C2:5E"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Operating System & Version</label>
                  <input
                    type="text"
                    value={formData.osName || ''}
                    onChange={(e) => setFormData({ ...formData, osName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. macOS Sequoia 15.1 / Windows 11 Enterprise"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Assigned Computer Hostname</label>
                  <input
                    type="text"
                    value={formData.hostname || ''}
                    onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. MNL-MBP-00842"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">MDM Enrollment Record Tag</label>
                  <input
                    type="text"
                    value={formData.mdmEnrollmentRecord || ''}
                    onChange={(e) => setFormData({ ...formData, mdmEnrollmentRecord: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. Kandji Enrolled / Microsoft Intune Enrolled"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">Disk Encryption Status Tag</label>
                  <input
                    type="text"
                    value={formData.encryptionStatus || ''}
                    onChange={(e) => setFormData({ ...formData, encryptionStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. FileVault 2 Confirmed / BitLocker Confirmed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">IT Staging Endorsement Status</label>
                  <select
                    value={formData.itSetupStatus}
                    onChange={(e) => setFormData({ ...formData, itSetupStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden bg-white"
                  >
                    <option value="COMPLETED">COMPLETED (2-Day Pre-Issuance Endorsed)</option>
                    <option value="AWAITING_SETUP">AWAITING_SETUP (Pending IT Staging)</option>
                    <option value="EXEMPT">EXEMPT (Peripheral / Passive Display)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#102A3A] mb-1">IT Staging Technician</label>
                  <input
                    type="text"
                    value={formData.itTechnician || ''}
                    onChange={(e) => setFormData({ ...formData, itTechnician: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE5EA] focus:border-[#00C8E8] focus:outline-hidden"
                    placeholder="e.g. Miguel Santos (IT Staff)"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DCE5EA] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 font-semibold text-[#607482] hover:text-[#102A3A] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00C8E8] text-[#05253D] font-bold rounded-lg hover:bg-[#00B7D8] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Hardware Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};