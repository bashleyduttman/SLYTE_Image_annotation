const express=require("express");
const catalyst=require("zcatalyst-sdk-node");
const router=express.Router();
const multer=require('multer');
const fs=require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {

 console.log("called")
  try {
   
    const catalystApp = catalyst.initialize(req);
    const fileStore = catalystApp.filestore();
    const folder = await fileStore.getFolderDetails("21787000000010203");

    console.log(folder);
    const config = {
      code: fs.createReadStream(req.file.path),
      name: req.file.originalname,
    };
   console.log(config)
   
    folder.uploadFile(config)

    
    

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

router.get("/",async(req,res)=>{
    try{
        console.log("Hello")
        const catalystApp=catalyst.initialize(req);
        const fileStore=catalystApp.filestore();
        const folder=await fileStore.getFolderDetails("21787000000010203");
        console.log(folder);
        const result=await Promise.all(
            folder._folderDetails.file_details.map(async(file)=>{
                const buffer=await folder.downloadFile(file.id);
                
                
                return {
                    id:file.id,
                    name:file.file_name,
                    size:file.file_size,
                    data: `data:image/png;base64,${buffer.toString("base64")}`
                }
            })
        )
        return res.status(200).json({
            message:"file fetched successfully",
            result:result

        });
    }
    catch(err){
        return res.status(500).json({
            message:"cant able to fetch file"
        })
    }


})
module.exports=router