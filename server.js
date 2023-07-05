const express = require("express");

const app = express();

const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const likeRoute = require("./routes/likes");
const commentRoute = require("./routes/comments");
const authRoute = require("./routes/auth");
const relationshipRoute = require('./routes/relationships');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const dotenv = require('dotenv');
dotenv.config();


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true);
    next()
})
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"https://socialsphere-296f.onrender.com"
}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../frontend/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

app.post('/api/upload',upload.single("file"),(req,res)=>{
    const file = req.file;
    res.status(200).send(file.filename)
})

app.use('/api/users',userRoute);
app.use('/api/posts',postRoute);
app.use('/api/likes',likeRoute);
app.use('/api/comments',commentRoute);
app.use('/api/auth',authRoute);
app.use('/api/relationships',relationshipRoute);


app.listen(5000,()=>{
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})