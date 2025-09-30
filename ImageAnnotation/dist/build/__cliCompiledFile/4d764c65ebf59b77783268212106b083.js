import { _defineProperty } from "@slyte/core/src/lyte-utils";
import './lyte-wormhole.js';
import './lyte-popover.js';
import { prop } from "../../../../@slyte/core/index.js";
import { Component } from "../component.js";
import $L from "../../../lyte-dom/modules/lyte-dom-utils.js"

/**
 * Renders a hovercard
 * @component lyte-hovercard
 * @dependencies lyte-popover
 * /components/lyte-popover.js
 * /theme/compiledCSS/default/ltr/lyte-ui-popover.css
 * @version  3.1.0
 * @methods beforeRender,afterRender,onHovercardShow,onHovercardHide,onHovercardBeforeHide
 */
class LyteHovercardComponent extends Component {
  constructor() {
    super();
  }

  data(arg1) {
    return Object.assign(super.data({
      /** 
       * @componentProperty {boolean} ltPropDisplay=true
       * @version 3.1.0
       */
      'ltPropDisplay' : prop( 'boolean', { 'default' : true } ),
      /** 
       * @componentProperty {boolean} ltPropShow=false
       * @version 3.1.0
       */
        'ltPropShow' : prop( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropOriginElem=''
       * @version 3.1.0
       */
        'ltPropOriginElem' : prop( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropMaxHeight=''
       * @version 3.1.0
       */
        'ltPropMaxHeight' : prop( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropWidth=''
       * @version 3.1.0
       */
        'ltPropWidth' : prop( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropHeight=auto
       * @version 3.1.0
       */
        'ltPropHeight' : prop( 'string', { 'default' : 'auto' } ),
        /** 
       * @componentProperty {string} ltPropPlacement=''
       * @version 3.1.0
       */
        'ltPropPlacement' : prop( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropClass=''
       * @version 3.1.0
       */
        'ltPropClass' : prop( 'string', { 'default' : window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'class', '' ) } ),
        /** 
       * @componentProperty {string} ltPropId=''
       * @version 3.1.0
       */
        'ltPropId' : prop( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropShowDelay=0
       * @version 3.1.0
       */
        'ltPropShowDelay' : prop( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropHideDelay=0
       * @version 3.1.0
       */
        'ltPropHideDelay' : prop( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropMaxDisplayTime=5000
       * @version 3.1.0
       */
        'ltPropMaxDisplayTime' : prop( 'number', { 'default' : 5000 } ),
        /** 
       * @componentProperty {boolean} ltPropKeepAlive=false
       * @version 3.1.0
       */
        'ltPropKeepAlive' : prop( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {boolean} ltPropFollowCursor=false
       * @version 3.1.0
       */
        'ltPropFollowCursor' : prop( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropPopoverWrapperClass
       * @version 3.1.0
       */
        'ltPropPopoverWrapperClass' : prop( 'string',{'default': window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'popoverWrapperClass', '' ) }),
        /** 
       * @componentProperty {object} ltPropOffset={}
       * @version 3.1.0
       */
        'ltPropOffset' : prop( 'object', { 'default' : {} } ),
        /** 
       * @componentProperty {boolean} ltPropCloseOnEscape=true
       * @version 3.1.0
       */
        'ltPropCloseOnEscape' : prop( 'boolean', { 'default' : true } ),
        /** 
        * @componentProperty {boolean} ltPropAutoShow=false
        * @version 3.1.0
        */
        'ltPropAutoShow' : prop( 'boolean', { 'default' : false}),
         /** 
        * @componentProperty {boolean} ltPropHideOnClick=false
        * @version 3.1.0
        */
        'ltPropHideOnClick' : prop( 'boolean', { 'default' : window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'hideOnClick', false ) } ),
         /**
          * @componentProperty {boolean} ltPropAria
          * @version 3.1.0
          * @default false
          *
          */
        "ltPropAria" : prop( 'boolean', { default : false } ),
        /**
         * @componentProperty {object} ltPropAriaAttributes={}
         * @version 3.1.0
         */
        "ltPropAriaAttributes" : prop( 'object', { default : {} } ),
         /**
         * @componentProperty {boolean} ltPropPreventFocus=true
         */
        "ltPropPreventFocus" : prop('boolean', { default : true } ),
         /**
         * @componentProperty {string} ltPropMaxWidth
         */
        "ltPropMaxWidth" : prop('string',{default:''}),
        "ltPropType" : prop('string',{default :'callout'}),
        "ltPropDimmer":prop("object",{"default":{"color":"black","opacity":"0.4"}}),
        "ltPropAnimation":prop("string",{"default":"fade"}), //fade,zoom
        "ltPropAutoAlign" : prop('boolean', {default : false}),

        'mousePosition' : prop( 'array', { 'default' : [] } ),
        'mouseover' : prop( 'boolean', { 'default' : false } ),
        'originEle' : prop( 'string', { 'default' : ''})

    }), arg1);   
  }

  init() {
    if( this.getMethods( 'beforeRender' ) ){
            this.executeMethod( 'beforeRender', this.$node );
      }
  }

  didConnect() {
    this._popover = this.$node.getElementsByTagName('lyte-popover')[0]
    this._hovercardScroll = this.hovercardScroll.bind( this );
    this._hovercardHideOnClick = this.hovercardHideOnClick.bind(this)
    this._mousemove = this.mousemove.bind(this);
    this._oriEleMouseMove = this.oriEleMousemove.bind(this)
    if(this.getData('ltPropAutoShow') && this.getData('ltPropOriginElem')){
      this.setMouseMove()
    }
    $L.fastdom.measure( function() {
         var fg = window.getComputedStyle( this.$node ).getPropertyValue( 'direction' ) == 'rtl';
         $L.fastdom.mutate( function(){
           if( fg ) {
             this.direction = true;
           }
         }.bind( this ) )
    }.bind( this ) )
    window._lyteUiUtils.dispatchEvent( 'afterrender', this.$node ); 

    if( this.getMethods( 'afterRender' ) ) {
       this.executeMethod('afterRender', this.$node);
    }
  }

  didDestroy() {
    this.$node.classList.remove('lyteActive')
    if( this.getData( 'ltPropHideOnClick') ){
      document.removeEventListener( 'click' , this._hovercardHideOnClick )
    }
    var originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ) 

    if(originElem ){
      this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
      this.removeEventListenerForOriginElem(originElem)

    }
    if(this._popover){
      this._popover.setData('ltPropShow',false)
    }
    if(window._lyteUiUtils.lyteHovercard){
      delete window._lyteUiUtils.lyteHovercard[this.$node.ltProp( 'originElem' ) ]

    }
    if( this._childComp ){
      this._childComp.remove()
    }
    if(this.getData('ltPropAutoShow')){
      document.removeEventListener('mousemove',this._mousemove)
    }
    delete this.prevHoverCardNode;
    delete this._childComp;
    delete this._popover;
  }

  setMaxHeightAndWidth(div) {
    if(this.getData('ltPropMaxWidth')){
      div.style.maxWidth = this.getData('ltPropMaxWidth')
    }
    if(this.getData('ltPropMaxHeight')){
      div.style.maxHeight = this.getData('ltPropMaxHeight')
    }
  }

  isNode(target) {
   return target instanceof HTMLElement || target instanceof Node;  

 }

  addEventListenerForOriginElem(originElem) {
    if(originElem){
      originElem.addEventListener( 'mousemove', this._oriEleMouseMove )
    }
  }

  removeEventListenerForOriginElem(originElem) {
    if(originElem){
      originElem.removeEventListener( 'mousemove', this._oriEleMouseMove )
    }
    this.setData( 'mousePosition', [] )
    this.setData( 'mouseover', false )

  }

  hovercardHideOnClick(event) {
    var target = event.target,
    popoverWormhole = this._popover.component.actualModalDiv;
    if( this.getData( 'ltPropHideOnClick' ) && this.getData( 'ltPropShow' ) && this.isNode(target) && !( target === popoverWormhole || popoverWormhole.contains( target ) ) ){
          this.setData( 'ltPropShow', false )
      }
  }

  oriEleMousemove(eve) {

    if( !this.getData( 'mouseover' ) ) {
        this.mouseovereve( eve )
        this.setData( 'mouseover', true )
    }
    var currMpos = [ eve.clientX, eve.clientY ];
    var mpos = this.getData( 'mousePosition' );
    var diff = [ currMpos[ 0 ] - ( mpos[ 0 ]? mpos[ 0 ] : 0 ), currMpos[ 1 ] - ( mpos[ 1 ] ? mpos[ 1 ] : 0 ) ];
    if( this._popover.ltProp( 'show' ) && this._popover.component.childComp) {
      var popupEle = $L( '.lyteHoverCardFollowCursor .lytePopover' ,this._popover.component.childComp)[ 0 ];
      var clientRect = popupEle.getBoundingClientRect();
      popupEle.style.top = clientRect.top + diff[ 1 ] + 'px';
      popupEle.style.left = clientRect.left + diff[ 0 ] + 'px';
    }
    this.setData( 'mousePosition', currMpos );
  }

  mouseovereve(eve) {
    var mpos = [ eve.clientX, eve.clientY ];
    var pos = '';
    var clientRect = document.querySelector( this.$node.ltProp( 'originElem' ) )
    
    this._popover.ltProp( {
      offset : { left : mpos[ 0 ] - 9, top : mpos[ 1 ] - 9, height : 18, width : 18 }
    } )
    this.setData('ltPropOffset',{ left : mpos[ 0 ] , top : mpos[ 1 ] , height : 18, width : 18 })
    this.setData( 'mousePosition', mpos );
  }

  mousemove(event) {
    var nodeName1 = event.target.correspondingElement || event.target;
    while(nodeName1 && nodeName1.tagName != 'BODY' && nodeName1 != document && nodeName1.tagName != 'HTML' ){
        
        var iHovercard = nodeName1.getAttribute( 'lyte-hovercard' );

        if( iHovercard ){
          var hovercard = this.findMatchingHoverCard(nodeName1);
          if( hovercard && !hovercard.getData('ltPropShow')){
             hovercard.setData('ltPropShow',true);
          } 
          break;
          
        }
        else {
            nodeName1 = nodeName1.parentNode;
        }  
    }
  
}

  findMatchingHoverCard(node) {
    for(var item in window._lyteUiUtils.lyteHovercard){
       if(node.matches(item)){
         return window._lyteUiUtils.lyteHovercard[item];
       }
   }
  }

  setMouseMove() {
     var map = window._lyteUiUtils.lyteHovercard ? window._lyteUiUtils.lyteHovercard : []
     map[this.$node.ltProp( 'originElem' )] = this.$node;
     window._lyteUiUtils.lyteHovercard = map;
     document.addEventListener('mousemove',this._mousemove)
   }

  compouteOffset(popover) {
      var arr = [ 'ltPropWidth', 'ltPropHeight' ];
      for( var i = 0; i < arr.length; i++ ) {
            if( this.getData( arr[ i ] ) ) {
                  popover.setData( arr[ i ], this.getData( arr[ i ] ) )
            }
       }
  }

  createHoverCard(event, popoverWormhole) {
    var popover = this._popover
    if(popover){
      window._lyteUiUtils.dispatchEvent( 'beforeshow', this.$node, { originalEvent: event } ); 
       var res = true;
        if( this.getMethods( 'onBeforeHovercardShow' ) ) {
          res = this.executeMethod('onBeforeHovercardShow', this.$node );
        }
        if(!res){
          return false
        }
        popover.ltProp( 'show', true )
        popover.ltProp( 'allowMultiple', true)
        this.$node.classList.add( 'lyteActive' )
        if( this.getMethods( 'onHovercardShow' ) ) {
                this.executeMethod('onHovercardShow', this.$node );
        }
    }
    if( !this.getData( 'ltPropKeepAlive' ) && !this.getData('ltPropFollowCursor')) {
          var originElem = document.querySelector( this.$node.ltProp( 'originElem' ) )

          popover._maxdisp = setTimeout( function() {
            this.removeHoverCard(popover, originElem, event, popoverWormhole)
          }.bind( this ), this.getData( 'ltPropMaxDisplayTime' ) );
    }
    
  }

  removeTimeout(popover) {
        clearTimeout( popover._settime )
        clearTimeout( popover._maxdisp )
        clearTimeout( popover._bodyTimeout )
  }

  closeHoverCard(event) {
      var wormHole = this._childComp,
       popoverWormhole = this._popover.component.actualModalDiv,
       popover = this._popover,
       originElem = document.querySelector( this.$node.ltProp( 'originElem' ) )
      if(  this.prevHoverCardNode && this.isNode(event.target) && ( this.getData('ltPropFollowCursor') || event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) && popoverWormhole && event.relatedTarget != popoverWormhole && !popoverWormhole.contains( event.relatedTarget )) {
                popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event ) ;

          } else if( popoverWormhole  && this.isNode(event.relatedTarget ) && (event.relatedTarget == popoverWormhole || popoverWormhole.contains( event.relatedTarget )  )  ) {  
              this.removeTimeout( popover )
              this._popovermouseleave = this.popoverMouseLeave.bind( this )
              popoverWormhole.addEventListener( 'mouseleave', this._popovermouseleave )
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
  
           } 
  }

  removeHoverCard(popover, originElem, event, popoverWormhole) {
    var res = true
    if(this.getMethods( 'onHovercardBeforeHide' ) ) {
          res = this.executeMethod( 'onHovercardBeforeHide', this.$node, event );
          if( !res && originElem){
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
              if( this._popovermouseleave && popoverWormhole ){
                popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
              }
          }
    }
    if( res && ( ( this.prevHoverCardNode  && this.isNode(event.target) && ( event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) ) || ( popoverWormhole  && this.isNode(event.target) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) ) ) ){
            this.removeTimeout( popover )

            if( this.getData( 'ltPropShow' ) && popover ) {
                    this.setData( 'ltPropShow', false )
                    popover.setData( 'ltPropShow',false )
                }  
    }
  }

  popoverMouseLeave(event) {
    var wormHole = this._childComp ,
    popoverWormhole = this._popover.component.actualModalDiv ,
    popover = this._popover ,
    originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ),
    element =document.elementFromPoint(event.clientX, event.clientY)
   if( popoverWormhole  && this.isNode(event.target) && !popoverWormhole.contains(element) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) && event.relatedTarget != this.prevHoverCardNode && !this.prevHoverCardNode.contains( event.relatedTarget ) ) {
     popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event, popoverWormhole );
   }
   else if( this.prevHoverCardNode  && this.isNode(event.relatedTarget) && ( event.relatedTarget == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.relatedTarget ) ) ) {
         popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), event, popoverWormhole );
         this._closeHoverCard = this.closeHoverCard.bind( this )
         originElem.addEventListener( 'mouseleave', this._closeHoverCard )
         if( this._popovermouseleave ){
           popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
         }

   }
  }

  hovercardScroll(event) {
    if($L(this.$node).hasClass("lyteActive")){
    var res = true
        var component = this,
            wormHole = component._childComp ,
            popoverWormhole = component._popover.component.actualModalDiv ,
            popover =component._popover ,
            originElem = document.querySelector( this.getData('ltPropOriginElem') )
            
        if(component.getMethods( 'onHovercardBeforeHide' ) ) {
            res = component.executeMethod( 'onHovercardBeforeHide', component.$node );
            if( !res && originElem){
                originElem.removeEventListener( 'mouseleave', component._closeHoverCard )
                if(  component._popovermouseleave && popoverWormhole ){
                    popoverWormhole.removeEventListener( 'mouseleave', component._popovermouseleave )
                  }
            }
        }
        if(res ){
            
            if( component.getData( 'ltPropShow' ) && popover ) {
                component.setData( 'ltPropShow', false )
                
            }
            if( component.prevHoverCardNode ) {
              delete component.prevHoverCardNode
            }
            component.removeTimeout( popover )
        }
      
      }
  }

  static methods(arg1) {
    return Object.assign(super.methods({
      beforeWormholeAppend : function(args){
        this._childComp = args
      }
    }), arg1);
  }

  static observers(arg1) {
    return Object.assign(super.observers({
      originEleObs : function(arg){
        
        if( window._lyteUiUtils.lyteHovercard){
          var originElem = document.querySelector( arg.oldValue  )  
          if(originElem ){
            this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
            this.removeEventListenerForOriginElem(originElem)

          }
          delete window._lyteUiUtils.lyteHovercard[ arg.oldValue ]
          window._lyteUiUtils.lyteHovercard[this.getData( 'ltPropOriginElem' )] = this.$node
          this.setData('ltPropShow', false)
        } else {
          this.setMouseMove()
        }
    
       
      }.observes('ltPropOriginElem'),

      showToggled : function() {

          var popover = this._popover
          if( popover.component && !popover.getData( 'ltPropBindToBody' ) ) {
              popover.ltProp( 'bindToBody', true )
          }
          var wormHole = this._childComp.querySelector('.hoverCardWrapper' ),
           popoverWormhole = this._popover.component.actualModalDiv,
           originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ) 
          if( this.getData( 'ltPropShow' ) && originElem ) {
              this.prevHoverCardNode = originElem;
              if( this.getData( 'ltPropHideOnClick') ){
                  document.addEventListener( 'click' , this._hovercardHideOnClick )
              }
             
              window._lyteUiUtils.appendChild( popoverWormhole, wormHole )

              popover.ltProp( 'originElem', this.getData( 'ltPropOriginElem' ) )
              popover.ltProp( 'freeze', false )
              popover.ltProp( 'duration', undefined )
              // popover.ltProp('offset',this.getData('ltPropOffset'))
              // popover.ltProp('preventFocus',this.getData('ltPropPreventFocus'))
              // popover.ltProp( 'closeOnEscape', this.getData( 'ltPropCloseOnEscape' ) )
              this.compouteOffset( popover );
              this.setMaxHeightAndWidth(wormHole)
              // if(this.getData('ltPropPopoverWrapperClass')){
              //    popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+' '+ this.getData('ltPropPopoverWrapperClass'))
              // }
              if( this.getData( 'ltPropFollowCursor' ) ) {
                  this.addEventListenerForOriginElem( originElem )
                  // popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+ ' lyteHoverCardFollowCursor' )
              }
            
              popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), window.event, popoverWormhole );
              
              this._closeHoverCard = this.closeHoverCard.bind( this )
              originElem.addEventListener( 'mouseleave', this._closeHoverCard )
          }
          else{
               popover.ltProp( 'show', false )

              popover.ltProp( 'bindToBody', false )
              // popover.setData( 'ltPropWrapperClass', 'lyteHovercardPopover' )
              this.$node.classList.remove( 'lyteActive' )
              if(originElem){
                originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
              }
              if( this._popovermouseleave ){
                  popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )

              }
               if( this.getData( 'ltPropHideOnClick') ){
                document.removeEventListener( 'click' , this._hovercardHideOnClick )
              }
              this.removeEventListenerForOriginElem( originElem )
              if( this.getMethods( 'onHovercardHide' ) ) {
                  this.executeMethod( 'onHovercardHide', this.$node );
              }
              if( this.prevHoverCardNode ) {
                  delete this.prevHoverCardNode
              }
              delete this._childComp;
              delete this._mousedownFlag;
              this.removeTimeout( popover )
          }
      }.observes( 'ltPropShow' )
    }), arg1);
  }

  _() {
    _;
  }
}

