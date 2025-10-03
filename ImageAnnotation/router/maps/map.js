import { RouterMap } from "@slyte/router";

class ImageAnnotationMap extends RouterMap {
	static path='../routes'
	map() {
		 
        this.route("index",{path:'/:page'}),
		this.route("image",{path:'edit'})
		this.route("wildcard",{path:"/*wildcard"}) 
	}
}
export {ImageAnnotationMap};
