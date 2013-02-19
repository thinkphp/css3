/*
 * cuba.js: a micro-framework JavaScript
 * copyright Adrian Statescu 2013 (@thinphp)
 * http://thinkphp.ro
 * MIT License
 */

//@namespace cuba
var cuba = {

   /**
    *  Library version
    */
    version: '1.0.5',

   /**
    *  Library name
    */
    name: 'cuba.js',
 
   /**
    *  DOM Manipulation
    */  
    select: function( selector ) {
 
            this.value = Array.prototype.slice.call( document.querySelectorAll( selector ) )

         return this
    },

    one: function( id ) { id = id.replace('#',''); this.value = [document.getElementById( id )]; return this},  

    grab: function( id ) { id = id.replace('#',''); return document.getElementById( id ) },

    getAll: function( selector) { return document.querySelectorAll( selector ) },

    getOne: function( selector) { return document.querySelectorAll( selector )[0] },

    first: function( bool ) {
 
           if(typeof bool == 'undefined') this.value = this.value.length > 0 ? [this.value[0]] : [];

              else
                    return this.value.length > 0 ? this.value[0] : null

        return this
    },

    last: function( bool ) {

           if(typeof bool == 'undefined') this.value = this.value.length > 0 ? [this.value[this.value.length-1]] : []

                   else

                     return this.value.length > 0 ? this.value[this.value.length-1]:null
         return this   
    },

    each: function(arr, fn) {

          var len = arr.length,

              index;

              for(index = 0; index < len; index++) {

                  fn.call(this, arr[ index ], index, arr)
              }

         return arr
    },

    some: function(arr, fn, scope) {
          
          for(var i = 0, j = arr.length; i < j; i++) {

              if( fn.call(scope, arr[i], i, arr) ) {

                  return true 
              }
          }  

        return false  
    },

    getStyle: document.defaultView && document.defaultView.getComputedStyle ? function(elem, property) {

               var value = null;

               if(property == 'float') { property = 'cssFloat';}      

               var computed = document.defaultView.getComputedStyle(elem, '') 

               value = computed[this.camelize(property)] 

             return elem.style[property] || value
        
        } : (ie && html.currentStyle) ? function(elem, property){

              property = this.camelize(property);

              property = property == 'float' ? 'styleFloat' : property;

              if(property == 'opacity') {

                 var val = 100;

                 try {

                   val = elem.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                 } catch( e1 ) {

                   try{

                      val = elem.filters('alpha').opacity

                   }catch( e2 ) {

                   }
                 }
              }

              var value = elem.currentStyle ? elem.currentStyle[property] : null;

            return elem.style[property] || value
              
        } : function(elem, property){ 

            return elem.style[this.camelize[property]]
    },

    css: function( v ) {
         
         this.value = this.each.call(this, this.value, function( elem ){

              elem.style.cssText = v 
         })

       return this
    },

    attr: function(a, v) {

         this.value = this.each.call(this, this.value, function( elem ){

              elem.setAttribute(a, v)
         })

       return this  
    },

    removeAttr: function( k ) {

         this.value = this.each.call(this, this.value, function( elem ){

              elem.removeAttribute(k)
         })

       return this  
    },

    html: function( h, text ) {

          var specialTags = /select|fieldset|table|tbody|tfoot|td|tr|colgroup/i,

              method = text ? 

                       document.documentElement === null ? 

                                   'innerText':'innerHTML'

                                    :

                                   'innerHTML';

              typeof h !== 'undefined' ? 

                     this.each.call(this, this.value, function(elem){
                          
                          elem[method] = h
                     })

                     :

                     this.each.call(this, this.value, function(elem){

                          elem[method] = h
                     })

         return this            
 
    },

    trim: function( s ) {

          return String.prototype.trim ? s.trim() : s.replace(/(^\s*|\s*$)/g,'')    
    },

    is: function( node ) {
          
        return node && node.nodeName && node.nodeType == 1
    },

    camelize: function( s ) {

        return s.replace(/-(.)/g, function(m,m1){

               return m1.toUpperCase();
        })  
    },

    /**
     *  Adds the specified class(es) to each of the set of matched elements.
     *  It's important to note that this method does not replace a class. It simply adds the class, appending it to any which
     *  may already be assigned to the elements.
     * 
     *  @param elem Object - the element for which add class
     *  @param c String - add specified class to the element
     *  @return (cuba) object
     */
    addClass: function(elem, c) {

          if('classList' in document.createElement('p')) {
            
              arguments.length == 1 && typeof elem == 'string' ? 

              this.value = this.each.call(this, this.value, function( el ){

                   el.classList.add( elem )

              }) : 

                   elem.classList.add( c )  

          } else {

              this.value = this.each.call(this, this.value, function( elem ){

                   elem.className = this.trim(elem.className + ' ' + c)
              })
          }

       return this
    },

    hasClass: function( el, c ) {

          if('classList' in document.createElement('p')) {

              return el.classList.contains( c )  

          } else {

              return this.classReg( c ).test(el.className)
          }

    },

    removeClass: function(elem, c ) {

         if('classList' in document.createElement('p')) {

              arguments.length == 1 && typeof elem == 'string' ? 
                      
              this.value = this.each.call(this, this.value, function( el ){

                   el.classList.remove( elem )

              }) : 
 
                   elem.classList.remove( c )                                      

         } else {

              this.value = this.each.call(this, this.value, function( elem ){

                   elem.className = this.trim(elem.className + ' ' + c)
              })
         }

       return this
    },

    classReg: function( c ) {

        return new RegExp('(^|\\s+)' + c +'(\\s+$)')
    }, 

    toggleClass: function( c ) {

        this.each.call(this, this.value, function( elem ){

             this.hasClass(elem, c) ? this.removeClass(elem, c) : this.addClass(elem, c)
        })   
    },

    /**
     *  Events Handling.     
     *
     *  A JS handler can be executed when an event occurs, like when a user click on an HTML element.
     */

    /**
      * Attach a handler to a event for the elements
      *
      */ 
    on: function(evType, fn, useCapture) {

       this.value = this.each.call(this, this.value, function( elem ){

           if(elem.addEventListener) {

              return elem.addEventListener(evType, fn, useCapture)
  
           } else if(elem.attachEvent) {
 
                  var _fn = function(){ fn.call(elem, window.event); }

                  var r = elem.attachEvent('on'+evType, _fn)

                  elem[fn.toString() + evType] = _fn
   
                  return r;

           } else {

                  elem['on'+evType] = fn
           } 
       })  

      return this
    },

    /**
     * Remove a previously-attached event handler from the elements.
     */
    unbind: function(elem,evType,fn,useCapture) {

       this.value = this.each.call(this, this.value, function( elem ){

        if(elem.addEventListener) {

           return elem.removeEventListener(evType, fn, useCapture)

        } else if(elem.detachEvent) {

           return elem.detachEvent('on'+evType, elem[fn.toString() + evType])

           elem[fn.toString() + evType] = null

        } else {

           elem['on'+evType] = function(){}
        } 

       })  

      return this
    },

    attach: function(elem, evType, fn, useCapture) {

        if(elem.addEventListener) {

              return elem.addEventListener(evType, fn, useCapture)
  
           } else if(elem.attachEvent) {
 
                  var _fn = function(){ fn.call(elem, window.event); }

                  var r = elem.attachEvent('on'+evType, _fn)

                  elem[fn.toString() + evType] = _fn
   
                  return r;

           } else {

                  elem['on'+evType] = fn
           }    
    },

    detach: function(elem,evType,fn,useCapture) {

        if(elem.addEventListener) {

           return elem.removeEventListener(evType, fn, useCapture)

        } else if(elem.detachEvent) {

           return elem.detachEvent('on'+evType, elem[fn.toString() + evType])

           elem[fn.toString() + evType] = null

        } else {

           elem['on'+evType] = function(){}
        } 
    },    

    stopPropagation: function( e ) {

        if(window.event) {

           window.event.cancelBubble = true

           window.event.returnValue = false 
        }   

        if(e.preventDefault && e.stopPropagation) {

           e.preventDefault()

           e.stopPropagation()  
        }
    },

    getTarget: function( evt ) {

         var target = window.event ? window.event.srcElement : evt ? evt.target : null  

         while(target.nodeType != 1 && target.nodeName.toLowerCase() != 'body') {

               target = target.parentNode
         }  
 
         if(!target) return false

       return target;
    },

   /**
    *  Utilities
    */
    ajax: function(method,url,callback,postData) {

                  function handleReadyState(o,callback) { 

                       o.onreadystatechange = function() {

                           if(o.readyState == 4) {

                                 if(o.status == 200) {

                                      callback(o.responseText);

                                 }
                           }
                       }
                  }


                  var XHR = function() {   
                       var http;
                       try {
                             http = new XMLHttpRequest();
                             XHR = function(){return new XMLHttpRequest();}
                           }catch(e) {
                                try {
                                     http = new ActiveXObject("Microsoft.XMLHTTP");
                                     XHR = function(){return new ActiveXObject("Microsoft.XMLHTTP");}
                                    }catch(e){} 
                           }
                      return XHR();
                 };

                 var http = XHR();
                     http.open(method,url,true);

                       if(postData) {
                            //Send the proper header information along with the request
                            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            http.setRequestHeader("Content-length", postData.length);
                            http.setRequestHeader("Connection", "close");
                       }

                       handleReadyState(http,callback);       
                       http.send(postData || null);   
 
              return http;
     },

     script: function(url, callback) {

            var s = document.createElement('script')
                s.setAttribute('type','text/javascript')
                s.setAttribute('src',url)
                s.setAttribute('id','leach')

                if(s.readyState) {

                  s.onreadystatechange = function() {

                     if(s.readyState == 'loaded' || s.readyState == 'complete') {
 
                          s.onreadystatechange = null
                          callback( s )
                          var old = document.getElementById('leach')

                          if( old ) {
                            old.parentNode.removeChild( old ) 
                          } 

                     }
                  }
                
                } else {

                  s.onload = function() {

                    callback( s )
                    var old = document.getElementById('leach')
                        if( old ) {
                            old.parentNode.removeChild( old ) 
                        } 
                  } 
                }

                document.getElementsByTagName("head")[0].appendChild(s);
     },

     loadLink: function( url ) {
                //get a reference to the head element
                var head = document.head || document.getElementsByTagName("head")[0],
                    //create a link element
                    linkEl = document.createElement('link');
                    //set attribute 'type'
                    linkEl.setAttribute('type','text/css')       
                    //set attribute 'rel'
                    linkEl.setAttribute('rel','stylesheet')
                    //set attribute 'href'
                    linkEl.setAttribute('href', url)
                    //if ok then append it
                    if( url ){

                        head.appendChild( linkEl ) 
                    }
     },

     ready: function( foo ) {

           var fns = [], fn, f = false, d = document,  

               testEl = d.documentElement, hack = testEl.doScroll,

               domContentLoaded = 'DOMContentLoaded', addEventListener = 'addEventListener',

               attachEvent = 'attachEvent',detachEvent = 'detachEvent',

               readyState = 'readyState', onreadystatechange = 'onreadystatechange',

               loaded = /^loade|c/.test(d[readyState]); 

               function flush() {

                        loaded = 1

                        while( f = fns.shift() ) f()
               }

               d[addEventListener] && d[addEventListener](domContentLoaded, fn = function(){

                     d.removeEventListener(domContentLoaded, fn, f)

                     flush()

               }, f);

               hack && d.attachEvent(onreadystatechange, fn = function(){

                  if(/^c/.test(d[readyState])) { 

                    d[detachEvent](onreadystatechange, fn)

                    flush()
                  }
               });
                
               (function( foo ) {

                      loaded ? foo() : fns.push( foo ) 

               })(foo);
     },

     /**
          A method YQL client for this micro-framework;
          Yahoo! Query Language is an expressive SQL-like language that lets you query, filter, and join data across web services.
          With YQL, apps runs faster with fewer lines of codes and smaller network footprint.
          Yahoo! and other sites across the internet make much of their structured data available to developers, primarily through
          Web Services. To access and query these services, developers traditionally endure the pain and location the right URLs and 
          documentation to access and query each Web service.

          i.e: select * from twitter.usertimeline where id='YQL'

          console: http://developer.yahoo.com/yql/console/  

          @param query String - a YQL query;
          @param callback Function - a callback function that receives the result of the query;
          @param format String - the format of the result, by default 'json';
          @param diagnostics Boolean - true or false, by default to false;
          @return - return this, c`est-a-dire this object;
               
      */
     yql: function(query, callback, format, diagnostics) {

          this.query = query;

          this.format = format || 'json';

          this.diagnostics = diagnostics || false;

          this.fetch( callback )

        return this 
     },

     fetch: function( callback ) {

         var scriptEl = document.createElement("script"),

         endpoint = 'http://query.yahooapis.com/v1/public/yql?q=',

         env = '&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',

         encodedURL = encodeURIComponent(this.query),

         format = this.format,

         id = 'YQL' + (+new Date()),

         src = endpoint + encodedURL + '&format='+ format + '&callback=cuba.' + id + '&diagnostics=' + this.diagnostics + env;

         cuba[ id ] = function( data ) {

              //for debug
              if(window.console) console.log( data )
 
              //invoke the callback function to execute
              callback( data ) 

              //delete from memory
              delete cuba[ id ]

              //delete script node
              document.body.removeChild( scriptEl )
         }

         //set type attribute
         scriptEl.setAttribute('type', 'text/javascript')

         //set src attribute
         scriptEl.setAttribute('src', src)

         //append to body dom
         document.body.appendChild( scriptEl ) 

       return this 
    },

    jsonp: function(url, callback, params, callbackname) {

       this.url = url

       this.callback = callback

       this.jsonCallbackName = callbackname || 'callback'

       if(params !== 'undefined' && typeof params == 'object'){

          var query = ''
                  for(var key in params) {
                       if(params.hasOwnProperty(key)) {
                          query += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&' 
                       } 
                  }
          this.url = this.url + '?' + query  
       }      

       this.url = this.url + '&' + this.jsonCallbackName + '=?'
   
       this.fetchjson( callback ) 

      return this 
    },

    fetchjson: function( callback ) {

       var id = new Date().getTime(),

           doc = document,  

           fn = 'callback_' + id,

           url = this.url.replace('=?','=cuba.' + fn),

           s = doc.createElement('script');

           s.setAttribute('type','text/javascript')

           cuba[ fn ] = this.evalJSON( callback )

           s.setAttribute('src', url)

           document.getElementsByTagName('head')[0].appendChild( s )

           this.s = s

           this.fn = fn
    },

    evalJSON: function( callback ) {

          return function( data ) {

                 var validjson = false;
 
                 if( typeof data == 'string' ) {

                      validjson = JSON.parse( data )

                 } else if( typeof data == 'object' ) {

                      validjson = data

                 } else {

                      validjson = JSON.parse( JSON.stringify(data) )
                 }

                 if( validjson ) {

                      callback( validjson )

                      if(window.console) console.log('VALID JSON')

                 } else {

                      if(window.console) oonsole.log('JSONP call returned invalid JSON or empty JSON') 
                 }
          }
     },

     /**
      *  cuba Effects - Fading 
      *  With cuba you can fade elements in and out of visibility  
      *
      *  - fadeIn(elem[,speed,callback])           - this method is used to fade in a hidden element.
      *  - fadeOut(elem[,speed,callback])          - this method is used to fade out in a visible element.
      *  - fadeInById(id,speed,callback)           
      *  - fadeOutById(id,speed,callback)
      */
      canTransitions: (function() {
           var t = ['transition', 'MozTransition', 'WebkitTransition', 'KhtmlTransition', 'OTransition', 'msTransition'],
           len = t.length,
           doc = document.body || document.documentElement; 
           for(var i=0;i<len;i++) {
               if('string' == typeof doc.style[t[i]]) return t[i]
           }
             
       return false;
      })(),

     /**
      * This method is used to fade in a hidden element.
      * 
      * @public method fadeIn
      * @param elem  Object -  the element to fade
      * @param speed number -  the optional speed parameter specifies the duration of the effect.    
      * @param callback     -  the optional callback parameter is the name of a function to be executed after the fading completes.
      * @return this        -  return this object (cuba)
      */
      fadeIn: function(elem, speed, callback) {

        speed = speed || 2

        this.runFade(elem, speed, 0, 100, callback)
 
        return this 
      },

     /**
      * This method is used to fade out a visible element.
      * 
      * @public method fadeIn
      * @param elem  Object -  the element to fade
      * @param speed number -  the optional speed parameter specifies the duration of the effect.    
      * @param callback     -  the optional callback parameter is the name of a function to be executed after the fading completes.
      * @return this        -  return this object (cuba)
      */
      fadeOut: function(elem, speed, callback) {

        speed = speed || 2

        this.runFade(elem, speed, 100, 0, callback)

        return this
      },

     /**
      * This method is used to fade in a hidden element.
      * 
      * @public method fadeInById
      * @param elem String  -  the id of the element to fade in.
      * @param speed number -  the optional speed parameter specifies the duration of the effect.    
      * @param callback     -  the optional callback parameter is the name of a function to be executed after the fading completes.
      * @return this        -  return this object (cuba)
      */
      fadeInById: function(id, speed, callback) {

        speed = speed || 2

        this.runFade(document.getElementById(id), speed, 0, 100, callback)

        return this
      },

     /**
      * This method is used to fade out a visible element
      * 
      * @public method fadeOutById
      * @param elem String  -  the id of the element to fade out.
      * @param speed number -  the optional speed parameter specifies the duration of the effect.    
      * @param callback     -  the optional callback parameter is the name of a function to be executed after the fading completes.
      * @return this        -  return this object (cuba)
      */
      fadeOutById: function(id, speed, callback) {

        speed = speed || 2

        this.runFade(document.getElementById(id), speed, 100, 0, callback)

        return this
      }, 

     /**
      * This method is used to fade in a hidden element.
      * 
      * @private
      * @param elem String  -  the id of the element to fade
      * @param speed number -  the optional speed parameter specifies the duration of the effect.    
      * @param callback     -  the optional callback parameter is the name of a function to be executed after the fading completes.
      * @param li           -  initial value to fade.
      * @param ls           -  finish value to fade.
      * @return this        -  return this object (cuba)
      */
      runFade: function(elem, speed, li, ls, callback) {

             var callback = callback || function(){},

                 set = function(x, alpha) {

                       x.style.filter = "alpha(opacity=" + alpha + ")";

                       x.style.opacity = alpha/100;
                 };


             if(cuba.canTransitions) { 

                elem.style.opacity = (li == 100) ? 1 : 0

                elem.style[cuba.canTransitions] = "opacity " + speed * 1000 + 'ms linear'

                elem.style.opacity = (ls == 100) ? 1 : 0

                return;
             }

             var alpha = li;

             var inc;

             if(ls >= li) {

                inc = 2;

             } else {

                inc = -2; 
             }

             var timer = (speed * 1000) / 50

             var f = window.setInterval(function(){

                     if((alpha >= ls && inc > 0) || (alpha <= ls && inc < 0)) {

                         clearInterval(f) 
                     }

                     set(elem, alpha)

                     alpha += inc

             }, timer);

       return this
     },

     /**
      *  @public method animate()
      *  @param selector String - the selector to get elements
      *  @return object (Move)
      */
     animate: function( selector ) {

            return move( selector ) 
     }
};


