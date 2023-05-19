const express=require("express");
const app=express()
const {logEvents,logger}=require("./middleware/logs")
const customErrorHandler=require("./middleware/customErrorHandler")

const cors=require("cors")
const corsOptions=require("./config/corsOptions")

const  homeRoute = require("./routes/web");
const {registerUserRoute,loginUserRoute,generalBTCCommandsRoute, 
   createWalletRoute,setWalletSeedRoute, getWalletInfoRoute, createWalletSeedRouter, 
    createMnemonicRouter,getNewAddressRoute, dumpWalletRoute}  = require("./routes/api");

const path=require('path');

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
app.use(generalBTCCommandsRoute)
app.use(createMnemonicRouter)
app.use(createWalletRoute)
app.use(setWalletSeedRoute)
app.use(getWalletInfoRoute)
app.use(createWalletSeedRouter)
app.use(getNewAddressRoute)
app.use(dumpWalletRoute)

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))