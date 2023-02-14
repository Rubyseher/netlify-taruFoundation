import mongoose from "mongoose";

const users =mongoose.Schema({
    fullName:String,
    type:String,
    age:Number,
    bloodGroup:String,
    phone:{type:Number,unique:true},
    password:String,
    address:String,
    dob:String,
    vitals:[
        { date :String, 
        weight :String, 
        bp :String,
        prescription:String
        }
    ],
    appointments:[{
        date:String,
        doc:String,
        meet:String,
        time:String,
        specialization:String
    }]
})

export default mongoose.model('users',users)