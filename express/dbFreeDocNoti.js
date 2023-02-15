const mongoose = require('mongoose');

const docNoti =mongoose.Schema({
    date:String,
    name:String,
    time:String,
    specialization:String
})

module.exports = mongoose.model('freeDocNotifications',docNoti)