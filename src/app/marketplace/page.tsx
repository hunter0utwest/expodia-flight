'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Listing = {
  id:string; provider_id:string|null; category:string; title:string; description:string|null;
  location_name:string|null; country_code:string|null; hero_image_url:string|null;
  gallery_image_urls:string[]; details:Record<string,unknown>; source_url:string|null;
  booking_url:string|null; price_amount:number|null; price_currency:string|null;
  price_period:string|null; availability_status:string; last_verified_at:string|null;
};

export default function MarketplacePage() {
  const [q,setQ]=useState(''), [category,setCategory]=useState(''), [items,setItems]=useState<Listing[]>([]), [loading,setLoading]=useState(false);
  async function search() {
    setLoading(true);
    const r=await fetch('/api/marketplace?' + new URLSearchParams({q,category}),{cache:'no-store'});
    setItems(r.ok ? await r.json() : []);
    setLoading(false);
  }
  useEffect(()=>{void search()},[]);
  return <main className="publicPage">
    <header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/track">Track</Link><Link href="/traveler">My journeys</Link><Link href="/assistant">Assistant</Link><Link href="/access" className="agentAccess">Sign in</Link></nav></header>
    <section className="publicSection publicPageIntro">
      <div className="publicEyebrow">TRAVEL MARKETPLACE</div><h1>Find the pieces of the journey.</h1>
      <p>Stays, vacation rentals, cars, transfers, activities, cruises and packages appear here only when Expodia has verified source data and an approved booking or referral path.</p>
      <form className="trackForm" onSubmit={e=>{e.preventDefault();void search()}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search destination, property or experience"/>
        <select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All</option><option value="STAY">Stays</option><option value="VACATION_RENTAL">Vacation rentals</option><option value="CAR">Cars</option><option value="TRANSFER">Transfers</option><option value="ACTIVITY">Activities</option><option value="CRUISE">Cruises</option><option value="PACKAGE">Packages</option></select>
        <button className="publicPrimary">{loading?'Searching…':'Search'}</button>
      </form>
      {items.length===0 && !loading ? <div className="planningEmpty">No verified marketplace listings match this search yet. Expodia will not invent properties, images, prices or availability.</div> :
      <div className="marketplaceGrid">{items.map(item=><article className="marketplaceCard" key={item.id}>
        {item.hero_image_url?<img src={item.hero_image_url} alt="" loading="lazy"/>:<div className="marketplaceImagePlaceholder">Provider image pending</div>}
        <div className="marketplaceCardBody"><span className="publicEyebrow">{item.category}</span><h2>{item.title}</h2>{item.location_name&&<p>{item.location_name}</p>}{item.description&&<p>{item.description}</p>}{item.price_amount!=null&&<strong>{item.price_currency||''} {item.price_amount} {item.price_period?'· '+item.price_period:''}</strong>}<div className="marketplaceActions">{item.source_url&&<a className="publicSecondary" href={item.source_url} target="_blank" rel="noreferrer">View source</a>}{item.booking_url&&<a className="publicPrimary" href={item.booking_url} target="_blank" rel="noreferrer">Continue</a>}</div><small>Last verified: {item.last_verified_at?new Date(item.last_verified_at).toLocaleString():'Not verified'}</small></div>
      </article>)}</div>}
    </section>
  </main>;
}