const express = require('express');
const { check } = require('express-validator');

const profileController = require('../controllers/Profile');
const auth = require('../middleware/is-auth');

const router = express.Router();
//API
//GET//api/profile/me    to get the currently logged in user profile
router.get('/me', auth, profileController.getLoggedInUserProfile);

//POST//api/profile/ to create or Edit user Profile

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required !').not().isEmpty(),
      check('skills', 'skills is required !').not().isEmpty(),
    ],
  ],
  profileController.postCreateAndUpdateProfiles
);
//GET//api/profile/   To get all the profiles stored in DB
router.get('/', profileController.getAllProfiles);

//GET//api/profile/user/:userId   to get single user Profile
router.get('/user/:userId', profileController.getSingleUserProfile);

//DELETE//api/profile/delete  to Delete User and Its Profile

router.delete('/delete', auth, profileController.deleteUserAndProfile);

//PUT//api/profile/exprience  to add experience in user profile data
router.put(
  '/exprience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from is required').not().isEmpty(),
    ],
  ],
  profileController.putUserExperience
);

//DELETE//api/profie/exprience/expId  to delete the exprience of the user
router.delete(
  '/exprience/:expId',
  auth,
  profileController.deleteUserProfileExprience
);

//PUT//api/profile/education To add education of the user

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is requried').not().isEmpty(),
      check('degree', 'degree is requried').not().isEmpty(),
      check('fieldofstudy', 'fieldofstudy is requried').not().isEmpty(),
      check('from', 'from is requried').not().isEmpty(),
    ],
  ],
  profileController.putUserEducation
);

//DELETE//api/profile/education/:edu_id
router.delete(
  '/education/:edu_id',
  auth,
  profileController.deleteUserProfileEducation
);

//GET//api/profile/github/:username to get repo from gitub
router.get('/github/:username', profileController.getGitHubRepo);

module.exports = router;
