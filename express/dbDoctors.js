const mongoose = require('mongoose');

const doctors =mongoose.Schema({
    name:String,
    experience:Number,
    languages:String,
    specialization:String
})
module.exports = mongoose.model('Doctors',doctors)