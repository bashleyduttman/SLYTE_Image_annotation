const express=require('express');
const catalyst=require('zcatalyst-sdk-node')
const cors=require("cors")
const multer=require("multer")
const imageRouter=require("./routes/imagesRoute")
const annotationRouter=require("./routes/annotationRoute")
const app=express();
app.use(express.json());
app.use(cors());
app.use("/images",imageRouter)
app.use("/annotation",annotationRouter)
module.exports=app
 