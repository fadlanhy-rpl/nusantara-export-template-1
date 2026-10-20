import { RfqFormData } from '@/types/rfq';

export function formatWhatsAppMessage(data: RfqFormData, productName: string): string {
  const lines = [
    `*NEW EXPORT INQUIRY (RFQ)*`,
    `----------------------------------`,
    `*Inquiry Type:* ${data.inquiryType === 'FREE_SAMPLE_REQUEST' ? 'FREE DHL SAMPLE (2 KG)' : 'COMMERCIAL CONTAINER QUOTE'}`,
    `*Company:* ${data.buyer.companyName || 'N/A'} (${data.buyer.country})`,
    `*Contact:* ${data.buyer.fullName} (${data.buyer.email})`,
    `*WhatsApp/Phone:* ${data.buyer.whatsappOrPhone}`,
    `*Commodity:* ${productName} - ${data.selectedVariant}`,
    `*Order Volume:* ${data.containerQty} x ${data.containerType} (Est. ${data.estimatedTotalMT} MT)`,
    `*Incoterms:* ${data.incoterm} ${data.destinationPort ? `-> Destination: ${data.destinationPort}` : ''}`,
    `*Payment Term:* ${data.paymentTermPreference}`,
    data.buyerTargetPriceUsdPerMT
      ? `*Buyer Target Price:* USD $${data.buyerTargetPriceUsdPerMT}/MT (Open for negotiation)`
      : `*Buyer Target Price:* Standard Indicative Tier`,
    `*Packaging:* ${data.oemPackagingRequired ? 'OEM Custom Branded Box' : 'Standard Factory Master Box'}`,
    data.packagingOption === '20kg_bulk_no_inner'
      ? `*Box Config:* 20kg Bulk Master Carton (No Inner Box)`
      : `*Box Config:* 10kg Master Box (10 x 1kg Inner Boxes)`,
    data.buyer.additionalNotes ? `*Notes:* ${data.buyer.additionalNotes}` : '',
    `----------------------------------`,
    `_Sent via Nusantara Origin Official Export Portal_`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function generateWhatsAppLink(
  phoneNumber: string,
  data: RfqFormData,
  productName: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const message = formatWhatsAppMessage(data, productName);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
