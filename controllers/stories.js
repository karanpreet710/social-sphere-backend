const db = require("../connect");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getStories = (req,res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  `SELECT s.id AS storyId, s.img, s.userId,s.createdAt, u.username, u.profilePic
        FROM stories s
        JOIN users u ON s.userId = u.id
        WHERE s.userId = ?
           OR s.userId IN (
              SELECT r.followedUserId
              FROM relationships r
              WHERE r.followerUserId = ?
           )
           ORDER BY CASE WHEN s.userId = ? THEN 0 ELSE 1 END;        
        `;
        db.query(q,[userId,userId,userId],(err,data)=>{
            console.log(err)
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })
}

const addStory = (req,res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "INSERT INTO stories (`img`,`userId`,`createdAt`) VALUES (?)";

        const values = [
            req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Story has been created");
        })
    })
}

module.exports = {
    getStories, addStory
}