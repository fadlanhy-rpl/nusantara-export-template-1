'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { LocaleCode } from '@/types/export-config';
import { getDictionary } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { WebGLScene } from '@/components/canvas/WebGLScene';
import { ContainerPriceSimulator } from '@/components/calculator/ContainerPriceSimulator';
import { TrustEvidenceSection } from '@/components/trust/TrustEvidenceSection';
import { siteConfig } from '@/config/site-config';
import { isRtl } from '@/lib/i18n';

const COMMODITY_SHOWCASE = [
  {
    slug: 'premium-shisha-coconut-charcoal-briquettes',
    hsCode: '4402.90.10',
    origin: 'East Java & Sulawesi (Factory: Gresik)',
    badge: 'SGS VERIFIED • 100% COCONUT SHELL',
    title: {
      en: 'Premium Shisha Coconut Charcoal Briquettes',
      id: 'Briket Arang Kelapa Shisha Premium (Grade Platinum)',
      ar: 'فحم جوز الهند الطبيعي للشيشة (درجة بلاتينية)',
      zh: '特级水烟椰壳炭块 (白金出口级)',
    },
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    price: '1,280 - 1,350',
    specs: [
      { label: 'Ash Content', val: '< 2.2% White' },
      { label: 'Moisture', val: '< 4.5%' },
      { label: 'Burning Time', val: '2.5 Hours' },
    ],
  },
  {
    slug: 'bbq-hexagonal-hardwood-coconut-charcoal',
    hsCode: '4402.90.90',
    origin: 'Kalimantan & East Java',
    badge: 'HOTEL & RESTO GRADE • ZERO CHEMICALS',
    title: {
      en: 'BBQ Hexagonal Hardwood & Coconut Charcoal',
      id: 'Briket Arang Heksagonal BBQ Campuran Kayu Keras',
      ar: 'فحم الشواء السداسي المفرغ للمطاعم',
      zh: '六角形硬木与椰壳烧烤炭 (无烟长效型)',
    },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    price: '950 - 1,080',
    specs: [
      { label: 'Ash Content', val: '< 4.0%' },
      { label: 'Calorific', val: '7,200 kcal/kg' },
      { label: 'Burning Time', val: '4.5 - 5 Hours' },
    ],
  },
  {
    slug: 'sumatra-mandheling-arabica-green-beans',
    hsCode: '0901.11.10',
    origin: 'Mandheling & Gayo, North Sumatra (1,450 MASL)',
    badge: 'SPECIALTY GRADE 1 • TRIPLE PICKED',
    title: {
      en: 'Sumatra Mandheling Arabica Green Coffee Beans',
      id: 'Biji Kopi Mentah Arabika Sumatra Mandheling Grade 1',
      ar: 'حبوب البن الأخضر أرابيكا سومطرة ماندهيلينغ (درجة 1)',
      zh: '苏门答腊曼特宁阿拉比卡生咖啡豆 (G1特选)',
    },
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    price: '5,400 - 5,800',
    specs: [
      { label: 'Moisture', val: '11.5% - 12%' },
      { label: 'Screen Size', val: '17 / 18' },
      { label: 'Defect Rate', val: '< 3% Max' },
    ],
  },
  {
    slug: 'maluku-lalpari-cloves-handpicked',
    hsCode: '0907.10.00',
    origin: 'Ambon & Seram (Maluku Islands)',
    badge: 'HANDPICKED LALPARI • HIGH EUGENOL',
    title: {
      en: 'Handpicked Maluku Lalpari Cloves & Kerinci Cinnamon',
      id: 'Cengkeh Lalpari Maluku & Kayu Manis Kerinci Pilihan',
      ar: 'قرنفل لالباري مالوكو يدوي الانتقاء وقرفة كيرينتشي',
      zh: '马鲁古精选手工丁香与葛林芝肉桂',
    },
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    price: '3,900 - 4,300',
    specs: [
      { label: 'Eugenol Oil', val: '18% - 20%' },
      { label: 'Head Intact', val: '> 92%' },
      { label: 'Foreign Matter', val: '< 0.5%' },
    ],
  },
];

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as LocaleCode) || 'en';
  const dict = getDictionary(locale);
  const rtl = isRtl(locale);
  const { openRfq, clientBrandName, clientCompanyName, targetWhatsAppNumber } = usePitch();

  const [activeCom, setActiveCom] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [procP, setProcP] = useState(0);
  const [statementWords, setStatementWords] = useState<number[]>([]);
  const [countedValue, setCountedValue] = useState(0);

  const stmtRef = useRef<HTMLParagraphElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);

  const statementText = dict.statement.text;
  const words = locale === 'zh' ? statementText.split('') : statementText.split(' ');

  // Scroll handler for statement word-reveal & process stages
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;

      // 1. Statement Word-by-Word Opacity Reveal
      if (stmtRef.current) {
        const r = stmtRef.current.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (r.height + vh * 0.4)));
        const n = words.length;
        const k = p * (n + 5);
        const opacities = words.map((_, i) =>
          parseFloat((0.2 + 0.8 * Math.min(1, Math.max(0, (k - i) / 3))).toFixed(3))
        );
        setStatementWords(opacities);
      }

      // 2. Process Section Progress & Stage Tracking
      if (processRef.current) {
        const r = processRef.current.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        setProcP(progress);
        const idx = Math.min(4, Math.floor(progress * 5));
        setStageIdx(idx);
      }

      // 3. Reveal elements
      document.querySelectorAll('.rv:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.88) {
          el.classList.add('in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [words.length]);

  // Animated Count-Up for 350 MT metric
  useEffect(() => {
    const end = 350;
    const duration = 1400;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress * progress * (3 - 2 * progress);
      setCountedValue(Math.round(easeProgress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const req = requestAnimationFrame(step);
    return () => cancelAnimationFrame(req);
  }, []);

  const handlePlanClick = (idx: number) => {
    setActiveCom(idx);
    const plannerEl = document.getElementById('planner');
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Fixed WebGL 3D Layer */}
      <WebGLScene
        activeCommodityIndex={activeCom}
        stageIndex={stageIdx}
        processProgress={procP}
      />

      <main id="top">
        {/* 2. Hero Section */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <p className="kicker">
                <i aria-hidden="true" />
                {dict.hero.kicker}
              </p>
              <h1>
                <span className="ln" style={{ '--d': 0 } as React.CSSProperties}>
                  <span>{dict.hero.h1Line1}</span>
                </span>
                <span className="ln" style={{ '--d': 1 } as React.CSSProperties}>
                  <span>
                    <em className="serif">{dict.hero.h1Accent}</em>,
                  </span>
                </span>
                <span className="ln" style={{ '--d': 2 } as React.CSSProperties}>
                  <span>{dict.hero.h1Line2}</span>
                </span>
              </h1>
              <p className="sub">{dict.hero.sub}</p>
              <div className="cta">
                <a className="btn btn-light" href="#planner" data-scroll>
                  {dict.hero.ctaCalculate}
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
                </a>
                <a className="btn btn-line" href="#commodities" data-scroll>
                  {dict.hero.ctaExplore}
                </a>
              </div>
            </div>
            {/* 3D Slot for Hero Cluster */}
            <div className="slot-hero" id="slot-hero" aria-hidden="true" />
          </div>
        </section>

        {/* 3. Infinite Marquee Ticker */}
        <div className="marquee" aria-hidden="true">
          <div className="mq-track">
            <span>
              {dict.marquee.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item}
                  <i />
                </React.Fragment>
              ))}
              {dict.marquee.items.map((item, idx) => (
                <React.Fragment key={`rep-${idx}`}>
                  {item}
                  <i />
                </React.Fragment>
              ))}
            </span>
            <span>
              {dict.marquee.items.map((item, idx) => (
                <React.Fragment key={`b-${idx}`}>
                  {item}
                  <i />
                </React.Fragment>
              ))}
              {dict.marquee.items.map((item, idx) => (
                <React.Fragment key={`b-rep-${idx}`}>
                  {item}
                  <i />
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>

        {/* 4. Statement & Proof Metrics */}
        <section className="statement">
          <div className="wrap">
            <p className="stmt" id="stmt" ref={stmtRef}>
              {words.map((w, i) => (
                <span
                  key={i}
                  className="w"
                  style={{
                    opacity: statementWords[i] !== undefined ? statementWords[i] : 0.2,
                  }}
                >
                  {w}
                  {locale === 'zh' ? '' : ' '}
                </span>
              ))}
            </p>
            <div className="stats">
              <div className="stat rv">
                <b>
                  <span>{countedValue}</span> {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}
                </b>
                <span>{dict.statement.outputLabel}</span>
              </div>
              <div className="stat rv" style={{ '--rd': '100ms' } as React.CSSProperties}>
                <b>{dict.statement.moqVal}</b>
                <span>{dict.statement.moqLabel}</span>
              </div>
              <div className="stat rv" style={{ '--rd': '200ms' } as React.CSSProperties}>
                <b>{dict.statement.leadTimeVal}</b>
                <span>{dict.statement.leadTimeLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Commodities Interactive Section */}
        <section className="commodities" id="commodities">
          <div className="wrap">
            <div className="sec-head rv">
              <p className="label">{dict.nav.commodities}</p>
              <h2>{dict.commoditiesSection.title}</h2>
            </div>
            <div className="com-grid">
              <div>
                <div className="rows" id="rows">
                  {dict.commoditiesSection.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`row ${activeCom === idx ? 'active' : ''}`}
                      data-i={idx}
                    >
                      <button
                        className="row-head"
                        type="button"
                        aria-expanded={activeCom === idx}
                        aria-controls={`rb${idx}`}
                        onClick={() => setActiveCom(idx)}
                        onPointerEnter={() => setActiveCom(idx)}
                      >
                        <span className="row-n">{item.num}</span>
                        <span className="row-name">{item.name}</span>
                        <span className="row-hs">{item.hs}</span>
                        <span className="row-go" aria-hidden="true">
                          <svg
                            className={`arrow ${rtl ? 'rotate-180' : ''}`}
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </span>
                      </button>
                      <div className="row-body" id={`rb${idx}`}>
                        <div>
                          <div className="row-inner">
                            <p>{item.desc}</p>
                            <dl className="specs">
                              {item.specs.map((sp, sIdx) => (
                                <div key={sIdx}>
                                  <dt>{sp.k}</dt>
                                  <dd>{sp.v}</dd>
                                </div>
                              ))}
                            </dl>
                            <div className="row-foot">
                              <span className="price">
                                {dict.commoditiesSection.fobFrom} <b>${item.price}</b> {dict.commoditiesSection.perMt}
                              </span>
                              <button
                                className="linkbtn"
                                type="button"
                                onClick={() => handlePlanClick(idx)}
                              >
                                {dict.commoditiesSection.planContainer}{' '}
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
                    </div>
                  ))}
                </div>

                <p className="note">{dict.commoditiesSection.indicativeNote}</p>
              </div>

              {/* Sticky Real Documentary Commodity Showcase */}
              <div className="slot-sticky" id="slot-com">
                <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-[#222731] bg-[#14171E] shadow-2xl flex flex-col justify-between group">
                  {/* Real Macro Documentary Photo */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={COMMODITY_SHOWCASE[activeCom].image}
                      alt={COMMODITY_SHOWCASE[activeCom].title[locale] || COMMODITY_SHOWCASE[activeCom].title.en}
                      className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.12] transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent pointer-events-none" />

                    {/* Top Quality & HS Code Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none z-10">
                      <span className="px-3 py-1 rounded-full bg-[#0B0F17]/85 backdrop-blur-md border border-[#E8742A]/40 text-[#E8742A] text-xs font-mono font-medium flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8742A] animate-pulse" />
                        {COMMODITY_SHOWCASE[activeCom].badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-mono">
                        HS {COMMODITY_SHOWCASE[activeCom].hsCode}
                      </span>
                    </div>

                    {/* Bottom Specs & Action Card Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 space-y-3 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent z-10">
                      <div>
                        <div className="text-[11px] text-[#8E8E93] font-mono uppercase tracking-wider">
                          {COMMODITY_SHOWCASE[activeCom].origin}
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
                          <span>{COMMODITY_SHOWCASE[activeCom].title[locale] || COMMODITY_SHOWCASE[activeCom].title.en}</span>
                          <span className="text-sm font-mono text-[#E8742A] font-semibold">
                            FOB ${COMMODITY_SHOWCASE[activeCom].price}/MT
                          </span>
                        </h3>
                      </div>

                      {/* Key Lab Parameters Grid */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono backdrop-blur-sm">
                        {COMMODITY_SHOWCASE[activeCom].specs.map((sp, sIdx) => (
                          <div key={sIdx} className="text-center">
                            <div className="text-[10px] text-[#8E8E93] uppercase">{sp.label}</div>
                            <div className="font-semibold text-white pt-0.5">{sp.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Interactive Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handlePlanClick(activeCom)}
                          className="flex-1 h-10 px-4 rounded-xl bg-[#E8742A] hover:bg-[#D96B27] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <span>{dict.commoditiesSection.planContainer}</span>
                          <svg className="w-3.5 h-3.5 rtl:rotate-180" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const slugs = [
                              'premium-shisha-coconut-charcoal-briquettes',
                              'bbq-hexagonal-hardwood-coconut-charcoal',
                              'sumatra-mandheling-arabica-green-beans',
                              'maluku-lalpari-cloves-handpicked',
                            ];
                            openRfq({ productSlug: slugs[activeCom] });
                          }}
                          className="h-10 px-3.5 rounded-xl border border-white/20 bg-black/40 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>{dict.nav.requestQuote}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. The Light Paper Band Container Planner */}
        <ContainerPriceSimulator
          locale={locale}
          dict={dict}
          selectedCommodityIndex={activeCom}
          onCommodityChange={(idx) => setActiveCom(idx)}
        />

        {/* 7. Process Section (Sticky Scroll) */}
        <section className="process" id="process" ref={processRef as any}>
          <div className="process-in">
            <div className="wrap pr-grid">
              <div>
                <p className="label">{dict.processSection.label}</p>
                <h2>{dict.processSection.title}</h2>
                <ol
                  className="stages"
                  id="stages"
                  style={{ '--p': procP.toFixed(3) } as React.CSSProperties}
                >
                  {dict.processSection.stages.map((stage, idx) => (
                    <li
                      key={idx}
                      className={`stage ${stageIdx === idx ? 'active' : ''}`}
                    >
                      <h3>{stage.title}</h3>
                      <div className="sb">
                        <div>
                          <p>{stage.desc}</p>
                          <span className="metric">{stage.metric}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 3D Heating Cube Slot */}
              <div className="slot-proc" id="slot-proc" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* 8. Physical Trust & Legal Evidence Section */}
        <TrustEvidenceSection locale={locale} dict={dict} />

        {/* 8. Closing Section */}
        <section className="closing" id="contact">
          <div className="wrap">
            <div>
              <h2 className="rv">
                {dict.closing.title} <em className="serif">{dict.closing.titleAccent}</em>.
              </h2>
              <div className="cta rv" style={{ '--rd': '120ms' } as React.CSSProperties}>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => {
                    const slugs = [
                      'premium-shisha-coconut-charcoal-briquettes',
                      'bbq-hexagonal-hardwood-coconut-charcoal',
                      'sumatra-mandheling-arabica-green-beans',
                      'maluku-lalpari-cloves-handpicked',
                    ];
                    openRfq({ productSlug: slugs[activeCom] || slugs[0] });
                  }}
                >
                  {dict.closing.cta}
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
                <span>{dict.closing.replyTime}</span>
              </div>
            </div>

            {/* 3D Container Slot */}
            <div className="slot-close" id="slot-close" aria-hidden="true" />
          </div>
        </section>
      </main>

      {/* 9. Minimal B2B Footer */}
      <footer>
        <div className="wrap">
          <div className="f-grid">
            <div>
              <h4>{dict.footerCinematic.factoryTitle}</h4>
              <p>{siteConfig.company.factoryAddress}</p>
              <p className="text-xs text-[#8E8E93] pt-1">
                {dict.footerCinematic.portNote}
              </p>
            </div>
            <div>
              <h4>{dict.footerCinematic.deskTitle}</h4>
              <p>
                WhatsApp{' '}
                <a
                  href={`https://wa.me/${targetWhatsAppNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mono text-[#E8742A] hover:underline"
                >
                  {targetWhatsAppNumber}
                </a>
              </p>
              <p>Email {siteConfig.contact.salesEmail}</p>
              <p>{dict.footerCinematic.deskHours}</p>
            </div>
            <div>
              <h4>{dict.footerCinematic.siteTitle}</h4>
              <a href="#commodities" data-scroll>
                {dict.footerCinematic.siteCommodities}
              </a>
              <a href="#planner" data-scroll>
                {dict.footerCinematic.sitePlanner}
              </a>
              <a href="#process" data-scroll>
                {dict.footerCinematic.siteQuality}
              </a>
            </div>
          </div>
          <div className="f-base">
            <span>
              {clientCompanyName} • NIB: {siteConfig.company.nibNumber}
            </span>
            <span>© {new Date().getFullYear()} {clientBrandName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}