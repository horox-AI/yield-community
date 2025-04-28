import React from "react";

const experts = [
    {
      name: "John Carter",
      bio: "Buyer's Agent in Sydney | 10+ years experience",
      img: "https://i.pravatar.cc/100?img=1",
      stats: {
        rating: 4.96,
        consultations: 740
      }
    },
    {
      name: "Sophie Nguyen",
      bio: "Real Estate Developer & Mentor",
      img: "https://i.pravatar.cc/100?img=2",
      stats: {
        rating: 4.85,
        consultations: 532
      }
    },
    {
      name: "Luca Bianchi",
      bio: "Italian investor now flipping in Australia",
      img: "https://i.pravatar.cc/100?img=3",
      stats: {
        rating: 4.78,
        consultations: 421
      }
    },
    {
      name: "Mia Patel",
      bio: "Investment Property Strategist",
      img: "https://i.pravatar.cc/100?img=4",
      stats: {
        rating: 4.92,
        consultations: 683
      }
    },
    {
      name: "David Lee",
      bio: "Finance & Mortgage Advisor",
      img: "https://ui-avatars.com/api/?name=David+Lee&background=random&size=100",
      stats: {
        rating: 4.89,
        consultations: 576
      }
    },
    {
      name: "Emily Wright",
      bio: "Renovation Queen | Airbnb Consultant",
      img: "https://ui-avatars.com/api/?name=Emily+Wright&background=random&size=100",
      stats: {
        rating: 4.91,
        consultations: 612
      }
    },
    {
      name: "Carlos Martinez",
      bio: "Multifamily Expert & Coach",
      img: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=random&size=100",
      stats: {
        rating: 4.87,
        consultations: 549
      }
    },
    {
      name: "Laura Chen",
      bio: "Legal Advisor for Real Estate Deals",
      img: "https://ui-avatars.com/api/?name=Laura+Chen&background=random&size=100",
      stats: {
        rating: 4.95,
        consultations: 725
      }
    },
    {
      name: "James Robinson",
      bio: "Commercial RE Developer | 20 years+",
      img: "https://ui-avatars.com/api/?name=James+Robinson&background=random&size=100",
      stats: {
        rating: 4.97,
        consultations: 812
      }
    },
    {
      name: "Fatima Al-Sayed",
      bio: "First-time Home Buyer Specialist",
      img: "https://ui-avatars.com/api/?name=Fatima+Al-Sayed&background=random&size=100",
      stats: {
        rating: 4.82,
        consultations: 493
      }
    },
    {
      name: "Tom Reynolds",
      bio: "Subdivision & Development Coach",
      img: "https://ui-avatars.com/api/?name=Tom+Reynolds&background=random&size=100",
      stats: {
        rating: 4.90,
        consultations: 602
      }
    },
    {
      name: "Natalie Gomez",
      bio: "Real Estate Branding & Marketing Expert",
      img: "https://ui-avatars.com/api/?name=Natalie+Gomez&background=random&size=100",
      stats: {
        rating: 4.81,
        consultations: 468
      }
    }
  ];
 

const ExpertCard = ({ expert }: { expert: { name: string, bio: string, img: string, stats: { rating: number, consultations: number } } }) => {
    return (
        <div className="bg-[#2B4764] rounded-lg overflow-hidden shadow-lg w-full h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-3">
              <img
                src={expert.img}
                alt={expert.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white flex-shrink-0"
              />
              <div>
                <h2 className="text-xl font-semibold text-white">{expert.name}</h2>
                <p className="text-[#9CB3C9] text-sm">{expert.bio}</p>
              </div>
            </div>
            
            <div className="border-t border-[#3a5678] mt-auto pt-3">
              <div className="flex items-center gap-2 text-[#9CB3C9]">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="font-semibold text-white">{expert.stats.rating.toFixed(2)}</span>
                <svg className="w-5 h-5 ml-2 text-[#9CB3C9] fill-current" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                <span className="text-[#9CB3C9]">{expert.stats.consultations} consultations</span>
              </div>
            </div>
          </div>
        </div>
      );
};

const ExpertsDirectory = () => {
  return (
    <div className="min-h-screen bg-bg text-white mb-6 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mt-20 mb-2">Browse Featured Experts</h1>
          <p className="text-lg font-semibold text-slate-400 mb-10 max-w-3xl mx-auto">
             Get expert advice from the top players in real estate. Pay per question, video response, or live call.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {experts.map((expert, index) => (
            <div className="h-[240px] lg:w-[377px] w-full" key={index}>
              <ExpertCard expert={expert} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertsDirectory;