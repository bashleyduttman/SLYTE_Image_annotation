class ClientMapManifest{ 
                                static map={
 "/app-init.js": [
  "/app-init.js",
  "/lyte.js"
 ]
};
                                get(file){
                                    let list =  ClientMapManifest.map[file];
                                    if(list) {
                                        return list
                                    } 
                                    return []
                                }
                            }