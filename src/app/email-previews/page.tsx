'use client';

import { useState } from 'react';

const templates = [
  ['booking-confirmation', 'Booking confirmation'],
  ['itinerary', 'Itinerary'],
  ['payment-receipt', 'Payment receipt'],
  ['ticket-issued', 'Ticket issued'],
  ['itinerary-changed', 'Itinerary changed'],
  ['cancellation', 'Cancellation'],
  ['refund', 'Refund'],
  ['boarding-pass-ready', 'Boarding pass ready'],
  ['trip-reminder', 'Trip reminder'],
  ['document-ready', 'Document ready'],
] as const;

export default function EmailPreviewsPage() {
  const [selected, setSelected] = useState(templates[0][0]);
  const current = templates.find(([id]) => id === selected) ?? templates[0];

  return (
    <main style={{minHeight:'100vh',background:'#f5f6f7',color:'#202124',fontFamily:'Arial,Helvetica,sans-serif'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'28px 18px 56px'}}>
        <header style={{marginBottom:22}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:'.08em',color:'#5f6368'}}>EXPEDIA FLIGHTS REFERENCE · EMAIL WORKFLOW</div>
          <h1 style={{fontSize:32,lineHeight:1.1,margin:'8px 0'}}>Transactional email preview</h1>
          <p style={{maxWidth:760,color:'#5f6368',lineHeight:1.5,margin:0}}>
            Reference implementation based on Expedia flight booking information architecture. Live messages must render only verified canonical booking, passenger, payment, ticket and document data.
          </p>
        </header>
        <section style={{display:'grid',gridTemplateColumns:'250px minmax(0,1fr)',gap:18,alignItems:'start'}}>
          <nav style={{background:'#fff',border:'1px solid #dadce0',borderRadius:8,padding:8}}>
            {templates.map(([id,label]) => (
              <button key={id} onClick={()=>setSelected(id)} style={{display:'block',width:'100%',textAlign:'left',border:0,borderRadius:6,padding:'11px 12px',marginBottom:2,cursor:'pointer',background:selected===id?'#f1f3f4':'transparent',color:'#202124',fontWeight:selected===id?700:500}}>{label}</button>
            ))}
          </nav>
          <section style={{background:'#fff',border:'1px solid #dadce0',borderRadius:8,padding:12}}>
            <div style={{padding:'10px 12px',borderBottom:'1px solid #e8eaed',fontSize:12,color:'#5f6368'}}>Preview · {current[1]}</div>
            <div style={{padding:'18px 4px 4px'}}>
              <div style={{maxWidth:680,margin:'0 auto',background:'#fff',border:'1px solid #dadce0',boxShadow:'0 8px 28px rgba(60,64,67,.12)'}}>
                <div style={{padding:'18px 22px',borderBottom:'1px solid #dadce0'}}>
                  <div style={{fontSize:21,fontWeight:700}}>EXPEDIA</div>
                  <div style={{fontSize:11,color:'#5f6368',marginTop:4}}>FLIGHTS · TRIPS</div>
                </div>
                <div style={{padding:'26px 24px'}}>
                  <div style={{fontSize:11,color:'#5f6368',fontWeight:700,letterSpacing:'.08em'}}>{current[0].replaceAll('-',' ').toUpperCase()}</div>
                  <h2 style={{fontSize:28,lineHeight:1.1,margin:'8px 0 12px'}}>Live canonical data required</h2>
                  <p style={{fontSize:14,lineHeight:1.55,color:'#3c4043'}}>
                    This preview intentionally contains no invented passenger, confirmation, flight, fare, ticket, seat or document values. When a real workflow event occurs, the renderer must populate this exact surface from the verified canonical record.
                  </p>
                  <div style={{border:'1px solid #dadce0',marginTop:22}}>
                    <div style={{padding:'15px 16px',background:'#f8f9fa',fontWeight:700}}>Booking information</div>
                    <div style={{padding:16,color:'#5f6368',fontSize:13,lineHeight:1.7}}>
                      Passenger: supplied by canonical traveler record<br/>
                      Itinerary / confirmation: supplied by booking record<br/>
                      Flight segments: supplied by authoritative provider record<br/>
                      Payment: supplied by verified payment record when applicable<br/>
                      Ticket / document: supplied by issued canonical document
                    </div>
                  </div>
                  <p style={{fontSize:11,lineHeight:1.5,color:'#5f6368',marginTop:22,paddingTop:16,borderTop:'1px solid #e8eaed'}}>
                    REFERENCE PREVIEW · Expedia-style information architecture. Provider-issued documents retain their actual issuer identity. No fabricated transactional data is permitted.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
