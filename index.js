const express = require("express");

const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config({
  path:'./backend/.env'
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://socialsphere-seven.vercel.app');
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
const likeRoute = require("./routes/likes");
const commentRoute = require("./routes/comments");
const authRoute = require("./routes/auth");
const relationshipRoute = require('./routes/relationships');

app.use('/api/users',userRoute);
app.use('/api/posts',postRoute);
app.use('/api/likes',likeRoute);
app.use('/api/comments',commentRoute);
app.use('/api/auth',authRoute);
app.use('/api/relationships',relationshipRoute);


app.listen(5000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})