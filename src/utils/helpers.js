/**
 * helpers.js – Reusable utility functions
 */

/**
 * Returns a high-quality Clearbit logo URL for a given company name.
 * Uses a predefined mapping for accuracy, otherwise falls back to a guessed domain.
 *
 * @param {string} companyName - The name of the company (e.g. "Google", "TCS")
 * @returns {string} URL to the Clearbit logo
 */
export function getCompanyLogo(companyName) {
  if (!companyName) return '/default-logo.svg';

  const cleanName = companyName.trim().toLowerCase();

  // Known mapping for popular companies to ensure correct domain
  const domainMap = {
    'google': 'google.com',
    'microsoft': 'microsoft.com',
    'amazon': 'amazon.com',
    'meta': 'meta.com',
    'facebook': 'facebook.com',
    'apple': 'apple.com',
    'netflix': 'netflix.com',
    'adobe': 'adobe.com',
    'adobe systems': 'adobe.com',
    'stripe': 'stripe.com',
    'uber': 'uber.com',
    'airbnb': 'airbnb.com',
    'spotify': 'spotify.com',
    'tesla': 'tesla.com',
    'twitter': 'twitter.com',
    'x': 'x.com',
    'tcs': 'tcs.com',
    'tata consultancy services': 'tcs.com',
    'infosys': 'infosys.com',
    'wipro': 'wipro.com',
    'hcl': 'hcltech.com',
    'hcl technologies': 'hcltech.com',
    'cognizant': 'cognizant.com',
    'ibm': 'ibm.com',
    'oracle': 'oracle.com',
    'salesforce': 'salesforce.com',
    'deloitte': 'deloitte.com',
    'accenture': 'accenture.com',
    'flipkart': 'flipkart.com',
    'paytm': 'paytm.com',
    'zomato': 'zomato.com',
    'swiggy': 'swiggy.com',
    'razorpay': 'razorpay.com',
  };

  // Google Favicon API — free, no auth, returns 128px icons
  const getFaviconUrl = (domain) =>
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://${domain}`;

  // 1. Check if we have a known mapping
  const domain = domainMap[cleanName];
  if (domain) {
    return getFaviconUrl(domain);
  }

  // 2. Fallback: guess the domain (lowercase, remove spaces, add .com)
  const guessedDomain = cleanName.replace(/[^a-z0-9]/g, '') + '.com';
  return getFaviconUrl(guessedDomain);
}

/**
 * Generates realistic, randomized seed data for the "Reset All Data" feature.
 * Ensures the UI looks populated but with varying data each time it's reset.
 */
export function generateDynamicSeedData() {
  const companies = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Swiggy', 'Zomato', 'Netflix', 'Airbnb', 'Stripe', 'Uber', 'TCS', 'Infosys', 'Wipro'];
  const roles = ['Frontend Developer', 'React Developer', 'Full Stack Engineer', 'Software Engineer', 'Backend Developer', 'UI/UX Designer', 'Product Manager'];
  const locations = ['Remote', 'Bangalore', 'Hyderabad', 'Pune', 'Gurgaon', 'Noida', 'Mumbai', 'Chennai'];
  const platforms = ['LinkedIn', 'Naukri', 'Instahyre', 'Company Website', 'Referral', 'AngelList', 'Wellfound'];
  const priorities = ['High', 'Medium', 'Low'];

  // Helper to get a random item from an array
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Helper to get a random date N days ago/ahead (returned as YYYY-MM-DD)
  const getDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  // We want to generate a mix of statuses so the dashboard looks good
  const template = [
    { status: 'Interview', offsetApplied: -20, offsetInterview: -2,  notes: 'Had a great phone screen. Waiting for technical round.' },
    { status: 'Applied',   offsetApplied: -5,  notes: 'Applied through referral. Waiting to hear back.' },
    { status: 'Rejected',  offsetApplied: -45, offsetInterview: -30, offsetResult: -20, notes: 'Did not clear the DSA round.' },
    { status: 'Offer',     offsetApplied: -50, offsetInterview: -35, offsetResult: -20, offsetOffer: -15, notes: 'GOT THE OFFER! Start date next month.' },
    { status: 'To Apply',  offsetDeadline: 15, notes: 'Interesting startup. Need to update my resume before applying.' },
    { status: 'Waiting',   offsetApplied: -25, offsetInterview: -5,  offsetResult: 10, notes: 'Interview went well. Waiting for HR to revert.' },
  ];

  return template.map((temp) => {
    const baseAmount = Math.floor(Math.random() * 80) * 1000 + 80000; // 80k to 160k
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      company: getRandom(companies),
      role: getRandom(roles),
      location: getRandom(locations),
      salary: String(baseAmount),
      platform: getRandom(platforms),
      priority: getRandom(priorities),
      status: temp.status,
      deadlineToApply: temp.offsetDeadline !== undefined ? getDate(temp.offsetDeadline) : '',
      appliedDate: temp.offsetApplied !== undefined ? getDate(temp.offsetApplied) : '',
      interviewDate: temp.offsetInterview !== undefined ? getDate(temp.offsetInterview) : '',
      resultDate: temp.offsetResult !== undefined ? getDate(temp.offsetResult) : '',
      offerDate: temp.offsetOffer !== undefined ? getDate(temp.offsetOffer) : '',
      rejectionDate: temp.status === 'Rejected' && temp.offsetResult ? getDate(temp.offsetResult) : '',
      notes: temp.notes,
      bookmarked: Math.random() > 0.6, // 40% chance of being bookmarked
    };
  });
}
