'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LocaleCode } from '@/types/export-config';

export interface CommodityAsset {
  index: number;
  name: string;
  category: string;
  hsCode: string;
  image: string;
  secondaryImage?: string;
  secondaryName?: string;
  specs: { label: string; value: string }[];
  origin: string;
  coordinates: string;
  glowColor: string;
  accentColor: string;
  badge: string;
}

export const COMMODITY_ASSETS: CommodityAsset[] = [
  {
    index: 0,
    name: 'Premium Shisha Coconut Charcoal Briquettes',
    category: '100% Mature Coconut Shell Carbon',
    hsCode: 'HS 4402.90.10',
    image: '/img/shisha-charcoal-cutout.png',
    specs: [
      { label: 'Ash Content', value: '< 2.2% White' },
      { label: 'Moisture', value: '< 4.5%' },
      { label: 'Calorific', value: '7,500+ kcal/kg' },
    ],
    origin: 'FACTORY: GRESIK, EAST JAVA',
    coordinates: '07°09\'23"S 112°39\'19"E',
    glowColor: 'rgba(232, 116, 42, 0.28)',
    accentColor: '#E8742A',
    badge: 'BATCH CERTIFIED • LIVE PREVIEW',
  },
  {
    index: 1,
    name: 'BBQ Hexagonal Hardwood & Coconut Charcoal',
    category: 'Extruded Hollow Resto Grade',
    hsCode: 'HS 4402.90.90',
    image: '/img/assets/charcoal-hex.webp',
    specs: [
      { label: 'Burn Time', value: '4.5 - 5.0 Hours' },
      { label: 'Fixed Carbon', value: '> 80%' },
      { label: 'Calorific', value: '7,200+ kcal/kg' },
    ],
    origin: 'KALIMANTAN & EAST JAVA',
    coordinates: '01°15\'44"S 116°49\'51"E',
    glowColor: 'rgba(201, 94, 27, 0.25)',
    accentColor: '#C95E1B',
    badge: 'HOTEL & RESTO GRADE • ZERO CHEMICALS',
  },
  {
    index: 2,
    name: 'Sumatra Mandheling Arabica Green Coffee',
    category: 'Specialty Grade 1 Triple Picked',
    hsCode: 'HS 0901.11.10',
    image: '/img/assets/coffee.webp',
    specs: [
      { label: 'Screen Size', value: '17 / 18' },
      { label: 'Moisture', value: '11.5% - 12%' },
      { label: 'Defect Rate', value: '< 3% Triple Pick' },
    ],
    origin: 'GAYO & MANDHELING (1,450 MASL)',
    coordinates: '04°41\'28"N 96°51\'40"E',
    glowColor: 'rgba(62, 142, 92, 0.28)',
    accentColor: '#3E8E5C',
    badge: 'SPECIALTY G1 • TRIPLE PICKED',
  },
  {
    index: 3,
    name: 'Maluku Lalpari Cloves & Kerinci Cinnamon',
    category: 'Handpicked Sun-Dried Export Spices',
    hsCode: 'HS 0907.10.00',
    image: '/img/assets/cinnamon.webp',
    secondaryImage: '/img/assets/cloves.webp',
    secondaryName: 'Maluku Lalpari Cloves',
    specs: [
      { label: 'Eugenol Oil', value: '18% - 20%' },
      { label: 'Head Intact', value: '> 92% Plump' },
      { label: 'Foreign Matter', value: '< 0.5%' },
    ],
    origin: 'AMBON (MALUKU) & KERINCI (JAMBI)',
    coordinates: '03°41\'42"S 128°10\'55"E',
    glowColor: 'rgba(217, 148, 64, 0.26)',
    accentColor: '#D99440',
    badge: 'HANDPICKED EXPORT GRADE • STEAM CLEANED',
  },
];

export interface CommodityShowcase3DProps {
  activeCommodityIndex?: number;
  className?: string;
  locale?: LocaleCode;
  onPlanClick?: (index: number) => void;
  onRequestQuote?: (index: number) => void;
}

