//TODO: footer nav routing

//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

//import views
import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
import { browseView } from "./views/browseView.js";
import { createRecipeView } from "./views/createRecipeView.js";
import { recipesView } from "./views/recipesView.js";
import { loginView } from "./views/loginView.js";

//import helpers
import {
  toggleCurrentPage,
  toggleMobileMenu,
  toggleRecipeHero,
} from "./helpers.js";

//init the firebase app
firebase.app();

// initFormListeners();

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

  toggleRecipeHero(hashTag);
  toggleCurrentPage(hashTag);

  document.querySelector("#app").innerHTML = page;
};

const handleLogout = () => {
  firebase.auth().signOut();
};

//add click listners
document.addEventListener("click", ({ target }) => {
  if (target.id === "#logout") {
    handleLogout();
  }

  if (
    target.classList.contains("hamburger") ||
    target.classList.contains("bar") ||
    target.classList.contains("nav-link")
  ) {
    toggleMobileMenu();
  }
});

const setupUI = (currentUser = null) => {
  window.onhashchange = () => render(currentUser);
  render(currentUser);

  initFormListeners(currentUser);

  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");

  if (currentUser) {
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = false));
    loggedOutLinks.forEach((item) => (item.hidden = true));
  } else {
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = true));
    loggedOutLinks.forEach((item) => (item.hidden = false));
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let currentUser = null;

    //TODO: use onsnapshot to have the listener for when changes?
    if (user) {
      currentUser = await firebase
        .firestore()
        .collection("Users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const data = doc.data();
          return { userId: doc.id, ...data, isLoggedIn: true };
        });

      console.log("on AuthStateChanged > user logged in ", currentUser);
      setupUI(currentUser);
    } else {
      console.log("on AuthStateChanged > user logged out");
      currentUser = null;
      setupUI(currentUser);
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
