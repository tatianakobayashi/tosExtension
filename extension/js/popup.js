// hide the alert that will be triggered if there is a failure to copy text
$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });

// Global Variables
var all;
var infoArray = [];
var documentArray = [];
var userPrefFields = ['dataUsage', 'privateMessages', 'tracking', 'indemnity', 'cookies', 'termsChange', 'contentRemoval'];
var userPreferences = $.getJSON('../data/userPreferences.json', function(data){return data;});
var loggedIn = false;

// Retorna
function getServices() { // eslint-disable-line no-unused-vars
  const requestURL = 'https://tosdr.org/api/1/all.json';

  const driveRequest = new Request(requestURL, {
    method: 'GET',
  });

  return fetch(driveRequest).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw response.status;
  });
}

var classificacaoDict = {
  0: "Sem classificação",
  "false": "Sem classificação",
  "A": "Os Termos de serviço te tratam de forma justa, respeitam seus direitos e seguem as melhores práticas.",
  "B": "Os Termos de serviço são justos com o usuário, mas podem ser melhorados.",
  "C": "Os Termos de serviço são bons, mas alguns problemas precisam da sua consideração.",
  "D": "Os Termos de serviço são muito irregulares ou existem problemas importantes que necessitam da sua atenção.",
  "E": "Os Termos de serviço levantam sérias preocupações."
}

var pointDict = {
  "bad": "Ruim",
  "good": "Bom",
  "neutral": "Neutro"
}

var alertDict = {
  "bad": "alert-danger",
  "good": "alert-success",
  "neutral": "alert-light",
  "undefined": "alert-info"
}

var ratingColorDict = {
  0: "black",
  "false": "black",
  "A": "green",
  "B": "yellow",
  "C": "orange",
  "D": "red",
  "E": "burgundy"
}

var topicDict = {
  
}

// URL parser 
function parseUrl(url){
  var parsed_url = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/);
  // console.log(parsed_url[0]);

  return parsed_url[0];
}

// get site information, if exists. If not, return null
function getInfoFromAPI(site){
  /*
  if(typeof(all) == 'undefined'){
    console.log("getAll");
    getAllFromAPI();
  }
  console.log(all);
  */
  var review = all["tosdr/review/" + site];

  if(review){
    if(review.see){
      return all["tosdr/review/" + review.see];
    }
    else{
      return review;
    }  
  }
  else{
    return null;
  }
}

// Set rating string
function ratingString(rating){
  return classificacaoDict[rating];
}

function getSiteInfo(siteJson){
  // Save API information on site in an Array
  siteJson.points.forEach(function(point){
    infoArray.push(point); // Already are objects
  })
}

function getUrlList(siteJson){
  // Save url list in an Array
  siteJson.documents.forEach(function(doc){
    documentArray.push(doc);
  })
}

function htmlWithClass(htmlTag, cssClass){
  return "<" + htmlTag +" class=\"" + cssClass + "\">";
}

function setInfoInHTML(data){
  const divEnd = "</div>";
  const spanEnd = "</span>";

  document.getElementById("siteName").innerHTML = htmlWithClass("div", "name") + data.name + divEnd;
  document.getElementById("siteRating").innerHTML = htmlWithClass("div", "rating") + 
      htmlWithClass("span", "tosdrLabel") + "Classificação: " + spanEnd + 
      htmlWithClass("span",  ratingColorDict[data.rated]) + ratingString(data.rated) + 
      spanEnd + divEnd;

  getSiteInfo(data);
  getUrlList(data);

  infoArray.forEach(function(content, index){
      var tagClass = "";
      if(typeof(alertDict[content.point]) == 'undefined'){
        tagClass = "alert-secondary ";
      }
      else{
        tagClass = alertDict[content.point];
      }

      var title = "";

      // TODO get translation from server
      title = content.title;


      // var topic = htmlWithClass("ul", "topic alert " + tagClass);
      var topic = htmlWithClass("div", "topic alert " + tagClass) + title + divEnd;
      // topic += "<li>" +  htmlWithClass("span", "topicPoint "+ content.point) + pointDict[content.point] + spanEnd+ "</li>";
      // topic += "<li>" +  htmlWithClass("span", "topicScore") + content.score + spanEnd+ "</li>";
      //if(content.privacyRelated){
      //  topic += "<li>" +  htmlWithClass("span", "topicPrivacy") + privacyRelated(content.privacyRelated) + spanEnd;
      //}
      // topic += "</ul>";
      document.getElementById("topicList").innerHTML += topic;
    }
  );

  var urlList = "";
  documentArray.forEach(function(content, index){
    urlList += "<a class=\"\" href=\"" + content.url + "\">" + content.name + "</a> <br />";
  });

  document.getElementById("urlList").innerHTML += urlList;
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
  // $('#urlInput').val(currentTab.url);
  
  var url = parseUrl(currentTab.url);
  
  // document.getElementById("userPreferences").innerHTML = currentTab.title + " " + currentTab.url;
  document.getElementById("tabInformation").innerHTML = url; 

  // console.log(parseUrl( currentTab.url));
  setInfoInHTML(getInfoFromAPI(url, all));

}

function userPreferencesAreEmpty(){
  if(userPreferences != null){
    return false;
  }
  else{
    return true;
  }
}

function changeUserPreferences(){
  var json = JSON.parse('userPreferences.json');
}

document.getElementById("savePreferencesButton").onclick = function saveUserPreferences(){
  userPrefFields.forEach((name)=>{
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++){
      if(radios[i].checked){
        userPreferences[name] = radios[i].value
      }
      
    }
  });

  console.log("Preferencias salvas");
}


document.getElementById("loginLink").onclick = function login(){
  document.getElementById("loggedUserNotice").hidden = false;
  document.getElementById("notLoggedUser").hidden = true;

  document.getElementById("userButton").setAttribute("data-target", "#loggedUserNotice");
  document.getElementById("userButton").setAttribute("aria-controls", "loggedUserNotice");
}

document.getElementById("logoutLink").onclick = function logout(){
  document.getElementById("loggedUserNotice").hidden = true;
  document.getElementById("notLoggedUser").hidden = false;

  document.getElementById("userButton").setAttribute("data-target", "#notLoggedUser");
  document.getElementById("userButton").setAttribute("aria-controls", "notLoggedUser");
}



/*
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("logoutLink").addEventListener("click", logout);
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("loginLink").addEventListener("click", login);
});
*/

function setUserPreferences(){
  userPrefFields.forEach((name)=>{
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++){
      if(radios[i].checked){
        radios[i].value = userPreferences[name];
      }
      
    }
  });
}

function getPrefs(){
  const requestURL = 'https://tossite.ignys.repl.co/getPrefJSON.php';

  var driveRequest = new Request(requestURL, {
    method: 'POST',
    dataType: 'json',
  });

  return fetch(driveRequest).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw response.status;
  });
}

function askSavedPreferences(){
  console.log('asking...');
  getPrefs().then((value)=>{
    console.log(JSON.stringify(value));
  }, (cause)=>{
  console.log(cause);
})
  
}

// To enable cross-browser use you need to see if this is Chrome or not

getServices().then(function(value){
  //console.log(value);
  all = value;
}, function(cause){
  console.log(cause);
}).then(function(val){
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
});

if(userPreferencesAreEmpty()){

  userPrefFields.forEach((name)=>{
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++){
      radios[i].checked = false;
    }
  });
}
else{
  userPrefFields.forEach((name)=>{
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++){
      radios[i].checked = userPreferences[name];
    }
  });
}
