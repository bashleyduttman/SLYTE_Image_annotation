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

router.get("/:pageNumber",async(req,res)=>{
    try{
        console.log("Hello")
        const {pageNumber}=req.params;
        console.log("pageNumber",pageNumber);
        const catalystApp=catalyst.initialize(req);
        const fileStore=catalystApp.filestore();
        const folder=await fileStore.getFolderDetails("21787000000010203");
        // console.log(folder);
        var start=(pageNumber-1)*10
        var end=pageNumber*10;
        if(start>folder._folderDetails.file_details.length){
          return res.sendStatus(400);
        }
        var len=folder._folderDetails.file_details.length;
        const filtered=folder._folderDetails.file_details.slice(start,Math.min(len,end));
        console.log(filtered)
        const result=await Promise.all(
        
            filtered.map(async(file)=>{
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