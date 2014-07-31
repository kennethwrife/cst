$(window).load(function(){

  //callback to open each tab after the PerspectivesLoadedEvent gets fired
  var callback = function(args) {
    setTimeout(function(){
      fetchAndOpenTabs();

      window.top.mantle_setPerspective('opened.perspective');
    }, 3000);
  };

  //add the handler as soon as it becomes available
  var functionTimed = function(){
    if(typeof mantle_addHandler != "undefined"){
       window.top.mantle_addHandler("PerspectivesLoadedEvent", callback);
       window.clearInterval(timeoutMangeOpenTab);
    }
  };

  var timeoutMangeOpenTab = setInterval(functionTimed, 100);

  var fetchAndOpenTabs = function(){
    var tabs;
    $.ajax({
      type: "GET",
      url: CONTEXT_PATH + "plugin/cst/api/readConfig?paramuserName=" + escape(SESSION_NAME),
      dataType: "json",
      success: function(data){
        if(data.resultset){
          var tabsCount = data.queryInfo.totalRows;
          $.each(data.resultset, function(i, tab){
            if(tab[2]){
              if(tabsCount == 1){
                window.location.href = tab[3];
              } else {
                window.open(tab[3], tab[1]);
              }
            } else {
              window.top.mantle_openTab(tab[0], tab[1], tab[3]);
            }
          });
        }
      }
    });
  };
});

