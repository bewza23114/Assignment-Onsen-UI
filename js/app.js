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

  if (page.id === 'homePage') {
    console.log("homePage");

    $("#menubtn").click(function () {
      console.log("click menubtn")
      $("#sidemenu")[0].open();
    });

    db.collection("recommended").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        var item = `<ons-carousel-item modifier="nodivider" id="${doc.data().id}" class="recomended_item">
        <div class="thumbnail" style="background-image: url('${doc.data().photoUrl}'); margin-top:10px;">
        </div>
        <div style="background-color:rgba(117, 122, 128, 0.938);" class="recomended_item_title" id="item1_name""><span style="color: white">${doc.data().name}</span></div>
        </ons-carousel-item>`;

        $("#carousel").append(item);
      });
    });
    $("#fastfoodbtn").click(function () {
      console.log("click fastfoodbtn")
      $("#content")[0].load("restaurantlist2.html");
    });
  }

  if (page.id === 'restaurantlistPage') {
    db.collection("restaurant").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var item = `<ons-card style="padding-top:10px">
    <div
        style="background-size: 330px auto; background-repeat: no-repeat; background-position: center; height:100px;
        background-image:url('${doc.data().picture}');">
        <div style="margin-left: 84%; width:16%; border-radius: 4px; margin-bottom:5px; background-color: rgb(241, 137, 40);">
            <ons-icon size="15px" style="color: rgb(255, 255, 255);" icon="fa-star"><span
                    style="color:white; padding-left:5px">${doc.data().rating}</span>
            </ons-icon>
        </div>
    </div>
    <ons-row>
        <ons-col style="padding-left: 7px">
            <div style="font-size: 18px; padding-top:7px; font-weight: bold;">${doc.data().name}</div>
            <div style="font-size: 15px">Distance : ${doc.data().distance} km / ${doc.data().time} min<span style="padding-left:18px; font-size: 17px;
             color: rgb(17, 180, 58)">${doc.data().status}</span></div>
        </ons-col>
        <ons-col width=18%>
            <div onclick="gomenu('${doc.id}');" class="btncard">Go<ons-icon size="13px"
                    style="padding-left:1px" icon="fa-chevron-right"></ons-icon>
            </div>
        </ons-col>
    </ons-row>
</ons-card>`;

        $("#listrestaurant").append(item);
      });
    });

    console.log("restaurantlistPage");
    $("#backbtn").click(function () {
      console.log("click backbtn RT")
      $("#content")[0].load("foodcategory2.html");
    });
    $("#gobtn").click(function () {
      console.log("click gobtn")
      $("#content")[0].load("restaurantmenu2.html");
    });
  }

  if (page.id === 'restaurantmenuPage') {

    var valueid = localStorage.getItem("curr_restid");

    var docRef = db.collection("restaurant").doc(valueid);

    docRef.get().then(function (doc) {
      var name = doc.data().name;
      var distance = doc.data().distance;
      var time = doc.data().time;
      var rating = doc.data().rating;
      var picture = doc.data().picture;
      var status = doc.data().status;
      var menu = doc.data().menu;

      $("#name").text(name)
      $("#distance").text(distance)
      $("#time").text(time)
      $("#rating").text(rating)
      $("#picture").css("background-image", "url('" + picture + "')")
      $("#status").text(status)
      $("#listmenu").empty()
      menu.forEach(element => {
        var item = `<ons-list-item style="background-color: rgb(230, 230, 230, 0.93);">
        <div class="left">${element.name}</div>
        <div class="right"><span>${element.price}฿&nbsp&nbsp</span><ons-button><ons-icon icon="fa-plus"></ons-icon></ons-button></div>
        </ons-list-item>`
        $("#listmenu").append(item);
        console.log("name:", element.name, ",price:", element.price);
      });
    }).catch(function (error) {
      console.log("Error getting cached document:", error);
    });

    console.log("restaurantlistPage");
    $("#backbtn").click(function () {
      console.log("click backbtn RM")
      $("#content")[0].load("restaurantlist2.html");
    });
    $("#orderbtn").click(function () {
      console.log("click orderbtn")
      $("#content")[0].load("orderconfirmation2.html");
    });
  }
  if (page.id === 'orderconfirmationPage') {
    console.log("orderconfirmationPage");
    $("#backbtn").click(function () {
      console.log("click backbtn OC")
      $("#content")[0].load("restaurantmenu2.html");
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
    $("#createaccountbtn").click(function(){
      console.log("click create account btn");
      $("#content")[0].load("register.html");
    });
    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodcategory2.html");
    });
  }
  if (page.id === 'registerPage') {
    $("#backhomebtn").click(function () {
      $("#content")[0].load("foodcategory2.html");
    });
  }



});

function gomenu(id) {
  localStorage.setItem("curr_restid", id);
  $("#content")[0].load("restaurantmenu2.html");
}