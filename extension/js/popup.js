// hide the alert that will be triggered if there is a failure to copy text
$('#alert').hide()

// to close the alert
$("#alert").click(() => { $('#alert').hide() });

// get all.json from TOS;DR API
var allReq = $.getJSON("https://tosdr.org/api/1/all.json");
var all = JSON.parse(allReq.responseText);

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

// URL parser 
function parseUrl(url){
  var parsed_url = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/);
  // console.log(parsed_url[0]);

  return parsed_url[0];
}

// get site information, if exists. If not, return null
function getInfoFromAPI(site){
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
  var infoArray = [];

  // Save API information on site in an Array
  siteJson.points.forEach(function(point){
    infoArray.push(siteJson.pointsData[point]); // Already are objects
  })

  return infoArray;
}

function htmlWithClass(htmlTag, cssClass){
  return "<" + htmlTag +" class=\"" + cssClass + "\">";
}

function setInfoInHTML(data){
  const divEnd = "</div>";
  const spanEnd = "</span>";

  var html = document.getId("info");// getFromId

  var innerHtml = htmlWithClass("div", "name") + data.name + divEnd;
  var innerHtml = innerHtml + htmlWithClass("div", "rating") + htmlWithClass("span", "tosdrLabel") + "Classificação: " + spanEnd + ratingString(data.rated) + divEnd;

  var siteInfoArray = getSiteInfo(data);

  siteInfoArray.forEach(function(content, index){
      var topic = htmlWithClass("div", "topic");
      topic += htmlWithClass("span", "topicTitle") + content.title + spanEnd;
      topic += htmlWithClass("span", "topicPoint") + pointDict[content.point] + spanEnd;
      topic += htmlWithClass("span", "topicScore") + content.score + spanEnd;
      topic += htmlWithClass("span", "topicPrivacy") + privacyRelated(content.privacyRelated) + spanEnd;
      topic += divEnd;
      innerHtml += topic;
    }
  );
  // TODO

  html.innerHtml = innerHtml;
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

  document.getElementById("teste").innerHTML = setInfoInHTML(getInfoFromAPI(url));

  
  setInfoInHTML(getInfoFromAPI(url, all));

}

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
