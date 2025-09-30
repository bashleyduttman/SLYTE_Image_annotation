import { _defineProperty } from "@slyte/core/src/lyte-utils";
import './lyte-hovercard.js';
import { prop } from "../../../../@slyte/core/index.js";
import { Component } from "../component.js";
import $L from "../../../lyte-dom/modules/lyte-dom-utils.js";

/**
 * This component is used to show tooltip when its content exceeds
 * @component lyte-text
 * @version 2.2.0
 */

window._lyteUiUtils.measureFont = function( style ){
	var str = [];
		
	[ 'fontStyle', 'fontVariant', 'fontWeight', 'fontSize', 'fontFamily' ].forEach( function( item ){
		var __style = style[ item ];
		__style && str.push( __style );
	});

	return str.join( ' ' );
}

window._lyteUiUtils.check4ellipsis = function( $node, to_value, force_allow, multiLine ){
	var __width = multiLine ? "Height" : "Width",
	offwidth = $node[ "offset" + __width ],
	scrollwidth = $node[ "scroll" + __width ],
	tooltip = scrollwidth > offwidth;

	if( scrollwidth == offwidth && force_allow && !multiLine ){
		var bcr_width = $node.getBoundingClientRect().width;

		if( offwidth - bcr_width <= 0.5 ){
			var compStyle = window.getComputedStyle( $node ),
			font = compStyle.font,
			ctx = document.createElement( "canvas" ).getContext( "2d" );

			ctx.font = font || window._lyteUiUtils.measureFont( compStyle );
			var measured = ctx.measureText( to_value ).width;

			if( measured - bcr_width >= 0.015 ){
				tooltip = true;
			}
		}
	}

	return tooltip;
}

class LyteTextComponent extends Component {
    constructor() {
        super();
    }

