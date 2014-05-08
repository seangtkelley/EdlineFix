function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie);
        }
    });
}

// some time variables just in case
var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
var hour = time[1] % 12 || 12;               // The prettyprinted hour.
var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.


// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.autoRefresh = false;
  localStorage.frequency = 15;
  localStorage.isInitialized = true;
  console.log("NO LOCAL STORAGE");
}


// Test for notification support.
if (window.webkitNotifications) {
  
  var maxTime;
  var secondsPast = 0;
  var loggedIn = false;
  var urlCache = "";
  var edlineTab = null;
  
  var overTime = 60;
  var warnings = 5;
  var reloadBuffer = 0;
  
  setInterval(function() {
	if(JSON.parse(localStorage.autoRefresh)){
		maxTime = localStorage.frequency * 60;
	} else {
		maxTime = 15 * 60;
	}
	
	// find tab for edline
	/*chrome.tabs.query({}, function(queryTabs) {
		if(queryTabs != undefined && queryTabs != null){
			for (var i = 0; i < queryTabs.length; i++) {
				if(queryTabs[i].url.indexOf("edline") != -1){
					edlineTab = queryTabs[i];
					//tabCache2++;
				}
			}
		}
	});*/
	chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
		if(queryTabs != undefined){
					edlineTab = queryTabs[0];
		}
	});
	
	
  
	// if edline log on cookie exists, user is logged on 
	getCookies("http://www.edline.net", "XT", function(cookie) {
		if(cookie != undefined && cookie != null){
			loggedIn = true;
		} else {
			loggedIn = false;
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
						var warning = window.webkitNotifications.createNotification(
							'48.png',                                        				 // The image.
							"WARNING",                                        				 // The title.
							'Edline has been refreshed to save your session. You can disable this on the option page.'    // The body.
						);
						warning.show();
						reloadBuffer = 1;
						chrome.tabs.reload(edlineTab.id);
					} else if(overTime >= 60 && warnings >= 0 && reloadBuffer != 1){
						var warning = window.webkitNotifications.createNotification(
							'48.png',                                        				 // The image.
							"WARNING",                                        				 // The title.
							'Edline is going to log you off in: ' + warnings + ' minutes'    // The body.
						);
						warning.show();
						overTime = 0;
						warnings -= 1;
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
  }, 1000); // run test every second
}

