'use client';

import React, { useState, useEffect } from 'react';
import { usePitch } from '@/context/PitchContext';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { productsData } from '@/data/products';
import { siteConfig } from '@/config/site-config';
import { isRtl } from '@/lib/i18n';

interface SmartRfqDrawerProps {
  locale: LocaleCode;
  dict: Messages;
}

export function SmartRfqDrawer({ locale, dict }: SmartRfqDrawerProps) {
  const { isRfqOpen, closeRfq, rfqPrefill, targetWhatsAppNumber, clientBrandName } = usePitch();
  const rtl = isRtl(locale);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [inc, setInc] = useState<'FOB' | 'CIF' | 'EXW'>('FOB');
  const [port, setPort] = useState('Jebel Ali Port, Dubai, UAE');
  const [pay, setPay] = useState(dict.drawer.payTtFull);
  const [target, setTarget] = useState(
    rfqPrefill.targetPrice ? String(rfqPrefill.targetPrice) : '1,210'
  );
  const [pack, setPack] = useState(dict.drawer.pkgStandardFull);

  // Contact fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Status & Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const selectedProduct =
    productsData.find((p) => p.slug === rfqPrefill.productSlug) || productsData[0];
  const containerLabel =
    rfqPrefill.containerType === '20FT_DRY'
      ? '20ft'
      : rfqPrefill.containerType === '40FT_DRY'
      ? '40ft'
      : '40ft HC';
  const containerQty = rfqPrefill.containerQty || 2;
  const totalMT =
    rfqPrefill.estimatedTotalMT ||
    containerQty * (rfqPrefill.containerType === '20FT_DRY' ? 18 : 26);

  useEffect(() => {
    if (isRfqOpen) {
      setStep(1);
      setStatusMsg('');
      setErrors({});
      setSubmittedRef(null);
      if (rfqPrefill.targetPrice) {
        setTarget(rfqPrefill.targetPrice.toLocaleString('en-US'));
      } else {
        const prod = productsData.find((p) => p.slug === rfqPrefill.productSlug) || productsData[0];
        setTarget(prod.pricing.fobPriceMinPerMT.toLocaleString('en-US'));
      }
    }
  }, [isRfqOpen, rfqPrefill]);

  // Construct warm, human WhatsApp message with bold labels (*...*)
  const constructMessage = () => {
    const greeting = dict.drawer.chatGreeting.replace('NusantaraOrigin', clientBrandName);
    const intro = dict.drawer.chatIntro;
    const commodity = `📦 *${dict.drawer.chatCommodity}:* ${selectedProduct.name[locale]}`;
    const volume = `🚢 *${dict.drawer.chatVolume}:* ${containerQty} x ${containerLabel} (${dict.drawer.aboutEst} ${totalMT} ${locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'})`;
    const incoterms = `📍 *${dict.drawer.chatIncoterms}:* ${inc}${inc === 'CIF' && port ? ` -> ${port}` : ''}`;
    const payment = `💳 *${dict.drawer.chatPayment}:* ${pay}`;
    const targetPrice = `💰 *${dict.drawer.chatTargetPrice}:* ${target ? `USD ${target}/MT (${dict.drawer.chatTargetPriceNego})` : '-'}`;
    const packaging = `📦 *${dict.drawer.chatPackaging}:* ${pack}`;
    const comp = `🏢 *${dict.drawer.chatCompany}:* ${company || '-'} (${country || '-'})`;
    const pic = `👤 *${dict.drawer.chatContact}:* ${name || '-'}${email ? ` (${email})` : ''}${phone ? ` • ${phone}` : ''}`;
    const n = notes ? `📝 *${dict.drawer.chatNotes}:* ${notes}` : '';
    const closing = dict.drawer.chatClosing;

    const parts = [
      greeting,
      '',
      intro,
      '',
      commodity,
      volume,
      incoterms,
      payment,
      targetPrice,
      packaging,
      '',
      comp,
      pic,
    ];
    if (n) parts.push(n);
    parts.push('', closing);
    return parts.join('\n');
  };

  const messageText = constructMessage();
  const cleanPhone = targetWhatsAppNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  // Construct mailto link for direct native email client
  const mailtoSubject = encodeURIComponent(`[OFFICIAL RFQ] ${selectedProduct.name[locale]} - ${company || 'Export Inquiry'}`);
  const mailtoBody = encodeURIComponent(
    `Dear ${clientBrandName} Export Sales Team,\n\nI would like to request an official proforma quotation for the following container shipment:\n\n` +
    `• Commodity: ${selectedProduct.name[locale]}\n` +
    `• Order Volume: ${containerQty} x ${containerLabel} (est. ${totalMT} MT)\n` +
    `• Incoterms: ${inc}${inc === 'CIF' && port ? ` -> Destination: ${port}` : ''}\n` +
    `• Payment Terms: ${pay}\n` +
    `• Buyer Target Price: USD ${target || '-'}/MT\n` +
    `• Packaging Option: ${pack}\n\n` +
    `• Buyer Company: ${company || '-'} (${country || '-'})\n` +
    `• Contact Person: ${name || '-'} (${email || '-'}${phone ? ` • ${phone}` : ''})\n` +
    `${notes ? `• Special Notes: ${notes}\n` : ''}\n` +
    `Please reply with your official proforma quotation and earliest stuffing schedule.\n\n` +
    `Best regards,\n${name || 'Buyer'} - ${company || ''}`
  );
  const mailtoUrl = `mailto:${siteConfig.contact.salesEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {};
    if (s === 1 && inc === 'CIF') {
      if (!port.trim()) {
        errs.port = dict.drawer.errPort;
      }
    }
    if (s === 3) {
      if (!name.trim()) errs.name = dict.drawer.errName;
      if (!company.trim()) errs.company = dict.drawer.errCompany;
      if (!country.trim()) errs.country = dict.drawer.errCountry;
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errs.email = dict.drawer.errEmail;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(3, prev + 1) as any);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1) as any);
  };

  // Submit via Serverless Email API (/api/rfq)
  const handleSubmitEmail = async () => {
    if (!validateStep(3)) {
      setStatusMsg(dict.drawer.errComplete);
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType: 'QUOTATION_REQUEST',
          locale,
          productSlug: selectedProduct.slug,
          selectedVariant: pack,
          containerType: rfqPrefill.containerType || '40FT_HC',
          containerQty,
          estimatedTotalMT: totalMT,
          incoterm: inc,
          destinationPort: port,
          paymentTermPreference: pay,
          buyerTargetPriceUsdPerMT: target ? parseFloat(target.replace(/[^0-9]/g, '')) : undefined,
          oemPackagingRequired: pack.includes('OEM') || pack.includes('Private'),
          buyer: {
            fullName: name,
            companyName: company,
            country,
            email,
            whatsappOrPhone: phone,
            additionalNotes: notes,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubmittedRef(data.referenceId);
      } else {
        setStatusMsg(data.message || 'Error submitting RFQ.');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Network error. You can still open your email app directly below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Scrim Backdrop */}
      <div
        className={`scrim ${isRfqOpen ? 'open' : ''}`}
        id="scrim"
        onClick={closeRfq}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        className={`drawer ${isRfqOpen ? 'open' : ''}`}
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dr-title"
        aria-hidden={!isRfqOpen}
        data-lenis-prevent
      >
        {/* Drawer Header */}
        <div className="dr-head">
          <div className="dr-top">
            <div>
              <h2 id="dr-title">{dict.drawer.title}</h2>
              <p>{dict.drawer.subtitle}</p>
            </div>
            <button
              className="x"
              type="button"
              id="dr-close"
              aria-label="Close"
              onClick={closeRfq}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          </div>

          <ol className="steps" id="steps">
            <li className={step === 1 ? 'cur' : step > 1 ? 'done' : ''}>
              {dict.drawer.stepShipment}
            </li>
            <li className={step === 2 ? 'cur' : step > 2 ? 'done' : ''}>
              {dict.drawer.stepTerms}
            </li>
            <li className={step === 3 ? 'cur' : ''}>
              {dict.drawer.stepContact}
            </li>
          </ol>
        </div>

        {/* Drawer Body (Panes) */}
        <div className="dr-body" id="dr-body">
          {submittedRef ? (
            /* Successful Email Submission State */
            <div className="p-6 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center mx-auto border border-[#15803D]/30 shadow-xs">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <span className="font-mono text-xs text-[#E8742A] uppercase tracking-wider block font-bold">
                  {dict.drawer.emailSuccessRef}: {submittedRef}
                </span>
                <h3 className="text-xl font-bold text-[#0B0B0C] tracking-tight">
                  {dict.drawer.emailSuccessTitle}
                </h3>
                <p className="text-sm text-[#5F5E59] leading-relaxed max-w-sm mx-auto">
                  {dict.drawer.emailSuccessDesc}
                </p>
              </div>
              <div className="pt-4 flex flex-col gap-2.5 max-w-xs mx-auto">
                <a
                  className="w-full py-2.5 px-4 rounded-xl border border-[#DAD6CC] bg-white hover:bg-[#FAF9F5] hover:border-[#0B0B0C] text-[#0B0B0C] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group text-center"
                  href={mailtoUrl}
                >
                  <svg className="w-3.5 h-3.5 text-[#5F5E59] group-hover:text-[#0B0B0C] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <span>{dict.drawer.openMailAppBtn}</span>
                </a>
                <button
                  type="button"
                  className="w-full h-11 px-6 rounded-xl bg-[#0B0B0C] hover:bg-[#1B1B1E] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  onClick={() => {
                    setSubmittedRef(null);
                    closeRfq();
                  }}
                >
                  {dict.rfq.close}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Pane 1: Shipment */}
              <div className={`pane ${step === 1 ? 'show' : ''}`} data-pane="1">
                <div className="summary" id="sum">
                  <b>{selectedProduct.name[locale]}</b>
                  <span>
                    {containerQty} × {containerLabel}, {dict.drawer.aboutEst} {totalMT}{' '}
                    {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'}
                  </span>
                  <span>
                    {dict.drawer.indicativeFobSpan} ${selectedProduct.pricing.fobPriceMinPerMT} - $
                    {selectedProduct.pricing.fobPriceMaxPerMT} {dict.drawer.perMtSpan}
                  </span>
                </div>

                <div className="field">
                  <label id="inc-l">{dict.drawer.incotermLabel}</label>
                  <div className="pills" role="group" aria-labelledby="inc-l">
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={inc === 'FOB'}
                      onClick={() => setInc('FOB')}
                    >
                      {dict.drawer.fobSurabaya}
                    </button>
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={inc === 'CIF'}
                      onClick={() => setInc('CIF')}
                    >
                      {dict.drawer.cifDest}
                    </button>
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={inc === 'EXW'}
                      onClick={() => setInc('EXW')}
                    >
                      {dict.drawer.exwFactory}
                    </button>
                  </div>
                </div>

                {inc === 'CIF' && (
                  <div className={`field ${errors.port ? 'err' : ''}`} id="port-f">
                    <label htmlFor="f-port">{dict.drawer.destPortLabel}</label>
                    <input
                      id="f-port"
                      type="text"
                      placeholder={dict.drawer.destPortPlaceholder}
                      autoComplete="off"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                    {errors.port && <div className="err-msg">{errors.port}</div>}
                  </div>
                )}

                <p className="hint" id="port-hint">
                  {inc === 'CIF'
                    ? dict.drawer.hintCif
                    : inc === 'FOB'
                    ? dict.drawer.hintFob
                    : dict.drawer.hintExw}
                </p>
              </div>

              {/* Pane 2: Terms */}
              <div className={`pane ${step === 2 ? 'show' : ''}`} data-pane="2">
                <div className="field">
                  <label id="pay-l">{dict.drawer.paymentLabel}</label>
                  <div className="pills" role="group" aria-labelledby="pay-l">
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={pay === dict.drawer.payTtFull}
                      onClick={() => setPay(dict.drawer.payTtFull)}
                    >
                      {dict.drawer.payTt}
                    </button>
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={pay === dict.drawer.payLcFull}
                      onClick={() => setPay(dict.drawer.payLcFull)}
                    >
                      {dict.drawer.payLc}
                    </button>
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={pay === dict.drawer.payCustomFull}
                      onClick={() => setPay(dict.drawer.payCustomFull)}
                    >
                      {dict.drawer.payCustom}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="f-target">{dict.drawer.targetPriceLabel}</label>
                  <div className="money">
                    <span>USD</span>
                    <input
                      id="f-target"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="1,210"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    />
                  </div>
                  <p className="hint" style={{ marginTop: 8 }}>
                    {dict.drawer.targetPriceHint}
                  </p>
                </div>

                <div className="field">
                  <label id="pack-l">{dict.drawer.packagingLabel}</label>
                  <div className="pills" role="group" aria-labelledby="pack-l">
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={pack === dict.drawer.pkgStandardFull}
                      onClick={() => setPack(dict.drawer.pkgStandardFull)}
                    >
                      {dict.drawer.pkgStandard}
                    </button>
                    <button
                      className="pill"
                      type="button"
                      aria-pressed={pack === dict.drawer.pkgOemFull}
                      onClick={() => setPack(dict.drawer.pkgOemFull)}
                    >
                      {dict.drawer.pkgOem}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pane 3: Contact, Tutorial Guide & Dual-Channel Preview */}
              <div className={`pane ${step === 3 ? 'show' : ''}`} data-pane="3">
                {/* Friendly Tutorial Guide Card */}
                <div className="p-3.5 mb-4 bg-[#FAF9F5] border border-[#DAD6CC] rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#0B0B0C] font-semibold">
                    <span className="px-2 py-0.5 rounded-full bg-[#E8742A] text-white text-[10px] uppercase font-mono tracking-wider">
                      {locale === 'ar' ? 'خطوات التواصل' : locale === 'zh' ? '操作指引' : locale === 'id' ? 'Panduan' : 'How it works'}
                    </span>
                    <span className="text-xs font-bold text-[#0B0B0C]">{dict.drawer.guideTitle}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[#5F5E59] text-[11px] leading-relaxed">
                    <li>{dict.drawer.guideStep1}</li>
                    <li>{dict.drawer.guideStep2}</li>
                    <li>{dict.drawer.guideStep3}</li>
                  </ol>
                </div>

                {/* Contact Inputs */}
                <div className="g2">
                  <div className={`field ${errors.name ? 'err' : ''}`}>
                    <label htmlFor="f-name">{dict.drawer.fullName} *</label>
                    <input
                      id="f-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (statusMsg) setStatusMsg('');
                        if (errors.name) setErrors((prev) => { const n = { ...prev }; delete n.name; return n; });
                      }}
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && <div className="err-msg">{errors.name}</div>}
                  </div>
                  <div className={`field ${errors.company ? 'err' : ''}`}>
                    <label htmlFor="f-company">{dict.drawer.company} *</label>
                    <input
                      id="f-company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        if (statusMsg) setStatusMsg('');
                        if (errors.company) setErrors((prev) => { const n = { ...prev }; delete n.company; return n; });
                      }}
                      placeholder="e.g. Global Trading LLC"
                    />
                    {errors.company && <div className="err-msg">{errors.company}</div>}
                  </div>
                </div>

                <div className="g2">
                  <div className={`field ${errors.country ? 'err' : ''}`}>
                    <label htmlFor="f-country">{dict.drawer.country} *</label>
                    <input
                      id="f-country"
                      type="text"
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (statusMsg) setStatusMsg('');
                        if (errors.country) setErrors((prev) => { const n = { ...prev }; delete n.country; return n; });
                      }}
                      placeholder="e.g. United Arab Emirates"
                    />
                    {errors.country && <div className="err-msg">{errors.country}</div>}
                  </div>
                  <div className={`field ${errors.email ? 'err' : ''}`}>
                    <label htmlFor="f-email">{dict.drawer.corporateEmail} *</label>
                    <input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (statusMsg) setStatusMsg('');
                        if (errors.email) setErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
                      }}
                      placeholder="procurement@company.com"
                    />
                    {errors.email && <div className="err-msg">{errors.email}</div>}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="f-phone">{dict.drawer.phone}</label>
                  <input
                    id="f-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                  />
                </div>

                <div className="field">
                  <label htmlFor="f-notes">{dict.drawer.notes}</label>
                  <textarea
                    id="f-notes"
                    rows={2}
                    placeholder={dict.drawer.notesPlaceholder}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Channel Selector: WhatsApp vs Official Email */}
                <div className="field mt-4">
                  <label className="text-xs font-semibold text-[#0B0B0C] block mb-2">
                    {dict.drawer.channelLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                        channel === 'whatsapp'
                          ? 'bg-[#0B0B0C] text-white border-[#0B0B0C] shadow-sm ring-1 ring-[#0B0B0C]'
                          : 'bg-white text-[#5F5E59] border-[#DAD6CC] hover:border-[#0B0B0C] hover:text-[#0B0B0C]'
                      }`}
                      onClick={() => setChannel('whatsapp')}
                    >
                      <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.146-.527-1.748-.724-2.883-2.493-2.971-2.609-.088-.116-.709-.942-.709-1.796 0-.854.448-1.274.608-1.449.16-.175.348-.219.464-.219.116 0 .232.001.333.006.107.005.25.04.385.367.144.351.492 1.201.536 1.289.044.088.073.19.015.306-.059.117-.088.19-.175.292-.088.102-.185.228-.264.307-.089.088-.182.185-.078.363.104.178.463.765 1.002 1.246.694.619 1.279.811 1.459.901.18.09.287.076.395-.049.108-.125.464-.539.588-.723.124-.184.249-.153.42-.089.171.064 1.085.512 1.272.605.187.093.312.139.357.218.045.079.045.459-.099.864z"/>
                      </svg>
                      <span>{dict.drawer.channelWa}</span>
                    </button>

                    <button
                      type="button"
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                        channel === 'email'
                          ? 'bg-[#0B0B0C] text-white border-[#0B0B0C] shadow-sm ring-1 ring-[#0B0B0C]'
                          : 'bg-white text-[#5F5E59] border-[#DAD6CC] hover:border-[#0B0B0C] hover:text-[#0B0B0C]'
                      }`}
                      onClick={() => setChannel('email')}
                    >
                      <svg className="w-4 h-4 fill-none stroke-current shrink-0" strokeWidth="2" viewBox="0 0 24 24">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span>{dict.drawer.channelEmail}</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Preview depending on selected channel */}
                {channel === 'whatsapp' ? (
                  /* WhatsApp Chat Bubble Live Preview */
                  <div className="field mt-2">
                    <label className="flex items-center justify-between">
                      <span>{dict.drawer.chatPreviewTitle}</span>
                      <span className="text-[11px] text-[#3E8E5C] font-normal flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3E8E5C] animate-pulse"></span>
                        Ready to send
                      </span>
                    </label>

                    <div className="rounded-xl border border-[#DAD6CC] bg-[#F7F5F0] p-4 text-[#0B0B0C] shadow-inner space-y-3">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E0D8]">
                        <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.146-.527-1.748-.724-2.883-2.493-2.971-2.609-.088-.116-.709-.942-.709-1.796 0-.854.448-1.274.608-1.449.16-.175.348-.219.464-.219.116 0 .232.001.333.006.107.005.25.04.385.367.144.351.492 1.201.536 1.289.044.088.073.19.015.306-.059.117-.088.19-.175.292-.088.102-.185.228-.264.307-.089.088-.182.185-.078.363.104.178.463.765 1.002 1.246.694.619 1.279.811 1.459.901.18.09.287.076.395-.049.108-.125.464-.539.588-.723.124-.184.249-.153.42-.089.171.064 1.085.512 1.272.605.187.093.312.139.357.218.045.079.045.459-.099.864z"/>
                          </svg>
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-[#0B0B0C] block">
                            {clientBrandName} Export Sales Desk
                          </span>
                          <span className="text-[10px] text-[#5F5E59]">
                            {dict.drawer.chatPreviewSub}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-[#141416] leading-relaxed">
                        <p className="font-medium text-[#0B0B0C]">
                          {dict.drawer.chatGreeting.replace('NusantaraOrigin', clientBrandName)}
                        </p>
                        <p className="text-[#5F5E59] text-[11px]">
                          {dict.drawer.chatIntro}
                        </p>

                        <div className="p-3 bg-white rounded-lg border border-[#E2E0D8] space-y-1.5 shadow-sm text-[11px]">
                          <div>📦 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatCommodity}:</strong> {selectedProduct.name[locale]}</div>
                          <div>🚢 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatVolume}:</strong> {containerQty} x {containerLabel} ({dict.drawer.aboutEst} {totalMT} {locale === 'zh' ? '公吨' : locale === 'ar' ? 'طن' : 'MT'})</div>
                          <div>📍 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatIncoterms}:</strong> {inc} {inc === 'CIF' && port ? `-> ${port}` : ''}</div>
                          <div>💳 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatPayment}:</strong> {pay}</div>
                          <div>💰 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatTargetPrice}:</strong> {target ? `USD ${target}/MT (${dict.drawer.chatTargetPriceNego})` : '-'}</div>
                          <div>📦 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatPackaging}:</strong> {pack}</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#E2E0D8] space-y-1.5 shadow-sm text-[11px]">
                          <div>🏢 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatCompany}:</strong> {company || '-'} ({country || '-'})</div>
                          <div>👤 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatContact}:</strong> {name || '-'} {email && `(${email})`} {phone && `• ${phone}`}</div>
                          {notes && <div>📝 <strong className="font-bold text-[#0B0B0C]">{dict.drawer.chatNotes}:</strong> {notes}</div>}
                        </div>

                        <p className="text-[#5F5E59] text-[11px] pt-1">
                          {dict.drawer.chatClosing}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Official Email Formal Inquiry Preview */
                  <div className="field mt-2">
                    <label className="flex items-center justify-between">
                      <span>{dict.drawer.emailPreviewTitle}</span>
                      <span className="text-[11px] text-[#E8742A] font-normal flex items-center gap-1 font-mono">
                        Official B2B Inquiry
                      </span>
                    </label>

                    <div className="rounded-xl border border-[#DAD6CC] bg-[#F7F5F0] p-4 text-[#0B0B0C] shadow-inner space-y-3 font-sans">
                      <div className="pb-2.5 border-b border-[#E2E0D8] space-y-1 text-xs">
                        <div>
                          <strong className="text-[#0B0B0C]">To:</strong> <span className="font-mono text-[11px] text-[#141416]">{siteConfig.contact.salesEmail}</span>
                        </div>
                        <div>
                          <strong className="text-[#0B0B0C]">Subject:</strong> <span className="text-[#141416] font-medium">[OFFICIAL RFQ] {selectedProduct.name[locale]} — {company || 'New Inquiry'}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs leading-relaxed text-[#141416]">
                        <p>
                          Dear <strong>{clientBrandName}</strong> Export Sales Desk,
                        </p>
                        <p className="text-[#5F5E59] text-[11px]">
                          We hereby submit an official quotation request for the following export cargo:
                        </p>

                        <div className="p-3 bg-white rounded-lg border border-[#E2E0D8] space-y-1.5 shadow-sm text-[11px]">
                          <div>• <strong className="font-bold text-[#0B0B0C]">Commodity:</strong> {selectedProduct.name[locale]}</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Volume:</strong> {containerQty} x {containerLabel} (~{totalMT} MT)</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Incoterms:</strong> {inc} {inc === 'CIF' && port ? `-> Destination: ${port}` : ''}</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Payment Terms:</strong> {pay}</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Buyer Target Price:</strong> USD {target || '-'}/MT</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Packaging:</strong> {pack}</div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#E2E0D8] space-y-1.5 shadow-sm text-[11px]">
                          <div>• <strong className="font-bold text-[#0B0B0C]">Company:</strong> {company || '-'} ({country || '-'})</div>
                          <div>• <strong className="font-bold text-[#0B0B0C]">Contact Person:</strong> {name || '-'} {email && `(${email})`} {phone && `• ${phone}`}</div>
                          {notes && <div>• <strong className="font-bold text-[#0B0B0C]">Notes:</strong> {notes}</div>}
                        </div>

                        <p className="text-[#5F5E59] text-[11px] pt-1">
                          Please evaluate our target specification and send an official proforma invoice.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions: Responsive, clean hierarchy, no overflow */}
        <div className="dr-foot" id="dr-foot">
          {submittedRef ? (
            /* Successful Submission: Close Button */
            <button
              type="button"
              className="w-full h-12 px-6 rounded-xl bg-[#0B0B0C] hover:bg-[#1B1B1E] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              onClick={() => {
                setSubmittedRef(null);
                closeRfq();
              }}
            >
              {dict.rfq.close}
            </button>
          ) : (
            <>
              {/* Main Actions Row: Back Button + Primary Action Button */}
              <div className="flex items-center gap-2.5 w-full">
                {step > 1 && (
                  <button
                    type="button"
                    id="b-back"
                    onClick={handleBack}
                    className="h-12 px-4 rounded-xl border border-[#DAD6CC] bg-white hover:bg-[#FAF9F5] hover:border-[#0B0B0C] text-[#0B0B0C] text-sm font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-2xs group"
                  >
                    <svg className="w-4 h-4 rtl:rotate-180 text-[#5F5E59] group-hover:text-[#0B0B0C] group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-all" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{dict.drawer.back}</span>
                  </button>
                )}

                {step < 3 ? (
                  /* Step 1 & 2: Continue Button */
                  <button
                    type="button"
                    id="b-next"
                    onClick={handleNext}
                    className="flex-1 h-12 px-6 rounded-xl bg-[#0B0B0C] hover:bg-[#1B1B1E] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
                  >
                    <span>{dict.drawer.continue}</span>
                    <svg className="w-4 h-4 rtl:rotate-180 text-white/70 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : channel === 'whatsapp' ? (
                  /* Step 3 - WhatsApp Channel Primary CTA */
                  <a
                    id="b-wa"
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!validateStep(3)) {
                        e.preventDefault();
                        setStatusMsg(dict.drawer.errComplete);
                      }
                    }}
                    className="flex-1 h-12 px-5 rounded-xl bg-[#0B0B0C] hover:bg-[#1B1B1E] text-white text-sm font-medium flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer group"
                  >
                    <svg className="w-5 h-5 fill-[#25D366] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.146-.527-1.748-.724-2.883-2.493-2.971-2.609-.088-.116-.709-.942-.709-1.796 0-.854.448-1.274.608-1.449.16-.175.348-.219.464-.219.116 0 .232.001.333.006.107.005.25.04.385.367.144.351.492 1.201.536 1.289.044.088.073.19.015.306-.059.117-.088.19-.175.292-.088.102-.185.228-.264.307-.089.088-.182.185-.078.363.104.178.463.765 1.002 1.246.694.619 1.279.811 1.459.901.18.09.287.076.395-.049.108-.125.464-.539.588-.723.124-.184.249-.153.42-.089.171.064 1.085.512 1.272.605.187.093.312.139.357.218.045.079.045.459-.099.864z"/>
                    </svg>
                    <span className="truncate">{dict.drawer.sendWa}</span>
                    <svg className="w-4 h-4 rtl:rotate-180 text-white/70 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                ) : (
                  /* Step 3 - Email Channel Primary CTA */
                  <button
                    type="button"
                    id="b-email-submit"
                    disabled={isSubmitting}
                    onClick={handleSubmitEmail}
                    className="flex-1 h-12 px-5 rounded-xl bg-[#0B0B0C] hover:bg-[#1B1B1E] disabled:bg-[#5F5E59] text-white text-sm font-medium flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer group"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-white shrink-0" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>{dict.drawer.sendingEmail}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-none stroke-current shrink-0" strokeWidth="2" viewBox="0 0 24 24">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span className="truncate">{dict.drawer.sendEmailBtn}</span>
                        <svg className="w-4 h-4 rtl:rotate-180 text-white/70 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Step 3 Email Secondary Action: Open in Local Mail Client */}
              {step === 3 && channel === 'email' && (
                <a
                  id="b-mailto"
                  href={mailtoUrl}
                  onClick={(e) => {
                    if (!validateStep(3)) {
                      e.preventDefault();
                      setStatusMsg(dict.drawer.errComplete);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#DAD6CC] bg-white hover:bg-[#FAF9F5] hover:border-[#0B0B0C] text-[#0B0B0C] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs group text-center"
                >
                  <svg className="w-3.5 h-3.5 text-[#5F5E59] group-hover:text-[#0B0B0C] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <span>{dict.drawer.openMailAppBtn}</span>
                </a>
              )}
            </>
          )}

          {/* Validation Status Error Alert */}
          {statusMsg && (
            <div
              className="w-full flex items-center gap-2.5 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] font-medium"
              role="alert"
              aria-live="polite"
            >
              <svg className="w-4 h-4 text-[#DC2626] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{statusMsg}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}