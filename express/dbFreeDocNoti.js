import mongoose from "mongoose";

const docNoti =mongoose.Schema({
    date:String,
    name:String,
    time:String,
    specialization:String
})

export default mongoose.model('freeDocNotifications',docNoti)