//TODO: footer nav routing

//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

//import views
import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
import { browseView } from "./views/browseView.js";
import { createRecipeView } from "./views/createRecipeView.js";
import { recipesView } from "./views/recipesView.js";
import { loginView } from "./views/loginView.js";
import { recipeDetailView } from "./views/recipeDetailView.js";

//import helpers
import {
  toggleCurrentPage,
  toggleMobileMenu,
  toggleRecipeHero,
  itemClickHandler,
  extractTextByCharacter,
} from "./helpers.js";

//import user feedback messags
import { MESSAGES } from "./messages.js";

//init the firebase app
const app = firebase.app();

//? maybe move render & handleLogout to separate file?
//just provide name of view to map to route, render will actually call the function
const routes = {
  "#home": homeView,
  "#browse": browseView,
  "#createRecipe": createRecipeView,
  "#yourRecipes": recipesView,
  "#login": loginView,
};

const render = (locals) => {
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
  alert(MESSAGES.INFO_LOGOUT);
};

const handleViewButtonClick = (target, currentUser) => {
  const currentId = extractTextByCharacter(target.id, "-");
  itemClickHandler(currentId, recipeDetailView, currentUser.recipes);
};

//add generic click listners
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

document.addEventListener("change", ({ target }) => {
  if (target.id === "recipeImage") {
    //check correct image format
    const fileInput = target.files[0];
    const imgType = fileInput.type;
    if (target.files[0]) {
      if (
        imgType !== "image/jpg" ||
        imgType !== "image/jpeg" ||
        imgType !== "image/png"
      ) {
        alert(MESSAGES.ERROR_IMG_FILE_TYPE);
        fileInput.value = "";
        return false;
      }
      document.getElementById("imgUploadText").innerHTML = target.files[0].name;
    }
  }
});

const setupUI = (currentUser = null) => {
  //maybe this should be after have user
  initFormListeners(currentUser);

  window.onhashchange = () => render(currentUser);
  render(currentUser);

  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const loggedInButtons = document.querySelectorAll(".btn--logged-in");

  //TODO: if time, also dim the attach file label - timing issue due to when rendered
  //NOTE: better design would be to hide the create recipes page altogether when not logged in

  // const attachFileLabel = document.getElementById("attachFile");

  if (currentUser) {
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = false));
    loggedOutLinks.forEach((item) => (item.hidden = true));

    loggedInButtons.forEach((item) => (item.disabled = false));

    // attachFileLabel.classList.remove("disabled");

    //add detail page listener after have a user
    document.addEventListener("click", ({ target }) => {
      if (target.classList.contains("btn--view")) {
        handleViewButtonClick(target, currentUser);
      }
    });
  } else {
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = true));
    loggedOutLinks.forEach((item) => (item.hidden = false));

    loggedInButtons.forEach((item) => (item.disabled = true));
    // attachFileLabel.classList.add("disabled");

    //TODO: redirect user to home
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let currentUser = null;
    let userRecipes = null;

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

      //https://stackoverflow.com/questions/52100103/getting-all-documents-from-one-collection-in-firestore
      //See Imanullah solution
      //might be a way to chain this with above, but this works for now
      // TODO: maybe use onSnapshot instead of get so these are more live??
      //https://stackoverflow.com/questions/52309507/firestore-onsnapshot-does-it-work-for-subcollections
      //https://firebase.google.com/docs/firestore/query-data/listen
      userRecipes = await firebase
        .firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("Recipes")
        .get()
        .then((querySnapshot) => {
          const recipes = [];
          querySnapshot.forEach((doc) => {
            recipes.push({ recipeId: doc.id, ...doc.data() });
          });
          return recipes;
        });

      currentUser.recipes = userRecipes;
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
