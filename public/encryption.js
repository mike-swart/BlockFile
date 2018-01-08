function signJWT(json_object, username, private_key) {
  if (username) {
    json_object.iss = username;
  }
  else {
    json_object.iss = "not set";
  }
  return KJUR.jws.JWS.sign(null, {"alg":"HS256", "cty":"JWT"}, json_object, private_key);
}

function verifyJWT(string_of_JWS, key) {
  /*get the public key from the username in the JWT and the API*/
	return KJUR.jws.JWS.verify(string_of_JWS, "{hex:" +  key + "}", {alg: ["ES256"]});
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
    	var responseText = xhr.responseText;
    	console.log(responseText);
  	}
  	if ("withCredentials" in xhr) {
    	xhr.open("GET", input, true);
  	}
  	else if (typeof XDomainRequest != "undefined") {
    	xhr = new XDomainRequest();
    	xhr.open("GET", input);
  	}
  	console.log(xhr);
  	xhr.send();
}