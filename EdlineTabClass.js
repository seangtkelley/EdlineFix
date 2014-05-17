/*
    File: EdlineTabClass.js
    Purpose: Holds class for handling all edline tabs for background.js
    Comments: N/A
    Authors: Sean Kelley (sgtkode)
*/

// throw away function for message listener
function sendMessage (json){
    return;
}


function EdlineTab(tab) {
    
    this.tabObject = tab;
    this.secondsPast = 0;
    this.warnings = 5;
    this.overTime = 60;
    this.urlCache = tab.url;
    this.loggedIn = false;
    
}

// refresh the tab information
EdlineTab.prototype.refresh = function (){
        if (this.exists()) {
            chrome.tabs.query({"windowId": this.tabObject.id}, function(queryTabs) {
                if(queryTabs != undefined){
                    this.tabObject = queryTabs[0];
                }
            });
        }
    };

// find if tab still exists
EdlineTab.prototype.exists = function (){
    chrome.tabs.query({"windowId": this.tabObject.id}, function(queryTabs) {
	    if(queryTabs != undefined){
		this.tabObject = queryTabs[0];
            } else {
                this.tabObject = null;
            }
	});
        
        if (this.tabObject == null) {
            return false;
        } else {
            return true;
        }
    };

// find if tab is on edline
EdlineTab.prototype.isOnEdline = function (){
    if (this.exists()) {
            if (this.tabObject.url.indexOf("edline") != -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

// find if tab is logged in
chrome.runtime.onMessage.addListener(function (message, sender, sendMessage){
            if (message.indexOf("TRUE") != -1) {
                EdlineTab.prototype.loggedIn = true;
            } else if(message.indexOf("FALSE") != -1) {
                EdlineTab.prototype.loggedIn = false;
            }
        });

EdlineTab.prototype.isLoggedIn = function (){
        
        chrome.tabs.executeScript(this.tabObject.id, {
            file: "injectScript.js"
        });
        
        return this.loggedIn;
    };


// reload tab
EdlineTab.prototype.reload = function (){
        chrome.tabs.reload(this.tabObject.id);
    };


// static function for initially finding all tabs
EdlineTab.getAllTabs = function (callback){
    // find tab for edline
    var edlineTabs = new Array();
    var tabs = null;
    chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
	if(queryTabs != undefined){
	    tabs = queryTabs;
	}
    });
    
    setTimeout(function() {
        if (tabs != null){
            for (var i = 0; i < tabs.length; i++) {
                edlineTabs[i] = new EdlineTab(tabs[i]);
            }
            
            callback(edlineTabs);
        } else {
            callback(false);
        }
    }, 300);
};