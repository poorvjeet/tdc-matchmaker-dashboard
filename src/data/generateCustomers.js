import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'customers.json');

const firstNamesMale = [
  'Amit', 'Raj', 'Suresh', 'Deepak', 'Vijay', 'Sanjay', 'Manish', 'Nitin', 'Ravi', 'Pankaj',
  'Gaurav', 'Harsh', 'Karan', 'Lalit', 'Mohan', 'Nikhil', 'Om', 'Prateek', 'Ranveer', 'Sachin',
  'Tanmay', 'Uday', 'Varun', 'Yash', 'Zubin', 'Aditya', 'Bharat', 'Chirag', 'Dinesh', 'Eknath',
  'Farhan', 'Girish', 'Hemant', 'Ishaan', 'Jatin', 'Kunal', 'Lokesh', 'Mahesh', 'Naveen', 'Piyush',
  'Rajat', 'Sameer', 'Tushar', 'Utkarsh', 'Vivek', 'Wasim', 'Yogesh', 'Abhishek', 'Bhuvan', 'Chetan',
  'Dhruv', 'Eshan', 'Faizal', 'Govind', 'Harish', 'Indrajit', 'Jagdish', 'Kamal', 'Lakshya', 'Manoj',
  'Neeraj', 'Parag', 'Quasim', 'Raghav', 'Shivam', 'Tribhuvan', 'Umang', 'Vikrant', 'Waqar', 'Yuvraj'
];

const firstNamesFemale = [
  'Neha', 'Pooja', 'Ritu', 'Sunita', 'Kavita', 'Meera', 'Anita', 'Divya', 'Shweta', 'Nandini',
  'Aisha', 'Bhavna', 'Chitra', 'Deepika', 'Ekta', 'Falguni', 'Geetanjali', 'Heena', 'Isha', 'Jyoti',
  'Kajal', 'Lata', 'Mala', 'Nita', 'Pallavi', 'Rashmi', 'Sangeeta', 'Taruna', 'Uma', 'Vandana',
  'Anjali', 'Bina', 'Charulata', 'Damini', 'Esha', 'Gargi', 'Hema', 'Indira', 'Jaya', 'Kiran',
  'Leela', 'Maya', 'Nalini', 'Padma', 'Radhika', 'Sarita', 'Tanya', 'Usha', 'Vimala', 'Yamini',
  'Aditi', 'Barkha', 'Charvi', 'Devika', 'Eesha', 'Garima', 'Harini', 'Ila', 'Janvi', 'Kriti',
  'Lavanya', 'Mridula', 'Navya', 'Ojasvi', 'Parul', 'Rachna', 'Sakshi', 'Tripti', 'Urvi', 'Vasudha'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Malhotra', 'Joshi', 'Rao', 'Nair', 'Menon',
  'Patel', 'Shah', 'Desai', 'Mehta', 'Trivedi', 'Bhatt', 'Pandey', 'Mishra', 'Tiwari', 'Dubey',
  'Reddy', 'Naidu', 'Murthy', 'Iyer', 'Pillai', 'Raj', 'Chopra', 'Arora', 'Saxena', 'Srivastava',
  'Thakur', 'Khan', 'Sheikh', 'Choudhury', 'Das', 'Sarkar', 'Banerjee', 'Mukherjee', 'Roy', 'Sen'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune',
  'Jaipur', 'Lucknow', 'Surat', 'Indore', 'Chandigarh', 'Nagpur', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Coimbatore', 'Guwahati', 'Mysore', 'Thiruvananthapuram', 'Bhubaneswar',
  'Raipur', 'Ranchi', 'Dehradun', 'Agra', 'Varanasi', 'Amritsar', 'Nashik'
];

const colleges = [
  'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur', 'IIT Roorkee',
  'IIT Guwahati', 'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'BITS Pilani', 'IIIT Hyderabad',
  'University of Delhi', 'Mumbai University', 'Pune University', 'Calcutta University',
  'Anna University', 'Osmania University', 'Jadavpur University', 'JNU Delhi',
  'SRM Institute', 'VIT Vellore', 'Manipal University', 'Amity University',
  'LPU Jalandhar', 'IISc Bangalore', 'IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta',
  'XLRI Jamshedpur', 'SP Jain Mumbai', 'NMIMS Mumbai', 'Symbiosis Pune', 'Christ University',
  'St. Stephen\'s Delhi', 'Loyola College Chennai', 'Madras Christian College',
  'Fergusson College', 'Hindu College Delhi', 'Ramjas College'
];

