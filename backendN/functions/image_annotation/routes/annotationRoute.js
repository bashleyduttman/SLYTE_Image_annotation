const express=require("express");
const catalyst=require("zcatalyst-sdk-node");
const router=express.Router();
const multer=require('multer');
const fs=require("fs");
router.post("/",async(req,res)=>{
    try{
        
        
        const {image_id,Bbox}=req.body
        var filtered=[Bbox.x,Bbox.y,Bbox.width,Bbox.height];
        const catalystApp=catalyst.initialize(req);
        const datastore=catalystApp.datastore();
        const annotation_table=datastore.table("Annotation");
        const rowData={
            Bbox:filtered,
            image_id:image_id,
        }
        const result=await annotation_table.insertRow(rowData);
        res.status(201).json({
            message:"success",
            result:result
        })
    }
    catch(err){
        res.status(500).send({
            message:"cant able to insert",
            error:err.message
        })
    }
    


})
router.get("/:imageId",async(req,res)=>{
    console.log("got")
    try{
         const {imageId}=req.params;
        const catalystApp=catalyst.initialize(req);
        const zcql=catalystApp.zcql();
        const query=`SELECT * FROM annotation WHERE image_id=${imageId}`
        const result=await zcql.executeZCQLQuery(query);
        const filtered=result.map(item=>
           item.annotation
        )
        return res.status(200).json({
            result:filtered
        })
    }
    catch(err){
        return res.status(500).json({
            message:"cant able to send request"
        })
    }
   
    
})
module.exports=router