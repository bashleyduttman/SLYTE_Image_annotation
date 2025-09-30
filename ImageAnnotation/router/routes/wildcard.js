import {Route} from "@slyte/router"
import { WildcardComp } from "/components/javascript/wildcard-comp"
class Wildcard extends Route{
    render(){
        return {outlet:"#outlet",component:WildcardComp}
    }
}
export {Wildcard}