const degrees = [
  'B.Tech', 'M.Tech', 'MBA', 'B.Com', 'M.Com', 'B.A.', 'M.A.', 'B.Sc.', 'M.Sc.',
  'B.E.', 'BBA', 'BCA', 'MCA', 'PhD', 'LLB', 'MBBS', 'BDS', 'B.Arch', 'B.Pharm'
];

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Reliance Industries', 'Tata Consultancy Services',
  'Infosys', 'Wipro', 'HCL Tech', 'Tech Mahindra', 'Goldman Sachs', 'JP Morgan',
  'Deloitte', 'PwC', 'EY', 'KPMG', 'McKinsey & Co', 'BCG', 'Bain & Co',
  'Accenture', 'IBM', 'Cognizant', 'Capgemini', 'Oracle', 'Cisco', 'Intel',
  'Adobe', 'Salesforce', 'Uber', 'OLA', 'Zomato', 'Swiggy', 'Paytm', 'PhonePe',
  'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank',
  'Bharti Airtel', 'Jio', 'Vodafone Idea', 'Adani Group', 'Mahindra Group',
  'Larsen & Toubro', 'Godrej Group', 'Hindustan Unilever', 'Procter & Gamble',
  'Biocon', 'Dr. Reddy\'s Labs', 'Cipla', 'Sun Pharma', 'Zydus',
  'Self Employed', 'Entrepreneur', 'Government Service', 'Indian Army', 'Indian Navy',
  'Indian Air Force', 'IAS Officer', 'IPS Officer', 'Medical Professional',
  'Legal Professional', 'Architecture Firm', 'Education Sector', 'NGO Sector',
  'Media House', 'Real Estate', 'Startup Founder'
];

const designations = [
  'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'Data Scientist',
  'Engineering Manager', 'Tech Lead', 'Full Stack Developer', 'DevOps Engineer',
  'Marketing Manager', 'Creative Director', 'Operations Manager', 'Business Analyst',
  'Financial Analyst', 'Investment Banker', 'Management Consultant', 'Strategy Lead',
  'HR Manager', 'Project Manager', 'Sales Director', 'Account Manager',
  'Research Scientist', 'Senior Scientist', 'Lab Director', 'Professor',
  'Medical Doctor', 'Dentist', 'Architect', 'Lawyer', 'Chartered Accountant',
  'Civil Servant', 'Army Officer', 'Navy Officer', 'Entrepreneur', 'CEO',
  'CTO', 'CFO', 'COO', 'Consultant', 'Analyst', 'Associate',
  'Team Lead', 'Vice President', 'Director', 'Head of Department'
];

const religions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist'];
const castes = ['General', 'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Patel', 'Reddy', 'Naidu', 'Jat', 'Khatri', 'Maratha', 'Rajput', 'Yadav', 'Kurmi', 'Gurjar', 'Lingayat', 'Vokkaliga', 'Nair', 'Ezhava', 'Muslim'];
const motherTonguesList = [
  'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada',
  'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Maithili', 'Sanskrit', 'Bhojpuri', 'Rajasthani'
];

const yesNoMaybe = ['Yes', 'No', 'Maybe'];
const yesNo = ['Yes', 'No'];
const yesNoDk = ['Yes', 'No', 'Don\'t Know'];
const diets = ['Veg', 'Non-Veg', 'Eggetarian'];
const drinks = ['No', 'Social', 'Yes'];
const smokes = ['No', 'Yes', 'Occasionally'];
const familyTypes = ['Nuclear', 'Joint'];
const maritalStatuses = ['Single', 'Single', 'Single', 'Single', 'Single', 'Single', 'Divorced', 'Widowed'];
const siblingOptions = [
  '1 brother', '2 brothers', '1 sister', '2 sisters', '1 brother 1 sister',
  '2 brothers 1 sister', '1 brother 2 sisters', 'No siblings', '3 brothers', '2 sisters 1 brother'
];

const languageGroups = {
  Hindi: ['Hindi', 'English', 'Sanskrit', 'Urdu'],
  Bengali: ['Bengali', 'English', 'Hindi'],
  Telugu: ['Telugu', 'English', 'Hindi'],
  Marathi: ['Marathi', 'English', 'Hindi'],
  Tamil: ['Tamil', 'English', 'Hindi'],
  Urdu: ['Urdu', 'English', 'Hindi'],
  Gujarati: ['Gujarati', 'English', 'Hindi'],
  Kannada: ['Kannada', 'English', 'Hindi'],
  Malayalam: ['Malayalam', 'English', 'Hindi'],
  Punjabi: ['Punjabi', 'English', 'Hindi'],
  Odia: ['Odia', 'English', 'Hindi'],
  Assamese: ['Assamese', 'English', 'Hindi'],
  Rajasthani: ['Rajasthani', 'English', 'Hindi'],
  Bhojpuri: ['Bhojpuri', 'English', 'Hindi'],
};

