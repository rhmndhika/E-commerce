const express = require("express");
const router = express.Router();
const Notification = require('../models/Notification')


const getNotification = async(req, res) => {
    try {
        const notif = await Notification.find().limit(10)
        
        res.status(200).json(notif);
    } catch(err) {
        res.status(500).json(err);
    }
}


router.get("/notification", getNotification);


module.exports = router