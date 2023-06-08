const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController");
const loginController = require("../controllers/authController");
const {getBlockchainInfo,getNetworkInfo}=require("../controllers/generalBTCCommands");

const { createMnemonic,createWalletSeed ,createWallet,setWalletSeed ,
    getWalletInfo,loadWallet,getNewAddress,getAddressInfo,getReceivedByAddress,
    listTransactions,listUnspentTransactions,createRawTransaction, signRawTransaction ,dumpWallet, sendRawTransaction, getBalances, getTransaction} = require("../controllers/walletController");
const { getNodeInfo, newAddress, listFunds, listNodes, createConfig, loadInstance, killInstance } = require("../controllers/lightningWalletController.js");

console.log("api route called")
//add routes

const registerUserRoute=router.post("/register",registerController);
const loginUserRoute=router.post('/login',loginController);
const getBlockchainInfoRoute=router.post('/block-info',getBlockchainInfo);
const getNetworkInforoute=router.post('/network-info',getNetworkInfo);
const createMnemonicRouter=router.post('/create-mnemonic',createMnemonic);
const createWalletSeedRouter=router.post('/create-wallet-seed',createWalletSeed);
const createWalletRoute=router.post('/create-wallet',createWallet);
const setWalletSeedRoute=router.post('/set-wallet-seed',setWalletSeed);
const getNewAddressRoute=router.post('/new-address',getNewAddress);
const getWalletInfoRoute=router.post('/wallet-info',getWalletInfo);
const loadWalletRoute=router.post('/load-wallet',loadWallet);
const getAddressInfoRoute=router.post('/address-info',getAddressInfo);
const getReceivedByAddressRoute=router.post('/received-by-address',getReceivedByAddress)
const getBalancesRoute=router.post('/get-balances',getBalances)
const listTransactionsRoute=router.post('/list-transactions',listTransactions);
const listUnspentTransactionsRoute=router.post('/list-unspent-transactions',listUnspentTransactions);
const createRawTransactionRoute=router.post('/create-raw-transaction',createRawTransaction);
const signRawTransactionRoute=router.post('/sign-raw-transaction',signRawTransaction);
const sendRawTransactionRoute=router.post('/send-raw-transaction',sendRawTransaction);
const getTransactionRoute=router.post('/get-transaction',getTransaction);
const dumpWalletRoute=router.post('/dump-wallet',dumpWallet);



///////////////////////////LIGHTNING ROUTES/////////////////////
const createConfigLNRoute=router.post('/ln-create-config',createConfig);
const loadInstanceLNRoute=router.post('/ln-load-instance',loadInstance);
const killInstanceLNRoute=router.post('/ln-kill-instance',killInstance);
const getInfoLNRoute=router.post('/ln-get-info',getNodeInfo);
const newAddressLNRoute=router.post('/ln-new-address',newAddress);
const listFundsLNRoute=router.post('/ln-list-funds',listFunds);
const listNodesLNRoute=router.post('/ln-list-nodes',listNodes);


 
module.exports={
    registerUserRoute,
    loginUserRoute,
    getBlockchainInfoRoute,
    getNetworkInforoute,
    createMnemonicRouter,
    createWalletSeedRouter,
    createWalletRoute,
    setWalletSeedRoute,
    getWalletInfoRoute,
    loadWalletRoute,
    getNewAddressRoute,
    getAddressInfoRoute,
    getReceivedByAddressRoute,
    getBalancesRoute,
    listTransactionsRoute,
    listUnspentTransactionsRoute,
    createRawTransactionRoute,
    signRawTransactionRoute,
    sendRawTransactionRoute,
    getTransactionRoute,
    dumpWalletRoute,

    createConfigLNRoute,
    loadInstanceLNRoute,
    killInstanceLNRoute,
    getInfoLNRoute,
    listNodesLNRoute,
    newAddressLNRoute,
    listFundsLNRoute
};