const appearanceNotesMale = [
  'Tall, athletic build, fair skin tone',
  'Medium height, muscular physique, wheatish complexion',
  'Well-built, professional attire, trimmed beard',
  'Sturdy build, short hair, friendly smile',
  'Athletic frame, sharp features, clean-shaven',
  'Average build, stylish hair, warm eyes',
  'Tall and lean, neat appearance, glasses',
  'Fit physique, trendy style, pleasant demeanor',
  'Broad shoulders, confident posture, well-groomed',
  'Compact build, sharp dresser, engaging smile',
  'Sportsman build, casual style, approachable',
  'Tall, slim build, dark complexion, charismatic',
  'Medium build, bearded, traditional style',
  'Fit and active, modern hairstyle, warm smile',
  'Strong build, professional look, clean shaven'
];

const appearanceNotesFemale = [
  'Petite, long dark hair, expressive eyes',
  'Medium height, wheatish skin tone, elegant style',
  'Tall and graceful, fair complexion, sharp features',
  'Slender build, radiant smile, stylish attire',
  'Average height, glowing skin, traditional wear',
  'Athletic build, short hair, confident demeanor',
  'Petite frame, dimpled smile, fashionable',
  'Elegant posture, long hair, warm expression',
  'Medium build, classic beauty, graceful walk',
  'Tall, slim, modern style, bright eyes',
  'Curvy figure, beautiful smile, traditional taste',
  'Slim build, fair skin, sophisticated look',
  'Athletic physique, trendy appearance, vibrant',
  'Delicate features, warm personality, graceful',
  'Striking eyes, confident posture, elegant'
];

const aboutMeTemplates = [
  "Tech professional passionate about innovation and continuous learning. I enjoy {hobby1} and {hobby2}. Looking for a partner who values {value1} and {value2}.",
  "Creative soul with a love for {hobby1} and {hobby2}. I believe in living life to the fullest. Seeking someone who shares my enthusiasm for {value1} and {value2}.",
  "Career-driven individual with a passion for {hobby1}. In my free time I enjoy {hobby2}. Looking for a partner who is {value1} and {value2}.",
  "Simple-hearted person who enjoys {hobby1} and {hobby2}. Family is very important to me. Seeking a partner who values {value1} and {value2}.",
  "Ambitious professional who loves {hobby1} and {hobby2}. I appreciate the finer things in life. Looking for someone {value1} and {value2}.",
  "Adventure enthusiast who loves {hobby1} and {hobby2}. I'm always up for trying new things. Seeking a partner who is {value1} and {value2}.",
  "Thoughtful and grounded individual. I enjoy {hobby1} and {hobby2} in my spare time. Looking for a partner who values {value1} and {value2}.",
  "Fitness enthusiast who also loves {hobby1} and {hobby2}. I maintain a balanced lifestyle. Seeking someone {value1} and {value2}.",
  "Foodie at heart who enjoys {hobby1} and {hobby2}. I love exploring new cuisines. Looking for a partner who is {value1} and shares my love for {value2}.",
  "Spiritual person who finds peace in {hobby1} and {hobby2}. Family traditions matter to me. Seeking a partner who is {value1} and {value2}.",
  "Book lover and {hobby1} enthusiast. I enjoy deep conversations and {hobby2}. Looking for someone {value1} and {value2}.",
  "Music lover who enjoys {hobby1} and {hobby2}. I'm an optimist who believes in {value1}. Seeking a partner who is {value2} and adventurous.",
  "Travel enthusiast who has explored {hobby1} and loves {hobby2}. I'm looking for a life partner who is {value1} and {value2}.",
  "Homebody who enjoys {hobby1} and {hobby2}. I value {value1} above all. Seeking someone who is {value2} and caring.",
  "Social butterfly who loves {hobby1} and {hobby2}. I enjoy {value1} and good company. Looking for a partner who is {value2} and fun-loving."
];

const hobbies = [
  'traveling', 'photography', 'cooking', 'reading', 'hiking', 'swimming', 'yoga',
  'painting', 'dancing', 'singing', 'playing guitar', 'gardening', 'cycling',
  'running', 'meditation', 'writing', 'blogging', 'gaming', 'watching movies',
  'exploring new restaurants', 'camping', 'bird watching', 'pottery', 'calligraphy',
  'playing chess', 'badminton', 'table tennis', 'trekking', 'volunteering',
  'learning new languages', 'cricket', 'football', 'basketball', 'tennis'
];

const values = [
  'family', 'tradition', 'ambition', 'kindness', 'honesty', 'humor',
  'independence', 'loyalty', 'intellect', 'simplicity', 'adventure',
  'compassion', 'integrity', 'creativity', 'empathy', 'resilience',
  'generosity', 'optimism', 'patience', 'respect'
];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function generateAge(rng, isFemale) {
  if (isFemale) {
    return 23 + Math.floor(rng() * 18);
  }
  return 24 + Math.floor(rng() * 18);
}

