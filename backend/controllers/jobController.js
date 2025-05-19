const Job = require('../models/Job');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create a new job (for seeding purposes)
exports.createJob = async (req, res) => {
  const {
    title,
    company,
    location,
    description,
    requirements,
    skills,
    jobType,
    experienceLevel,
    salary
  } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      location,
      description,
      requirements,
      skills,
      jobType,
      experienceLevel,
      salary
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
