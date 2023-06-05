const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status : {
    type: String,
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);

module.exports = NotificationModel;
