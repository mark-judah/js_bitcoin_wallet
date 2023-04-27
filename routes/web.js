const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController")

console.log("web route called")
//add routes
const homeRoute=router.get('/',(req,res)=>{
    res.send('Hello World')
});



module.exports=homeRoute;