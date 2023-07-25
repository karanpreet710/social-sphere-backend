const db = require("../connect");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getRequests = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  `
        SELECT 
            requests.id AS requestId, 
            requests.requesterId, 
            users.username, 
            users.profilePic
        FROM 
            requests 
        JOIN 
            users ON requests.requesterId = users.id
        WHERE 
            requests.receiverId = ?;
        `

        db.query(q,[req.query.receiverId],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })
}

const addRequest = (req,res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "INSERT INTO requests (`requesterId`,`receiverId`,`createdAt`) VALUES (?)";

        const values = [
            req.body.requesterId,
            req.body.receiverId,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Requested");
        })
    })
};

const acceptRequest = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "DELETE FROM requests WHERE id = ?";
        db.query(q,[req.body.requestId],(err,data)=>{
            if(err) return res.status(500).json(err);
            const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?, ?)";
            db.query(q,[req.body.requesterId,req.body.receiverId],(err,data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("Request accepted");
            })
        })
    })
}

const declineRequest = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "DELETE FROM requests WHERE id = ?";
        db.query(q,[req.body.requestId],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Request declined");
        })
    });
}

module.exports = {
    getRequests,addRequest,acceptRequest,declineRequest
}