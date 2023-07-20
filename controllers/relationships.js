const db = require("../connect");
const jwt = require("jsonwebtoken");

const getRelationships = (req,res) => {
    if (req.query.followerUserId !== null) {
        const query1 = `SELECT followedUserId FROM relationships WHERE followerUserId = ?`;
        db.query(query1, [req.query.followerUserId], (err, data) => {
          if (err) return res.status(500).json(err);
          const promises = data.map((d) => {
            return new Promise((resolve, reject) => {
              const query = `
                SELECT u.id, u.username, u.profilePic, m.image, m.content AS latestMessage, m.timestamp
                FROM users AS u
                LEFT JOIN (
                    SELECT sender, receiver, image, content, timestamp
                    FROM messages
                    WHERE (sender = ? AND receiver = ?)
                      OR (sender = ? AND receiver = ?)
                    ORDER BY timestamp DESC
                    LIMIT 1
                ) AS m ON (u.id = m.sender OR u.id = m.receiver)
                WHERE u.id = ?                          
              `;
              db.query(query, [req.query.followerUserId, d.followedUserId, d.followedUserId, req.query.followerUserId, d.followedUserId], (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data[0]);
                }
              });
            });
          });
      
          Promise.all(promises)
            .then((par) => {
                res.status(200).json({ users: par });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        });
      }
      
    else if(req.query.followedUserId==null)
    {
        const q = "SELECT followerUserId,profilePic,users.id FROM relationships JOIN users ON users.id = relationships.followedUserId WHERE username = ?";
        db.query(q,[req.query.followedUsername],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    }
    else
    {
        const q =  "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

        db.query(q,[req.query.followedUserId],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data.map(relationship=>relationship.followerUserId));
        })
    }
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