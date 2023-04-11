//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

import { initListeners } from "./events/initListeners.js";
import { render } from "./router.js";
//import helpers
import { redirectPage } from "./helpers.js";

import { handleViewButtonClick } from "./events/eventHandlers.js";

//init the firebase app
const app = firebase.app();

//NOTE: async since we have to wait to get user stuff back
const setupUI = async (currentUser = null, allRecipes = null) => {
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const loggedInButtons = document.querySelectorAll(".btn--logged-in");

  //NOTE: better design would be to hide the create recipes page altogether when not logged in

  if (currentUser) {
    initListeners(currentUser);

    const locals = { currentUser, allRecipes };
    window.onhashchange = () => render(locals);
    render(locals);

    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = false));
    loggedOutLinks.forEach((item) => (item.hidden = true));

    loggedInButtons.forEach((item) => (item.disabled = false));

    //add detail page listener after have a user
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn--view")) {
        handleViewButtonClick(e, currentUser);
      }
    });
  } else {
    // toggle user UI elements
    loggedInLinks.forEach((item) => (item.hidden = true));
    loggedOutLinks.forEach((item) => (item.hidden = false));

    loggedInButtons.forEach((item) => (item.disabled = true));

    redirectPage();
    initListeners(null);

    const locals = { currentUser: null, allRecipes };

    window.onhashchange = () => render(locals);
    render(locals);
  }
};

// listen for auth status changes
//TODO: set up locals here
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
          //check type of change and just push changed doc otherwise get duplicates
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
      });

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

      setupUI(currentUser, allRecipes);
      console.log("on AuthStateChanged > user logged in ");
    } else {
      setupUI(null, allRecipes);
      console.log("on AuthStateChanged > user logged out");
    }
  });
};

//now that have other stuff, init our auth
onAuthInit();