    data(arg1) {
		var default_values = window._lyteUiUtils.getDefault( 'lyte-text' );

		return Object.assign(super.data({
			/**
			 * @componentProperty {string} ltPropValue=''
			 * @version 2.2.0
			 */
			ltPropValue : prop( 'string', { default : '' } ),
			/**
			 * @componentProperty {boolean} ltPropShow=true
			 * @version 2.2.0
			 */
			ltPropShow : prop( 'boolean', { default : default_values.show ==false ? false : true } ),
			/**
			 * @componentProperty {boolean} ltPropYield=false
			 * @version 2.2.20
			 */
			ltPropYield : prop( 'boolean', { default : default_values.yield || false } ),
			/**
			 * @componentProperty {Boolean} ltPropText
			 * @version 3.50.0
			 */
			ltPropText : prop( 'boolean', { default : default_values.text == false ? false : true } ),
			/**
			 * @componentProperty {array} ltPropArray
			 * @version 3.50.0
			 */
			ltPropArray : prop( 'array' ),
			/**
			 * @componentProperty {string} ltPropSuffix=""
			 * @version 3.50.0
			 */
			ltPropSuffix : prop( 'string', { default : default_values.suffix || "" } ),
			/**
			 * @componentProperty {string} ltPropHovercard='{}'
			 * @component lyte-hovercard
			 * @version 3.50.0
			 */
			ltPropHovercard : prop( 'string', { default : default_values.hovercard || '{}' } ),
			/**
			 * @componentProperty {string} ltPropSeparator=', '
			 * @version 3.50.0
			 */
			ltPropSeparator : prop( 'string', { default : default_values.separator || ", " } ),
			/**
			 * @componentProperty {number} ltPropWidth=0
			 * @version 3.50.0
			 */
			ltPropWidth : prop( 'number', { default : default_values.width || 0 } ),
			/**
			 * @componentProperty {number} ltPropMinCount=0
			 * @version 3.50.2
			 */
			ltPropMinCount : prop( 'number', { default : default_values.minCount || 0 } ),
			/**
			 * @componentProperty {string} ltPropTooltipConfig='{}'
			 * @component lyte-tooltip ltPropTooltipConfig
			 * @version 3.52.0
			 */
			ltPropTooltipConfig : prop( "string", { default : default_values.tooltipConfig || '{}' } ),

			ltPropRerender : prop( 'boolean', { default : false } ),

			/**
			 * @componentProperty {string} ltPropTail
			 * @version 3.98.0
			 */
			
			ltPropTail : prop( "string", { default : default_values.tail || "" } ),

			/**
			 * @componentProperty {boolean} ltPropFillAvailable=false
			 * @version 3.98.0
			 */
			ltPropFillAvailable : prop( 'boolean', { default : default_values.fillAvailable || false } ),

			/**
			 * @componentPropery {boolean} ltPropShowHovercardOnClick=false
			 * @version 3.98.0
			 */

			ltPropShowHovercardOnClick : prop( 'boolean', { default : default_values.showHovercardOnClick || false } ),

			/**
			 * @componentPropery {string} ltPropHovercardKey="Space"
			 * @version 3.98.0
			 */

			ltPropHovercardKey : prop( 'string', { default : default_values.hovercardKey || " " } ),
			
			/**
			 * @componentProperty {boolean} ltPropTag=false
			 * @version 3.103.0
			 */
			ltPropTag : prop( 'boolean', { default : default_values.hoverCardArray || false } ),

			/**
			 * @componentProperty {number} ltPropAdditionalSpace=0
			 * @version 3.103.0
			 */
			ltPropAdditionalSpace : prop( 'number', { default : 0 } ),

			/**
			 * @componentProperty {string} ltPropTabindex="-1"
			 * @version 3.103.0
			 */
			ltPropTabindex : prop( 'string', { default : "-1" } ),

			/**
			 * @componentProperty {boolean} ltPropMultiLine=false
			 * @version 3.105.0
			 */
			ltPropMultiLine : prop( 'boolean', { default : default_values.multiLine || false } ),

			renderHover : prop( 'boolean', { default : false } ),
			lyteUnbound : prop( 'boolean', { default : false } ),
			hoverCardArray : prop( 'array', { default : [] } ),
			render : prop( 'boolean' ),
			show : prop( 'boolean', { default : false } ),
			originElem : prop( 'string', { default : "" } ),
			suffix : prop( 'string', { default : "" } ),
			
			dummyText : prop( 'string', { default : "" } ),
			tailText : prop( 'string', { default : "" } ),
			renderArray : prop( 'array', { default : [] } )
		}), arg1);		
	}

    init() {
		var __data = this.data,
		arr = __data.ltPropArray;

		if( arr ){
			var $node = this.$node,
			hovercard = JSON.parse( __data.ltPropHovercard );

			__data.ltPropText = !arr;

			__data.originElem = hovercard.originElem || ( function(){
				var id = $node.id;
				if( !id ){
					id = $node.id = 'lyteText_' + parseInt( Math.random() * 10000 );
				}
				return "#" + id + ' .lyteTextSuffix>span';
			})();
		}
	}

    didDestroy() {
		$L.fastdom.clear( this.prev_fast );
	}

