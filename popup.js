/* not work 

	setInterval(function() {
		// find tabs for edline
		var edlineTabs = null;
		
		chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
			if(queryTabs != undefined){
				var mainDivHTML = document.getElementById('main').innerHTML;
				mainDivHTML = "";
				for (var i = 0; i < queryTabs.length; i++) {
					var tempHTML = "<div id=\"tab\"" + i.toString() + ">";
						tempHTML += "<h4>Tab " + i.toString() + "</h4>";
						tempHTML += "<div class=\"URL\">URL: " + queryTabs[i].url + "</div>"
				
					tempHTML += "</div>";
					mainDivHTML = mainDivHTML + tempHTML;
				}
			}
		});
	}, 1000);*/
	
function reloadClick(){
	// reload all edline tabs
	chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
		if(queryTabs !== undefined){
			for (var i = 0; i < queryTabs.length; i++) {
				chrome.tabs.reload(queryTabs[i].id);
			}
		}
	});
}

setTimeout(function() {

	document.getElementById('reload').onclick = reloadClick;/*function (){
		// reload all edline tabs
		chrome.tabs.query({"url": "*://*.edline.net/*"}, function(queryTabs) {
			if(queryTabs !== undefined){
				for (var i = 0; i < queryTabs.length; i++) {
					chrome.tabs.reload(queryTabs[i].id);
				}
			}
		});
	};*/
	
}, 1000);

