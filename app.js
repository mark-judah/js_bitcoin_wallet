const express=require("express");
const app=express()
const {logEvents,logger}=require("./middleware/logs")
const customErrorHandler=require("./middleware/customErrorHandler")

const cors=require("cors")
const corsOptions=require("./config/corsOptions")

const  homeRoute = require("./routes/web");
const {registerUserRoute,loginUserRoute,generalBTCCommandsRoute, 
   createWalletRoute,setWalletSeedRoute, getWalletInfoRoute, loadWalletRoute,createWalletSeedRouter, 
    createMnemonicRouter,getNewAddressRoute, getAddressInfoRoute,getReceivedByAddressRoute,
    listTransactionsRoute,dumpWalletRoute, listUnspentTransactionsRoute, createRawTransactionRoute, signRawTransactionRoute, sendRawTransactionRoute, getBlockchainInfoRoute, getNetworkInforoute, getBalancesRoute, getTransactionRoute, getInfoLNRoute, newAddressLNRoute, listFundsLNRoute, listNodesLNRoute, createConfigLNRoute, loadInstanceLNRoute, killInstanceLNRoute}  = require("./routes/api");

const path=require('path');
const { listFundsLN } = require("./controllers/lightningWalletController");

// console.log(ENV);
//move port to .env

const PORT=3500;
 
//middleware- starts with app.use()
//built-in json middleware, it allows for extracting json data from the requests 
//coming into the routes
app.use(express.json())

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
app.use(homeRoute)
app.use(registerUserRoute)
app.use(loginUserRoute)
app.use(getBlockchainInfoRoute)
app.use(getNetworkInforoute)
app.use(createMnemonicRouter)
app.use(createWalletRoute)
app.use(setWalletSeedRoute)
app.use(getWalletInfoRoute)
app.use(loadWalletRoute)
app.use(createWalletSeedRouter)
app.use(getNewAddressRoute)
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



///////////////////////////LIGHTNING ROUTES/////////////////////
app.use(createConfigLNRoute)
app.use(loadInstanceLNRoute)
app.use(killInstanceLNRoute)
app.use(getInfoLNRoute)
app.use(newAddressLNRoute)
app.use(listFundsLNRoute)
app.use(listNodesLNRoute)


app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))