//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
import { browseView } from "./views/browseView.js";
import { createRecipeView } from "./views/createRecipeView.js";
import { recipesView } from "./views/recipesView.js";
import { loginView } from "./views/loginView.js";

//init the firebase app
firebase.app();

initFormListeners();

//? maybe move render & handleLogout to separate file?
//just provide name of view to map to route, render will actually call the function
const routes = {
  "#home": homeView,
  "#browse": browseView,
  "#createRecipe": createRecipeView,
  "#yourRecipes": recipesView,
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

const setupUI = (currentUser = null) => {
  window.onhashchange = () => render(currentUser);
  render(currentUser);

  if (currentUser.isLoggedIn) {
    document.getElementById("loginNav").hidden = true;
    document.getElementById("logoutNav").hidden = false;
  } else {
    document.getElementById("loginNav").hidden = false;
    document.getElementById("logoutNav").hidden = true;
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let userDocData = null;
    let currentUser = {
      userDocData,
      isLoggedIn: false,
    };
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

      //TODO: maybe change to:
      const currentUser = {
        userDocData,
        isLoggedIn: true,
      };
      setupUI(currentUser);
    } else {
      console.log("on AuthStateChanged > user logged out");
      setupUI(currentUser);
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
