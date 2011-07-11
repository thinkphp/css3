var bingfight = function() {

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

             while(target.nodeType !== 1 && target.nodeName.toLowerCase() != 'body'){
                   target = target.parentNode;                    
             }  
             if(!target) {
                 return; 
             }
          return target;
     } 

};

var bingAPI = 'http://api.bing.net/json.aspx?AppId=B59F3913692A46D75ED39BA8F472DF261C05B80C&Sources=Web&Web.Count=1&Adult=Off&Web.Options=DisableHostCollapsing+DisableQueryAlterations&JsonType=callback&jsonCallback=bingfight.incoming&Query=',
    results = [], val1, val2, 
    f  = document.getElementById('f'), 
    t1 = document.getElementById('searchterm1'),
    t2 = document.getElementById('searchterm2');


    if(window.location.hash.indexOf('-vs-') !== -1) {

       var chunks = window.location.hash.split("-vs-");
           chunks[0] = chunks[0].replace("#",'');
           t1.value = chunks[0];   
           t2.value = chunks[1];
           setLoad(chunks[0],chunks[1]); 
    } 


    DOMhelp.addEvent(f,'submit',function(event){

            var val1 = t1.value,
                val2 = t2.value;

            if(val1 != "" && val2 != "") {
               setLoad(val1,val2);
            } else {
               alert("Please Provide Terms first!");
            }

    DOMhelp.cancelClick(event);    
    },false);      


    function setLoad(val1,val2) {
         loadScript(bingAPI + val1,function(){});  
         loadScript(bingAPI + val2,function(){});  
         window.location.hash = val1 + '-vs-' + val2;
    }

    function incoming(o) {

          if(!o.SearchResponse.Errors) {

             results.push({
                 term : o.SearchResponse.Query.SearchTerms, 
                 value: o.SearchResponse.Web.Total 
             }); 

             if(results.length === 2)  {
                paint(results); 
             }

          } else {

            alert("Bing faild: " + o.SearchResponse.Errors); 
          }
    } 


    function paint(results) {

             var out = '', max = 0, 
                 val1 = +results[0].value, 
                 val2 = +results[1].value;
 
                 if(val1 > val2) {
                    out += '<h2>Winner: ' + results[0].term + '</h2>';
                    max = val1;
                 } else {
                    out += '<h2>Winner: ' + results[1].term + '</h2>';
                    max = val2;
                 }

                 var scale = 270 / max,
                     h1 = 310 - ~~(val1 * scale),
                     h2 = 310 - ~~(val2 * scale);

                 out += '<ul>';

                 out += '<li style="border-top:' + h1 + 'px solid #665"><span>' + results[0].term + ':<strong>' + results[0].value + '</strong></span></li>';
                 out += '<li style="border-top:' + h2 + 'px solid #665"><span>' + results[1].term + ':<strong>' + results[1].value + '</strong></span></li>';
 
                 out += '</ul><div id="curtain"></div>';

                 document.getElementById("output").innerHTML = out; 
                 
                 results.length = 0;
    }


    function loadScript(url, callback) {

             var script = document.createElement("script");
                 script.type = "text/javascript";

             if(script.readyState) {

                script.onreadystatechange = function() {
                       if(script.readyState == 'loaded' || script.readyState == 'complete') {
                          script.onreadystatechange = null;
                          callback(); 
                       }
                }
  
             } else {
               script.onload = function() {
                   callback();
               }  
             }
             script.src = url;
             document.getElementsByTagName("head")[0].appendChild(script);    
    }

return {incoming: incoming};   
}();
