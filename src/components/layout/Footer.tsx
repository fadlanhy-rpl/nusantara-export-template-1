'use client';

import React from 'react';
import Link from 'next/link';
import { LocaleCode } from '@/types/export-config';
import { Messages } from '@/lib/dictionary';
import { usePitch } from '@/context/PitchContext';
import { siteConfig } from '@/config/site-config';
import { ShieldCheck, MapPin, Phone, Mail, Award, Anchor, ExternalLink } from 'lucide-react';

interface FooterProps {
  locale: LocaleCode;
  dict: Messages;
}

export function Footer({ locale, dict }: FooterProps) {
  const { clientCompanyName, clientBrandName, targetWhatsAppNumber, setIsPitchActive, isPitchActive } = usePitch();

  return (
    <footer className="w-full bg-[#0B0C0E] text-[#9CA3AF] hairline-b-dark border-t border-[#2A2E39] pt-16 pb-12 select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Verification Badges Strip */}
        <div className="border border-[#2A2E39] bg-[#14171E] p-4 rounded-md mb-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span className="font-mono text-[11px] text-[#F3F4F6] uppercase">INSW Registered</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-[#D96B27]" />
            <span className="font-mono text-[11px] text-[#F3F4F6] uppercase">SGS Lab Tested</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span className="font-mono text-[11px] text-[#F3F4F6] uppercase">Sucofindo Surveyor</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-[#D96B27]" />
            <span className="font-mono text-[11px] text-[#F3F4F6] uppercase">SVLK Timber Legal</span>
          </div>
          <div className="flex items-center justify-center gap-2 col-span-2 sm:col-span-1">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span className="font-mono text-[11px] text-[#F3F4F6] uppercase">Halal Indonesia</span>
          </div>
        </div>

        {/* 4-Column Structured B2B Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#2A2E39]">
          {/* Col 1: Factory & Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#1A1D24] border border-[#D96B27]/40 flex items-center justify-center rounded text-[#D96B27] font-mono font-bold text-sm">
                NO
              </div>
              <h3 className="font-heading font-bold text-white text-base uppercase tracking-tight">
                {clientBrandName}
              </h3>
            </div>
            <p className="font-mono text-xs text-[#DCFCE7] font-medium leading-relaxed">
              {clientCompanyName}
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D96B27] shrink-0 mt-0.5" />
                <span className="text-[#9CA3AF] leading-relaxed">
                  {siteConfig.company.factoryAddress}
                </span>
              </div>
              <div className="text-[11px] text-[#64748B] pt-1">
                {siteConfig.company.coordinates}
              </div>
            </div>
          </div>

          {/* Col 2: Ports of Loading & Logistics */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#D96B27]" />
              {dict.footer.portHeading}
            </h4>
            <ul className="space-y-3 text-xs font-mono text-[#9CA3AF]">
              {siteConfig.company.loadingPorts.map((port, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D96B27] font-bold">›</span>
                  <span>{port}</span>
                </li>
              ))}
              <li className="pt-2 text-[11px] text-[#64748B]">
                Average Transit Time: Dubai 14 days, Rotterdam 26 days, Ningbo 12 days.
              </li>
            </ul>
          </div>

          {/* Col 3: Export Compliance & Certifications */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              {dict.footer.complianceHeading}
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-[#14171E] border border-[#2A2E39] rounded">
                <span className="text-[#DCFCE7] block font-semibold">NIB (Export License)</span>
                <span className="text-[#9CA3AF] text-[11px]">9120301928371 — Kemendag RI</span>
              </div>
              <div className="p-2.5 bg-[#14171E] border border-[#2A2E39] rounded">
                <span className="text-[#DCFCE7] block font-semibold">IMO Non-DG Safe Cargo</span>
                <span className="text-[#9CA3AF] text-[11px]">Special Provision SP 925 Sea Freight</span>
              </div>
            </div>
          </div>

          {/* Col 4: Export Sales Desk */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D96B27]" />
              {dict.footer.contactHeading}
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <a
                href={`https://wa.me/${targetWhatsAppNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 bg-[#1A1D24] border border-[#2A2E39] hover:border-[#15803D] text-[#DCFCE7] rounded transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-[#15803D] animate-ping" />
                <span dir="ltr">WhatsApp: {targetWhatsAppNumber}</span>
              </a>

              <a
                href={`mailto:${siteConfig.contact.salesEmail}`}
                className="flex items-center gap-2 p-2 bg-[#1A1D24] border border-[#2A2E39] hover:border-[#D96B27] text-[#F3F4F6] rounded transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>{siteConfig.contact.salesEmail}</span>
              </a>

              <div className="text-[11px] text-[#64748B] pt-2">
                Export Response Time: &lt; 2 hours during business operations (GMT+7).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Secret Live Pitch Toggle */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
          <p>© {new Date().getFullYear()} {clientCompanyName}. {dict.footer.copyright}</p>

          <div className="flex items-center gap-4">
            <Link href={`/${locale}/quality-legal`} className="hover:text-white transition-colors">
              Legal Disclaimer
            </Link>
            <span>•</span>
            <button
              onClick={() => setIsPitchActive(!isPitchActive)}
              className="hover:text-[#D96B27] text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>⚡</span>
              <span>{isPitchActive ? 'Hide Pitch Bar' : 'Presenter Mode (?pitch=true)'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
