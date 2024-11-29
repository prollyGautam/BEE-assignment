const mongoose=require("mongoose")

const studentSchema=new mongoose.Schema({
    name: {type: String , required: true},
    age: { type: Number},
    grade: {type:String, required:true},
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: "courses"}]
})
module.exports=mongoose.model("Student", studentSchema)