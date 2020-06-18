const { validationResult } = require('express-validator');
const request = require('request');

const Profile = require('../model/Profile');
const User = require('../model/User');
const Post = require('../model/Post');

exports.getLoggedInUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.userId,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).json({ msg: 'No profile for this user !' });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.postCreateAndUpdateProfiles = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const profileFields = {};
  profileFields.user = req.userId;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills
      .split(',')
      .map(skill => skill.trim());
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  try {
    let profile = await Profile.findOne({ user: req.userId });
    if (profile) {
      //for updating profile
      profile = await Profile.findOneAndUpdate(
        { user: req.userId },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getAllProfiles = async (req, res, next) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'No profiles found' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getSingleUserProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'profile not found !' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'profile not found !' });
    }
    res.status(500).send('Server error');
  }
};

exports.deleteUserAndProfile = async (req, res, next) => {
  try {
    await Post.deleteMany({ user: req.userId });
    await Profile.findOneAndRemove({ user: req.userId });
    await User.findOneAndRemove({ _id: req.userId });

    return res.json({ msg: 'User and Profile Deleted SuccessFully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.putUserExperience = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  try {
    const profile = await Profile.findOne({ user: req.userId });
    // Add to exp array
    profile.experience.unshift(newExp);

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUserProfileExprience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(400).json({ msg: 'profile not found !' });
    }
    profile.experience = profile.experience.filter(
      exp => exp._id.toString() !== req.params.expId.toString()
    );

    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.putUserEducation = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  try {
    const profile = await Profile.findOne({ user: req.userId });
    // Add to exp array
    profile.education.unshift(newEdu);

    await profile.save();

    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUserProfileEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(400).json({ msg: 'profile not found !' });
    }
    profile.education = profile.education.filter(
      edu => edu._id.toString() !== req.params.edu_id.toString()
    );

    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.getGitHubRepo = async (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
      },
    };
    request(options, (error, responce, body) => {
      if (error) {
        console.log(error);
      }
      if (responce.statusCode !== 200) {
        res.status(404).json({ msg: 'No GitHub repo Found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};