function generateIncome(age, gender, rng) {
  let base;
  if (age < 26) {
    base = 4 + Math.floor(rng() * 8);
  } else if (age < 31) {
    base = 6 + Math.floor(rng() * 16);
  } else if (age < 36) {
    base = 8 + Math.floor(rng() * 28);
  } else {
    base = 10 + Math.floor(rng() * 40);
  }
  if (gender === 'female') {
    base = Math.max(3, base - Math.floor(rng() * 4));
  }
  return Math.round(base);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const existingIds = new Set(data.customers.map(c => c.id));
let nextIdNum = 81;

const newCustomers = [];

for (let i = 0; i < 30; i++) {
  const numId = String(nextIdNum).padStart(3, '0');
  const id = `C${numId}`;
  nextIdNum++;
  
  const seed = i * 97 + 42;
  const rng = seededRandom(seed);
  
  const isMale = rng() > 0.48;
  const firstName = isMale ? pick(firstNamesMale, rng) : pick(firstNamesFemale, rng);
  const lastName = pick(lastNames, rng);
  const gender = isMale ? 'male' : 'female';
  const age = generateAge(rng, !isMale);
  const year = 2026 - age;
  const month = String(1 + Math.floor(rng() * 12)).padStart(2, '0');
  const day = String(1 + Math.floor(rng() * 28)).padStart(2, '0');
  const dob = `${year}-${month}-${day}`;
  
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${numId}@example.com`;
  const phoneNum = `+91 ${90000 + Math.floor(rng() * 99999)} ${10000 + Math.floor(rng() * 89999)}`;
  
  const city = pick(cities, rng);
  const college = pick(colleges, rng);
  const degree = pick(degrees, rng);
  const incomeLpa = generateIncome(age, gender, rng);
  const income = `${incomeLpa}LPA`;
  
  const company = pick(companies, rng);
  const designation = pick(designations, rng);
  const maritalStatus = pick(maritalStatuses, rng);
  
  const motherTongue = pick(motherTonguesList, rng);
  const langOpts = languageGroups[motherTongue] || [motherTongue, 'English', 'Hindi'];
  const languages = [motherTongue, 'English'];
  if (rng() > 0.5 && langOpts.length > 2) {
    languages.push(langOpts[2]);
  }
  
  const religion = pick(religions, rng);
  let caste = pick(castes, rng);
  if (religion !== 'Hindu') {
    caste = religion === 'Muslim' ? 'Muslim' : religion === 'Sikh' ? 'Sikh' : religion === 'Christian' ? 'Christian' : religion === 'Jain' ? 'Jain' : 'Buddhist';
  }
  
  const familyMult = 1.5 + rng() * 2.0;
  const annualFamilyIncome = `${Math.round(incomeLpa * familyMult)}LPA`;
  
  const siblings = pick(siblingOptions, rng);
  
  const appearanceNotes = isMale ? pick(appearanceNotesMale, rng) : pick(appearanceNotesFemale, rng);
  
  const hobby1 = pick(hobbies, rng);
  let hobby2 = pick(hobbies, rng);
  while (hobby2 === hobby1) {
    hobby2 = pick(hobbies, rng);
  }
  const value1 = pick(values, rng);
  let value2 = pick(values, rng);
  while (value2 === value1) {
    value2 = pick(values, rng);
  }
  
  const template = pick(aboutMeTemplates, rng);
  const aboutMe = template
    .replace('{hobby1}', hobby1)
    .replace('{hobby2}', hobby2)
    .replace('{value1}', value1)
    .replace('{value2}', value2);
  
  const height = isMale ? 165 + Math.floor(rng() * 20) : 152 + Math.floor(rng() * 18);
  
  const profile = {
    id,
    firstName,
    lastName,
    gender,
    age,
    dob,
    country: 'India',
    city,
    height,
    email,
    phone: phoneNum,
    college,
    degree,
    income,
    company,
    designation,
    maritalStatus,
    languages,
    caste,
    religion,
    wantKids: pick(yesNoMaybe, rng),
    openToRelocate: pick(yesNoMaybe, rng),
    openToPets: pick(yesNoMaybe, rng),
    manglik: religion === 'Hindu' ? pick(yesNoDk, rng) : 'No',
    motherTongue,
    familyType: pick(familyTypes, rng),
    diet: pick(diets, rng),
    drinking: pick(drinks, rng),
    smoking: pick(smokes, rng),
    horoscopeMatchRequired: religion === 'Hindu' ? pick(yesNo, rng) : 'No',
    annualIncome: income,
    appearanceNotes,
    aboutMe,
    siblings,
    annualFamilyIncome
  };
  
  newCustomers.push(profile);
}

data.customers.push(...newCustomers);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${newCustomers.length} new customers. Total: ${data.customers.length}`);