    render_array() {
		var __this = this,
		__data = __this.data,
		array = __data.ltPropArray,
		suffix = __data.ltPropSuffix,
		fastdom = $L.fastdom,
		__length = array.length,
		arr = [],
		separator = __data.ltPropSeparator,
		fns = 'prev_fast';

		__this.setData( 'render', true );
		
		fastdom.clear( __this[ fns ] );

		__this[ fns ] = fastdom.measure( function(){

			delete __this[ fns ];

			var $node = __this.$node,
			elem = $node.getElementsByClassName( 'lyteTextRenderDiv' )[ 0 ];

			if( !elem ){
				return;
			}

			var __child = elem.children,
			ns = 'getBoundingClientRect',
			__width = 'width',
			is_tag = __data.ltPropTag,
			additional_space = __data.ltPropAdditionalSpace,
			suffix_width = elem.nextElementSibling.children[ 0 ][ ns ]()[ __width ],
			act_width = __data.ltPropWidth || $node.offsetWidth,
			sum = 0,
			break_point,
			i = 0;

			for( ; i < __length; i++ ){
				var __div = __child[ i ],
				spans = __div.children,
				span_elem = spans[ 0 ],
				span_wid = span_elem[ ns ]()[ __width ],
				comma_wid;

				if( is_tag ){
					var __style = getComputedStyle( span_elem );
					span_wid += ( parseFloat( __style.marginInlineStart ) + parseFloat( __style.marginInlineEnd ) );
					comma_wid = 0;
					if( i + 1 != __length ){
						span_wid += additional_space;
					}
				} else {
					comma_wid = spans[ 1 ][ ns ]()[ __width ];
				}

				arr.push({
					width : span_wid,
					comma : comma_wid
				});

				sum += ( span_wid + comma_wid );

				if( sum > act_width ){
					break_point = true;
					act_width -= suffix_width;
					while( sum > act_width ){
						var __last = arr.pop();
						if( __last ){
							sum -= ( __last.width + __last.comma - additional_space );
							i--;
						} else {
							break;
						}
					}
					break;
				}
			}

			fastdom.mutate( function(){
				var str = '',
				h_arr = [],
				suffixText = "",
				to_render = [];

				if( break_point ){

					var fn = "remove";

					if( __data.ltPropFillAvailable && !is_tag ){
						i++;
						fn = "add";
					} else if( i == -1 ){
						i = /*Math.max(  */Math.min( __length, __data.ltPropMinCount ) - 1/*, 0 )*/;
						fn = "add";
					}

					$L( $node )[ fn + 'Class' ]( 'lyteTextNoSpace' );

					for( var k = 0; k < __length; k++ ){
						var __cur = array[ k ];
						if( k <= i ){
							if( is_tag ){
								to_render.push( __cur );
							} else {
								str += ( ( k ? separator : "" ) + __cur );
							}
						} else {
							h_arr.push( __cur );
						}
					}

					if( i + 1 != __length ){
						suffixText = ( suffix.replace( '{0}', ( __length - ++i ) ) );
					}

				} else {
					is_tag ? to_render = array : void 0;
					str = array.join( separator );
				}

				__this.setData({
					ltPropValue : str,
					suffix : suffixText,
					render : false,
					hoverCardArray : h_arr,
					renderHover : break_point && __data.ltPropShow,
					renderArray : to_render
				});

			});
		});
	}

    reset(__node, __value, frm_mid) {
		var $node = __node || this.$node,
		data = this.data;

		if( data.ltPropText || __node ){
			var value_to = "",
			tooltip = window._lyteUiUtils.check4ellipsis( $node,  __value || data.ltPropValue, !data.ltPropYield, data.ltPropMultiLine );

			if( tooltip && data.ltPropShow ){
				value_to = __value || data.ltPropValue;
			}
			$node.setAttribute( 'lt-prop-title', frm_mid ? ( tooltip && data.ltPropShow ? data.ltPropValue : "" ) : value_to );
		} 
	}

    over(evt) {
		var __data = this.data,
		is_click = __data.ltPropShowHovercardOnClick;

		switch( evt.type ){
			case "click" : {
				if( !is_click ){
					return;
				}
			}
			break; 
			case "keydown" : {
				var allow = true;
				if( is_click ){
					var keys = ( __data.ltPropHovercardKey || "" ).split( /\,|\|/g );
					if( keys.indexOf( evt.key ) + 1 ){
						evt.preventDefault();	
						allow = false;
					}
				} 
				if( allow ) {
					return;
				}
			}
			break;
			default : {
				if( is_click ){
					return;
				}
			}
		}

		if( !evt.target.closest( '.lyteTextSuffix' ) ){
			return;
		}

		is_click ? window.requestAnimationFrame( function(){
			this.setData( 'show', __data.ltPropShow );
		}.bind( this ) ) : this.setData( 'show', __data.ltPropShow );
	}

