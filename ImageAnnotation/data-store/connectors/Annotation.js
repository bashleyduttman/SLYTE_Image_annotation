import { RESTConnector } from "@slyte/data";

class AnnotationConnector extends RESTConnector{
    host="http://localhost:3001/server/image_annotation/";
    withCredentials=false;
    
    requestURL({url,type,queryParams}){
        console.log("url is",url)
        console.log("type=",type)
        console.log("queryParams",queryParams)
       if(type=="getAll"){
        var imageId=localStorage.getItem("imageId");
        console.log("url added",url+'/'+imageId)
        return url+'/'+imageId;
       }
       if(type=="createEntity")
       {
        return url+'/';
       }
       
       return url;
       
        
    }
    processRequest({url,cachedData,type,schemaName,payLoad}){
        // if(type=="createEntity"){
        //     return new Promise((resolve,reject)=>{
        //         console.log("cached data",cachedData)
        //         var xhr=new XMLHttpRequest();
        //         xhr.open("POST", url, true);
        //         xhr.responseType="json"
        //         var formdata=new FormData();
        //         formdata.append("image_id",cachedData.image_id);
        //         formdata.append("Bbox",cachedData.Bbox);
        //         xhr.onload = function () {
        //         if (xhr.status >= 200 && xhr.status < 300) {
        //             console.log("success from xhr")
        //         resolve(JSON.parse(xhr.response)); 
        //         } else {
        //         reject(xhr.response); 
        //         }
        //     };
        //         xhr.send(formdata)

        //         })
                    
        
    // }
    console.log("cached data",cachedData)
   if (type === "createEntity") {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json"); 

    xhr.responseType = "json"; 

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const savedRecord = xhr.response; 
        localStorage.setItem("uniqueId",savedRecord)
        console.log("saved Record",savedRecord);

        
        resolve(JSON.stringify(savedRecord));
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    // send JSON string
    xhr.send(JSON.stringify(cachedData));
  });
}

  

    if(type==="updateEntity"){
        console.log("cached data",cachedData);
        return fetch(url,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            }
            ,body:JSON.stringify(cachedData)
        }).then(res=>res.json());
    }
    else if(type=="deleteEntity"){
        return fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",

            }
        
        })
    }
}
       
    
    parseResponse({ payLoad, type }) {
    console.log("image payload ", payLoad);

    if (!payLoad || !payLoad.result) {
        return [];
    }

    const filtered = payLoad.result.map((item) => {
        let bboxArray;

        if (Array.isArray(item.Bbox)) {
            bboxArray = item.Bbox; // ✅ already array
        } 
        else if (typeof item.Bbox === "string") {
            try {
                // Only parse if it *looks* like JSON
                if (item.Bbox.trim().startsWith("[") || item.Bbox.trim().startsWith("{")) {
                    bboxArray = JSON.parse(item.Bbox);
                } else {
                    console.warn("Skipping non-JSON Bbox string:", item.Bbox);
                    bboxArray = [0,0,0,0];
                }
            } catch (e) {
                console.error("Invalid Bbox string:", item.Bbox, e);
                bboxArray = [0,0,0,0];
            }
        } 
        else if (typeof item.Bbox === "object" && item.Bbox !== null) {
            // Already a proper object
            bboxArray = [item.Bbox.x, item.Bbox.y, item.Bbox.width, item.Bbox.height];
        } 
        else {
            bboxArray = [0,0,0,0]; // fallback
        }

        return {
            image_id: item.image_id,
            Bbox: {
                x: bboxArray[0],
                y: bboxArray[1],
                width: bboxArray[2],
                height: bboxArray[3]
            },
            id: item.ROWID,
            text: item.text
        };
    });

    console.log("filtered ", filtered);
    return filtered;
}

        

    
}

export {AnnotationConnector}