LyteHovercardComponent._template = "<template tag-name=\"lyte-hovercard\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropShow}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-wormhole case=\"{{ltPropShow}}\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"hoverCardWrapper {{ltPropClass}}\" id=\"{{ltPropId}}\"> <lyte-yield yield-name=\"hoverCardYield\"></lyte-yield> </div> </template> </lyte-wormhole> </template></template> <lyte-popover class=\"lyteHoverCard\" lt-prop-aria=\"{{ltPropAria}}\" lt-prop-aria-attributes=\"{{ltPropAriaAttributes}}\" lt-prop-wrapper-class=\"lyteHovercardPopover {{ltPropPopoverWrapperClass}} {{if(ltPropFollowCursor,'lyteHoverCardFollowCursor','')}}\" lt-prop-close-on-body-click=\"false\" lt-prop-type=\"{{ltPropType}}\" lt-prop-show-close-button=\"false\" lt-prop-bind-to-body=\"true\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-offset=\"{{ltPropOffset}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-prevent-focus=\"{{ltPropPreventFocus}}\" lt-prop-dimmer=\"{{ltPropDimmer}}\" lt-prop-animation=\"{{ltPropAnimation}}\" lt-prop-auto-align=\"{{ltPropAutoAlign}}\"> <template is=\"registerYield\" yield-name=\"popover\"> </template> </lyte-popover> </template>";;
LyteHovercardComponent._dynamicNodes = [{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}},"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1]},{"t":"i","p":[1,1],"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":2,"sibl":[1]},{"t":"a","p":[3]},{"t":"r","p":[3,1],"dN":[],"in":1,"sibl":[0]},{"t":"cD","p":[3],"in":0},{"type":"dc","trans":true,"hc":true,"p":[2,0]}];;

