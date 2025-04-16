export const metadata = {
  title: 'Start - Community',
  description: 'Page description',
}
import Hero from '@/components/hero'

import Image from 'next/image'
import PostImage from '@/public/images/post-image.jpg'


export default function Start() {
  return (
    <>
      <Hero />

      {/* Page content */}
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="md:flex md:justify-between md:divide-x md:divide-slate-800">

            {/* Main content */}
            <div className="md:grow pt-6 pb-12 md:pb-20">
              <div className="md:pr-6 lg:pr-10">

              <div className="text-slate-400 space-y-6">
                        <p>
                          SaaS adoption is snowballing. A recent Harvey Nash survey revealed that SaaS was voted the most important technology in helping
                          achieve business goals.
                        </p>
                        <p className="italic pl-3 border-l-2 border-slate-600">
                          Metrics research found that organizations with more than 1,000 employees use over 150 SaaS applications 🙌
                        </p>
                        <p>
                          Products within the SaaS industry serve an immense number of functions. While some are intended to cater to the specific needs of a
                          particular group of users, others help a hugely diverse client base, providing solutions to a broader market. This critical
                          distinction has resulted in two key SaaS models:{' '}
                          <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                            vertical and horizontal
                          </a>
                          .
                        </p>
                            
                              <div className="image-wrapper">
                                 <Image src={PostImage} width="624" height="352" alt="Post image" />
                              </div>
                        <p>
                          If you're thinking of becoming part of the SaaS industry, you'll need to clearly understand these{' '}
                          <strong className="font-medium text-slate-200">two different models and determine which one is right for your business</strong>.
                          Simply put - the better your understanding of these services, the higher your chances of success are.
                        </p>
                        <h2 className="text-xl font-bold text-slate-200">The 7 Key Differences Between Vertical and Horizontal SaaS</h2>
                        <h3 className="text-lg font-bold text-slate-200">Scope of Industries and Market Size</h3>
                        <p>
                          The vertical SaaS business model is an end-to-end solution designed for the needs of a specific sector. These solutions' software
                          features are specially designed to streamline particular industry operations. On the other hand, horizontal SaaS solutions are less
                          industry-personalized and more problem-oriented. Their increased applicability across several industries sets them apart from
                          horizontal SaaS.
                        </p>
                        <h3 className="text-lg font-bold text-slate-200">Customer Acquisition and Retention Approaches</h3>
                        <p>
                          In the vertical SaaS model, acquiring customers takes less time and effort than in horizontal SaaS. As you can imagine, if only a
                          few businesses offer solutions to a niche problem, customers will likely choose a business and stick with it. Make sure you have a
                          look over our SaaS customer acquisition guide, as it might come in handy.
                        </p>
                      </div>

                
              </div>
            </div>

            

          </div>
        </div>
      </section> 
    </>
  )
}