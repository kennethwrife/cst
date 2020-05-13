// CST
$(window).ready(function(){ 

  // prevent for history back or forward
//   history.pushState(null, null, location.href); history.back(); history.forward(); window.onpopstate = function () { history.go(1); };
  //callback to open each tab after the PerspectivesLoadedEvent gets fired
  var callback = function(args) {
	  /** timeout decreased from 3000 */
    setTimeout(function(){ fetchAndOpenTabs(); }, 1000);
  };

  //add the handler as soon as it becomes available
        var functionTimed = function(){
	  // test if we already have defined tabs
          if(typeof mantle_openTab != "undefined"){
	    // tabs are already set, do not do it again
            window.clearInterval(timeoutMangeOpenTab);
            callback(); // do callback() to setTimeout again
          } else {
	    // tabs are not set, define them
            if(typeof mantle_addHandler != "undefined"){
              console.log("CST: functionTimed3 " + (typeof mantle_addHandler) );
              window.top.mantle_addHandler("PerspectivesLoadedEvent", callback);
              window.clearInterval(timeoutMangeOpenTab);
            } else {
              //set runs interval again
            }
          }
        };

  var timeoutMangeOpenTab = setInterval(functionTimed, 100);

  // fetch configuration
  async function fetchAsync () {
		let data = await ( await fetch(CONTEXT_PATH + "plugin/cst/api/readConfigOnce" )).json();
		return data;
		} /*fetchAsync*/

  //setup tabs using new or stored data
  var setupTabs = function(data) {
        if(data.resultset){
          //console.log("CST: setupTabs resultset =  " + data.resultset); /*data.resultset is just comma separated strings */
          var mode = $.unique($.map(data.resultset, function(row){
            // console.log("CST: row4 " + row[4] );
            return row[4];
          }));
          if (mode[0] == "launcher"){
            window.top.mantle_openTab('CST', 'Community Startup Tabs',  CONTEXT_PATH + "plugin/cst/api/launcher");
          } else {
            var tabsCount = data.queryInfo.totalRows;
            console.log("CST: " + "tabCount= " + tabsCount);
            $.each(data.resultset, function(i, tab){
              if(tab[2]){
                if(tabsCount == 1){
                  window.location.href = tab[3];
                } else {
                  window.open(tab[3], tab[1]);
                }
              } else {
                // console.log("CST: " + "ELSE" );
                window.top.mantle_openTab(tab[0], tab[1], tab[3]);
              }
            });
          }
          $($(".pentaho-tab-deck-panel iframe")[0]).on('load', function(){
            // console.log("CST: " + "tab-deck ");
            setTimeout(function(){
              $($(".pentaho-tab-bar .pentaho-tabWidget")[0]).mouseup();
            }, 1000);
          });
        }
      } ; /* end setUpTabs*/

  // fetch or reload configuration
  var fetchAndOpenTabs = function(){
    var tabs;
    var data1 = new Response();
	  data1.resultset = ("bbbb");
	  data1.tabsc = 1;

    	//console.log("CST: fetchAndOpenTabs = " + data1.resultset );
        // check if not refresh button on browser
	if(performance.navigation.type == 0){
          fetchAsync().then(data => {
		    	   setupTabs(data);
		    	   /* Save the data set in browser storage*/
            		   var tabsCount = data.queryInfo.totalRows;
		           data.tabsc = tabsCount; 
  		           data.resultset = JSON.stringify(data);
  	                   localStorage.setItem(SESSION_NAME, data.resultset);
	    		  });
	}
	/* check if refresh button */
	if(performance.navigation.type >= performance.navigation.TYPE_RELOAD){
           tempdata1 = localStorage.getItem(SESSION_NAME );
           data1 = JSON.parse(tempdata1);
	   setupTabs(data1);
	}

  }; /* end fetchAndOpenTabs */