LyteHovercardComponent._observedAttributes = [
  "ltPropDisplay",
  "ltPropShow",
  "ltPropOriginElem",
  "ltPropMaxHeight",
  "ltPropWidth",
  "ltPropHeight",
  "ltPropPlacement",
  "ltPropClass",
  "ltPropId",
  "ltPropShowDelay",
  "ltPropHideDelay",
  "ltPropMaxDisplayTime",
  "ltPropKeepAlive",
  "ltPropFollowCursor",
  "ltPropPopoverWrapperClass",
  "ltPropOffset",
  "ltPropCloseOnEscape",
  "ltPropAutoShow",
  "ltPropHideOnClick",
  "ltPropAria",
  "ltPropAriaAttributes",
  "ltPropPreventFocus",
  "ltPropMaxWidth",
  "ltPropType",
  "ltPropDimmer",
  "ltPropAnimation",
  "ltPropAutoAlign",
  "mousePosition",
  "mouseover",
  "originEle"
];

window.addEventListener( 'scroll', function(event) {
   window.clearTimeout( window._lyteUiUtils._expressDebounce );

  window._lyteUiUtils._expressDebounce = setTimeout( function() {

    var activeHovercard = document.querySelector('lyte-hovercard.lyteActive')
    if(activeHovercard){
       var popover = activeHovercard.component._popover
       if(popover){
        var childComp = popover.component.actualModalDiv
        var target = arguments[0].target
        if(childComp.contains(target)){
          return;
        }
       }
    }


      var hovercard = document.getElementsByTagName( 'lyte-hovercard' ),
      i = 0;
     
          for( ; i < hovercard.length; i++ ) {
              if( hovercard[ i ] ){
                  hovercard[ i ].component.hovercardScroll();
              }
          
      }   
  }, 250,event );
  
}, true );

/**
 * @syntax yielded
 * <lyte-hovercard>
 *     <template is = "registerYield" yield-name = "hoverCardYield">
 *         <lyte-hovercard-content>
 *             //Some Content
 *         </lyte-hovercard-content>
 *     </template>
 * </lyte-hovercard>
 */
export { LyteHovercardComponent };

LyteHovercardComponent.register("lyte-hovercard", {
  hash: "LyteHovercardComponent_4",
  refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});
