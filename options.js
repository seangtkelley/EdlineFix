// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black'; // The label color.
  
  options.frequency.disabled = isDeactivated; // The control manipulability.
}

window.addEventListener('load', function() {
  // Initialize the option controls.
  if(localStorage.autoRefresh != undefined && localStorage.autoRefresh != null){
	options.autoRefresh.checked = JSON.parse(localStorage.autoRefresh);
  }
  
  if(localStorage.timeOut != undefined && localStorage.timeOut != null){
	options.timeOut.checked = JSON.parse(localStorage.timeOut);
  }
  
  if(localStorage.frequency != undefined && localStorage.frequency != null){
	options.frequency.value = localStorage.frequency;
  }
  
  if(localStorage.displayNot != undefined && localStorage.displayNot != null){
	options.displayNot.checked = JSON.parse(localStorage.displayNot);
  }
  
  if(localStorage.startupNot != undefined && localStorage.startupNot != null){
	options.startupNot.checked = JSON.parse(localStorage.startupNot);
  }

  if(localStorage.handleErr != undefined && localStorage.handleErr != null){
	options.handleErr.checked = JSON.parse(localStorage.handleErr);
  }

  //if (!options.autoRefresh.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.startupNot.onchange = function() {
    localStorage.startupNot = options.startupNot.checked;
  };
  
  options.autoRefresh.onchange = function() {
    localStorage.autoRefresh = options.autoRefresh.checked;
	
	options.timeOut.checked = false;
	localStorage.timeOut = options.timeOut.checked;
  };
  
  options.timeOut.onchange = function() {
    localStorage.timeOut = options.timeOut.checked;
	
	options.autoRefresh.checked = false;
	localStorage.autoRefresh = options.autoRefresh.checked;
  };
  
  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
  
  options.displayNot.onchange = function() {
    localStorage.displayNot = options.displayNot.checked;
  };

  options.handleErr.onchange = function() {
    localStorage.handleErr = options.handleErr.checked;
  };
});
