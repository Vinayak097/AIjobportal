const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-recommender')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Sample job data
const jobData = [
  {
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'New York, NY',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing responsive designs.',
    requirements: 'Proficiency in HTML, CSS, JavaScript, and modern frontend frameworks like React or Vue.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'],
    jobType: 'remote',
    experienceLevel: 'mid',
    salary: '$80,000 - $100,000'
  },
  {
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'San Francisco, CA',
    description: 'Join our backend team to develop robust APIs and server-side applications. You will work with databases and implement business logic.',
    requirements: 'Experience with Node.js, Express, and database technologies like MongoDB or PostgreSQL.',
    skills: ['Node.js', 'Express', 'MongoDB', 'API Development', 'JavaScript'],
    jobType: 'onsite',
    experienceLevel: 'senior',
    salary: '$120,000 - $150,000'
  },
  {
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    description: 'We need a versatile Full Stack Developer who can work on both frontend and backend aspects of our web applications.',
    requirements: 'Proficiency in JavaScript, React, Node.js, and database technologies.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Full Stack'],
    jobType: 'remote',
    experienceLevel: 'mid',
    salary: '$90,000 - $120,000'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    description: 'Help us build and maintain our cloud infrastructure. You will be responsible for deployment pipelines and system reliability.',
    requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    jobType: 'hybrid',
    experienceLevel: 'senior',
    salary: '$130,000 - $160,000'
  },
  {
    title: 'UI/UX Designer',
    company: 'CreativeMinds',
    location: 'Austin, TX',
    description: 'Design beautiful and intuitive user interfaces for our web and mobile applications. Create wireframes, prototypes, and visual designs.',
    requirements: 'Proficiency in design tools like Figma or Adobe XD. Understanding of user-centered design principles.',
    skills: ['UI Design', 'UX Design', 'Figma', 'Wireframing', 'Prototyping'],
    jobType: 'remote',
    experienceLevel: 'mid',
    salary: '$85,000 - $110,000'
  },
  {
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    description: 'Analyze large datasets to extract insights and build predictive models. Work with machine learning algorithms and data visualization.',
    requirements: 'Strong background in statistics, machine learning, and programming languages like Python or R.',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics', 'SQL'],
    jobType: 'onsite',
    experienceLevel: 'senior',
    salary: '$140,000 - $170,000'
  },
  {
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Chicago, IL',
    description: 'Develop native or cross-platform mobile applications for iOS and Android. Implement features and ensure smooth user experience.',
    requirements: 'Experience with React Native, Flutter, or native iOS/Android development.',
    skills: ['React Native', 'Mobile Development', 'JavaScript', 'UI/UX', 'API Integration'],
    jobType: 'hybrid',
    experienceLevel: 'mid',
    salary: '$95,000 - $125,000'
  },
  {
    title: 'QA Engineer',
    company: 'QualityFirst',
    location: 'Denver, CO',
    description: 'Ensure the quality of our software products through manual and automated testing. Identify bugs and work with developers to resolve issues.',
    requirements: 'Experience with testing methodologies, test automation frameworks, and bug tracking tools.',
    skills: ['Test Automation', 'Selenium', 'QA Methodologies', 'Bug Tracking', 'JavaScript'],
    jobType: 'remote',
    experienceLevel: 'entry',
    salary: '$70,000 - $90,000'
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert new jobs
    await Job.insertMany(jobData);
    console.log('Added sample jobs to the database');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
