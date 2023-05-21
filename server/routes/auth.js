const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");



const Register = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const Login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: "Wrong Username!" });
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
        if (originalPassword !== req.body.password) {
            return res.status(401).json({ message: "Please input the correct password!" });
        }

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc; 
       
        return res.status(200).json({ ...others, accessToken });
          
    } catch(err) {
        console.log(err);
        // Handle the error appropriately (e.g., send an error response)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// const Login = async (req, res) => {
    
//     try {

//         const user = await User.findOne({ username: req.body.username });

//         !user && res.status(401).json({ message: "Wrong Username!"});

//         const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);

//         const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
//         OriginalPassword !== req.body.password && 
//             res.status(401).json({ message: "Please input the correct password!"});

//             const accessToken = jwt.sign({
//                 id: user._id, 
//                 isAdmin: user.isAdmin
//             }, process.env.JWT_SEC, 
//             { expiresIn: "3d"}
//             );

//             const { password, ...others } = user._doc; 
       
//             res.status(200).json({ ...others, accessToken });
          
//     } catch(err) {
//         console.log(err);
//     }
// }



router.post("/register", Register);
router.post("/login", Login);


module.exports = router