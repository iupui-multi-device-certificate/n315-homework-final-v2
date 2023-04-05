//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
import { loginView } from "./views/loginView.js";
import { recipesView } from "./views/recipesView.js";

//init the firebase app
firebase.app();

initFormListeners();

//? maybe move render & handleLogout to separate file?
//just provide name of view to map to route, render will actually call the function
const routes = {
  "#home": homeView,
  "#recipes": recipesView,
  "#login": loginView,
};

//why am i sending path when it's a global already?
const render = (locals) => {
  console.log("render > window.location", window.location);
  const path = window.location;

  //check not empty string
  const hashTag = path.hash !== "" ? path.hash : "#home";
  const page = locals ? routes[hashTag](locals) : routes[hashTag]();

  document.querySelector("#app").innerHTML = page;
};

const handleLogout = () => {
  firebase.auth().signOut();
};

//add event listener for all buttons
document.addEventListener("click", ({ target }) => {
  if (target.matches("button")) {
    //logout
    if ((target.id = "#logout")) {
      handleLogout();
    }
  }
});

const setupUI = (userData = null) => {
  window.onhashchange = () => render(userData);
  render(userData);

  if (userData) {
    document.getElementById("login").hidden = true;
    document.getElementById("#logout").hidden = false;
  } else {
    document.getElementById("login").hidden = false;
    document.getElementById("#logout").hidden = true;
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let userDocData = null;
    if (user) {
      userDocData = await firebase
        .firestore()
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          console.log(doc.data());
          return doc.data();
        });

      setupUI(userDocData);
    } else {
      console.log("on AuthStateChanged > user logged out");
      setupUI();
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
