import React from 'react';
import { FileCheck, X, FileText, Download } from 'lucide-react';
import { AssetDocument } from '../../types';

interface DocumentPreviewModalProps {
  document: AssetDocument | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-preview-title"
      className="fixed inset-0 z-50 bg-[#05253D]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#DCE5EA] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#05253D] text-white flex items-center justify-between shrink-0">
          <span id="doc-preview-title" className="text-sm font-bold flex items-center gap-2 truncate">
            <FileCheck className="w-4 h-4 text-[#00C8E8] shrink-0" />
            Authenticated Streaming Document Preview (`DOC-01`)
          </span>
          <button onClick={onClose} className="text-[#8797A2] hover:text-white p-1" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs tabular-nums">
          <div className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE5EA] space-y-2.5">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-[#00B7D8] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#05253D] truncate">{document.name}</div>
                <div className="text-[#607482] mt-0.5">
                  Type: <strong>{document.type}</strong> • Version: <strong>v{document.version}</strong> • Size: {document.size}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#607482] pt-2 border-t border-[#DCE5EA] space-y-1">
              <div>SHA-256 Checksum: <span className="font-mono text-[#102A3A]">{document.sha256}</span></div>
              <div>Uploaded by: <span className="font-medium text-[#102A3A]">{document.uploader}</span> on {document.date}</div>
              <div className="text-[#16834A] font-semibold pt-1">
                Streamed via /api/v1/documents/{document.id}/download (No public static URL exposure)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold bg-[#05253D] hover:bg-[#092741] text-white transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
