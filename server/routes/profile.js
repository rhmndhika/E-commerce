const express = require("express");
const router = express.Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Profile = require("../models/Profile");


const createUserProfile = async (req, res) => {

    const newProfile = new Profile(req.body);

    try {        
        const saveProfile = await newProfile.save();
        res.status(200).json(saveProfile);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getUserProfile = async (req, res) => {

    try {
        const profile = await Profile.find({ userId : req.params.id }).populate('userId')
        
        res.status(200).json(profile);
    } catch(err) {
        res.status(500).json(err);
    }
}

const getAllProfile = async (req, res) => {

  const query = req.query.new

  try {
      const profiles = query ? await Profile.find().sort({_id: -1}).limit(5).populate('userId') : await Profile.find({}).populate('userId');
      
      res.status(200).json(profiles);
  } catch(err) {
      res.status(500).json(err)
  }
}



const updateUserProfile = async (req, res) => {
    
    try {
      if (req.body.updatedProfile) {

        const updatedUserProfile = await Profile.findOneAndUpdate({ userId: req.params.id },
          {
            $set: req.body.updatedProfile,
          },
          { new: true }
          );
          res.status(200).json(updatedUserProfile);
        } else {
          
        const updatedUserProfile = await Profile.findOneAndUpdate({ userId: req.params.id },
          {
            $set: req.body,
          },
          { new: true }
          );
          res.status(200).json(updatedUserProfile);
        }
      } catch (err) {
        res.status(500).json(err);
      }

}

router.post("/profile/create", createUserProfile);
router.get("/profile/:id", getUserProfile);
router.get("/profiles", verifyTokenAndAdmin, getAllProfile);
router.put("/profile/update/:id", verifyTokenAndAuthorization, updateUserProfile);

module.exports = router;