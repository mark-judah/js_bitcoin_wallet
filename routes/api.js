const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController");
const loginController = require("../controllers/authController");
const getBlockchainInfo=require("../controllers/generalBTCCommands");
const { createMnemonic,createWalletSeed ,createWallet,setWalletSeed ,getWalletInfo,getNewAddress,dumpWallet} = require("../controllers/walletController");

console.log("api route called")
//add routes

const registerUserRoute=router.post("/register",registerController);
const loginUserRoute=router.post('/login',loginController);
const generalBTCCommandsRoute=router.post('/block-info',getBlockchainInfo);
const createMnemonicRouter=router.post('/create-mnemonic',createMnemonic);
const createWalletSeedRouter=router.post('/create-wallet-seed',createWalletSeed);
const createWalletRoute=router.post('/create-wallet',createWallet);
const setWalletSeedRoute=router.post('/set-wallet-seed',setWalletSeed);
const getNewAddressRoute=router.post('/new-address',getNewAddress);
const getWalletInfoRoute=router.post('/wallet-info',getWalletInfo);
const dumpWalletRoute=router.post('/dump-wallet',dumpWallet);


 
module.exports={
    registerUserRoute,
    loginUserRoute,
    generalBTCCommandsRoute,
    createMnemonicRouter,
    createWalletSeedRouter,
    createWalletRoute,
    setWalletSeedRoute,
    getWalletInfoRoute,
    getNewAddressRoute,
    dumpWalletRoute
};