HTMLElement.prototype.fadeOut = function( time, fn ) {

      cuba.fadeOut(this, time)
}

HTMLElement.prototype.fadeIn = function( time, fn ) {
     
      cuba.fadeIn(this, time)
}


//cuba UI (User Interface)
cuba.UI = {

     accordion: function(accordionID, acc_hidden, urlCSS) {

        cuba.loadLink( urlCSS ) 

        var elem = cuba.grab( accordionID ) 

        //using event delegation
        cuba.attach(elem,'click', function( event ){

              var target = cuba.getTarget( event );

              if(cuba.hasClass(target.parentNode, acc_hidden))

              if(target.nodeName.toLowerCase() == 'h1') {

                   var next = [], 
                       prev = [];

                   var target = event.target,
                       el = target.parentNode
;
                   var n = el.nextSibling
                   while(n && (n.nodeType != 1 || n.nodeType != 2)) { 
                        n = n.nextSibling; 
                        next.push(n)
                   }
                   var p = el.previousSibling;
                   while(p && (p.nodeType != 1 || p.nodeType != 2)) { 
                        p = p.previousSibling; 
                        prev.push(p)
                   }   
                   var len = next.length, 
                       len2 = prev.length;

                   for(var i=0;i<len;i++) {
                       if(next[i] != null && next[i].nodeType == 1) {
                          cuba.addClass(next[i], acc_hidden)
                       } 
                   }
                   for(var i=0;i<len2;i++) {
                       if(prev[i]!= null && prev[i].nodeType == 1) {
                          cuba.addClass(prev[i], acc_hidden)
                       } 
                   }

                   cuba.removeClass(el, acc_hidden);

              }//end if

        })//end event delegation     
     },

     autocomplete: function() {
        
     },

     tabs: function() {

     }
};

