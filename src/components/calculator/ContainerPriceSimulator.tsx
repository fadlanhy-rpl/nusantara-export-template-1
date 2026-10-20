'use client';

import React, { useState, useEffect } from 'react';
import { usePitch } from '@/context/PitchContext';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { isRtl } from '@/lib/i18n';

interface ContainerPriceSimulatorProps {
  locale: LocaleCode;
  dict: Messages;
  selectedCommodityIndex?: number;
  onCommodityChange?: (idx: number) => void;
}

interface ContainerSpec {
  label: string;
  payload: number;
  cbm: number;
  dims: string;
  cols: number;
}

interface ProductSpec {
  id: string;
  name: string;
  short: string;
  unit: string;
  unitKg: number;
  dims: [number, number, number];
  low: number;
  high: number;
}

const STOW = 0.95;
const DISCOUNT = 0.05;

const CONTAINERS: Record<string, ContainerSpec> = {
  '20FT': { label: '20ft', payload: 18000, cbm: 33.2, dims: '5.90 × 2.35 × 2.39 m', cols: 10 },
  '40FT': { label: '40ft', payload: 25000, cbm: 67.7, dims: '12.03 × 2.35 × 2.39 m', cols: 20 },
  '40HC': { label: '40ft HC', payload: 26000, cbm: 76.4, dims: '12.03 × 2.35 × 2.69 m', cols: 20 },
};

const PRODUCTS: ProductSpec[] = [
  { id: 'shisha', name: 'Shisha charcoal, cube 25 mm', short: 'Shisha charcoal', unit: '10 kg boxes', unitKg: 10, dims: [32, 26, 21], low: 1280, high: 1350 },
  { id: 'bbq', name: 'BBQ charcoal, hexagonal', short: 'BBQ charcoal', unit: '10 kg cartons', unitKg: 10, dims: [35, 25, 25], low: 950, high: 1080 },
  { id: 'coffee', name: 'Green coffee, Arabica Grade 1', short: 'Green coffee', unit: '60 kg bags', unitKg: 60, dims: [90, 50, 22], low: 5400, high: 5800 },
  { id: 'spices', name: 'Whole spices, cassia and cloves', short: 'Whole spices', unit: '20 kg cartons', unitKg: 20, dims: [100, 30, 30], low: 3900, high: 4300 },
];

function r5(x: number) {
  return Math.round(x / 5) * 5;
}

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('en-US');
}

