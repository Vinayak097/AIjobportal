const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', auth, jobController.getAllJobs);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, jobController.getJobById);

// @route   POST api/jobs
// @desc    Create a new job (for seeding purposes)
// @access  Private
router.post('/', auth, jobController.createJob);

module.exports = router;