//cuba badges
cuba.badges = {
 
     twitter: function() {

     },

     flickr: function() {

     },

     lastfm: function() {

     },

     weather: function() {

     }
}

//Event 'click' Handling
HTMLElement.prototype.Click = function( fn ) {

     return cuba.attach(this, 'click', fn, false)  
}

//CSS3 Animation 

/** 
 *  CSS3 transitions are effects that let an element gradually change from one style to another.
 *  How does it work?
 *
 *  To do this, you must specify two things:
 *  - specify the CSS property you want to add and effect to
 *  - specify the duration of the effect
 *
 *  The following table lists all the transitions properties
 * 
 *  transition                 - a shorthand property for setting the four transition properties into a single property;
 *  transition-property        - specifies the name of the CSS property to which to transition is applied;
 *  transition-duration        - defines the length of time that a transition takes, default to 0;
 *  transition-timing-function - describes how the speed during a transition will be calculated. Default to 'ease';
 *  transition-delay           - defines when the transition will start. default to 0; 
 *
 *
 *  CSS3 transform
 * 
 *  With CSS transform, we can move, scale, turn, spin, and strech elements
 *  methods: translate(), rotate(), scale(), skew() 
 */

;(function(exports) {

        /**
         * With CSS3 transform, we can move, scale, turn, spin, and stretch elements.
         * A transform is an effect that lets an element change shape, size and position.
         * We can transform your elements using 2D and 3D transformation.
         * 
         * IE requires the prefix -ms-
         * FF requires the prefix -moz-
         * Chrome and Safari requires the prefix -webkit-
         * Opera requires the prefix -o-
         *  
         */

        /**
         *  Defines a map of properties
         */

        var map = {
            'top': 'px',
            'bottom': 'px',
            'left': 'px',
            'right': 'px',
            'width': 'px',
            'height': 'px',
            'margin-left': 'px'  
        };

        /**
         *  selector method
         */

        exports.move = function( selector ) {

                return typeof selector == 'object' ? new Move( selector ) : new Move(move.select( selector ))
        } 


        /**
         *  Selector elements
         */

        move.select = function( selector ) {

             return document.getElementById( selector ) || document.querySelectorAll( selector )[0] 
        }

        /**
         *  Library version
         */
        move.version = '1.0.0';

        /**
         *  Defaults
         *
         *  default duration of 500ms
         */
        move.defaults = {duration: 500};


        /**
         *  Easing functions
         */
        move.ease = {
             'in'               : 'ease-in',
             'out'              : 'ease-out',
             'in-out'           : 'ease-in-out',
             'snap'             : 'cubic-bezier(0,1,.5,1)',
             'linear'           : 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
             'ease-in-quad'     : 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
             'ease-in-cubic'    : 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
             'ease-in-quart'    : 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
             'ease-in-quint'    : 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
             'ease-in-sine'     : 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
             'ease-in-expo'     : 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
             'ease-in-circ'     : 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
             'ease-in-back'     : 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
             'ease-out-quad'    : 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
             'ease-out-cubic'   : 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
             'ease-out-quart'   : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
             'ease-out-quint'   : 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
             'ease-out-sine'    : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
             'ease-out-expo'    : 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
             'ease-out-circ'    : 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
             'ease-out-back'    : 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
             'ease-out-quad'    : 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
             'ease-out-cubic'   : 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
             'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
             'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
             'ease-in-out-sine' : 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
             'ease-in-out-expo' : 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
             'ease-in-out-circ' : 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
             'ease-in-out-back' : 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'};

        var current = window.getComputedStyle || window.currentStyle;

        /**
         *  EventEmitter
         */
           
        function EventEmitter() {

                 this.callbacks = {}; 
        }; 

        EventEmitter.prototype.on = function(event, fn) {

                 (this.callbacks[ event ] = this.callbacks[ event ] || []).push( fn )

           return this
        };
        
       
        EventEmitter.prototype.emit = function( event ) {

                  var args = Array.prototype.slice.call(arguments, 1),

                      callbacks = this.callbacks[ event ],

                      len;

                      if(callbacks) {

                         len = callbacks.length;

                         for(var i=0;i<len;++i) {

                             callbacks[ i ].apply(this, args)
                         }  
                      } 

              return this
        };

        exports.Move = function Move( el ) {

                if(window.console) console.log(el) 

                if(!(this instanceof Move)) return new Move( el )

                EventEmitter.call(this) 

                this.el = el

                this._props = {}

                this._transitionProps = []

                this._transforms = []

                this._rotate = 0

                this.duration( move.defaults.duration )
        }

        Move.prototype = new EventEmitter;

        Move.prototype.constructor = Move;

        Move.prototype.setProperty = function(prop, val) {

             this._props[ prop ] = val

           return this
        } 

        /** 
         * IE requires the prefix -ms-
         * FF requires the prefix -moz-
         * Chrome and Safari requires the prefix -webkit-
         * Opera requires the prefix -o-  
         */ 

        Move.prototype.setVendorProperty = function(prop, val) {

             this.setProperty('-webkit-' + prop, val);            
             this.setProperty('-moz-' + prop, val);            
             this.setProperty('-ms-' + prop, val);            
             this.setProperty('-o-' + prop, val);            

           return this
        }

        Move.prototype.set = function( prop, val ) {

             this.transition( prop )

             if(typeof val == 'number' && map[ prop ]) val += map[ prop ]              

             this._props[ prop ] = val 

          return this
        }

        Move.prototype.transition = function( prop ) {

             this._transitionProps.push( prop )
        } 

        Move.prototype.applyProperties = function() {

             var props = this._props, 

                 elem = this.el;

                 for(var prop in props) {

                     if(props.hasOwnProperty(prop)) {

                           elem.style.setProperty(prop, props[prop],'')
                     }
                 } 

           return this
        }

        Move.prototype.then = function( fn ) {

             if( fn instanceof Move) {

                 this.on('end', function(){

                      fn.end()
                 });

             } else if(typeof fn == 'function') {

               this.on('end', fn)

             } else {

                var clone = new Move(this.el)

                    clone._transforms = this._transforms.slice(0);

                    this.then(clone)

                    clone.parent = this

                    return clone
             }

          return this;
        }

        Move.prototype.end = function( fn ) {

             var self = this;

             //apply transform properties (i.e. rotate, scale, translateX, translateY, translate) 
             if(this._transforms.length) {

                     this.setVendorProperty('transform', this._transforms.join(" "))
             }

             //apply transition properties (i.e. transition-properties: margin-left, top, left)
             this.setVendorProperty('transition-properties', this._transitionProps.join(", "))

             //apply real properties
             this.applyProperties();

             //callback given
             if(fn) this.then(fn) ;

             window.setTimeout(function(){

                    self.emit('end')

             }, this._duration);

          return this
        }

        Move.prototype.duration = function( n ) {
             
                n = this._duration = 'string' == typeof n ? parseFloat(n) * 1000 : n

             return this.setVendorProperty('transition-duration', n + 'ms'); 
        }

        Move.prototype.pop = function() {

             return this.parent
        }       

        Move.prototype.delay = function( n ) {

             n = 'string' == typeof n ? parseFloat(n) * 1000 : n

           return this.setVendorProperty('transition-delay', n + 'ms'); 
        };

        Move.prototype.ease = function( fn ) {

             fn = move.ease[ fn ] || fn || 'ease';
 
             return this.setVendorProperty('transition-timing-function', fn) 
        }


        /**
         *    In this area you will learn about the 2d transform methods:
         *       
         *    translate()     
         *    rotate()   
         *    scale()
         *    skew()
         *   
         *   Array of transforms.
         *   
         *   @param trans (String) 
         *   @return push into array _transforms for chaining and returns this Move
         */
        Move.prototype.transform = function( trans ) {

               this._transforms.push( trans )

             return this
        };


        /**
         *   Translate to (x,y) axis
         *   With the translate() method, the element moves from its current position, depending on the 
         *   given the left (X-axis) and the top (Y-axis) position. The value translate(500px,500px)
         *   moves the element 50 pixels from the left, and 100 pixels from the top.
         *   
         *   @param x (Number) - X cartesian axis
         *   @param y (Number) - Y cartesian axis
         *   @return push into array _transforms
         */
        Move.prototype.translate = Move.prototype.to = function( x, y ) {
               y = y || 0   
               return this.transform('translate(' + x + 'px, ' + y + 'px)')
        }


        Move.prototype.translateX = Move.prototype.x = function( x ) {

               return this.transform('translateX('+ x +'px)')
        }

        Move.prototype.translateY = Move.prototype.y = function( y ) {

               return this.transform('translateY('+ y +'px)')
        }

        /**
         *   Rotate n degrees.
         *   With the rotate() method, the element rotates clockwise at a given degree. Negative values are allowed
         *   and rotates the element counter-clockwise. The value (20deg) rotates the element clockwise 20 degrees 
         *   
         *   @param n (Number) rotate n degrees
         *   @return push into array of transforms for chaining
         */
        Move.prototype.rotate = function( n ) {

               return this.transform('rotate(' + n + 'deg)')
        }


        /**
         *  With the scale() method, the element increases or decreases the size, depending on the parameters given
         *  for the widht (X-axis) and the height (Y-axis)
         *  The value scale(2,3) transforms the width to be twice its original size, and the height 3 times its 
         *  original size.
         *
         *  @param x (Number) scaleX   
         *  @param y (Number) scaleY
         *  @return push into array of transforms for chaining
         */
        Move.prototype.scale = function( x, y ) {
               y = null == y ? x : y  
               return this.transform('scale(' + x + ', '+ y + ')')
        }

        /**
         *  With the scaleX() method, the element increases or decreases the width size, depending on the parameter given.
         *  
         *  @param x (Number) scaleX   
         *  @return push into array of transforms for chaining
         *   
         */
        Move.prototype.scaleX = function( x ) {

               return this.transform('scale(' + x + ')')
        }

        /**
         *  
         *  With the scaleY() method, the element increases or decreases the height size, depending on the parameter given.
         *  
         *  @param y (Number) scaleY
         *  @return push into array of transforms for chaining
         *   
         */
        Move.prototype.scaleY = function( y ) {

               return this.transform('scale(' + y + ')')
        }


        /**
         *  
         *  With the skew() method, the element turns in a given angle, depending on the parameters given for
         *  the horizontal (X-axis) and the vertical (Y-axis). The value skew(30deg,20deg) turn the element 30 degrees
         *  around the X-axis, and 20 degrees around the Y-axis.
         *
         *  @param x (Number) skewX   
         *  @param y (Number) skewY
         *  @return push into array of transforms for chaining
         */
        Move.prototype.skew = function( x, y ) {
               y = y || 0
               return this.transform('skew(' + x + 'deg, '+ y + 'deg)')
        }


        Move.prototype.skewX = function( x ) {

               return this.transform('skewX(' + x + 'deg)')
        }

        Move.prototype.skewY = function( y ) {

               return this.transform('skewY(' + y + 'deg)')
        }

})(this);