export function ContainerPriceSimulator({
  locale,
  dict,
  selectedCommodityIndex = 0,
  onCommodityChange,
}: ContainerPriceSimulatorProps) {
  const { openRfq } = usePitch();
  const rtl = isRtl(locale);

  const [productIdx, setProductIdx] = useState(selectedCommodityIndex);
  const [ctype, setCtype] = useState<'20FT' | '40FT' | '40HC'>('40HC');
  const [qty, setQty] = useState(2);
  const [targetPrice, setTargetPrice] = useState('1,210');

  useEffect(() => {
    if (selectedCommodityIndex !== undefined && selectedCommodityIndex !== productIdx) {
      setProductIdx(selectedCommodityIndex);
    }
  }, [selectedCommodityIndex]);

  const handleProductSelect = (idx: number) => {
    setProductIdx(idx);
    if (onCommodityChange) {
      onCommodityChange(idx);
    }
  };

  // Perform calculation
  const p = PRODUCTS[productIdx];
  const c = CONTAINERS[ctype];
  const unitVol = (p.dims[0] * p.dims[1] * p.dims[2]) / 1e6;
  const byWeight = Math.floor(c.payload / p.unitKg);
  const byVolume = Math.floor((c.cbm * STOW) / unitVol);
  const per = Math.min(byWeight, byVolume);
  const units = per * qty;
  const mt = (units * p.unitKg) / 1000;
  const tier = qty >= 4 ? 'vip' : ctype !== '20FT' || qty >= 2 ? 'volume' : 'base';
  const disc = tier === 'base' ? 0 : DISCOUNT;
  const low = r5(p.low * (1 - disc));
  const high = r5(p.high * (1 - disc));
  const limit = byWeight <= byVolume ? 'weight' : 'volume';
  const volUsed = clamp((units * unitVol) / (c.cbm * qty), 0, 1);
  const payUsed = clamp((per * p.unitKg) / c.payload, 0, 1);
  const totalLow = low * mt;
  const totalHigh = high * mt;

  // Render 2D SVG Diagram Grid
  const W = ctype === '20FT' ? 330 : 600;
  const H = 120;
  const X0 = 20;
  const Y0 = 30;
  const cols = c.cols;
  const rows = 2;
  const pad = 6;
  const cw = (W - pad * (cols + 1)) / cols;
  const ch = (H - pad * 3) / rows;
  const totalCells = cols * rows;
  const onCellsCount = Math.round(volUsed * totalCells);

  const handleOpenRfq = () => {
    openRfq({
      productSlug:
        productIdx === 0
          ? 'premium-shisha-coconut-charcoal-briquettes'
          : productIdx === 1
          ? 'bbq-hexagonal-hardwood-coconut-charcoal'
          : productIdx === 2
          ? 'sumatra-mandheling-arabica-green-beans'
          : 'maluku-lalpari-cloves-handpicked',
      containerType: ctype === '40HC' ? '40FT_HC' : ctype === '40FT' ? '40FT_DRY' : '20FT_DRY',
      containerQty: qty,
      estimatedTotalMT: Number(mt.toFixed(1)),
      targetPrice: targetPrice ? parseFloat(targetPrice.replace(/[^0-9]/g, '')) : undefined,
    });
  };

  const localizedCommodity = dict.planner.commodities[productIdx] || p;

  return (
    <section className="planner" id="planner">
      <div className="wrap pl-grid">
        {/* Left Control Panel */}
        <div>
          <p className="label">{dict.planner.label}</p>
          <h2>{dict.planner.title}</h2>
          <p className="lead">{dict.planner.lead}</p>

          {/* Commodity Pills */}
          <fieldset className="ctl">
            <legend>{dict.planner.commodityLegend}</legend>
            <div className="pills">
              {PRODUCTS.map((prod, idx) => {
                const item = dict.planner.commodities[idx];
                return (
                  <button
                    key={prod.id}
                    className="pill"
                    type="button"
                    aria-pressed={idx === productIdx}
                    onClick={() => handleProductSelect(idx)}
                  >
                    {item ? item.short : prod.short}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Container Size Pills */}
          <fieldset className="ctl">
            <legend>{dict.planner.containerLegend}</legend>
            <div className="pills">
              <button
                className="pill"
                type="button"
                aria-pressed={ctype === '20FT'}
                onClick={() => setCtype('20FT')}
              >
                20ft <small>18 {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}</small>
              </button>
              <button
                className="pill"
                type="button"
                aria-pressed={ctype === '40FT'}
                onClick={() => setCtype('40FT')}
              >
                40ft <small>25 {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}</small>
              </button>
              <button
                className="pill"
                type="button"
                aria-pressed={ctype === '40HC'}
                onClick={() => setCtype('40HC')}
              >
                40ft HC <small>26 {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}</small>
              </button>
            </div>
          </fieldset>

          {/* Row 2: Stepper & Target Price */}
          <div className="ctl row2">
            <div className="field">
              <label htmlFor="pl-qty-out">{dict.planner.containersCount}</label>
              <div className="stepper">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label={dict.planner.fewerAria}
                >
                  −
                </button>
                <output id="pl-qty-out" aria-live="polite">
                  {qty}
                </output>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(8, qty + 1))}
                  aria-label={dict.planner.moreAria}
                >
                  +
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="pl-target">{dict.planner.targetPriceLabel}</label>
              <div className="money">
                <span>USD</span>
                <input
                  id="pl-target"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={targetPrice}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '');
                    setTargetPrice(digits ? fmt(+digits) : '');
                  }}
                  placeholder="1,210"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div>
          {/* 2D SVG Container Diagram */}
          <div className="card diagram" aria-label="Container load diagram">
            <svg viewBox={`0 0 ${W + 40} 180`} role="img" aria-label="Top view of container showing volume used">
              {/* Container Exterior Wall */}
              <rect x={X0} y={Y0} width={W} height={H} rx={4} className="cnt-wall" />
              {/* Dynamic Cargo Grid Cells */}
              {Array.from({ length: totalCells }).map((_, i) => {
                const col = Math.floor(i / rows);
                const row = i % rows;
                const rxPos = X0 + pad + col * (cw + pad);
                const ryPos = Y0 + pad + row * (ch + pad);
                const isOn = i < onCellsCount;
                return (
                  <rect
                    key={i}
                    x={rxPos}
                    y={ryPos}
                    width={cw}
                    height={ch}
                    rx={2}
                    className={`cell ${isOn ? 'on' : ''}`}
                    style={{ '--i': col } as React.CSSProperties}
                  />
                );
              })}
              {/* Container Door */}
              <line
                x1={X0 + W}
                x2={X0 + W}
                y1={Y0 - 6}
                y2={Y0 + H + 6}
                className="cnt-door"
              />
            </svg>
            <div className="cap">
              <span>{c.dims} {dict.planner.diagramInternal}</span>
              <span>{c.cbm.toFixed(1)} {dict.planner.diagramCbm}</span>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="card results">
            <div className="big3">
              <div>
                <small>{dict.planner.netWeight}</small>
                <b>
                  {mt.toFixed(1)} {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}
                </b>
              </div>
              <div>
                <small>{localizedCommodity.unit}</small>
                <b>{fmt(units)}</b>
              </div>
              <div>
                <small>{dict.planner.indicativeFob}</small>
                <b>${fmt(low)}</b>
                <span className="block text-xs font-normal text-[#5F5E59]">
                  {dict.planner.toPricePerMt.replace('${high}', fmt(high))}
                </span>
              </div>
            </div>

            {/* Utilization Progress Bars */}
            <div className="bars">
              <div className="bar" style={{ '--w': `${Math.round(payUsed * 100)}%` } as React.CSSProperties}>
                <span>{dict.planner.payloadUsed}</span>
                <i />
                <b>{Math.round(payUsed * 100)}%</b>
              </div>
              <div className="bar" style={{ '--w': `${Math.round(volUsed * 100)}%` } as React.CSSProperties}>
                <span>{dict.planner.volumeUsed}</span>
                <i />
                <b>{Math.round(volUsed * 100)}%</b>
              </div>
            </div>

            <p className="res-note">
              <span className="tag">
                {limit === 'volume' ? dict.planner.volumeLimited : dict.planner.weightLimited}
              </span>
              {limit === 'volume'
                ? dict.planner.volumeLimitedDesc
                : dict.planner.weightLimitedDesc}{' '}
              {tier === 'vip'
                ? dict.planner.tierVip
                : tier === 'volume'
                ? dict.planner.tierVolume
                : dict.planner.tierBase}
            </p>

            <div className="res-foot">
              <div className="tot">
                {dict.planner.estimatedValue}
                <b className="mono">
                  ${fmt(totalLow)} - ${fmt(totalHigh)}
                </b>
              </div>
              <button className="btn btn-dark" type="button" onClick={handleOpenRfq}>
                <span>{dict.planner.requestQuote}</span>
                <svg
                  className={`arrow ${rtl ? 'rotate-180' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}