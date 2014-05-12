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

function optionsClick(){
	// reload all edline tabs
	var url = "chrome-extension://" + chrome.runtime.id + "/options.html";
	chrome.tabs.create({"url": url, "active": true});
}

setTimeout(function() {

	document.getElementById('reload').onclick = reloadClick;
	
	document.getElementById('options').onclick = optionsClick;
	
	
}, 1000);