    static actions(arg1) {
        return Object.assign(super.actions({
			focusout : function(){
				var __data = this.data;

				if( __data.ltPropShowHovercardOnClick && __data.show ){
					this.setData( "show", false );
				}
			},

			mouse : function(){
				if( this.data.ltPropTail ){
					return;
				}
				this.reset();
			},

			over : function( evt ){
				this.data.ltPropArray && this.over( evt );
			},

			submouse : function( __this ){
				if( $L( this.$node ).hasClass( 'lyteTextNoSpace' ) /*&& data.ltPropMinCount*/ ){
					this.reset( __this, this.data.ltPropValue );
				}
			},

			tailmouse : function( __this ){
				this.reset( __this, this.data.dummyText, true );
			}
        }), arg1);
    }

    static methods(arg1) {
        return Object.assign(super.methods({
			beforeHide : function( __node, evt ){
				if( this.data.ltPropShowHovercardOnClick && ( evt || {} ).type == "mouseleave" ){
					return false;
				}
				return true;
			}
        }), arg1);
	}

    static observers(arg1) {
        return Object.assign(super.observers({
			value_obs : function( arg ){
				var text = this.data.ltPropValue,
				tail = this.data.ltPropTail;
		
				if( tail ){
					var regx = new RegExp( tail ),
					match = text.match( regx )[ 0 ] || "";
		
					this.setData({
						dummyText : text.slice( 0, -match.length ),
						tailText : match
					});
		
					if( !arg ){
						this.$node.classList.add( "lyteTextNoSpace" );
					}
				}
		
			}.observes( 'ltPropValue' ).on( 'init' ),

			rerender_obs : function( arg ){
				if( arg.newValue && this.data.ltPropArray ){
					this.render_array();
					this.setData( arg.item, !1 );
				}
			}.observes( 'ltPropRerender' ),
		
			didCnt : function( arg ){
				if( this.data.ltPropArray ){
					this.render_array();
				} else if( !arg && this.data.ltPropMultiLine ){
					var $node = this.$node,
					__attr = 'lt-prop-tooltip-style',
					__style = $node.getAttribute( __attr );
		
					$node.classList.add( "lyteTextWithMultipleLineContent" );
					!__style && ( __style = "width:50%;" ) && $node.setAttribute( __attr, __style );
				}
			}.observes( 'ltPropSuffix', 'ltPropArray', 'ltPropArray.[]', 'ltPropWidth' ).on( 'didConnect' )
		}), arg1);
	}

    _() {
        _;
    }
}

LyteTextComponent._template = "<template tag-name=\"lyte-text\" lt-prop-title=\"\" onmouseenter=\"{{action('mouse')}}\" onmouseover=\"{{action('over',event)}}\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropText}}\" is=\"case\" lc-id=\"lc_id_0\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropYield}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-yield class=\"lyteTextYield\" yield-name=\"lyte-text\" lt-prop-value=\"{{ltPropValue}}\"></lyte-yield> </template><template default=\"\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropTail}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteTextWrapper\" onmouseenter=\"{{action('tailmouse',this)}}\" lt-prop-tooltip-class=\"lyteTextTooltip\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\">{{dummyText}}</span> <span class=\"lyteTextTail\">{{tailText}}</span> </template><template default=\"\">{{ltPropValue}}</template></template> </template></template> </template><template default=\"\"> <span class=\"lyteTextWrapper\" onmouseenter=\"{{action('submouse',this)}}\" lt-prop-tooltip-class=\"lyteTextTooltip\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\">{{ltPropValue}}</span> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{suffix}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteTextSuffix\" onclick=\"{{action('over',event)}}\" onkeydown=\"{{action('over',event)}}\" onfocusout=\"{{action('focusout',event)}}\">{{unescape(suffix)}}</span> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{renderHover}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-hovercard lt-prop=\"{{ltPropHovercard}}\" lt-prop-hide-on-click=\"{{ltPropShowHovercardOnClick}}\" lt-prop-origin-elem=\"{{originElem}}\" lt-prop-show=\"{{lbind(show)}}\" on-hovercard-before-hide=\"{{method('beforeHide')}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content> <template items=\"{{hoverCardArray}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteTextHovercardList\">{{item}}</div> </template> </lyte-hovercard-content> </template> </lyte-hovercard> </template></template> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{render}}\" is=\"case\" lc-id=\"lc_id_0\"> <div class=\"lyteTextRenderDiv\"> <template items=\"{{ltPropArray}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteTextIndividual\"> <span class=\"lyteTextWord\">{{item}}</span> <span class=\"lyteTextComma\">{{unescape(ltPropSeparator)}}</span> </div> </template> </div> <div class=\"lyteTextSuffix\"> <span>{{unescape(ltPropSuffix)}}</span> </div> </template></template> </template>";;
LyteTextComponent._dynamicNodes = [{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"i","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,0],"cn":"lc_id_0"},{"t":"tX","p":[3,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[0],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,0],"cn":"default"},{"t":"s","p":[3],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"default"},{"t":"s","p":[5],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1,1]},{"t":"f","p":[1,1],"dN":[{"t":"tX","p":[1,0]}],"in":1,"sibl":[0]},{"t":"cD","p":[1],"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":1,"sibl":[0]},{"t":"s","p":[2],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1,1],"cn":"lc_id_0"},{"t":"f","p":[1,1],"dN":[{"t":"tX","p":[1,1,0]},{"t":"tX","p":[1,3,0]}],"cn":"lc_id_0"},{"t":"tX","p":[3,1,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":0},{"type":"dc","trans":true,"hc":true,"p":[1]}];;

