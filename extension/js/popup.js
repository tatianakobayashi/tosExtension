// hide the alert that will be triggered if there is a failure to copy text
$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });

// get all.json from TOS;DR API
var all;
var infoArray = [];
var documentArray = [];
var userPrefFields = ['dataUsage', 'privateMessages', 'tracking', 'indemnity', 'cookies', 'termsChange', 'contentRemoval'];
var userPreferences = $.getJSON('../data/userPreferences.json', function(data){return data;});

// Função da extensão oficial - TODO: testar
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

var translation_dict = {
  "This service may collect, use, and share location data": "Este serviço pode coletar, usar e compartilhar dados de localização.",
  "Your data may be processed and stored anywhere in the world": "Suas informações podem ser processadas e armazenadas em qualquer lugar do mundo.",
  "This service tracks you on other websites": "Este serviço pode te monitorar em outros sites.",
  "The service can read your private messages": "Este serviço pode ler suas mensagens privadas.",
  "You agree to defend, indemnify, and hold the service harmless in case of a claim related to your use of the service": "",
  "The service may use tracking pixels, web beacons, browser fingerprinting, and/or device fingerprinting on users.": "",
  "This service can use your content for all their existing and future services": ""
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
      if(content.title in translation_dict){
        // translation_dict[content.title] !== undefined
        title = translation_dict[content.title];
      }
      else{
        title = content.title;
      }


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
  if(userPreferences.isset == true){
    return false;
  }
  else{
    return true;
  }
}

function changeUserPreferences(){
  var json = JSON.parse('userPreferences.json');
}

function saveUserPreferences(){
  userPrefFields.forEach((name)=>{
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++){
      if(radios[i].checked){
        userPreferences[name] = radios[i].value
      }
      
    }
  });
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
