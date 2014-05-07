// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';
                                              // The label color.
  options.frequency.disabled = isDeactivated; // The control manipulability.
}

window.addEventListener('load', function() {
  // Initialize the option controls.
  if(localStorage.autoRefresh != undefined && localStorage.autoRefresh != null){
	options.autoRefresh.checked = JSON.parse(localStorage.autoRefresh);
	options.frequency.value = localStorage.frequency;
  }

  if (!options.autoRefresh.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.autoRefresh.onchange = function() {
    localStorage.autoRefresh = options.autoRefresh.checked;
    ghost(!options.autoRefresh.checked);
  };
  
  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
});
