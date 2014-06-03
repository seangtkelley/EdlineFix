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
    this.exist = true;
    this.wasLoggedIn = false;
    
}

// refresh the tab information
EdlineTab.prototype.refresh = function (){
        console.log("Edline Class: edline tab refresh called");
        
        chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
            if(typeof queryTabs[0] === 'undefined' && queryTabs[0] === null){
                for (var j = 0; j < queryTabs.length; j++) {
                    if (queryTabs[j].id == this.tabObject.id) {
                        this.tabObject = queryTabs[j];
                    }
                }
            }
        });
      
        this.checkLogIn();
    };

// find if tab still exists
EdlineTab.prototype.exists = function (/*callback*/){
        console.log("Edline Class: edline tab exists called");
        
        /*chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
            if(typeof queryTabs[0] === 'undefined' && queryTabs[0] === null){
                var exists = false;
                for (var j = 0; j < queryTabs.length; j++) {
                    if (queryTabs[j].id == this.tabObject.id) {
                        exists = true;
                        console.log("IT EXISTS");
                    }
                }
                
                if (exists) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
	});*/
        
        return this.exist;
        
    };

// find if tab is on edline
EdlineTab.prototype.isOnEdline = function (){
        console.log("Edline Class: edline tab is on edline called");
        if (this.tabObject.url.indexOf("edline") != -1) {
            return true;
        } else {
            return false;
        }
    };

// find if tab is logged in
chrome.runtime.onMessage.addListener(function (message, sender, sendMessage){
                for (var i = 0; i < edlineTabs.length; i++) {
                    if (edlineTabs[i].tabObject.id == sender.tab.id) {
                        if (message.indexOf("TRUE") != -1) {
                            console.log("Edline Class: Message Listener Called");
                            console.log("Edline Class: Login True");
                            edlineTabs[i].loggedIn = true;
                        } else if(message.indexOf("FALSE") != -1) {
                            console.log("Edline Class: Message Listener Called");
                            console.log("Edline Class: Login False");
                            edlineTabs[i].loggedIn = false;
			    edlineTabs[i].wasLoggedIn = false;
                        }
                    }
                }
        });

// check the login status of a tab
EdlineTab.prototype.checkLogIn = function (){
        chrome.tabs.executeScript(this.tabObject.id, {
            file: "injectScript.js"
        });
        
        console.log("Edline Class: Login checked");
    };
    
// return if the tab is logged
EdlineTab.prototype.isLoggedIn = function (){
        
        console.log("Edline Class: Login returned");
        
        return this.loggedIn;
    };


// reload tab
EdlineTab.prototype.reload = function (){
        chrome.tabs.reload(this.tabObject.id);
    };


// static function for initially finding all tabs
EdlineTab.getAllTabsInit = function (callback){
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
    }, 250);
    
    console.log("Edline Class: Get Tabs Init");
};

// update edlineTabs array
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
    
    // find if array already has tab
    var isInArray = false;
    if (tab.url.indexOf("edline") != -1) {
        for (var i = 0; i < edlineTabs.length; i++) {
            if (tabId == edlineTabs[i].tabObject.id) {
                isInArray = true;
                
                edlineTabs[i].tabObject = tab;
            }
        }
        
        // if array doesn't have tab, add it
        if (isInArray == false) {
            edlineTabs.push(new EdlineTab(tab));
        }
    }
    
    console.log("Edline Class: Tabs Updated");
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
    for (var i = 0; i < edlineTabs.length; i++) {
        if (tabId == edlineTabs[i].tabObject.id) {
                edlineTabs[i].exist = false;
            }
    }
});