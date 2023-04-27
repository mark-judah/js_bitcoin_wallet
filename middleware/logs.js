const {format}=require("date-fns")
const {v4:uuid}=require("uuid");

const file_system=require("fs")
const file_system_promises=require("fs").promises;
const path=require("path");
 

const logEvents=async(message,logName)=>{
    const dateTime=`${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`
    //\t means tabs
    const logItem=`${dateTime}\t${uuid()}\t${message}\n`

    try{
        //if there is no logs folder in the projects root directory, create one
        if(!file_system.existsSync(path.join(__dirname,'..','logs'))){
            await file_system_promises.mkdir(path.join(__dirname,'..','logs'))
            
        }
        await file_system_promises.appendFile(path.join(__dirname,'..','logs',logName),logItem)
    }catch (err){
        console.log(err)
    }
}

const logger=(req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\n`,'requestsLog.txt');
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports={logEvents,logger};