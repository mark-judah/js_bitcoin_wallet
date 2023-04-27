const bcrypt = require("bcrypt");
const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users=data
    }
}

const fsPromises = require('fs').promises;
const path = require("path");

const newUserHandler = async (req, res) => {
    const { uname, pwd } = req.body;
    //validate data
    if (!uname || !pwd) {
        const msg = "username and password are required";
        return res.status(400).json({ 'message': msg })
    }
    //check for duplicates
    const duplicate = usersDB.users.find(person => person.username === uname);
    if (duplicate) {
        const msg = "the username already exists";
        return res.status(409).json({ 'message': msg })
    }
    //create new user
    try {
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //save the new user in memory
        const newUser = { "username": uname, "password": hashedPwd }
        console.log(newUser);
        usersDB.setUsers([...usersDB.users, newUser])
        console.log(usersDB.users)
    } catch (err) {
        return res.status(500).json({ 'error': err.message })
    }

    //store the saved user to disk
    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users)
        return res.status(200).json({ 'success': `New user ${uname} created` })

    } catch (err) {
        return res.status(500).json({ 'error': err.message })
    }
}

module.exports=newUserHandler;