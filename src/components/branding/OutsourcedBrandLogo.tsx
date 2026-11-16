import React, { useState } from 'react';

// Exact SVG Data URI fallback of the official Outsourced logo if the webp fails
const OUTSOURCED_LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 690 120" fill="none">
    <polygon points="44,18 68,18 32,68 68,118 44,118 8,68" fill="#00AEEF"/>
    <text x="74" y="114" fill="#FFFFFF" font-family="Inter, Montserrat, 'Segoe UI', system-ui, -apple-system, sans-serif" font-size="112" font-weight="700" letter-spacing="-3.5">outsourced</text>
  </svg>`
)}`;

interface BrandLogoProps {
  collapsed?: boolean;
  variant?: 'sidebar' | 'header' | 'printable';
  className?: string;
}

export const OutsourcedBrandLogo: React.FC<BrandLogoProps> = ({
  collapsed = false,
  variant = 'sidebar',
  className = ''
}) => {
  const [imgSrc, setImgSrc] = useState('/branding/outsourced_logo.webp');
  const [faviconError, setFaviconError] = useState(false);

  // Collapsed Sidebar View: Displays official brand favicon icon in a polished container
  if (collapsed) {
    return (
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-xl bg-[#092741] border border-[#00C8E8]/40 select-none shrink-0 shadow-xs ${className}`}
        title="Outsourced ITAM — SOP OPH-FA-PRO-0001 R1"
      >
        {!faviconError ? (
          <img
            src="/branding/favicon.png"
            alt="Outsourced Icon"
            className="w-5 h-5 object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <svg viewBox="0 0 80 120" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="48,14 72,14 34,60 72,106 48,106 10,60" fill="#00C8E8" />
          </svg>
        )}
      </div>
    );
  }

  // Expanded View: Full brand logo with cyan ITAM badge
  return (
    <div className={`flex flex-col justify-center select-none min-w-0 ${className}`}>
      <div className="flex items-center gap-2">
        <img
          src={imgSrc}
          onError={() => {
            if (imgSrc !== OUTSOURCED_LOGO_DATA_URI) {
              setImgSrc(OUTSOURCED_LOGO_DATA_URI);
            }
          }}
          alt="Outsourced"
          className="h-[26px] w-auto max-w-[145px] object-contain shrink-0"
        />
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
