const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController");
const loginController = require("../controllers/authController");
const getBlockchainInfo=require("../controllers/generalBTCCommands");
const { createMnemonic,createWalletSeed ,createWallet ,getWalletInfo} = require("../controllers/walletController");

console.log("api route called")
//add routes

const registerUserRoute=router.post("/register",registerController);
const loginUserRoute=router.post('/login',loginController);
const generalBTCCommandsRoute=router.post('/block-info',getBlockchainInfo);
const createMnemonicRouter=router.post('/create-mnemonic',createMnemonic);
const createWalletSeedRouter=router.post('/create-wallet-seed',createWalletSeed);
const createWalletRoute=router.post('/create-wallet',createWallet);
const getWalletInfoRoute=router.post('/wallet-info',getWalletInfo);

 
module.exports={
    registerUserRoute,
    loginUserRoute,
    generalBTCCommandsRoute,
    createMnemonicRouter,
    createWalletSeedRouter,
    createWalletRoute,
    getWalletInfoRoute
};
