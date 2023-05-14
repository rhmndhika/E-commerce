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
        const profile = await Profile.find({ userId : req.params.id })
        
        res.status(200).json(profile);
    } catch(err) {
        res.status(500).json(err);
    }
}


const updateUserProfile = async (req, res) => {
    
    try {
        const updatedUserProfile = await Profile.findOneAndUpdate({ userId: req.params.id },
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUserProfile);
      } catch (err) {
        res.status(500).json(err);
      }

}

router.post("/profile/create", createUserProfile);
router.get("/profile/:id", getUserProfile);
router.put("/profile/update/:id", verifyTokenAndAuthorization, updateUserProfile);

module.exports = router;