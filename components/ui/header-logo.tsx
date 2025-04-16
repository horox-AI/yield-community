import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/images/logo.svg'
import Logo5 from '@/public/images/yield4.png'



export default function HeaderLogo() {
  return (
    <div className="shrink-0 mr-2 relative h-10 w-10 sm:h-12 sm:w-12 lg:h-12 lg:w-12">

      {/* Logo */}
      <Link href="/" aria-label="Cruip" passHref>
        <div className="block group h-full w-full">
          <Image src={Logo5} fill objectFit="contain" priority alt="Community" />
        </div>
      </Link>
    </div>
 );
}
