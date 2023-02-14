import mongoose from "mongoose";

const doctors =mongoose.Schema({
    name:String,
    experience:Number,
    languages:String,
    specialization:String
})

export default mongoose.model('Doctors',doctors)