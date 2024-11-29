const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()
const express=require("express")
const app=express()
const studentsRouter=require("./routes/students")
const coursesRouter=require("./routes/courses")
const PORT=3030
app.use(express.json())

app.use("/students",studentsRouter)
app.use("/courses",coursesRouter)

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('database Connected!')
    app.listen(PORT,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(`Listening on PORT ${PORT}`)
        }
    })
  }).catch((err)=>console.log(err));