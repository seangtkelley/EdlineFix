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


// wait for variables to set, then run code
setTimeout(function() {
	// Test for notification support.
	if (permLevel.indexOf("g") != -1) {
		  
		var maxTime;
		var secondsPast = 0;
		var loggedIn = false;
		var urlCache = "";
		var edlineTab = null;
		var loginCookie = null;
		var cookieValueCache = 0;
		  
		var overTime = 60;
		var warnings = 5;
		var reloadBuffer = 0;
		
		setInterval(function() {
			try{
				// set max time based on user input
				if(JSON.parse(localStorage.autoRefresh)){
					maxTime = localStorage.frequency * 60;
				} else {
					maxTime = 15 * 60;
				}
				
				// find tab for edline
				chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
					if(queryTabs != undefined){
						edlineTab = queryTabs[0];
					}
				});
			  
				// if edline log on cookie exists, user is logged on 
				getCookies("http://www.edline.net", "XT", function(cookie) {
					if(cookie != undefined && cookie != null){
						loggedIn = true;
						loginCookie = cookie;
					} else {
						loggedIn = false;
						loginCookie = null;
					}
				});
				
				// make sure edline tab exists
				if(edlineTab == null && loggedIn){
					// tab was closed without log out
					chrome.cookies.remove({"url": "http://www.edline.net", "name": "XT"});
					console.log("LOGGED OUT GLITCH");
				} else if(!loggedIn){
					// if user not logged in, ignore rest of code
					secondsPast = 0;
					urlCache = "";
					console.log("NOT LOGGED IN");
					return;
				} else if(loggedIn){
					// if user logged on, check timer
					if(secondsPast == 0){
						// if no seconds have past, set all initial values
						urlCache = edlineTab.url;
						secondsPast++;
						
						if(loginCookie.value != cookieValueCache){
							if(JSON.parse(localStorage.startupNot)){
								displayNotification("start");
							}
							cookieValueCache = loginCookie.value;
						} else {
							cookieValueCache = loginCookie.value;
						}
						
						console.log("START");
					} else if (secondsPast > 0){
						// if seconds have past, run checks on data
						if(edlineTab.url != urlCache){
							// if the page is not the same, reset timer
							secondsPast = 0;
							urlCache = edlineTab.url;
							overTime = 60;
							warnings = 5;
							reloadBuffer = 0;
							
							console.log("DIFFERENT PAGE RESET");
						} else if (edlineTab.status == "loading"){
							// if page is loading(new request by user), reset timer
							secondsPast = 0;
							urlCache = edlineTab.url;
							overTime = 60;
							warnings = 5;
							reloadBuffer = 0;
					
							console.log("LOADING PAGE RESET");
						} else {
							// user is still idle
							if(secondsPast > maxTime){
								// exceeded max time, alert user or refresh automatically
								if(JSON.parse(localStorage.autoRefresh) && reloadBuffer != 1){
									/* rich notification code */
									// check if they want to display notifications
									if(JSON.parse(localStorage.displayNot)){
										displayNotification("reload");
									}
							
									reloadBuffer = 1;
									chrome.tabs.reload(edlineTab.id);
								} else if(overTime >= 60 && warnings >= 0 && reloadBuffer != 1 && JSON.parse(localStorage.timeOut)){
									/* rich notification code */
									displayNotification("time", warnings);
							
									overTime = 0;
									warnings -= 1;
								} else if(warnings == -1 && overTime == 5){
									chrome.cookies.remove({"url": "http://www.edline.net", "name": "XT"});
									console.log("USER TIMED OUT");
									console.log("LOG IN COOKIE CLEARED");
								}
								overTime++;
						
								console.log("IDLE: NO TIME");
							} else {
								// user still has time, continue iterate
								urlCache = edlineTab.url;
								secondsPast++;
						
								console.log("IDLE: WITH TIME");
								console.log("SECONDS PAST: " + secondsPast.toString());
							}
						}
					}
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
}, 2000);


