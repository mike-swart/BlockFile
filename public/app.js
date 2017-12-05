const UNIVERSAL_RECORD_KEEPING_FILE_NAME = "/records.json"

function fileSubmit() {
  blockstack.putFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME, '{"files": []}').then(() => {});
  var input = document.getElementById("file");
  var display = document.getElementById("file_show");

  if (input.files) {
    if (input.files.length === 1) {
      var file = input.files[0];
      var encryptor = new FileReader;
      encryptor.onload = function() {
        var obj = encryptor.result;
        submitFile(obj, file);
      }     
      encryptor.readAsBinaryString(file);
    }
    else {
      alert("Please select only one file to encrypt");
    }
  }
}

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
}

function submitFile(obj, file) {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    //if the file does not exist then make a new file
    //fileContents=null; //reset the record file
    var parsed;
    if (fileContents == null) {
      console.log("file was null. Creating new file.")
      blockstack.putFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME, '{"files": []}').then(() => {});
      parsed = JSON.parse('{"files": []}');
    }
    else {
      parsed = JSON.parse(fileContents);
    }

    //parse the current tracking file and add the new contents
    var arr = [];
    var i;
    for (i = 0; i<parsed.files.length; i++) {
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
    });
  });
}

function getEncryptedMasterFile(public_key) {
  blockstack.getFile(UNIVERSAL_RECORD_KEEPING_FILE_NAME).then((fileContents) => {
    var parsed;
    if (fileContents === null) {
      parsed = "no files";
    }
    else {
      parsed = fileContents;
    }
  })
}

function showElement(id_name) {
  document.getElementById('addition').style.display = 'none';
  document.getElementById('share').style.display = 'none';
  document.getElementById('show').style.display = 'none';
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
  document.getElementById('addition-button').addEventListener('click', function(event) {
    event.preventDefault();
    showElement('addition');
  })
  document.getElementById('share-button').addEventListener('click', function(event) {
    event.preventDefault();
    showElement('share');
  })
  document.getElementById('show-button').addEventListener('click', function(event) {
    event.preventDefault();
    showElement('show');
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
        console.log(url);
        a.href = url;
        a.download = "file.json";
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
    document.getElementById('username').innerHTML = person.address() ? person.address() : "not set";
    document.getElementById('public-key').innerHTML = blockstack.getPublicKeyFromPrivate(profile.appPrivateKey);
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl());
    }
    //show the log in page only
    document.getElementById('section-1').style.display = 'none';
    document.getElementById('section-2').style.display = 'block';
    document.getElementById('addition').style.display = 'none';
    document.getElementById('share').style.display = 'none';
    document.getElementById('show').style.display = 'none';

    console.log(window.localStorage);
    console.log("This user's private key is " + profile.appPrivateKey);
    console.log("PK: " + blockstack.getPublicKeyFromPrivate(profile.appPrivateKey));
    console.log(parseJwt(JSON.parse(window.localStorage.blockstack)["coreSessionToken"]));
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData()
    showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }
})
