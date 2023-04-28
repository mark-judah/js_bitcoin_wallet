const bcrypt = require("bcrypt");

const jwt=require('jsonwebtoken');
require('dotenv').config();
const fsPromises=require('fs').promises;
const path=require('path');

const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users=data
    }
}

const loginHandler = async (req, res) => {
    const { uname, pwd } = req.body;
    //validate data
    if (!uname || !pwd) {
        const msg = "username and password are required";
        return res.status(400).json({ 'message': msg })
    }
    const foundUser=usersDB.users.find(person=>person.username===uname);
    if(!foundUser){
        return res.status(401);//unauthorized
    }
    //confirm password
    const match=await bcrypt.compare(pwd,foundUser.password);
    if(match){
        //create JWT tokens
        const accessToken=jwt.sign(
            {"username":foundUser.username},
                process.env.ACCESS_TOKEN_SECRET
        )
        return res.status(200).json({ 'success': `User ${uname} is logged in` })
    }else{
        return res.status(401);//unauthorized
    }
}

module.exports=loginHandler;