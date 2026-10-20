import { NextRequest, NextResponse } from 'next/server';
import { RfqFormData, RfqApiResponse } from '@/types/rfq';
import { siteConfig } from '@/config/site-config';
import { productsData } from '@/data/products';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body: RfqFormData = await req.json();

    // Basic Validation
    if (!body.buyer?.fullName || !body.buyer?.email) {
      return NextResponse.json<RfqApiResponse>(
        {
          status: 'error',
          message: 'Full Name and Corporate Email are mandatory.',
        },
        { status: 400 }
      );
    }

    // Generate formal Reference ID
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const referenceId = `RFQ-${todayStr}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const product = productsData.find((p) => p.slug === body.productSlug) || productsData[0];
    const waLink = generateWhatsAppLink(
      siteConfig.contact.whatsappNumber,
      body,
      product.name[body.locale] || product.name.en
    );

    // Optional: Resend API integration if key provided
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'NusantaraOrigin Export Desk <rfq@nusantaraorigin.com>',
            to: [siteConfig.contact.salesEmail],
            reply_to: body.buyer.email,
            subject: `[NEW RFQ ${referenceId}] ${body.buyer.companyName} (${body.buyer.country}) - ${body.containerQty}x ${body.containerType}`,
            html: `
              <h2>New Export Inquiry Received</h2>
              <p><strong>Reference:</strong> ${referenceId}</p>
              <p><strong>Company:</strong> ${body.buyer.companyName} (${body.buyer.country})</p>
              <p><strong>Contact:</strong> ${body.buyer.fullName} (${body.buyer.email} / ${body.buyer.whatsappOrPhone})</p>
              <p><strong>Commodity:</strong> ${product.name.en} - ${body.selectedVariant}</p>
              <p><strong>Order Volume:</strong> ${body.containerQty}x ${body.containerType} (Est. ${body.estimatedTotalMT} MT)</p>
              <p><strong>Incoterms:</strong> ${body.incoterm} ${body.destinationPort ? `to ${body.destinationPort}` : ''}</p>
              <p><strong>Payment Term:</strong> ${body.paymentTermPreference}</p>
              <p><strong>Target Price:</strong> USD $${body.buyerTargetPriceUsdPerMT || 'N/A'}/MT</p>
              <p><strong>Notes:</strong> ${body.buyer.additionalNotes || 'None'}</p>
            `,
          }),
        });
      } catch (err) {
        console.error('Resend email error:', err);
      }
    }

    return NextResponse.json<RfqApiResponse>({
      status: 'success',
      referenceId,
      timestamp,
      whatsappRedirectUrl: waLink,
    });
  } catch (error) {
    console.error('RFQ submission error:', error);
    return NextResponse.json<RfqApiResponse>(
      {
        status: 'error',
        message: 'Internal server error processing RFQ.',
      },
      { status: 500 }
    );
  }
}