export function CommodityShowcase3D({
  activeCommodityIndex = 0,
  className = '',
  locale = 'en',
  onPlanClick,
  onRequestQuote,
}: CommodityShowcase3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Active commodity safe lookup
  const safeIdx = Math.max(0, Math.min(activeCommodityIndex, COMMODITY_ASSETS.length - 1));
  const currentAsset = COMMODITY_ASSETS[safeIdx];

  // Optional sub-variant toggle for index 3 (Cinnamon vs Cloves)
  const [spiceVariant, setSpiceVariant] = useState<'cinnamon' | 'cloves'>('cinnamon');

  // 3D Tilt & Parallax Physics States
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const targetTilt = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const currentTilt = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // Spring lerp interpolation loop for 60fps smooth tilt physics
  useEffect(() => {
    let active = true;
    const update = () => {
      if (!active) return;
      const ease = 0.12; // Silky smooth damping factor
      currentTilt.current.rx += (targetTilt.current.rx - currentTilt.current.rx) * ease;
      currentTilt.current.ry += (targetTilt.current.ry - currentTilt.current.ry) * ease;
      currentTilt.current.gx += (targetTilt.current.gx - currentTilt.current.gx) * ease;
      currentTilt.current.gy += (targetTilt.current.gy - currentTilt.current.gy) * ease;

      setTilt({
        rx: parseFloat(currentTilt.current.rx.toFixed(2)),
        ry: parseFloat(currentTilt.current.ry.toFixed(2)),
        gx: parseFloat(currentTilt.current.gx.toFixed(1)),
        gy: parseFloat(currentTilt.current.gy.toFixed(1)),
      });

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Relative to center: -1 to 1
    const dx = (x - 0.5) * 2;
    const dy = (y - 0.5) * 2;

    const MAX_TILT = 13; // Degrees
    targetTilt.current.rx = -dy * MAX_TILT; // Inverted Y tilt
    targetTilt.current.ry = dx * MAX_TILT;
    targetTilt.current.gx = x * 100;
    targetTilt.current.gy = y * 100;
    if (!isHovered) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetTilt.current.rx = 0;
    targetTilt.current.ry = 0;
    targetTilt.current.gx = 50;
    targetTilt.current.gy = 50;
  };

  // Determine active displayed image (handles spices sub-variant)
  const activeImage =
    safeIdx === 3 && spiceVariant === 'cloves' && currentAsset.secondaryImage
      ? currentAsset.secondaryImage
      : currentAsset.image;

  // Key for re-triggering entrance transition
  const transitionKey = `${safeIdx}-${spiceVariant}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[540px] sm:h-[560px] rounded-[16px] overflow-hidden select-none transition-shadow duration-500 ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        border: '1px solid rgba(245, 245, 244, 0.12)',
        background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, #1f1a17 0%, #151311 40%, #0B0B0C 90%)`,
        boxShadow: isHovered
          ? '0 30px 60px -12px rgba(0,0,0,0.85), 0 0 40px -10px ' + currentAsset.glowColor
          : '0 20px 45px -15px rgba(0,0,0,0.7)',
      }}
    >
      {/* 1. Industrial Background Crosshair Grid & Subtle Technical Lines */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300"
        style={{ transform: `translateZ(10px) translate(${-tilt.ry * 0.4}px, ${tilt.rx * 0.4}px)` }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,245,244,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,244,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Center Crosshair Guides */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-white/[0.07]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-white/[0.07]" />

        {/* Center Reticle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed border-white/[0.03] pointer-events-none" />

        {/* Corner Precision Marks */}
        <div className="absolute top-3 left-3 text-white/20 font-mono text-xs select-none">+</div>
        <div className="absolute top-3 right-3 text-white/20 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-3 left-3 text-white/20 font-mono text-xs select-none">+</div>
        <div className="absolute bottom-3 right-3 text-white/20 font-mono text-xs select-none">+</div>

        {/* Dynamic Studio Ambient Glow centered on product */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{
            backgroundColor: currentAsset.glowColor,
            opacity: isHovered ? 0.75 : 0.45,
          }}
        />
      </div>

      {/* 2. Top Technical HUD Overlays */}
      <div
        className="absolute top-0 inset-x-0 p-5 flex items-start justify-between gap-3 pointer-events-none z-20 transition-transform duration-300"
        style={{ transform: `translateZ(40px) translate(${tilt.ry * 0.5}px, ${-tilt.rx * 0.5}px)` }}
      >
        {/* Top-Left: Live Batch Status */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono tracking-tight shadow-md">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentAsset.accentColor }}
            />
            <span className="text-white/90 font-medium text-[11px]">{currentAsset.badge}</span>
          </div>
          <div className="text-[10px] font-mono text-[#8E8E93] tracking-widest uppercase pl-1">
            {currentAsset.origin}
          </div>
        </div>

        {/* Top-Right: HS Code Industrial Badge */}
        <div className="text-right space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-semibold shadow-md">
            <span className="text-[#8E8E93] text-[10px]">TARIFF</span>
            <span style={{ color: currentAsset.accentColor }}>{currentAsset.hsCode}</span>
          </div>
          <div className="text-[10px] font-mono text-white/40 tracking-wider">
            {currentAsset.coordinates}
          </div>
        </div>
      </div>

      {/* 3. Central 3D Floating Product PNG Cutout */}
      <div
        className="absolute inset-0 flex items-center justify-center p-8 z-10 pointer-events-none"
        style={{
          transform: `translateZ(55px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          key={transitionKey}
          className="relative max-w-[85%] max-h-[68%] flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            animation: 'showcaseSpringEnter 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <img
            src={activeImage}
            alt={currentAsset.name}
            draggable={false}
            className="w-auto h-auto max-h-[290px] sm:max-h-[330px] max-w-full object-contain select-none transition-transform duration-500"
            style={{
              filter: `
                drop-shadow(${tilt.ry * -1.8}px ${30 + tilt.rx * 1.2}px 38px rgba(0, 0, 0, 0.88))
                drop-shadow(${tilt.ry * -0.8}px ${12 + tilt.rx * 0.5}px 14px rgba(0, 0, 0, 0.6))
                brightness(1.03) contrast(1.06)
              `,
            }}
          />
        </div>
      </div>

      {/* Optional Sub-Variant Switcher (Exclusively for Spices: Cinnamon vs Cloves) */}
      {safeIdx === 3 && currentAsset.secondaryImage && (
        <div
          className="absolute top-20 right-5 z-20 flex flex-col gap-1.5 transition-transform duration-300"
          style={{ transform: `translateZ(45px)` }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSpiceVariant('cinnamon');
            }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
              spiceVariant === 'cinnamon'
                ? 'bg-[#D99440] text-black shadow-sm font-semibold'
                : 'bg-black/60 text-[#8E8E93] hover:text-white border border-white/10'
            }`}
          >
            Kerinci Cinnamon
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSpiceVariant('cloves');
            }}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
              spiceVariant === 'cloves'
                ? 'bg-[#D99440] text-black shadow-sm font-semibold'
                : 'bg-black/60 text-[#8E8E93] hover:text-white border border-white/10'
            }`}
          >
            Maluku Cloves
          </button>
        </div>
      )}

      {/* 4. Bottom Technical HUD Specifications & Interactive Controls */}
      <div
        className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent z-20 space-y-3 pointer-events-auto transition-transform duration-300"
        style={{ transform: `translateZ(35px) translate(${tilt.ry * 0.3}px, ${-tilt.rx * 0.3}px)` }}
      >
        {/* Product Title & Category */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider">
              {currentAsset.category}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {currentAsset.name}
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8742A]" />
            <span>3D PARALLAX</span>
          </div>
        </div>

        {/* 3-Cell Technical Lab Parameters */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#14171E]/80 backdrop-blur-md border border-white/10 text-xs font-mono">
          {currentAsset.specs.map((sp, sIdx) => (
            <div key={sIdx} className="text-center px-1">
              <div className="text-[9px] sm:text-[10px] text-[#8E8E93] uppercase tracking-wider truncate">
                {sp.label}
              </div>
              <div className="font-semibold text-white pt-0.5 text-[11px] sm:text-xs truncate">
                {sp.value}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Action Buttons */}
        {(onPlanClick || onRequestQuote) && (
          <div className="flex items-center gap-2 pt-0.5">
            {onPlanClick && (
              <button
                type="button"
                onClick={() => onPlanClick(safeIdx)}
                className="flex-1 h-9 sm:h-10 px-4 rounded-xl text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer group"
                style={{ backgroundColor: currentAsset.accentColor }}
              >
                <span>Plan This Container</span>
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            )}

            {onRequestQuote && (
              <button
                type="button"
                onClick={() => onRequestQuote(safeIdx)}
                className="h-9 sm:h-10 px-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Request RFQ</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Embedded CSS Spring Keyframes */}
      <style jsx>{`
        @keyframes showcaseSpringEnter {
          0% {
            opacity: 0;
            transform: translateZ(15px) scale(0.88) translateY(14px);
          }
          60% {
            opacity: 1;
            transform: translateZ(58px) scale(1.03) translateY(-3px);
          }
          100% {
            opacity: 1;
            transform: translateZ(55px) scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
