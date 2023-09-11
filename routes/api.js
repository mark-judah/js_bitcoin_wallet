const express=require("express");
const router=express.Router();

//import controllers
const registerController=require("../controllers/registerController");
const loginController = require("../controllers/authController");
const {getBlockchainInfo,getNetworkInfo}=require("../controllers/generalBTCCommands");

const { createMnemonic,createWalletSeed ,createWallet,setWalletSeed ,
    getWalletInfo,loadWallet,getNewAddress,deriveReceivingAddress,getAddressInfo,getReceivedByAddress,
    listTransactions,listUnspentTransactions,createRawTransaction, signRawTransaction ,dumpWallet, sendRawTransaction, getBalances, getTransaction, unloadWallet,dumpPrivKey, deriveChangeAddress, loadWalletRequest} = require("../controllers/walletController");
const { getNodeInfo, newAddress, listFunds, listNodes, createConfig, loadInstance, killInstance, createInvoice, payInvoice, connectToNode, fundChannel, getPayStatus, getRoute, sendPay, listPays, waitSendPay, listPeers, listChannels, closeChannel } = require("../controllers/lightningWalletController.js");
const { ussdEntry } = require("../controllers/ussdWalletController");

console.log("api route called")
//add routes
const ussdEntryRoute=router.post("/",ussdEntry);
const registerUserRoute=router.post("/register",registerController);
const loginUserRoute=router.post('/login',loginController);
const getBlockchainInfoRoute=router.post('/block-info',getBlockchainInfo);
const getNetworkInforoute=router.post('/network-info',getNetworkInfo);
const createMnemonicRouter=router.post('/create-mnemonic',createMnemonic);
const createWalletSeedRouter=router.post('/create-wallet-seed',createWalletSeed);
const createWalletRoute=router.post('/create-wallet',createWallet);
const setWalletSeedRoute=router.post('/set-wallet-seed',setWalletSeed);
const getNewAddressRoute=router.post('/new-address',getNewAddress);
const deriveAddressRoute=router.post('/deriveAddress',deriveReceivingAddress);
const derivechangeAddressRoute=router.post('/deriveChangeAddress',deriveChangeAddress);
const getWalletInfoRoute=router.post('/wallet-info',getWalletInfo);
const loadWalletRoute=router.post('/load-wallet',loadWalletRequest);
const unloadWalletRoute=router.post('/unload-wallet',unloadWallet);
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
const dumpPrivKeyRoute=router.post('/dump-priv-key',dumpPrivKey);



///////////////////////////LIGHTNING ROUTES/////////////////////
const createConfigLNRoute=router.post('/ln-create-config',createConfig);
const loadInstanceLNRoute=router.post('/ln-load-instance',loadInstance);
const killInstanceLNRoute=router.post('/ln-kill-instance',killInstance);
const getInfoLNRoute=router.post('/ln-get-info',getNodeInfo);
const connnectToNodeLNRoute=router.post('/ln-connect-to-node',connectToNode);
const listPeersLNRoute=router.post('/ln-list-peers',listPeers);
const getRouteLNRoute=router.post('/ln-get-route',getRoute);
const newAddressLNRoute=router.post('/ln-new-address',newAddress);
const fundChannelLNRoute=router.post('/ln-fund-channel',fundChannel);
const listChannelsLNRoute=router.post('/ln-list-channels',listChannels);
const listFundsLNRoute=router.post('/ln-list-funds',listFunds);
const createInvoiceLNRoute=router.post('/ln-create-invoice',createInvoice);
const sendPayLNRoute=router.post('/ln-send-pay',sendPay);
const waitSendPayLNRoute=router.post('/ln-wait-send-pay',waitSendPay);
const payInvoiceLNRoute=router.post('/ln-pay-invoice',payInvoice);
const payStatusLNRoute=router.post('/ln-pay-status',getPayStatus);
const listPaysLNRoute=router.post('/ln-list-pays',listPays);
const listNodesLNRoute=router.post('/ln-list-nodes',listNodes);
const closeChannelLNRoute=router.post('/ln-close-channel',closeChannel);


 
module.exports={
    ussdEntryRoute,
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
    unloadWalletRoute,
    getNewAddressRoute,
    deriveAddressRoute,
    derivechangeAddressRoute,
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
    dumpPrivKeyRoute,

    createConfigLNRoute,
    loadInstanceLNRoute,
    killInstanceLNRoute,
    connnectToNodeLNRoute,
    listPeersLNRoute,
    getRouteLNRoute,
    getInfoLNRoute,
    listNodesLNRoute,
    newAddressLNRoute,
    fundChannelLNRoute,
    listChannelsLNRoute,
    createInvoiceLNRoute,
    sendPayLNRoute,
    waitSendPayLNRoute,
    payInvoiceLNRoute,
    payStatusLNRoute,
    listPaysLNRoute,
    listFundsLNRoute,
    closeChannelLNRoute
};
