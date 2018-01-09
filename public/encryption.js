const UNIVERSAL_USER_INFO_FILE_NAME = "/user.json"
var username = "";
var private_key = "";

function signJWT(json_object, username, private_key) {
  if (username) {
    json_object.iss = username;
  }
  else {
    json_object.iss = "none";
  }
  return KJUR.jws.JWS.sign(null, {"alg":"HS256", "cty":"JWT"}, json_object, private_key);
}

function verifyJWT(JWT_JSON) {
	//var x = KJUR.jws.JWS.verify(JWT_JSON, "{hex:" +  key + "}", {alg: ["ES256"]});
  return JWT_JSON["for"] == username;
}

function getUserInfo(isReset) {
  blockstack.getFile(UNIVERSAL_USER_INFO_FILE_NAME).then((fileContents) => {
    //if the file does not exist then make a new file

    if (fileContents == null || isReset) {
      var user_temp = prompt("Please Enter Your Blockstack id", "sample.id");
      var pk = prompt("Please Enter Your Bockstack private key", "e86b1270d16542e83585ad80fb018fa48145e3c9e7f48fceb4ffda775355205b");
      insert_str = '{"username": "' + user_temp + '", "private_key": "' + pk + '"}';
      blockstack.putFile(UNIVERSAL_USER_INFO_FILE_NAME, insert_str).then(() => {
        username = user_temp;
        document.getElementById('username').innerHTML = username;
        private_key = pk;
      });
    }
    else {
      var parsed = JSON.parse(fileContents);
      username = parsed["username"];
      document.getElementById('username').innerHTML = username;
      private_key = parsed["private_key"];
    }
  });
}

function getValuesFromJWT(jws) {
	var jwt = KJUR.jws.JWS.parse(jws);
	return JSON.parse(jwt["payloadPP"]);
}

function isJWT(jwt_string){
  return true;
}

function getProfileInfoFromUsername(username) {
  const input = "https://core.blockstack.org/v1/names/" + username
	var xhr = new XMLHttpRequest();
  	xhr.onloadend = function() {
    	var data = JSON.parse(xhr.responseText);
      if (data.error || !data.zonefile) {
        alert("Could not load user. They likely do not exist!");
        return;
      }
      var zonefile = data["zonefile"]
      var lastIndex = zonefile.lastIndexOf('"');
      zonefile = zonefile.substring(0 , lastIndex);
      lastIndex = zonefile.lastIndexOf('"');
      var url = zonefile.substr(lastIndex+1);
      if (url.indexOf("https://") != 0) {
        url = "https://" + url;
      }
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display:none";
      a.onclick = "openInNewTab('" + url + "')";
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
  	}
  	if ("withCredentials" in xhr) {
    	xhr.open("GET", input, true);
  	}
  	else if (typeof XDomainRequest != "undefined") {
    	xhr = new XDomainRequest();
    	xhr.open("GET", input);
  	}
  	xhr.send();
}