function fileSubmit() {
  var x = document.getElementById("file")
  var txt = "";
  var file_reader = new FileReader;
    if ('files' in x) {
        if (x.files.length == 1) {
            for (var i = 0; i < x.files.length; i++) {
                var file = x.files[i];
                if ('name' in file) {
                    txt += "name: " + file.name + "\t";
                }
                if ('size' in file) {
                    txt += "size: " + file.size + " bytes \n";
                }
                txt += "\tThe file is of type " + file.type;
            }
        }
        else if (x.files.length > 1) {
            alert("Please select only one file to encrypt");
        } 
    } 
    else {
        if (x.value == "") {
            alert("Select a file to encrypt");
        } else {
            alert("File submission not supported");
        }
    }
    console.log(txt)
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
    document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Unknown Person"
    if(person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    }
    document.getElementById('section-1').style.display = 'none'
    document.getElementById('section-2').style.display = 'block'
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile
      showProfile(profile)
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin
    })
  }
})
