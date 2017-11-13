function fileSubmit() {
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
    console.log(JSON.parse(JSON.parse(responseText)));
  }
  if ("withCredentials" in xhr) {
    //xhr.withCredentials = true;
    xhr.open("GET", input, true);
  }
  else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open("GET", input);
  }
  console.log(xhr);
  xhr.send();
  /*var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       document.getElementById("demo").innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("GET", input, true);
  xhttp.send();*/
}

function submitFile(obj, file) {
  blockstack.getFile("/file.txt").then((fileContents) => {
    //if the file does not exist then make a new file
    //fileContents=null; //reset the file.txt
    var parsed;
    if (fileContents === null) {
      console.log("file was null. Creating new file.")
      blockstack.putFile("/file.txt", '{"files": []}').then(() => {});
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
    blockstack.putFile("/file.txt", str).then(() => {
      console.log("file written");
    });
  });
}

function getEncryptedMasterFile(public_key) {
  blockstack.getFile("/file.txt").then((fileContents) => {
    var parsed;
    if (fileContents === null) {
      parsed = "no files";
    }
    else {
      parsed = fileContents;
    }
  })
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
    
    blockstack.getFile("/file.txt").then((fileContents) => {
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

  function showProfile(profile) {
    var person = new blockstack.Person(profile.profile)
    console.log("This user's private key is " + profile.appPrivateKey);
    document.getElementById('user-name').innerHTML = person.name() ? person.name() : "not set";
    console.log("PK: " + blockstack.getPublicKeyFromPrivate(profile.appPrivateKey));
    document.getElementById('public-key').innerHTML = blockstack.getPublicKeyFromPrivate(profile.appPrivateKey);
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl());
    }
    document.getElementById('section-1').style.display = 'none'
    document.getElementById('section-2').style.display = 'block'
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
