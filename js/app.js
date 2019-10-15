//Initial Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBcdnhWfoAEFIBBa3k6xoJ03dJBTD8jdPc",
  authDomain: "food247-4a7d1.firebaseapp.com",
  databaseURL: "https://food247-4a7d1.firebaseio.com",
  projectId: "food247-4a7d1",
  storageBucket: "food247-4a7d1.appspot.com",
  messagingSenderId: "295030401649",
  appId: "1:295030401649:web:a71eb0eae853c5235b09d0"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Monitor authen status
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    console.log(email + " signed in");
  } else {
    console.log("signed out");
  }
});

document.addEventListener('init', function (event) {
  var page = event.target;


  if (page.id === 'homePage') {
    console.log("homePage");

    $("#menubtn").click(function () {
      console.log("click menubtn")
      $("#sidemenu")[0].open();
    });

    $("#carousel").empty();
    db.collection("recommended").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        var item = `<ons-carousel-item modifier="nodivider" id="${doc.data().id}" class="recomended_item">
        <div class="thumbnail" style="background-image: url('${doc.data().photoUrl}')">
        </div>
        <div class="recomended_item_title" id="item1_name">${doc.data().name}</div>
        </ons-carousel-item>`;

        $("#carousel").append(item);
      });
    });
  }

  if (page.id === 'menuPage') {
    console.log("menuPage");

    $("#login").click(function () {
      $("#content")[0].load("login.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      firebase.auth().signOut().then(function () {
        $("#content")[0].load("foodcategory2.html");
        $("#sidemenu")[0].close();
      }).catch(function (error) {
        console.log(error.message);
      });
    });

    $("#home").click(function () {
      $("#content")[0].load("foodcategory2.html");
      $("#sidemenu")[0].close();
    });
  }
  var provider = new firebase.auth.GoogleAuthProvider();

  $("#googlebtn").click(function () {
    firebase.auth().signInWithPopup(provider).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      $("#content")[0].load("foodcategory2.html");
      // ...
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      // ...
    });
  })

  if (page.id === 'loginPage') {
    console.log("loginPage");

    $("#signinbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();
      firebase.auth().signInWithEmailAndPassword(username, password).then(function () {
        $("#content")[0].load("foodcategory2.html");
        $("#sidemenu")[0].close();
      }).catch(function (error) {
        console.log(error.message);
      });
    });

    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodcategory2.html");
    });
  }
});
