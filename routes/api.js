const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController");
const loginController = require("../controllers/authController");
const getBlockchainInfo=require("../controllers/generalBTCCommands");
console.log("api route called")
//add routes

const registerUserRoute=router.post("/register",registerController);
const loginUserRoute=router.post('/login',loginController);
const generalBTCCommandsRoute=router.post('/block-info',getBlockchainInfo);

 
module.exports={
    registerUserRoute,
    loginUserRoute,
    generalBTCCommandsRoute
};
