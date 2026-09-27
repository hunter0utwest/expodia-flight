'use client';

import { useMemo, useState } from 'react';

const templates = [
  ['booking-confirmation', 'Booking confirmation', 'Your trip is booked!'],
  ['itinerary', 'Itinerary', 'Your itinerary'],
  ['payment-receipt', 'Payment receipt', 'Payment received'],
  ['ticket-issued', 'Ticket issued', 'Your ticket is ready'],
  ['itinerary-changed', 'Itinerary changed', 'Your itinerary has changed'],
  ['cancellation', 'Cancellation', 'Your trip was cancelled'],
  ['refund', 'Refund', 'Your refund is being processed'],
  ['boarding-pass-ready', 'Boarding pass ready', 'Your boarding pass is ready'],
  ['trip-reminder', 'Trip reminder', 'Your trip is coming up'],
  ['document-ready', 'Document ready', 'Your travel document is ready'],
] as const;

const sample = {
  passenger: 'ALEX MORGAN',
  confirmation: 'EXP-7K4P2Q',
  flightNumber: 'EX 204',
  dateRange: '14–21 October 2026',
  route: 'Lagos (LOS) → London (LHR)',
  departureTime: '10:35',
  departureAirport: 'LOS',
  arrivalTime: '17:20',
  arrivalAirport: 'LHR',
  duration: '6h 45m',
  stops: 'Nonstop',
  amount: '₦485,000',
  currency: 'NGN',
  ticketNumber: 'Provider ticket number',
  seat: '12A',
  documentNumber: 'EXP-DOC-0001',
};

export default function EmailPreviewsPage() {
  const [selected, setSelected] = useState(templates[0][0]);
  const current = useMemo(() => templates.find(([id]) => id === selected) ?? templates[0], [selected]);

  return (
    <main style={{ minHeight: '100vh', background: '#eef1f4', color: '#17191c', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 20px 56px' }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', color: '#69717a' }}>EXPODIA FLIGHTS · TEMPLATE PREVIEW</div>
          <h1 style={{ fontSize: 34, lineHeight: 1.08, margin: '8px 0' }}>Travel email library</h1>
          <p style={{ maxWidth: 720, color: '#5c646d', lineHeight: 1.55, margin: 0 }}>
            Review the registered customer email surfaces before they are connected to live delivery. The preview data is clearly marked as sample data and is never used by the workflow.
          </p>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
          <nav style={{ background: '#fff', border: '1px solid #dfe3e7', borderRadius: 12, padding: 10 }}>
            {templates.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', border: 0, borderRadius: 9,
                  padding: '12px 13px', marginBottom: 4, cursor: 'pointer',
                  background: selected === id ? '#eef3f7' : 'transparent',
                  color: '#17191c', fontWeight: selected === id ? 800 : 600,
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          <section>
            <div style={{ background: '#fff', border: '1px solid #dfe3e7', borderRadius: 12, padding: 12 }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #e8ebee', color: '#6a7178', fontSize: 12 }}>
                Preview · {current[1]}
              </div>
              <div style={{ padding: '16px 4px 4px' }}>
                <div style={{ maxWidth: 680, margin: '0 auto', background: '#fff', border: '1px solid #e1e4e7', boxShadow: '0 12px 34px rgba(20,28,36,.08)' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid #ddd' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.04em' }}>EXPODIA</div>
                    <div style={{ fontSize: 11, color: '#6b6b6b', marginTop: 4 }}>TRAVEL · FLIGHTS · TRIPS</div>
                  </div>
                  <div style={{ padding: '28px 24px' }}>
                    <div style={{ fontSize: 12, color: '#68707a', fontWeight: 800, letterSpacing: '.08em' }}>{current[0].replaceAll('-', ' ').toUpperCase()}</div>
                    <h2 style={{ fontSize: 30, lineHeight: 1.08, margin: '8px 0 12px' }}>{current[2]}</h2>
                    <p style={{ fontSize: 15, lineHeight: 1.55, color: '#4e555d' }}>
                      This is a visual preview using clearly labelled sample values. The live workflow will populate only verified canonical records.
                    </p>
                    <div style={{ border: '1px solid #dedede', borderRadius: 4, overflow: 'hidden', marginTop: 24 }}>
                      <div style={{ padding: '16px 18px', background: '#f7f8f9' }}>
                        <strong>{sample.dateRange}</strong>
                        <div style={{ fontSize: 13, color: '#5f6670', marginTop: 5 }}>{sample.route}</div>
                      </div>
                      <div style={{ padding: 18 }}>
                        <div style={{ fontSize: 11, color: '#747b84', fontWeight: 800 }}>PASSENGER</div>
                        <div style={{ fontSize: 16, fontWeight: 800, marginTop: 5 }}>{sample.passenger}</div>
                        <div style={{ marginTop: 18, fontSize: 11, color: '#747b84', fontWeight: 800 }}>CONFIRMATION #</div>
                        <div style={{ fontSize: 16, fontWeight: 800, marginTop: 5 }}>{sample.confirmation}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, borderTop: '1px solid #e1e1e1', paddingTop: 18 }}>
                      <div style={{ fontSize: 11, color: '#747b84', fontWeight: 800 }}>FLIGHT</div>
                      <div style={{ fontSize: 24, fontWeight: 900, marginTop: 5 }}>{sample.flightNumber}</div>
                      <div style={{ marginTop: 16 }}>
                        <strong>{sample.departureTime}</strong> · {sample.departureAirport}<br />
                        <span style={{ color: '#777' }}>{sample.duration} · {sample.stops}</span><br />
                        <strong>{sample.arrivalTime}</strong> · {sample.arrivalAirport}
                      </div>
                    </div>
                    <div style={{ marginTop: 26, display: 'inline-block', background: '#1769aa', color: '#fff', padding: '13px 20px', borderRadius: 3, fontWeight: 800 }}>
                      View {current[1].toLowerCase()}
                    </div>
                    <p style={{ fontSize: 11, lineHeight: 1.5, color: '#777', marginTop: 22, paddingTop: 18, borderTop: '1px solid #eee' }}>
                      SAMPLE PREVIEW ONLY · Live emails use verified booking, payment, ticket and document records. Provider-issued documents retain their actual issuer identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
