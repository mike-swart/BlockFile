const UNIVERSAL_RECORD_KEEPING_FILE_NAME = "/records.json"
var time = 0;
var username = "";
var privateKey = "e86b1270d16542e83585ad80fb018fa48145e3c9e7f48fceb4ffda775355205b"
var publicKey = "03164b68e9b7fcbc67bb13a6ecd8058e5691f7433db7d068bd61c490eec9817684"

/*this is the file submission button*/
function fileSubmit() {
  var input = document.getElementById("file");

  if (input.files) {
    if (input.files.length === 1) {
      var file = input.files[0];
      var encryptor = new FileReader;
      encryptor.onload = function() {
        var obj = encryptor.result;
        if (isJWT(obj)) {
          addFileToMaster(obj);
        }
      }     
      encryptor.readAsBinaryString(file);
    }
    else {
      alert("Please select only one file to encrypt");
    }
  }
}

/*this is the URL submission field*/
function getFileFromURL() {
  var input = document.getElementById("url_addr").value;
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
  /*need to actually add the record*/
}

/*this is how a file is added to the storage*/
/*obj is the text within the file*/
/*file is the file object*/
function submitFile(obj, file) {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    var parsed = JSON.parse(fileContents);
    //parse the current tracking file and add the new contents
    var arr = [];
    for (var i = 0; i<parsed.files.length; i++) {
      arr[i] = parsed.files[i];
    }
    var date = (new Date()).getTime();
    var obj_arr = {"name":file.name, "date_added": date, "type":file.type, "file":obj};
    arr.push(obj_arr);
    parsed.files = arr;
    var str = JSON.stringify(parsed);
    console.log(parsed);
    //write the new file
    blockstack.putFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME, str).then(() => {
      console.log("file written");
      time2 = new Date().getTime()
      console.log(time2-time);
    });
  });
}

function addFileToMaster(jwt_text) {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    var parsed = JSON.parse(fileContents);
    //parse the current tracking file and add the new contents
    var arr = [];
    for (var i = 0; i<parsed.files.length; i++) {
      arr[i] = parsed.files[i];
    }
    arr.push(jwt_text);
    parsed.files = arr;
    var str = JSON.stringify(parsed);
    console.log(parsed);
    //write the new file
    blockstack.putFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME, str).then(() => {
      console.log("file written");
      time2 = new Date().getTime()
      console.log(time2-time);
    });
  });
}

function getAllRecords() {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    var parsed;
    if (fileContents === null) {
      console.log("no file contents");
      document.getElementById('record-display').innerHTML = '<tr><td>No files</td></tr>';
      return
    }
    else {
      parsed = JSON.parse(fileContents);
    }
    var files = '<tr><th>Record Name</th><th>Date</th><th>Information</th><th>Get Individual Record</th></tr>';
    for (var i = 0; i<parsed.files.length; i++) {
      console.log(getValuesFromJWT(parsed.files[i]));
      var temp = getValuesFromJWT(parsed.files[i]);
      files += '<tr><td>' + temp["name"] + '</td><td>' + temp["date_added"] + '</td><td>' + temp["file"] + '</td>'
      files += '<td><button class="button1" onclick="getIndividualRecord(' + i + ')">Get Record</button></tr>';
      //getIndividualRecord(i);
      /*could add a get record button that prints only the one by adding in a method that gets by the element number*/
    }
    document.getElementById('record-display').innerHTML = files;
  });
  var jwt = signJWT({"hello": "hi"}, "mikeswart.id", privateKey);
  console.log(jwt);
  console.log(getValuesFromJWT(jwt));
  console.log(verifyJWT(jwt, publicKey));
}

function makeNewRecord() {
  var new_name = document.getElementById("new_record_name").value;
  var new_info = document.getElementById("new_record_info").value;
  var date = new Date();
  var date_string = date.getHours() + ":" + date.getMinutes() + " " + date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
  var obj_arr = {"name":new_name, "date_added": date_string, "file": new_info};
  var username = blockstack.loadUserData().username;
  if (!username) {
    username = prompt("We cannot find your blockstack id. Please enter it here and we will add it. You can also add/change it in the user dropdown menu", "sample.id");
  }
  var jwt_text = signJWT(obj_arr, username, privateKey);
  console.log("here");
  console.log(jwt_text);
  addFileToMaster(jwt_text);
}

function getIndividualRecord(index) {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    var parsed;
    if (fileContents === null) {
      console.log("no file contents");
      document.getElementById('record-display').innerHTML = '<tr><td>No files</td></tr>';
      return
    }
    else {
      parsed = JSON.parse(fileContents);
    }
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display:none";
    var output = parsed["files"][index];
    var blob = new Blob([output], {type:'octet/stream'});
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = output["name"] + ".txt";
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

function showElement(id_name) {
  document.getElementById('addition').style.display = 'none';
  document.getElementById('home').style.display = 'none';
  document.getElementById(id_name).style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('signin-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.redirectToSignIn()
  })
  document.getElementById('signout-button').addEventListener('click', function(event) {
    event.preventDefault()
    blockstack.signUserOut(window.location.href)
  })
  document.getElementById('get-full-file').addEventListener('click', function(event) {
    event.preventDefault();
    blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
      if (fileContents === null) {
        alert("No files. Add some in the file submission menu.");
      }
      else {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        var parsed = JSON.stringify(fileContents);
        var blob = new Blob([parsed], {type:'octet/stream'});
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "records.json";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  })

  /*taken from stack overflow because the other libraries were for NODE*/
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  function showProfile(profile) {
    var person = new blockstack.Person(profile.profile)
    // set the dropdown meny elements
    document.getElementById('user-name').innerHTML = person.name() ? person.name() : "not set";
    document.getElementById('username').innerHTML = profile.username ? profile.username : "not set";
    document.getElementById('public-key').innerHTML = blockstack.getPublicKeyFromPrivate(profile.appPrivateKey);
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl());
    }
    //show the log in page only
    document.getElementById('section-1').style.display = 'none';
    document.getElementById('section-2').style.display = 'block';
    document.getElementById('addition').style.display = 'none';
    console.log(window.localStorage);
    console.log("This user's private key is " + profile.appPrivateKey);
    console.log("PK: " + blockstack.getPublicKeyFromPrivate(profile.appPrivateKey));
    console.log(parseJwt(JSON.parse(window.localStorage.blockstack)["coreSessionToken"]));
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData()
    console.log(profile);
    showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }

  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    //if the file does not exist then make a new file
    //fileContents=null; //this will reset the file record if uncommented
    if (fileContents === null) {
      blockstack.putFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME, '{"files": []}').then(() => {
        console.log("making file");
        getAllRecords();
      });
    }
    else {
      getAllRecords();
    }
  });
})
