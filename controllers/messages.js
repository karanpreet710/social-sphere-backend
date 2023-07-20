const db = require("../connect");
const jwt = require("jsonwebtoken");

const getMessages = (req,res) => {

    const userId = req.query.user;
    const otherUserId = req.query.otherUser;

    const q =  'SELECT m.id, u.id AS userId, u.profilePic, m.content, m.image, m.timestamp FROM messages AS m JOIN users AS u WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)) AND sender = u.id ORDER BY timestamp ASC';

    db.query(q,[userId,otherUserId,otherUserId,userId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json({messages:data});
    })
}

module.exports = {
    getMessages
}