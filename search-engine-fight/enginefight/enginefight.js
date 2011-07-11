/**
 *   I used: 
 *           Object DOMhelp (addEvent,cancelClick,getTarget); 
 *           
 */
var DOMhelp = {

     addEvent: function(elem,evType,fn,useCapture) {
 
              if(elem.addEventListener) {
                return elem.addEventListener(evType, fn, useCapture);
              } else if(elem.attachEvent) {
                var r = elem.attachEvent('on'+evType, fn);
                return r; 
              } else {
                elem['on'+evType] = fn;  
              }
     },

     cancelClick: function(event) {

             if(window.event) {
                window.event.returnValue = false;
                window.event.cancelBubble = true;  
             }
             if(event && event.stopPropagation && event.preventDefault) {
                event.stopPropagation();
                event.preventDefault();
             }
     },

     getTarget: function(event) {
 
             var target = window.event ? window.event.srcElement : e ? e : null;

             while(target.nodeType != 1 && target.nodeName.toLowerCase() != 'body'){
                   target = target.parentNode;                    
             }  
             if(!target) {
                 return; 
             }
          return target;
     } 

};


var enginefight = (function(){

    //define Google WebSearch API ENDPOINT
    var googleAPI = 'http://ajax.googleapis.com/ajax/services/search/web?gl=en&userip=&hl=en&v=1.0&start=0&rsz=8&callback=enginefight.incoming&q=',
        //define Yahoo Endpoint WebSearch API
        yahooAPI  = 'http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&callback=enginefight.incoming&output=json&query=',
        //define Bing Endpoint WebSearch API
        bingAPI   = 'http://api.bing.net/json.aspx?AppId=B59F3913692A46D75ED39BA8F472DF261C05B80C&Sources=Web&Web.Count=1&Adult=Off&Web.Options=DisableHostCollapsing+DisableQueryAlterations&JsonType=callback&jsonCallback=enginefight.incoming&Query=',
          //define an array and a var val
          results = [], val,
               //get element form
               f  = document.getElementById('f'),
               //get textfield from form
               t  = document.getElementById('searchterm');

    //add handler for 'submit' event form
    DOMhelp.addEvent(f,'submit',function(event){

            //get the value of the textfield
            var val = t.value;

            //if the value is non empty then make a request
            if(val != "") {
               setLoad(val);
            //otherwise output an alert
            } else {
               alert("Please Provide Terms first!");
            }

      //prevent propagation
      DOMhelp.cancelClick(event);    
    },false);      

    //method setLoad that loads JSON from API Services Engines (Yahoo, Google, and Bing)
    function setLoad(val) {
           loadScript(googleAPI + val,function(script){ if(window.console) console.log(script); });
           loadScript(yahooAPI + val,function(script){ if(window.console) console.log(script); });
           loadScript(bingAPI + val,function(script){ if(window.console) console.log(script); });
    }      
 
    //function to fire when the data were received from Services
    function incoming(o) {

        if(window.console) {console.log(o);}

        //if Bing engine 
        if(o.SearchResponse) {
            results.push({
              term : 'Bing',
              value: o.SearchResponse.Web.Total
            }); 
        } else if(o.ResultSet){
            results.push({
              term : 'Yahoo',
              value: o.ResultSet.totalResultsAvailable 
            });
        } else {
            results.push({
              term : 'Google',
              value: o.responseData.cursor.estimatedResultCount
            });
        }

        if(results.length == 3) {
           paint(results);
        }
    }

    //this function paint bars
    //@var Object Array (results) object with properly data
    function paint(results) {

        var out = '',
            j=0,
            max = 0,
            val1 = +results[0].value,
            val2 = +results[1].value,
            val3 = +results[2].value;
  
            var arr = [val1,val2,val3];
            max = arr[0];
            for(var i=1;i<=2;i++) {
                if(arr[i]>max){
                   max = arr[i];
                   j = i; 
                }
            }
            out += '<h2>Winner: ' + results[j].term + '</h2>';
    

        var scale = 270 / max,
            h1 = 310 - ~~(val1 * scale),
            h2 = 310 - ~~(val2 * scale);
            h3 = 310 - ~~(val3 * scale);

                out += '<ul>';

                out += '<li style="border-top: '+ h1 +'px solid #665"><span>'+ results[0].term +' <strong>'+ results[0].value +'</strong> results</span></li>';
                out += '<li style="border-top: '+ h2 +'px solid #665"><span>'+ results[1].term +' <strong>'+ results[1].value +'</strong> results</span></li>';
                out += '<li style="border-top: '+ h3 +'px solid #665"><span>'+ results[2].term +' <strong>'+ results[2].value +'</strong> results</span></li>';       

                out += '</ul><div id="curtain"></div>';

            document.getElementById("output").innerHTML = out; 

            results.length = 0;

    }

    //this function inject the script in the head of the document and make a request to services API GET REST
    function loadScript(url, callback) {

             var script = document.createElement("script");
                 script.type = "text/javascript";

             if(script.readyState) {

                script.onreadystatechange = function() {
                       if(script.readyState == 'loaded' || script.readyState == 'complete') {
                          script.onreadystatechange = null;
                          callback(script); 
                       }
                }
  
             } else {
               script.onload = function() {
                   callback(script);
               }  
             }
             script.src = url;
             document.getElementsByTagName("head")[0].appendChild(script);    
    }

   return {incoming: incoming};
})();