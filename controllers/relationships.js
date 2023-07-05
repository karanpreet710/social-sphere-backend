const db = require("../connect");
const jwt = require("jsonwebtoken");

const getRelationships = (req,res) => {
    const q =  "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q,[req.query.followedUserId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    })
}

const addRelationships = (req,res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.userId
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Following");
        })
    })
};

const deleteRelationships = (req,res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"mysecretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!");
        const q =  "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

        const values = [
            userInfo.id,
            req.query.userId
        ]
        db.query(q,values,(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Unfollowed");
        })
    })
};

module.exports = {
    getRelationships,addRelationships,deleteRelationships
}