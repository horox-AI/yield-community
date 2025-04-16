// Using CommonJS require syntax instead of ES module imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connect = require('../utils/config/database').default;
const Post = require('../utils/models/post').default;

// Load environment variables
dotenv.config();

// Array of real estate investment topics
const topics = [
  "Rental Strategies",
  "House Flipping",
  "Market Trends",
  "Financing Tips",
  "Legal Aspects",
  "Property Tax Hacks",
  "REITs",
  "Commercial Real Estate",
  "Vacation Rentals",
  "Property Management"
] as const;

// Define a type for the topics
type TopicType = typeof topics[number];

// Array of realistic author names
const authors = [
  { name: "John Smith", email: "john.smith@example.com", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Emma Williams", email: "emma.williams@example.com", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Michael Johnson", email: "michael.johnson@example.com", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Sophia Brown", email: "sophia.brown@example.com", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  { name: "Robert Davis", email: "robert.davis@example.com", image: "https://randomuser.me/api/portraits/men/5.jpg" }
];

// Function to generate detailed content based on topic
const generateContent = (topic: TopicType): string => {
  const contents = {
    "Rental Strategies": "When investing in rental properties, it's crucial to understand your target market. Urban apartments attract different demographics than suburban single-family homes. Consider implementing smart home technology to command higher rents and reduce vacancy rates. My latest property saw a 15% increase in rental income after installing smart thermostats, keyless entry, and security cameras. Additionally, offering flexible lease terms can help you attract quality tenants who might be hesitant to commit to a full year lease initially.",
    
    "House Flipping": "Success in house flipping comes down to the 70% rule: never pay more than 70% of the After Repair Value (ARV) minus repair costs. I recently flipped a property in an emerging neighborhood, purchasing for $180,000, investing $40,000 in renovations, and selling for $320,000. The key was focusing on kitchen and bathroom upgrades that had the highest ROI. Always build a 15-20% contingency into your renovation budget for unexpected issues, and develop relationships with reliable contractors who can work within tight timelines.",
    
    "Market Trends": "The real estate market is showing interesting shifts in 2023. With interest rates stabilizing, we're seeing increased activity in the mid-market segment. Data from the National Association of Realtors indicates a 3.8% year-over-year increase in median home prices, with particularly strong growth in secondary cities as remote work continues to influence migration patterns. Investors should watch for opportunities in growing metropolitan areas with strong job markets and affordability advantages compared to primary markets.",
    
    "Financing Tips": "Creative financing can significantly boost your real estate returns. Consider using a HELOC (Home Equity Line of Credit) to fund down payments on new investment properties. This allows you to leverage existing equity without going through conventional financing. For larger projects, explore commercial portfolio loans that allow you to bundle multiple properties under one financing vehicle, potentially saving on closing costs and providing more favorable terms. Always compare at least 3-4 lenders to ensure competitive rates.",
    
    "Legal Aspects": "Protecting your real estate investments through proper legal structures is non-negotiable. I've found that using a Series LLC structure provides significant liability protection while maintaining flexibility for tax purposes. Consult with a real estate attorney to determine the optimal structure based on your state's laws. Additionally, ensure your leases are comprehensive and comply with local regulations. Having a well-drafted lease has saved me thousands in potential disputes with tenants.",
    
    "Property Tax Hacks": "Many investors overlook the potential for property tax reductions. I successfully appealed the assessment on three of my properties last year, saving over $4,200 annually. The key is to gather compelling comparable sales data that supports your case for a lower valuation. Additionally, explore available exemptions or abatements in your jurisdiction - many localities offer incentives for energy-efficient upgrades or historical preservation that can significantly reduce your tax burden.",
    
    "REITs": "Real Estate Investment Trusts offer excellent exposure to real estate without the headaches of direct ownership. When evaluating REITs, look beyond dividend yield to metrics like Funds From Operations (FFO) and debt-to-EBITDA ratios. I've found that specialized REITs focusing on data centers and logistics properties have outperformed traditional retail and office REITs in recent years. Consider allocating 5-10% of your investment portfolio to a diverse mix of REITs for exposure to different real estate sectors.",
    
    "Commercial Real Estate": "The commercial real estate landscape is evolving rapidly post-pandemic. While office spaces face challenges, industrial and logistics properties continue to see strong demand driven by e-commerce growth. Cap rates for well-located industrial properties in primary markets have compressed to 4-5%, reflecting strong investor confidence. When analyzing commercial opportunities, focus on tenant quality, lease duration, and triple-net structure potential to ensure stable cash flows.",
    
    "Vacation Rentals": "Short-term rentals can generate 2-3x the income of traditional long-term rentals, but they require more active management. I've optimized my vacation rental portfolio by investing in professional photography, dynamic pricing software, and streamlined check-in processes. Properties with unique features or optimal locations can achieve occupancy rates above 80% year-round. Consider the seasonality of your market and have strategies to maximize bookings during shoulder seasons through targeted promotions.",
    
    "Property Management": "Effective property management is the difference between a passive investment and a second job. I've implemented systems that automate rent collection, maintenance requests, and tenant screening, reducing my management time by 70%. For multi-family properties, consider on-site management once you reach 16+ units. The cost is offset by higher occupancy rates, better tenant satisfaction, and reduced turnover. Always maintain a capital expenditure reserve of at least 5% of gross rents to address major repairs without stressing your cash flow."
  };
  
  return contents[topic] || 
    `Investing in ${topic} requires careful market analysis and strategic planning. The current real estate landscape presents both challenges and opportunities in this sector. Based on my experience, focusing on location quality, understanding financing options, and maintaining a long-term perspective yields the best results. Always conduct thorough due diligence before committing capital to any property investment.`;
};

// Generate 25 unique posts with real estate investment content
const generatePosts = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const topic = topics[i % topics.length];
    const author = authors[i % authors.length];
    const daysAgo = Math.floor(Math.random() * 30); // Random date within last month
    const postDate = new Date();
    postDate.setDate(postDate.getDate() - daysAgo);
    
    // Format the date as MM DD (e.g., "Apr 15")
    const formattedDate = `${postDate.toLocaleString('default', { month: 'short' })} ${postDate.getDate()}`;
    
    return {
      title: `${topic}: ${["Expert Strategies", "Market Insights", "Investment Guide", "Profit Maximization", "Risk Mitigation"][i % 5]} for 2023`,
      content: generateContent(topic),
      author: author.name,
      authorEmail: author.email,
      date: formattedDate,
      votes: Math.floor(Math.random() * 50),
      userVoted: Math.random() > 0.5,
      comments: Math.floor(Math.random() * 20),
      authorImage: author.image,
      commenters: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `user${j + 1}`),
    };
  });
};

// Main function to populate the database
const populateRealEstatePosts = async () => {
  try {
    // Connect to the database
    await connect();
    console.log('Connected to the database');
    
    // Generate the sample posts
    const samplePosts = generatePosts();
    
    // Insert the posts into the database
    await Post.insertMany(samplePosts);
    console.log('Successfully added 25 real estate investment posts to the database!');
    
  } catch (error) {
    console.error('Error populating posts:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
populateRealEstatePosts(); 