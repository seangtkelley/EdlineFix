/*
    File: background.js
    Purpose: Main engine for Edline Fix
    Comments: All extra functions stored in functions.js to
	      reduce clutter and speed up file loading
    Authors: Sean Kelley (sgtkode)
*/

// some time variables just in case
var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
var hour = time[1] % 12 || 12;               // The prettyprinted hour.
var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.


// Conditionally initialize the options.
if (!localStorage.startupNot) {
  localStorage.startupNot = true;
}
if (!localStorage.autoRefresh) {
  localStorage.autoRefresh = false;
}
if (!localStorage.displayNot) {
  localStorage.displayNot = true;
}
if (!localStorage.frequency) {
  localStorage.frequency = 15;
}
if (!localStorage.timeOut) {
  localStorage.timeOut = true;
}
if (!localStorage.handleErr) {
  localStorage.handleErr = true;
}

// initially find all tabs
var edlineTabs = false;
setTimeout(function (){
    EdlineTab.getAllTabsInit(function(tabs){
      edlineTabs = tabs;
    });  
}, 500);

// wait for variables to set, then run code
setTimeout(function() {
  // Test for notification support.
  if (permLevel.indexOf("g") != -1) {
		  
    var maxTime;
    var reloadBuffer = 0;
    
    setInterval(function() {
      try{
	console.log(edlineTabs);
	if (edlineTabs != false) {
	  for (var i = 0; i < edlineTabs.length; i++) {
	    console.log("Index: " + i);
	    // set max time based on user input
	    if(JSON.parse(localStorage.autoRefresh)){
	      maxTime = localStorage.frequency * 60;
	    } else {
	      maxTime = 15 * 60;
	    }
	    
	    // refresh tab details
	    edlineTabs[i].refresh();
	    
	    // make sure edline tab exists
	    if(edlineTabs[i].exists() == false){
	      
	      console.log("TAB DOESN'T EXIST");
	      
	    } else if(edlineTabs[i].isLoggedIn() == false){
	      // if user not logged in, ignore rest of code
	      edlineTabs[i].secondsPast = 0;
	      edlineTabs[i].urlCache = "";
	      
	      console.log("NOT LOGGED IN");
	      return;
	    } else if(edlineTabs[i].isLoggedIn()){
	      // if user logged on, check timer
	      if(edlineTabs[i].secondsPast == 0){
		// if no seconds have past, set all initial values
		edlineTabs[i].urlCache = edlineTabs[i].tabObject.url;
		edlineTabs[i].secondsPast++;
		
		if(JSON.parse(localStorage.startupNot)){
		  displayNotification("start");
		}
		
		console.log("START");
	      } else if (edlineTabs[i].secondsPast > 0){
		// if seconds have past, run checks on data
		if(edlineTabs[i].tabObject.url != edlineTabs[i].urlCache){
		  // if the page is not the same, reset timer
		  edlineTabs[i].secondsPast = 0;
		  edlineTabs[i].urlCache = edlineTabs[i].tabObject.url;
		  edlineTabs[i].overTime = 60;
		  edlineTabs[i].warnings = 5;
		  
		  console.log("DIFFERENT PAGE RESET");
		} else if (edlineTabs[i].tabObject.status == "loading"){
		  // if page is loading(new request by user), reset timer
		  edlineTabs[i].secondsPast = 0;
		  edlineTabs[i].urlCache = edlineTabs[i].tabObject.url;
		  edlineTabs[i].overTime = 60;
		  edlineTabs[i].warnings = 5;
		  
		  console.log("LOADING PAGE RESET");
		} else {
		  // user is still idle
		  if(edlineTabs[i].secondsPast > maxTime){
		    // exceeded max time, alert user or refresh automatically
		    if(JSON.parse(localStorage.autoRefresh) /*&& reloadBuffer != 1*/){
		      /* rich notification code */
		      // check if they want to display notifications
		      if(JSON.parse(localStorage.displayNot)){
			displayNotification("reload");
		      }
		      
		      //reloadBuffer = 1;
		      edlineTabs[i].reload();
		    } else if(edlineTabs[i].overTime >= 60 && edlineTabs[i].warnings >= 0 && reloadBuffer != 1 && JSON.parse(localStorage.timeOut)){
		      /* rich notification code */
		      displayNotification("time", warnings);
		      
		      edlineTabs[i].overTime = 0;
		      edlineTabs[i].warnings -= 1;
		    } else if(edlineTabs[i].warnings == -1 && edlineTabs[i].overTime == 5){
		      chrome.cookies.remove({"url": "http://www.edline.net", "name": "XT"});
		      edlineTabs[i].reload();
		      
		      console.log("USER TIMED OUT");
		      console.log("LOG IN COOKIE CLEARED");
		    }
		    // increase over time
		    edlineTabs[i].overTime++;
		    
		    console.log("IDLE: NO TIME");
		  } else {
		    // user still has time, continue iterate
		    edlineTabs[i].urlCache = edlineTabs[i].tabObject.url;
		    edlineTabs[i].secondsPast++;
		    
		    console.log("IDLE: WITH TIME");
		    console.log("SECONDS PAST: " + edlineTabs[i].secondsPast.toString());
		  }
		}
	      }
	    }
	  }
	  
	  EdlineTab.updateTabs(function(tabs){
	    edlineTabs = tabs;
	  });
	} else {
	  EdlineTab.getAllTabsInit(function(tabs){
	    edlineTabs = tabs;
	  });
	}
      } catch(e){
	console.log("CAUGHT ERROR: " + e.stack)
        
	if(JSON.parse(localStorage.handleErr)){
	  sendErrorEmail(e);
	}
      }
    }, 1000); // run test every second
  } else {
    console.log("no notification support");
  }
}, 1000);


