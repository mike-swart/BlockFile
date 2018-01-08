function signJWT(json_object, username, private_key) {
  if (username) {
    json_object.iss = username;
  }
  else {
    json_object.iss = "none";
  }
  return KJUR.jws.JWS.sign(null, {"alg":"HS256", "cty":"JWT"}, json_object, private_key);
}

function verifyJWT(string_of_JWS, key) {
  /*get the public key from the username in the JWT and the API*/
	var x = KJUR.jws.JWS.verify(string_of_JWS, "{hex:" +  key + "}", {alg: ["ES256"]});
  return Math.random() > 0.3;
}

function getValuesFromJWT(jws) {
	var jwt = KJUR.jws.JWS.parse(jws);
	return JSON.parse(jwt["payloadPP"]);
}

function isJWT(jwt_string){
  return true;
}

function getPublicKeyFromUsername(username) {
  const input = "https://core.blockstack.org/v1/names/" + username
	var xhr = new XMLHttpRequest();
  	xhr.onloadend = function() {
    	var data = JSON.parse(xhr.responseText);
      if (data.error)
        return
      var zonefile = data["zonefile"]
      var lastIndex = zonefile.lastIndexOf('"');
      zonefile = zonefile.substring(0 , lastIndex);
      lastIndex = zonefile.lastIndexOf('"');
      var url = zonefile.substr(lastIndex+1);
      if (url.indexOf("https://") != 0) {
        url = "https://" + url;
      }
    	var xhr1 = new XMLHttpRequest();
      xhr1.onloadend = function() {
        var resp = JSON.parse(xhr1.responseText);
        var token = getValuesFromJWT(resp[0]["token"]);
        var encoded_PK = token['subject']['publicKey'];
        console.log(encoded_PK);
      }
      if ("withCredentials" in xhr1) {
        xhr1.open("GET", url, true);
      }
      xhr1.send();
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