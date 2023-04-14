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

    //check on metadata changes so only see the log once
    //otherwise, it fires 2x but no duplicates in db
    // https://cloud.google.com/firestore/docs/query-data/listen
    // https://medium.com/firebase-developers/firestore-clients-to-cache-or-not-to-cache-or-both-8f66a239c329
    await firebase
      .firestore()
      .collectionGroup("Recipes")
      .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
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

            //TODO: still seeing this called 2x, esp. w/ image & slower connection. Does not create duplicates in db or state.

            //since we're not using React to manage state, we are mutating it
            if (change.type === "added") {
              console.log(
                `Recipe added with id: ${change.doc.id}`,
                change.doc.data()
              );
              allRecipes.push({
                ownerId: parentCollectionRef.parent.id,
                recipeId,
                ...data,
              });
            }
            if (change.type === "modified") {
              console.log(
                `Recipe modified with id: ${change.doc.id}`,
                change.doc.data()
              );
            }
            if (change.type === "removed") {
              console.log(
                `Recipe removed with id: ${change.doc.id}`,
                change.doc.data()
              );
              const indexOfRecipe = allRecipes.findIndex((recipe) => {
                return recipe.recipeId === change.doc.id;
              });

              console.log("index to delete", indexOfRecipe);

              allRecipes.splice(indexOfRecipe, 1);
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
      //todo: remove loggedInListeners
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
