const express=require("express");
const catalyst=require("zcatalyst-sdk-node");
const router=express.Router();
const multer=require('multer');
const fs=require("fs");
router.delete("/:rowId",async(req,res)=>{
    try{
         console.log("insdie the delete uri")
         const {rowId}=req.params;
         console.log(rowId)
         const catalystApp=catalyst.initialize(req);
         const zcql=catalystApp.zcql();
         const query=`DELETE FROM annotation WHERE ROWID=${rowId}`
         const result=await zcql.executeZCQLQuery(query);
         return res.sendStatus(201)
    }
    catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
})
router.patch("/:imageId",async(req,res)=>{
    try{
        
        const {image_id,Bbox,id,text}=req.body;
        const catalystApp=catalyst.initialize(req);
        const datastore=catalystApp.datastore();
        const annotation_table=datastore.table("annotation");
        const temp=[Bbox.x,Bbox.y,Bbox.width,Bbox.height];
        const updatedRow={Bbox:temp,ROWID:id,image_id:image_id,text:text}
      
        const updated=await annotation_table.updateRow(updatedRow)
         console.log("updated",updated)
         
      
        
        return res.sendStatus(200)
    }
    catch(err){
        return res.sendStatus(500)
    }
})


router.post("/",async(req,res)=>{
    try{
        
        
        const {image_id,Bbox}=req.body
        var filtered=[Bbox.x,Bbox.y,Bbox.width,Bbox.height];
        const catalystApp=catalyst.initialize(req);
        const datastore=catalystApp.datastore();
        const annotation_table=datastore.table("annotation");
        
        const rowData={
            Bbox:filtered,
            image_id:image_id,
        }
        const data= await annotation_table.insertRow(rowData);
        console.log("posted data",data.ROWID)
        const zcql=catalystApp.zcql();
        const query=`SELECT * FROM annotation WHERE image_id=${image_id}`
        const result=await zcql.executeZCQLQuery(query);
        const filter=result.map(item=>
           item.annotation
        )
        console.log("backend", filter)

        return res.status(201).json(data.ROWID);

       
        
    }
    catch(err){
        res.status(500).json({
            
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