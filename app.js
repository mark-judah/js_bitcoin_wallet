const express=require("express");
const app=express()
const bodyParser = require('body-parser');

const {logEvents,logger}=require("./middleware/logs")
const customErrorHandler=require("./middleware/customErrorHandler")

const cors=require("cors")
const corsOptions=require("./config/corsOptions")

const {registerUserRoute,loginUserRoute, 
   createWalletRoute,setWalletSeedRoute, getWalletInfoRoute, loadWalletRoute,createWalletSeedRouter, 
    createMnemonicRouter,getNewAddressRoute, getAddressInfoRoute,getReceivedByAddressRoute,
    listTransactionsRoute,dumpWalletRoute, listUnspentTransactionsRoute, createRawTransactionRoute, signRawTransactionRoute, sendRawTransactionRoute, getBlockchainInfoRoute, getNetworkInforoute, getBalancesRoute, getTransactionRoute, getInfoLNRoute, newAddressLNRoute, listFundsLNRoute, listNodesLNRoute, createConfigLNRoute, loadInstanceLNRoute, killInstanceLNRoute, createInvoiceLNRoute, payInvoiceLNRoute, connnectToNodeLNRoute, fundChannelLNRoute, payStatusLNRoute, getRouteLNRoute, sendPayLNRoute, listPaysLNRoute, waitSendPayLNRoute, listPeersLNRoute, listChannelsLNRoute, closeChannelLNRoute, ussdEntryRoute, unloadWalletRoute,dumpPrivKeyRoute, deriveAddressRoute, derivechangeAddressRoute}  = require("./routes/api");

const path=require('path');
const { listFundsLN } = require("./controllers/lightningWalletController");

// console.log(ENV);
//move port to .env

const PORT=3500;
 
//middleware- starts with app.use()
//built-in json middleware, it allows for extracting json data from the requests 
//coming into the routes
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//custom middleware -custom logger
app.use(logger);

//third party middleware
//the whitelist referers to domains that can send requests to this backend, that cors
//wont prevent
//the localhost domain should be removed in production


//Cross origin resourse sharing- browser security feature that restricts http requests 
//that are initiated from scripts running in the browser
app.use(cors(corsOptions))


//custom error handler
//the error handler middleware should be the last route
app.use(customErrorHandler);


//routes
app.use(ussdEntryRoute)
app.use(registerUserRoute)
app.use(loginUserRoute)
app.use(getBlockchainInfoRoute)
app.use(getNetworkInforoute)
app.use(createMnemonicRouter)
app.use(createWalletRoute)
app.use(setWalletSeedRoute)
app.use(getWalletInfoRoute)
app.use(loadWalletRoute)
app.use(unloadWalletRoute)
app.use(createWalletSeedRouter)
app.use(getNewAddressRoute)
app.use(deriveAddressRoute)
app.use(derivechangeAddressRoute)
app.use(getAddressInfoRoute)
app.use(getReceivedByAddressRoute)
app.use(getBalancesRoute)
app.use(listTransactionsRoute)
app.use(listUnspentTransactionsRoute)
app.use(createRawTransactionRoute)
app.use(signRawTransactionRoute)
app.use(sendRawTransactionRoute)
app.use(getTransactionRoute)
app.use(dumpWalletRoute)
app.use(dumpPrivKeyRoute)


///////////////////////////LIGHTNING ROUTES/////////////////////
app.use(createConfigLNRoute)
app.use(loadInstanceLNRoute)
app.use(killInstanceLNRoute)
app.use(getInfoLNRoute)
app.use(connnectToNodeLNRoute)
app.use(listPeersLNRoute)
app.use(getRouteLNRoute)
app.use(newAddressLNRoute)
app.use(fundChannelLNRoute)
app.use(listChannelsLNRoute)
app.use(createInvoiceLNRoute)
app.use(sendPayLNRoute)
app.use(waitSendPayLNRoute)
app.use(payInvoiceLNRoute)
app.use(payStatusLNRoute)
app.use(listPaysLNRoute)
app.use(listFundsLNRoute)
app.use(listNodesLNRoute)
app.use(closeChannelLNRoute)


app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))