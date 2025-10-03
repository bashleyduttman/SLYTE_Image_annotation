import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { RESTConnector } from "../../node_modules/@slyte/data/index.js";

class ImagesConnector extends RESTConnector{
  constructor() {
    super(...arguments);
    this.host = "http://localhost:3001/server/image_annotation/";
    this.withCredentials = false;
  }

  requestURL({schemaName, type, queryParams, payLoad, url, actionName, customData, key}){
    console.log("query params ",queryParams)
    const page=queryParams.page;
     if(type=='getAll'){
       return url+'/'+page;
     }
     else if( type=="createEntity"){
       return url;
         
     }
     
     
     
     return url;
  }
  processRequest({ type, cachedData ,url,schemaName}) {
    console.log("url ",url)

    if (type === "createEntity") {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        const formData = new FormData();
        xhr.responseType="json"
        formData.append("file", cachedData.file);
        formData.append("name", cachedData.name);
        formData.append("size", cachedData.size);
        

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
              console.log("success from xhr")
            resolve(JSON.parse(xhr.response)); 
          } else {
            reject(xhr.response); 
          }
        };

        xhr.onerror = function () {
          reject("Network error");
        };

        xhr.send(formData);
      });
    }
  }

  parseResponse({payLoad,type}){
     
     var filtered=payLoad.result.map((item)=>({
         id:item.id,
         name:item.name,
         size:item.size,
         data:item.data,
     }))
     
     return filtered;

  }
  parseRequest({type,xhr,customData}){
     if(type=="createEntity"){
         console.log(customData);
     }

  }

  _() {
    _;
  }
}

export {ImagesConnector}

