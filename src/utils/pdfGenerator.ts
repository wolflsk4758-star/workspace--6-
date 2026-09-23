import { Order } from '../types';
import { Language, translations } from '../i18n/translations';

export async function generateInvoicePDF(order: Order, language: Language) {
  const t = translations[language];
  const isRTL = language === 'ar';
  
  // Service name translation
  const serviceNames: Record<string, string> = {
    'Web Development': t.webDev,
    'Commercial Marketing': t.commercialMarketing,
    'Ad Campaign Management': t.adCampaign,
    'SEO & Site Audit': t.seoAudit,
    'Design & Branding': t.designBranding,
    'AI Promotional Videos': t.aiVideos,
    'Other': t.other,
  };

  const translatedService = serviceNames[order.service] || order.service;
  const invoiceDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const invoiceNumber = `WLSK-${order.id.slice(0, 8).toUpperCase()}`;

  // Create the invoice HTML
  const invoiceHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; color: #1a1a1a; direction: ${isRTL ? 'rtl' : 'ltr'};">
      
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #D4AF37;">
        <div style="margin-bottom: 16px;">
          <img src="https://via.placeholder.com/200x60/D4AF37/1a1a1a?text=WOLF+LSK+Agency" 
               alt="WOLF LSK Agency Logo" 
               style="max-width: 200px; height: auto;" />
        </div>
        <h1 style="font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 0; letter-spacing: 1px;">
          WOLF <span style="color: #D4AF37;">LSK</span> Agency
        </h1>
        <p style="color: #666; font-size: 12px; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase;">
          ${t.agencyTagline}
        </p>
      </div>

      <!-- Invoice Title & Meta -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; flex-wrap: wrap; gap: 20px;">
        <div>
          <h2 style="font-size: 32px; font-weight: 800; color: #D4AF37; margin: 0; letter-spacing: 2px;">
            ${t.invoice}
          </h2>
        </div>
        <div style="text-align: ${isRTL ? 'left' : 'right'};">
          <p style="margin: 0; font-size: 13px; color: #666;">
            <strong style="color: #1a1a1a;">${t.invoiceNumber}:</strong> ${invoiceNumber}
          </p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #666;">
            <strong style="color: #1a1a1a;">${t.invoiceDate}:</strong> ${invoiceDate}
          </p>
        </div>
      </div>

      <!-- Client Info -->
      <div style="background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 12px 0; font-weight: 700;">
          ${t.billTo}
        </h3>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${order.clientName}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #666;">${order.phoneNumber}</p>
      </div>

      <!-- Order Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 16px 0; font-weight: 700;">
          ${t.orderDetails}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1a1a1a; color: white;">
              <th style="padding: 12px 16px; text-align: ${isRTL ? 'right' : 'left'}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                ${t.service}
              </th>
              <th style="padding: 12px 16px; text-align: ${isRTL ? 'right' : 'left'}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                ${t.description}
              </th>
              <th style="padding: 12px 16px; text-align: ${isRTL ? 'left' : 'right'}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                ${t.deliveryDate}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a;">${translatedService}</td>
              <td style="padding: 14px 16px; font-size: 14px; color: #444;">${order.description || '-'}</td>
              <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; text-align: ${isRTL ? 'left' : 'right'}; white-space: nowrap;">
                ${new Date(order.deliveryDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment Summary -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 16px 0; font-weight: 700;">
          ${t.paymentSummary}
        </h3>
        <div style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e5e5;">
              <td style="padding: 14px 20px; font-size: 14px; color: #666;">${t.totalAmount}</td>
              <td style="padding: 14px 20px; font-size: 16px; font-weight: 600; color: #1a1a1a; text-align: ${isRTL ? 'left' : 'right'};">
                $${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e5e5; background: #f0fdf4;">
              <td style="padding: 14px 20px; font-size: 14px; color: #16a34a;">${t.depositPaid}</td>
              <td style="padding: 14px 20px; font-size: 16px; font-weight: 600; color: #16a34a; text-align: ${isRTL ? 'left' : 'right'};">
                -$${order.firstPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr style="background: #fffbeb;">
              <td style="padding: 16px 20px; font-size: 15px; font-weight: 700; color: #92400e;">${t.balanceDue}</td>
              <td style="padding: 16px 20px; font-size: 20px; font-weight: 800; color: #D4AF37; text-align: ${isRTL ? 'left' : 'right'};">
                $${order.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Payment Dates -->
      ${(order.firstPaymentDate || order.secondPaymentDate) ? `
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 12px 0; font-weight: 700;">
          ${t.paymentDates}
        </h3>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          ${order.firstPaymentDate ? `
          <div style="flex: 1; min-width: 200px; background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px 18px;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999;">${t.firstPaymentDate}</p>
            <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
              ${new Date(order.firstPaymentDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          ` : ''}
          ${order.secondPaymentDate ? `
          <div style="flex: 1; min-width: 200px; background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px 18px;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999;">${t.secondPaymentDate}</p>
            <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
              ${new Date(order.secondPaymentDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37; text-align: center;">
        <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">
          ${t.thankYou}
        </p>
        <p style="font-size: 11px; color: #999; margin-top: 8px; letter-spacing: 1px;">
          WOLF LSK Agency — ${t.agencyTagline}
        </p>
      </div>
    </div>
  `;

  // Create a temporary container for the invoice
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = invoiceHTML;
  document.body.appendChild(container);

  try {
    // @ts-ignore - html2pdf.js doesn't have proper types
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: [0, 0, 0, 0],
      filename: `Invoice-${order.clientName.replace(/\s+/g, '-')}-${invoiceNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    };

    await html2pdf()
      .set(opt as any)
      .from(container.firstElementChild as HTMLElement)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}
