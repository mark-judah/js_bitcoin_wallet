const { createWallet,createMnemonic }=require("./controllers/walletController");
const express=require("express");
const app=express()
const {logEvents,logger}=require("./middleware/logs")
const customErrorHandler=require("./middleware/customErrorHandler")

const cors=require("cors")
const corsOptions=require("./config/corsOptions")

const  homeRoute = require("./routes/web");
const {registerUserRoute,loginUserRoute,generalBTCCommandsRoute, walletRouter, createWalletRoute, getWalletInfoRoute, createWalletSeedRouter, createMnemonicRouter}  = require("./routes/api");

const path=require('path');

// console.log(ENV);


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
app.use(generalBTCCommandsRoute)
app.use(createMnemonicRouter)
app.use(createWalletRoute)
app.use(getWalletInfoRoute)
app.use(createWalletSeedRouter)

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))