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
                            Real estate is changing. Whether you're buying your first home, scaling a portfolio, or building with strategy — having the right knowledge and
                            community behind you can make all the difference.
                          </p>
                          <p className="italic pl-3 border-l-2 border-slate-600">
                            That's why we built this — a space where smart investors, professionals, and curious learners connect, share, and grow together.
                          </p>
                          <p>
                            Our community forum is open, transparent, and designed for real-world real estate. From residential flips to commercial finance — it's a place to ask,
                            explore, and get clarity without the noise.
                          </p>

                          <div className="image-wrapper">
                            <Image src={PostImage} width="624" height="352" alt="Post image" />
                          </div>

                          <p>
                            On top of that, we’ve built a way for you to go deeper: book 1-on-1 calls, request custom video responses, or get written advice from trusted experts
                            across every stage of the property game.
                            <strong className="font-medium text-slate-200"> No fluff, no gatekeeping — just straight-up insight from people who’ve done it.</strong>
                          </p>

                          <h2 className="text-xl font-bold text-slate-200">Why We Exist</h2>
                          <h3 className="text-lg font-bold text-slate-200">Make Real Estate Human Again</h3>
                          <p>
                            Real estate can be intimidating, overwhelming, and sometimes lonely. We want to fix that. This platform is here to connect good people doing great work
                            — whether you're just starting out or 50 properties deep.
                          </p>

                          <h3 className="text-lg font-bold text-slate-200">Built With Intent</h3>
                          <p>
                            We're building tools and a space that lasts — for those who want clarity, connection, and smart decisions in property. 
                            Join us, explore the forum, and if you need real answers — reach out to our vetted experts.
                          </p>
                          <div className="text-center max-w-3xl mx-auto pt-20">
                              <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
                              <p className="mt-4 text-lg text-slate-400">
                                Ask anything. Pick an expert. Get real answers — fast.  
                                From quick written advice to short video calls, it’s all built to give you clarity when you need it.
                              </p>
                            </div>


                                <div className="grid md:grid-cols-3 gap-6 pt-6">
                                  {/* Step 1 */}
                                      <div className="flex flex-col items-start bg-slate-800 p-6 rounded-2xl shadow-md">
                                        <div className="text-indigo-400 mb-4">
                                          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.847.755 6.879 2.042M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                          </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200 mb-2">Pick an Expert</h3>
                                        <p className="text-slate-400 text-sm">
                                          Choose from vetted investors, agents, builders, or finance pros — real people with real experience.
                                        </p>
                                      </div>

                                   {/* Step 2 */}

                                    <div className="flex flex-col items-start bg-slate-800 p-6 rounded-2xl shadow-md">
                                    <div className="text-indigo-400 mb-4">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6"></path>
                                      </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Post a Question</h3>
                                    <p className="text-slate-400 text-sm">
                                      Ask the community or request private advice. Choose between a written reply or a 15-min call.
                                    </p>
                                  </div>

                                  
                               

                                  {/* Step 3 */}
                                  <div className="flex flex-col items-start bg-slate-800 p-6 rounded-2xl shadow-md">
                                    <div className="text-indigo-400 mb-4">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0-4.418-3.582-8-8-8S5 7.582 5 12s3.582 8 8 8 8-3.582 8-8z"></path>
                                      </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Get Clear Answers</h3>
                                    <p className="text-slate-400 text-sm">
                                      Get tailored advice via chat, or book a short video call. No fluff — just straight insight.
                                    </p>
                                  </div>
                                </div>

                        </div>

                
              </div>
            </div>

            

          </div>
        </div>
      </section> 
    </>
  )
}