LyteTextComponent._observedAttributes = [
    "ltPropValue",
    "ltPropShow",
    "ltPropYield",
    "ltPropText",
    "ltPropArray",
    "ltPropSuffix",
    "ltPropHovercard",
    "ltPropSeparator",
    "ltPropWidth",
    "ltPropMinCount",
    "ltPropTooltipConfig",
    "ltPropRerender",
    "ltPropTail",
    "ltPropFillAvailable",
    "ltPropShowHovercardOnClick",
    "ltPropHovercardKey",
    "ltPropTag",
    "ltPropAdditionalSpace",
    "ltPropTabindex",
    "ltPropMultiLine",
    "renderHover",
    "lyteUnbound",
    "hoverCardArray",
    "render",
    "show",
    "originElem",
    "suffix",
    "dummyText",
    "tailText",
    "renderArray"
];

window.addEventListener( "resize", function(){
	clearTimeout( window.__lyteTextTimeout );
	window.__lyteTextTimeout = setTimeout( function(){
		window.__lyteTextTimeout = void 0;

		var elems = document.getElementsByTagName( "lyte-text" ),
		len = elems.length;

		for( var i = 0; i < len; i++ ){
			var cur = elems[ i ];

			if( cur.ltProp( 'array' ) ){
				cur.component.render_array();
			}
		}

	}, 100 );
}, true );

/**
 * Now ellipsis tooltip can be extended for non lyte-text elements also. Elements having the mentioned class will be considered as ellipsis element
 */

document.addEventListener( "mouseover", function( evt ){
	var cls_name = 'lyteTextEllipsisNode',
	target = evt.target;
	
	if( $L( target ).hasClass( cls_name ) ){
		var __attr = "lt-prop-title",
		to_value = target.getAttribute( "data-lyte-text-tooltip" ) || target.textContent.trim();

		if( window._lyteUiUtils.check4ellipsis( target, to_value, true, false ) ){
			target.setAttribute( __attr, to_value );
		} else {
			target.removeAttribute( __attr );
		}
	}
}, true );

/**
* @syntax nonYielded
* <lyte-text lt-prop-value = "some long text having higher width"></lyte-text>
*/

/**
*  @syntax staticBuilder
*  <lyte-text lt-prop-value = "Some long text to be displayed"></lyte-text>
*/

/**
* @syntax yielded
* <lyte-text lt-prop-yield = true lt-prop-value = "some long text having higher width">
* 	 <template is = "registerYield" yield-name = "lyte-text">
*		your value
*	 </template>
* </lyte-text>
*/

/**
* @syntax Array of text
*	<lyte-text lt-prop-array = '[ "Text1", "Text2", "Text3" ]'></lyte-text>
*/
export { LyteTextComponent };

LyteTextComponent.register("lyte-text", {
    hash: "LyteTextComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});