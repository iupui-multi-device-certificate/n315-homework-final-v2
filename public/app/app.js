//TODO: footer nav routing

//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

//import views
import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
import { browseView } from "./views/browseView.js";
import { createRecipeView, renderListItem } from "./views/createRecipeView.js";
import { recipesView } from "./views/recipesView.js";
import { loginView } from "./views/loginView.js";
import { recipeDetailView } from "./views/recipeDetailView.js";

//import helpers
import {
  toggleCurrentPage,
  toggleMobileMenu,
  toggleRecipeHero,
  itemClickHandler,
  getTextAfterCharacter,
  redirectPage,
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
  const currentId = getTextAfterCharacter(target.id, "-");
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

  if (target.classList.contains("btn--add")) {
    const splitId = target.parentElement.id.split("-");
    const newId = parseInt(splitId[1]) + 1;
    console.log("new id", newId);
    const newItem = renderListItem(splitId[0], newId);
    target.parentElement.insertAdjacentHTML("afterend", newItem);
  }

  if (target.classList.contains("btn--close")) {
    window.location.reload();
  }
});

document.addEventListener("change", ({ target }) => {
  if (target.id === "recipeImage") {
    //check correct image format
    //https://www.geeksforgeeks.org/file-type-validation-while-uploading-it-using-javascript/#
    // https://dev.to/faddalibrahim/filtering-and-validating-file-uploads-with-javascript-327p

    const fileInput = target.files[0];

    const allowedExtensions = ["jpg", "jpeg", "png"];
    const { name: fileName } = fileInput;
    const fileExtension = fileName.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)) {
      alert(MESSAGES.ERROR_IMG_FILE_TYPE);
      fileInput.value = null;
      //this ensures the text restores back to "Add Recipe Image"
      return false;
    }

    document.getElementById("imgUploadText").innerHTML = target.files[0].name;
  }
});

//NOTE: async since we have to wait to get user stuff back
const setupUI = async (user = null, allRecipes = null) => {
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const loggedInButtons = document.querySelectorAll(".btn--logged-in");

  //NOTE: better design would be to hide the create recipes page altogether when not logged in

  if (user) {
    const currentUser = await firebase
      .firestore()
      .collection("Users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const data = doc.data();
        return { userId: doc.id, ...data, isLoggedIn: true };
      });

    const userRecipes = allRecipes.filter(
      (recipe) => recipe.ownerId === currentUser.userId
    );

    currentUser.recipes = userRecipes;
    console.log("currentUser w/ filtered recipes", currentUser);

    initFormListeners(currentUser);

    window.onhashchange = () => render(currentUser, allRecipes);
    render(currentUser, allRecipes);

    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = false));
    loggedOutLinks.forEach((item) => (item.hidden = true));

    loggedInButtons.forEach((item) => (item.disabled = false));

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

    redirectPage();
    initFormListeners(null);

    window.onhashchange = () => render(null, allRecipes);
    render(null, allRecipes);
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let allRecipes = [];

    if (user) {
      await firebase
        .firestore()
        .collectionGroup("Recipes")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const docRef = doc.ref;
            const parentCollectionRef = docRef.parent;

            //setting up more like a SQL db w/ a foreign key (lol)
            allRecipes.push({
              ownerId: parentCollectionRef.parent.id,
              recipeId: doc.id,
              ...doc.data(),
            });
            return allRecipes;
          });

          console.log("allRecipes > allRecipes", allRecipes);

          setupUI(user, allRecipes);
        });

      console.log("on AuthStateChanged > user logged in ");
    } else {
      setupUI(null, allRecipes);
      console.log("on AuthStateChanged > user logged out");
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
