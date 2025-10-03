import {Image as Image} from '/router/routes/image.js';
import {Index as Index} from '/router/routes/index.js';
import {Wildcard as Wildcard} from '/router/routes/wildcard.js';

import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { RouterMap } from "../../node_modules/@slyte/router/index.js";

class ImageAnnotationMap extends RouterMap {
    map() {
		 
        this.route("index",{
            path:'/:page',
            handler: Index
        }),
		this.route("image",{
            path:'edit',
            handler: Image
        })
		this.route("wildcard",{
            path:"/*wildcard",
            handler: Wildcard
        }) 
	}

    _() {
        _;
    }
}

ImageAnnotationMap.path = '../routes';
export {ImageAnnotationMap};
