import { RESTConnector } from "@slyte/data";

class AnnotationConnector extends RESTConnector{
    host="http://localhost:3001/server/image_annotation/";
    withCredentials=false;
    
    requestURL({url,type}){
        console.log("url is")
        console.log("type=",type)
       if(type=="getAll"){
        var imageId=localStorage.getItem("imageId");
        console.log("url added",url+'/'+imageId)
        return url+'/'+imageId;
       }
       if(type=="createEntity")
       {
        return url+'/';
       }
       
        
    }
    processRequest({url,cachedData,type}){
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
     if (type == "createEntity") {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cachedData)
        })
        .then(res => res.json());
    }
}
       
    
    parseResponse({ payLoad ,type}) {
        if(type!="createEntity"){
             console.log("image payload ", payLoad);

    const filtered = payLoad.result.map((item) => {
        let bboxArray;

       
        if (typeof item.Bbox === "string") {
            bboxArray = JSON.parse(item.Bbox);
        } else {
            bboxArray = item.Bbox;
        }

       
        const bboxObject = {
            x: bboxArray[0],
            y: bboxArray[1],
            width: bboxArray[2],
            height: bboxArray[3]
        };

        return {
            image_id: item.image_id,
            Bbox: bboxObject,
            id:item.ROWID,
        };
    });

    console.log("filtered ", filtered);
    return filtered;
        }
    
}
}
export {AnnotationConnector}

