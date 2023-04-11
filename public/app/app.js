//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

//import views
import { initFormListeners } from "./formHandlers.js";
import { homeView } from "./views/homeView.js";
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
  "#browse": recipesView,
  "#createRecipe": createRecipeView,
  "#yourRecipes": recipesView,
  "#login": loginView,
};

const render = (locals) => {
  const path = window.location;

  locals.browseRecipes = false;

  //check not empty string
  const hashTag = path.hash !== "" ? path.hash : "#home";

  if (hashTag === "#browse") {
    locals.browseRecipes = true;
  }

  const page = locals ? routes[hashTag](locals) : routes[hashTag]();

  toggleRecipeHero(hashTag);
  toggleCurrentPage(hashTag);

  // else if (hashTag === "#yourRecipe") {
  //   locals.browseRecipes = false;
  //   window.location.reload();
  // }

  console.log(`hash: ${hashTag}`, "locals", locals);

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
    // console.log("currentUser w/ filtered recipes", currentUser);

    initFormListeners(currentUser);

    const locals = { currentUser, allRecipes };
    window.onhashchange = () => render(locals);
    render(locals);

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

    const locals = { currentUser: null, allRecipes };

    window.onhashchange = () => render(locals);
    render(locals);
  }
};

// listen for auth status changes
const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let allRecipes = [];

    let counter = 1;
    await firebase
      .firestore()
      .collectionGroup("Recipes")
      .onSnapshot((snapshot) => {
        if (counter === 1) {
          //initial load
          snapshot.forEach((doc) => {
            const docRef = doc.ref;
            const parentCollectionRef = docRef.parent;
            allRecipes.push({
              ownerId: parentCollectionRef.parent.id,
              recipeId: doc.id,
              ...doc.data(),
            });
          });
          counter++;
        } else {
          //check type of change and just push changed doc
          snapshot.docChanges().forEach((change) => {
            const docRef = change.doc.ref;
            const parentCollectionRef = docRef.parent;
            const recipeId = change.doc.id;
            const data = change.doc.data();

            if (change.type === "added") {
              console.log("Recipe: ", change.doc.data());
              allRecipes.push({
                ownerId: parentCollectionRef.parent.id,
                recipeId,
                ...data,
              });
            }
            if (change.type === "modified") {
              console.log("Recipe: ", change.doc.data());
            }
            if (change.type === "removed") {
              console.log("Recipe: ", change.doc.data());
            }
          });

          counter++;
        }

        //   //setting up more like a SQL db w/ a foreign key (lol)
        //   allRecipes.push({
        //     ownerId: parentCollectionRef.parent.id,
        //     recipeId: doc.id,
        //     ...doc.data(),
        //   });
        //   return allRecipes;
        // });

        // console.log("allRecipes > allRecipes", allRecipes);

        // setupUI(user, allRecipes);
      });

    if (user) {
      setupUI(user, allRecipes);
      console.log("on AuthStateChanged > user logged in ");
    } else {
      setupUI(null, allRecipes);
      console.log("on AuthStateChanged > user logged out");
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
