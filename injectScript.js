/*
    File: injectScript.js
    Purpose: Script that is sent to edline tab page.
    Comments: Used by EdlineTabClass.js
    Authors: Sean Kelley (sgtkode)
*/

if($("#logout").children().html().indexOf("OUT") != -1){
    console.log("TRUE");
    chrome.runtime.sendMessage(chrome.runtime.id, "LOGIN TRUE");
} else if ($("#logout").children().html().indexOf("IN") != -1) {
    console.log("FALSE");
    chrome.runtime.sendMessage(chrome.runtime.id, "LOGIN TRUE");
}