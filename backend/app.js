const express = require("express");
const app = express();
const bodyParser=require("body-parser");
const mongoose=require('mongoose');

const postRoutes =require("./routes/posts");
const userRoutes=require("./routes/user");
const path=require("path");


mongoose.connect("mongodb+srv://Syed:"+process.env.MONGO_ATLAS_PW+"@cluster0-jcxhe.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true}).then(()=>{
  console.log("Connected to DB Successfully");
}).catch((error)=>{
  console.log("DB Connection Failed!")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
  next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
