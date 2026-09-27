import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { renderTravelEmail } from '@/lib/email/renderer';
import { sendTravelEmail } from '@/lib/email/provider';
import type { TravelEmailTemplateId } from '@/lib/email/travel-templates';

export async function POST(request: Request) {
  const expected = process.env.EMAIL_WORKER_SECRET;
  const supplied = request.headers.get('x-email-worker-secret');
  if (!expected || !supplied || supplied !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createSupabaseServerClient();
  const { data: rows, error } = await supabase.from('email_deliveries').select('id, booking_id, document_id, template_id, recipient_email, subject, metadata').eq('status','QUEUED').order('created_at',{ascending:true}).limit(10);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const row of rows ?? []) {
    try {
      const metadata = (row.metadata ?? {}) as Record<string, unknown>;
      const data = (metadata.canonicalData ?? {}) as Record<string, unknown>;
      const rendered = renderTravelEmail({ templateId: row.template_id as TravelEmailTemplateId, data, actionUrl: typeof metadata.actionUrl === 'string' ? metadata.actionUrl : null });
      const sent = await sendTravelEmail({ to: row.recipient_email, subject: row.subject ?? rendered.subject, html: rendered.html });
      await supabase.from('email_deliveries').update({ status:'SENT', provider_message_id: sent.id ?? null, sent_at:new Date().toISOString() }).eq('id',row.id);
      if (row.document_id) await supabase.from('document_events').insert({document_id:row.document_id,booking_id:row.booking_id,event_type:'EMAIL_SENT',actor_type:'SYSTEM',metadata:{deliveryId:row.id,providerMessageId:sent.id ?? null}});
      results.push({id:row.id,status:'SENT'});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'EMAIL_SEND_FAILED';
      await supabase.from('email_deliveries').update({ status:'FAILED', error_message:message }).eq('id',row.id);
      if (row.document_id) await supabase.from('document_events').insert({document_id:row.document_id,booking_id:row.booking_id,event_type:'EMAIL_FAILED',actor_type:'SYSTEM',metadata:{deliveryId:row.id,error:message}});
      results.push({id:row.id,status:'FAILED',error:message});
    }
  }
  return NextResponse.json({ processed: results.length, results });
}
