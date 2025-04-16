import Image from 'next/image'
import Illustration from '@/public/images/hero-illustration.svg'
import HeroImage from '@/public/images/hero-image.png'
import Client01 from '@/public/images/client-01.svg'
import Client02 from '@/public/images/client-02.svg'
import Client03 from '@/public/images/client-03.svg'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-800 bg-opacity-60 pointer-events-none -z-10" aria-hidden="true" />

      {/* Illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" priority alt="Hero Illustration" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-28 pb-8 md:pt-36 md:pb-16">
          {/* Hero content */}
          <div className="relative max-w-xl mx-auto md:max-w-none text-center md:text-left flex flex-col md:flex-row">
            {/* Content */}
            <div className="md:w-[48rem]">
              {/* Copy */}
              <div className="md:pr-32">
                <h1 className="h2 font-aspekta bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-sky-300 to-slate-200 pb-6">
                  A community of makers that learn and grow together
                </h1>
                <p className="text-lg text-slate-400 mb-8">
                  Our landing page template works on all devices, so you only have to set it up once, and get beautiful results forever.
                </p>
              </div>
              {/* Logos */}
              <div className="md:flex flex-wrap items-center md:space-x-5 text-center">
                {/* Label */}
                <div className="mb-4 md:mb-0">
                  <div className="text-sm italic text-slate-500 whitespace-nowrap">Catch up with founders from</div>
                </div>
                <div className="inline-flex flex-wrap items-center">
                  <div className="py-2 px-3">
                    <Image src={Client01} alt="Client 01" />
                  </div>
                  <div className="py-2 px-3">
                    <Image src={Client02} alt="Client 02" />
                  </div>
                  <div className="py-2 px-3">
                    <Image src={Client03} alt="Client 03" />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="max-w-sm mx-auto md:max-w-none md:absolute md:left-[42rem] lg:left-[48rem] mt-12 md:mt-0 md:top-1/2 md:-translate-y-1/2">
                <Image src={HeroImage} className="md:max-w-none mx-auto" width="332" height="298" alt="Hero Illustration" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}