const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, location, yearsOfExperience, skills, preferredJobType } = req.body;

  // Build user profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (location) profileFields.location = location;
  if (yearsOfExperience) profileFields.yearsOfExperience = yearsOfExperience;
  if (skills) profileFields.skills = skills;
  if (preferredJobType) profileFields.preferredJobType = preferredJobType;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
