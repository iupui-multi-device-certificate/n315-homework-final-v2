//NOTE: do not need DOMContentLoaded listener since our scripts at bottom of body tag and use defer and/or module

// import { initListeners } from "./events/initListeners.js";
import { render } from "./router.js";
//import helpers
import { toggleShowLoggedIn, redirectPage } from "./helpers.js";

import {
  initListeners,
  initLoggedInListeners,
} from "./events/initListeners.js";

//init the firebase app
const app = firebase.app();

// listen for auth status changes

const onAuthInit = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    let allRecipes = [];
    let counter = 1;
    let locals = {};

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

      initLoggedInListeners(currentUser);
      toggleShowLoggedIn(currentUser);
      locals = { currentUser, allRecipes };
      console.log("on AuthStateChanged > user logged in ");
      redirectPage();
    } else {
      toggleShowLoggedIn(null);
      locals = { currentUser: null, allRecipes };
      console.log("on AuthStateChanged > user logged out");
      redirectPage();
    }

    window.onhashchange = () => render(locals);
  });
};

//now that have other stuff, init our auth
onAuthInit();
initListeners();
