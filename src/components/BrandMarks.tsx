import Image from 'next/image';

export default function BrandMarks(){
  const expedia=process.env.NEXT_PUBLIC_EXPEDIA_LOGO_URL;
  const group=process.env.NEXT_PUBLIC_EXPEDIA_GROUP_LOGO_URL;
  if(!expedia && !group) return null;
  return <div className="brandMarks" aria-label="Travel industry references">
    {group&&<Image src={group} alt="Expedia Group" width={150} height={32} unoptimized />}
    {expedia&&<Image src={expedia} alt="Expedia" width={120} height={32} unoptimized />}
  </div>;
}
