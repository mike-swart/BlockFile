function fileSubmit() {
  var input = document.getElementById("file");
  var display = document.getElementById("file_show");

  if (input.files) {
    if (input.files.length == 1) {
      var file = input.files[0];
      //load file
      var encryptor = new FileReader;
      encryptor.onloadend = function() {
        var obj = encryptor.result;
        blockstack.putFile("/this_file.txt", obj).then(() => {
            blockstack.getFile("/this_file.txt").then((fileContents) => {
            console.log("IN GETFILE");
            console.log(fileContents);
            //could be nice to show the file
          })
        })
      }
      //how should read
      encryptor.readAsText(file);
    }
    else {
      alert("Please select only one file to encrypt");
    }
  }
  else if (x.value == "") {
    alert("Select a file to encrypt");
  } 
  else {
    alert("File submission not supported");
  }
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
    console.log(person.toJSON())
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
