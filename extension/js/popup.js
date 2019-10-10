// hide the alert that will be triggered if there is a failure to copy text
$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });

function parseUrl(url){
  var parsed_url = url.replace('http://','').replace('https://','').split(/[/?#]/);
  console.log(parsed_url[0]);

  parsed_url = parsed_url[0];

  var remove = ["www.", ".com"];
  
  remove.forEach(element => {
    parsed_url = parsed_url.replace(element, "");  
  });

  parsed_url = parsed_url.split(".");

  return parsed_url;
}

function getInfoFromAPI(site){
	var req = $.getJSON("https://tosdr.org/api/1/service/" + site +".json").done(function(data) {
	  return data;
	});

	return JSON.parse(req.responseText);
}

function ratingString(rating){
	if(rating == false){
		return "Sem classificação";
	}
	else{
		return rating;
	}
}

function setInfoInHTML(data){
	var html = document.getId("info");// getFromId

	var innerHtml = "<div class=\"name\">" + data.name + "</div>";
	var innerHtml = innerHtml + "<div class=\"rating\"><span class=\"tosdrLabel\">Classificação: </span>" + ratingString(data.rated) + "</div>";

  // TODO

	html.innerHtml = innerHtml;
}

const tosdr_api = "https://tosdr.org/api/1/service/";

const alertError = (error, message) => {
  console.log(message)
  console.log(error)
  $('#alertText').text(message)
  $('#alert').show()
}

const getJsonFromAPI = (obj) => {
  var json = $.getJSON(tosdr_api + obj + ".json").done(function(data) {
    return JSON.stringify(data);
  });
  console.log(json);
  return json;
  /*
  if (Array.isArray(obj)){
    obj.forEach(element => {
      var json = $.getJSON(tosdr_api + url + ".json").done(function(data) {
        return console.log(JSON.stringify(data));
      });

      if(json != null){
        return json;
      }
    });
  }
  else{
    
  }*/
}

const addLinkDataFromTab = (tabs) => {
  currentTab = tabs[0]
  $('#tabTitle').text(currentTab.title);
  // $('#urlInput').val(currentTab.url);
  
  var url = parseUrl(currentTab.url);
  
  // document.getElementById("userPreferences").innerHTML = currentTab.title + " " + currentTab.url;
  document.getElementById("tabInformation").innerHTML = url; 

  // console.log(parseUrl( currentTab.url));

  document.getElementById("teste").innerHTML = getJsonFromAPI(url).stringify;
  
}



// const fs = require('fs') 

/*
function userPreferencesAreEmpty(){
  var json = JSON.parse($.getJSON('../data/userPreferences.json', function(data){return data;}));
	if(json.isset == true){
		return false;
	}
	else{
		return true;
	}
}

function changeUserPreferences(){
  var text = readFile('../Input.txt');
  document.getElementById("userPreferences").innerHTML = text;
	var json = JSON.parse('userPreferences.json');

}

function searchToSInJSON(url){
	$(jQuery.parseJSON(JSON.stringify(dataArray))).each(function() {  
	    if (this.url == url) {
	    	return this;
	    }
  });
}
*/

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

/*
if(userPreferencesAreEmpty()){
  var reader = new FileReader();

	var text1 = reader.readAsText('Input.txt');
  
  document.getElementById("userPreferences").innerHTML = text1; 
}
*/
