const mongoose = require('mongoose');

const patients =mongoose.Schema({
    name:String,
    age:String,
    doc:String,
    date:String,
    meet:String,
    time:String,
})

module.exports = mongoose.model('patientsToday',patients)