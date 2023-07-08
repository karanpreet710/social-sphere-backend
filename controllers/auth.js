const db = require('../connect');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const register = (req,res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).send(err);
        if(data.length) return res.status(409).send("User already exists!");
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt);
        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?,?,?,?)";
        db.query(q,[req.body.username,req.body.email,hashedPassword,req.body.name],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created"); 
        });
    })
}

const login = (req,res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length===0) return res.status(404).json("User not found!");
        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.status(400).json("Wrong password or username!");
        const token = jwt.sign({id:data[0].id},"mysecretkey");
        const {password,...others} = data[0];
        res.cookie("accessToken", token, {
        httpOnly: true,
        domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app'
        }).status(200).json(others);
    })
}

const logout = (req,res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out");
}

module.exports = {
    register,login,logout
};