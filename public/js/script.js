let HEADER_LOGIN_INFO = "header-login-info"
let ERROR_WRONG_PASSWORD = "Passwort ungültig"
let HEADER_USERNAME = "username"
let USERNAME
let HEADER_USER_INFORMATION = "header-user-information"
let DOC_Header_Login_Info = document.getElementById(HEADER_LOGIN_INFO)
let STATE = 0;

function Init(){
    console.log("Init");
    document.getElementById(HEADER_USER_INFORMATION).style.display = "none"
    if (getCookie("userType") == "poor"){
        document.getElementById(HEADER_USERNAME).classList.add("text-bg-secondary")
        document.getElementById("nav-item-aktien").classList.add("disabled")
        STATE = 1;
        USERNAME = "poor"
        loggedIn();
    }
    else if (getCookie("userType") == "rich"){
        document.getElementById(HEADER_USERNAME).classList.add("text-bg-warning")
        USERNAME = "rich"
        STATE = 2;
        loggedIn();
    }
    else if (getCookie("userType") == "error"){
        document.getElementById("password-input").placeholder = ERROR_WRONG_PASSWORD;
        document.getElementById("nav-item-infos").classList.add("disabled")
        document.getElementById("nav-item-aktien").classList.add("disabled")
    }
    else {
        document.getElementById("nav-item-infos").classList.add("disabled")
        document.getElementById("nav-item-aktien").classList.add("disabled")
    }
}

function getCookie(cookiename){
    let name = cookiename + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function eraseCookie(cookiename){
    document.cookie = cookiename+ "=; Max-Age= -99999999;";
}

function loggedIn(){
    if(STATE == 1){
        //DOC_Header_Login_Info.innerText = "Hallo poor"
    }
    else if (STATE == 2){
        //DOC_Header_Login_Info.innerText = "Hallo rich"

    }
    document.getElementById(HEADER_USERNAME).innerText = USERNAME
    document.getElementById("header-login-inputs").style.display = "none"
    document.getElementById(HEADER_USER_INFORMATION).style.display = "flex"
}

function logoutButtonOnClick(){
    eraseCookie("userType");
    window.location.href = "/"
}

//Aktienfunktionalität



function loadAktien(){
    loadAktie("IBM", "IBM", "line-chart-ibm")
    loadAktie("SAP", "SAP", "line-chart-sap")
    loadAktie("Apple", "AAPL", "line-chart-apple")
}

function loadAktie(name, symbol, canvas){
    var api = "NI2UY3DVURQUQU24"
    //var api = "demo"
    var date = []
    var closeValue = []
    const url = "https://alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&apikey="+api

    console.log("loadAktien()");
    var query = "/proxy/?url=" + url
    var xhttp = new XMLHttpRequest();
    var response
    console.log("AlphaVantage Search String ",query);
    xhttp.onreadystatechange = function() {
    console.log("callback reached ",this.readyState);
    if (this.readyState == 4 && this.status == 200) {
      try {
        //console.log(this.responseText);
        response = JSON.parse(this.responseText);
        //console.log(response);
      } catch (e) {
        document.getElementById('main-card-aktien').innerHTML = e;
        document.getElementById('main-card-aktien').style.display = "block";
        return;
      }
      if (response.error != null && response.error.message != undefined)
      {
          document.getElementById('main-card-aktien').innerHTML = "Schade es ist ein Fehler aufgetreten " + response.error.message;
          document.getElementById('main-card-aktien').style.display = "block";
      }
      else {
          var timeseries = response.response["Time Series (Daily)"]
          var i = 0
          var highestValue = 0
          var highestDate = ""
          var lowestValue = 10000
          var lowestDate = ""
          for(var time in timeseries){
              date[i] = time;
              closeValue[i] = timeseries[time]["4. close"];
              if(closeValue[i] >= highestValue){
                  highestValue = closeValue[i]
                  highestDate = date[i]
              }
              if(lowestValue >= closeValue[i]){
                  lowestValue = closeValue[i]
                  lowestDate = date[i]
              }
              i++
          }
          date.reverse()
          closeValue.reverse()
          showChart(name, canvas, date, closeValue)
          document.getElementById(name + "-value-insert").innerText = closeValue[closeValue.length-1]
          document.getElementById(name + "-high-insert").innerText = highestValue + " am " + highestDate
          document.getElementById(name + "-low-insert").innerText = lowestValue + " am " + lowestDate
      }
    }
  };
  xhttp.open("GET",query, true);
  xhttp.send();

  

}


function showChart(targetname, targetcanvas, dates, closeValues){
    var myChart = new Chart(document.getElementById(targetcanvas), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                data: closeValues,
                label: targetname,
                borderColor: "#3e95cd",
                fill: false
            }]
        }
    })
}