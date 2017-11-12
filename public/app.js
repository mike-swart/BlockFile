function fileSubmit() {
  var input = document.getElementById("file");
  var display = document.getElementById("file_show");

  if (input.files) {
    if (input.files.length === 1) {
      var file = input.files[0];
      var encryptor = new FileReader;
      encryptor.onload = function() {
        var obj = encryptor.result;
        getMasterFile(obj);
      }     
      encryptor.readAsBinaryString(file);
    }
    else {
      alert("Please select only one file to encrypt");
    }
  }
}

function getMasterFile(obj) {
  blockstack.getFile("/file.txt").then((fileContents) => {
    //if the file does not exist then make a new file
    if (fileContents === null) {
      console.log("file was null. Creating new file.")
      blockstack.putFile("/file.txt", '{"files": []}').then(() => {});
    }
    var parsed = JSON.parse(fileContents);
    var arr = [];
    var i;
    for (i = 0; i<parsed.files.length; i++) {
      arr[i] = parsed.files[i];
    }
    arr.push(obj);
    parsed.files = arr;
    var str = JSON.stringify(parsed);
    console.log(parsed);
    /*blockstack.putFile("/file.txt", str).then(() => {
      console.log("file written");
    });*/
    //console.log("Hello");
  });
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

  function showProfile(profile) {
    var person = new blockstack.Person(profile)
    //console.log(person.toJSON())
    document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Unknown Person"
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    }
    if (person.address()) {
      console.log("Address")
      console.log(person.address())
    }
    document.getElementById('section-1').style.display = 'none'
    document.getElementById('section-2').style.display = 'block'
  }

  if (blockstack.isUserSignedIn()) {
    console.log("This user's private key is " + blockstack.loadUserData().appPrivateKey);
    console.log("This user's public key is " + blockstack.getPublicKeyFromPrivate(blockstack.loadUserData().appPrivateKey));
    var profile = blockstack.loadUserData().profile
      showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }
})
