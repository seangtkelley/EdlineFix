/*
    File: functions.js
    Purpose: Holds all extra functions for background.js
    Comments: N/A
    Authors: Sean Kelley (sgtkode)
*/


// better function for getting cookies
function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie);
        }
    });
}

// function for sending post request to server
function post_to_url(path, params, method) {
    method = method || "POST"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.

    // use ajax to send post
    console.log("SENDING EMAIL WITH AJAX");
    
    // create xmlhttp object
    var xmlHttp = new XMLHttpRequest();

    // open to path and set post headers
    xmlHttp.open(method, path, true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    // build string of params for post
    var paramStr = ""
    for (var param in params) {
    	if (params.hasOwnProperty(param)) {
    	    paramStr += param + "=" + params[param] + "&";
        }
    }
    
    // send request (no need to actually handle the request)
    xmlHttp.send(paramStr);
}

var errorCache = "";
function sendErrorEmail(error){
     console.log("SEND EMAIL FUNCTION CALLED");
     
     // make sure email is only sent once
     if(error.message != errorCache){
        errorCache = error.message;
        
	// send post request to my sendEmail.php page with the error details
     	post_to_url("http://sgtkode.org/sendEmail.php", {"to":"sgtkode01@gmail.com", "subject":"Edline Fix Error: " + error.message, "body":error.stack, "Submit": "Send Email"});
     } 
}

// handle the display of notifications
var notifications = new Array();

/* rich notifications (windows, mac, ubuntu) */
// get permission level of rich notifications
var permLevel = "";
chrome.notifications.getPermissionLevel(function (level){
	permLevel = level;
});

function displayNotification(type, timeLeft){
	timeLeft = (typeof timeLeft === "undefined") ? 0 : timeLeft;
	if(type == "reload"){
		var message = "Edline has been refreshed to save your session. You can change this on the option page.";
		var options = {"type": "basic", "iconUrl": "128.png", "title": "Edline Session", "message": message, "buttons": [{"title": "Options"}]};
		chrome.notifications.create("", options, function (notificationId){
			notifications.push(notificationId);
		});
	} else if(type == "time") {
		var message = "";
		if(timeLeft == 0){
			message = "Edline has logged you out.";
		} else {
			message = "Edline is going to log you off in: " + timeLeft + " minutes";
		}
		var options = {"type": "basic", "iconUrl": "128.png", "title": "Edline Session", "message": message, "buttons": [{"title": "Options"}, {"title": "Reload Edline"}]};
		chrome.notifications.create("", options, function (notificationId){
			notifications.push(notificationId);
		});
	} else if(type == "start") {
		var message = "Edline Fix is now protecting your session. You can change this on the option page.";;
		var options = {"type": "basic", "iconUrl": "128.png", "title": "Edline Session", "message": message, "buttons": [{"title": "Options"}]};
		chrome.notifications.create("", options, function (notificationId){
			notifications.push(notificationId);
		});
	}
}

function clearEdlineNotifications(){
	if (typeof notifications !== 'undefined' && notifications.length > 0) {
		for (var i = 0; i < notifications.length; i++) {
			chrome.notifications.clear(notifications[i], function (wasCleared){
				if(wasCleared){
					console.log("NOTIFICATION " + notifications[i] + " CLEARED");
				} else {
					console.log("NOTIFICATION " + notifications[i] + " NOT CLEARED");
				}
			});
		}
	}
}

function clearAllNotifications(){
	var allNotificationIDs = null;
	chrome.notifications.getAll(function (IDS){
		if(IDS !== undefined && IDS !== null){
			allNotificationIDs = IDS;
		}
	});
						
	if(allNotificationIDs !== null){
		for (var i = 0; i < allNotificationIDs.length; i++) {
			chrome.notifications.clear(allNotificationIDs[i], function (wasCleared){
				if(wasCleared){
					console.log("NOTIFICATION " + notifications[i] + " CLEARED");
				} else {
					console.log("NOTIFICATION " + notifications[i] + " NOT CLEARED");
				}
			});
		}
	}
}

// notification button click listeners
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
	if(buttonIndex == 0){
		var url = "chrome-extension://" + chrome.runtime.id + "/options.html";
		chrome.tabs.create({"url": url, "active": true});
	} else {
		var tempEdlineTab = null;
		chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
			if(queryTabs !== undefined){
				tempEdlineTab = queryTabs[0];
			}
		});
		
		setTimeout(function() { chrome.tabs.reload(tempEdlineTab.id); }, 300);
	}
});