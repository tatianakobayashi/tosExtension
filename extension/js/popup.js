// Link Formatter js

// hide the alert that will be triggered if there is a failure to copy text
$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });

// Copy button events, obtains the input id from amending the button id
$("button").click((event) => {
  let inputId = "#" + event.target.id.replace("CopyButton", "Input")
  copyInputToClipboard(inputId)
});

const copyInputToClipboard = (elementId) => {
  let data = $(elementId).val()
  let dt = new clipboard.DT();
  dt.setData("text/plain", data);
  clipboard.write(dt)
  .then(() => {
    // confirm successful copy
    $('[data-toggle="popover"]').popover('disable').popover('hide')
    $(elementId).popover('enable').popover('show')
    setTimeout(() => { $(elementId).popover('disable').popover('hide') }, 2000)
    $(elementId).select()
  })
  .catch((error) => {
    alertError(error, "Error occurred when trying to copy to clipboard")
  })
}

const alertError = (error, message) => {
  console.log(message)
  console.log(error)
  $('#alertText').text(message)
  $('#alert').show()
}

const addLinkDataFromTab = (tabs) => {
  currentTab = tabs[0]
  $('#tabTitle').text(currentTab.title);
  $('#urlInput').val(currentTab.url);
}

const fs = require('fs') 

function userPreferencesAreEmpty(){
	var json = JSON.parse('userPreferences.json');
	if(json.isset == true){
		return false;
	}
	else{
		return true;
	}
}

if(userPreferencesAreEmpty){
	fs.readFile('Input.txt', 'utf-8', (err, data) => { 
	    if (err) throw err; 
	  
	    document.getElementById("userPreferences").innerHTML = data.toString(); 
	})
}

function changeUserPreferences(){
	fs.readFile('Input.txt', 'utf-8', (err, data) => { 
	    if (err) throw err; 
	  
	    document.getElementById("userPreferences").innerHTML = data.toString(); 
	})
	var json = JSON.parse('userPreferences.json');

}

function searchToSInJSON(url){
	$(jQuery.parseJSON(JSON.stringify(dataArray))).each(function() {  
	    if (this.url == url) {
	    	return this;
	    }
  });
}

// To enable cross-browser use you need to see if this is Chrome or not
if(chrome) {
  chrome.tabs.query(
    {active: true, currentWindow: true},
    (arrayOfTabs) => { addLinkDataFromTab(arrayOfTabs) }
  );
  // This enables links to be opened in new tabs
  $('a').click( (event) => { chrome.tabs.create({url:event.target.href}) } )
} else {
  browser.tabs.query({active: true, currentWindow: true})
    .then(addLinkDataFromTab)
  // This enables links to be opened in new tabs
  $('a').click( (event) => { browser.tabs.create({url:event.target.href}) } )
}
