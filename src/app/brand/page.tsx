import Link from 'next/link';
import BrandMarks from '@/components/BrandMarks';

export default function BrandPage(){
  return <main className="publicPage"><header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><Link href="/access" className="agentAccess">Sign in</Link></header><section className="publicSection"><div className="publicEyebrow">INDUSTRY REFERENCES</div><h1>Travel ecosystem</h1><p className="subtitle">Approved brand assets can be displayed here without making them part of Expodia Flights identity.</p><BrandMarks/></section></main>;
}
