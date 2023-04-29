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

        !user && res.status(401).json("Wrong Credentials!");

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);

        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
        OriginalPassword !== req.body.password && 
            res.status(401).json("Wrong Credentials!");

            const accessToken = jwt.sign({
                id: user._id, 
                isAdmin: user.isAdmin
            }, process.env.JWT_SEC, 
            { expiresIn: "3d"}
            );

            const { password, ...others } = user._doc; 

    
            const sessionUser = {
                id: user._id,
                email: user.email,
                username: user.username,
                admin: user.isAdmin,
                token: accessToken
            };
            req.session.data = sessionUser
           
            res.status(200).json({ ...others, accessToken });
          
    } catch(err) {
        res.status(500).json(err);
    }
}

const getUserInfo = (req, res) => {

    // session=req.session;
    // if (session.user) {
    //     res.send("Nice");
    // } else {
    //     res.send("Not Nice")
    // }
    // req.session.destroy();

    console.log(req.session)
}

router.post("/register", Register);
router.post("/login", Login);
router.get("/login", getUserInfo);

module.exports = router