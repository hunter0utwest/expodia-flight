import { getTravelEmailTemplate, type TravelEmailTemplateId } from '@/lib/email/travel-templates';

export type CanonicalTravelEmailData = Record<string, unknown>;

function esc(value: unknown) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

function requiredValue(data: CanonicalTravelEmailData, key: string) {
  const value = data[key];
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function renderTravelEmail(input: { templateId: TravelEmailTemplateId; data: CanonicalTravelEmailData; actionUrl?: string | null }) {
  const template = getTravelEmailTemplate(input.templateId);
  if (!template) throw new Error('Unknown travel email template');
  const missing = template.requiredFields.filter((field) => !requiredValue(input.data, field));
  if (missing.length) throw new Error(`EMAIL_CANONICAL_DATA_MISSING: ${missing.join(',')}`);

  const d = input.data;
  const rows = [
    ['Passenger', d.passenger],
    ['Confirmation', d.confirmation],
    ['Itinerary', d.route],
    ['Flight', d.flightNumber],
    ['Departure', d.departureTime && d.departureAirport ? `${d.departureTime} · ${d.departureAirport}` : undefined],
    ['Arrival', d.arrivalTime && d.arrivalAirport ? `${d.arrivalTime} · ${d.arrivalAirport}` : undefined],
    ['Ticket', d.ticketNumber],
    ['Seat', d.seat],
    ['Amount', d.amount && d.currency ? `${d.amount} ${d.currency}` : undefined],
    ['Document', d.documentNumber],
  ].filter(([, value]) => requiredValue(d, String(value)));

  const details = rows.map(([label, value]) => `<tr><td style="padding:9px 0;color:#5f6368;width:34%">${esc(label)}</td><td style="padding:9px 0;font-weight:700">${esc(value)}</td></tr>`).join('');
  const subject = template.subject;
  const action = input.actionUrl && input.actionUrl.startsWith('/') ? input.actionUrl : null;

  return {
    subject,
    html: `<!doctype html><html><body style="margin:0;background:#f5f6f7;color:#202124;font-family:Arial,Helvetica,sans-serif"><div style="max-width:680px;margin:0 auto;padding:24px 12px"><header style="background:#fff;border-bottom:1px solid #dadce0;padding:18px 22px"><div style="font-size:21px;font-weight:700">EXPODIA</div><div style="font-size:11px;color:#5f6368;margin-top:4px">FLIGHTS · TRIPS</div></header><main style="background:#fff;padding:28px 24px"><div style="font-size:11px;color:#5f6368;font-weight:700;letter-spacing:.08em">${esc(template.eyebrow)}</div><h1 style="font-size:28px;line-height:1.1;margin:8px 0 12px">${esc(template.headline)}</h1><p style="font-size:14px;line-height:1.55;color:#3c4043">This message contains the verified travel information associated with your booking.</p><section style="border:1px solid #dadce0;padding:16px;margin-top:20px"><table style="width:100%;border-collapse:collapse">${details}</table></section>${action ? `<p style="margin:24px 0 0"><a href="${esc(action)}" style="display:inline-block;background:#1769aa;color:#fff;text-decoration:none;padding:12px 18px;font-weight:700">${esc(template.actionLabel)}</a></p>` : ''}<p style="font-size:11px;line-height:1.5;color:#5f6368;margin-top:24px;padding-top:16px;border-top:1px solid #e8eaed">This email is generated from the canonical travel record. Provider-issued documents retain the identity of the actual airline, supplier, or booking provider.</p></main></div></body></html>`,
  };
}
