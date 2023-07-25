const express = require("express");

const app = express();

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const db = require("./connect");
dotenv.config({
  path:'./backend/.env'
});
// dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://socialsphere-seven.onrender.com');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, *');
  next();
});

const upload = require('./configs/cloudinary.config');

app.post('/api/upload',upload.single("file"),(req,res,next)=>{
  const file = req.file;
  if (!file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.status(200).json({ secure_url: req.file.path })
})

const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const storyRoute = require("./routes/stories");
const likeRoute = require("./routes/likes");
const commentRoute = require("./routes/comments");
const authRoute = require("./routes/auth");
const relationshipRoute = require('./routes/relationships');
const messageRoute = require("./routes/messages");
const requestRoute = require("./routes/requests");

app.use('/api/users',userRoute);
app.use('/api/posts',postRoute);
app.use('/api/likes',likeRoute);
app.use('/api/stories',storyRoute);
app.use('/api/comments',commentRoute);
app.use('/api/auth',authRoute);
app.use('/api/relationships',relationshipRoute);
app.use('/api/messages',messageRoute);
app.use('/api/requests',requestRoute);

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('online', (user) => {
    if (!onlineUsers.find(onlineUser => onlineUser.id === user.id)) {
      onlineUsers.push({ ...user, socketId: socket.id });
      io.emit('onlineUsers', onlineUsers);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('joinRoom', (rooms) => {
    socket.join(rooms);
  });
  
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });
  // Handle incoming chat messages
  socket.on('chat message', ({message,roomId}) => {
    // Save the message to the database
    const { id, sender, receiver, content, timestamp, image } = message;
    const contentR = content ? content : null
    const imagePath = image ? image : null;
    const query = `INSERT INTO messages (id, sender, receiver, content, timestamp, image) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [id, sender, receiver, contentR, timestamp, imagePath], (err, result) => {
      if (err) {
        console.error('Error saving message:', err);
        return;
      }
      // Broadcast the message to the recipient's socket
      io.to(roomId).emit('message', message);
    });
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


server.listen(5000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})