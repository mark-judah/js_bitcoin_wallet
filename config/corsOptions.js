const whitelist=['https://my-production-backend.com','http://localhost:3500'];

const corsOptions={
    origin:(origin,mycallback)=>{
        //if the domain is not in the whitelist
        //index of returns the first occurence of a string in an object
        //index returns -1 if a value is not found
        //in development, the req.headers.origin is undefined hence the origin
        //will not be found in the whitelist, to cater for this in development
        //add || !origin as a condition
        if(whitelist.indexOf(origin) !== -1 || !origin){
            //callbacks are functions passed as arguments to other functions
            //they are useful where on function has to wait for another function
            mycallback(null,true)
        }else{
            mycallback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports=corsOptions;