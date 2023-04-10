//NOTE: don't use redirect page from form - looks like logged user out

import { uploadImage } from "./helpers.js";
import { MESSAGES } from "./messages.js";
// import { redirectPage } from "./helpers.js";

const handleSignupSubmit = (e, signupForm) => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const firstName = signupForm["first-name"].value;
  const lastName = signupForm["last-name"].value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      const user = cred.user;
      if (user) {
        console.log("account created");
        return firebase.firestore().collection("Users").doc(cred.user.uid).set({
          firstName,
          lastName,
          email,
        });
      }
      alert(MESSAGES.SUCCESS_ACCOUNT_CREATED);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error creating account", errorMessage);

      let userErrorMessage = "";

      switch (errorCode) {
        case "auth/email-already-in-use":
          userErrorMessage = MESSAGES.ERROR_EMAIL_EXISTS;
          break;
        case "auth/weak-password":
          userErrorMessage = MESSAGES.ERROR_WEAK_PASSWORD;
          break;
        default:
          userErrorMessage = MESSAGES.ERROR_SIGNUP_GENERAL;
          break;
      }

      alert(userErrorMessage);
    })
    //clear form at end regardless
    .then(() => {
      signupForm.reset();
      alert(MESSAGES.SUCCESS_ACCOUNT_CREATED);
      // redirectPage("#yourRecipes");
    });
};

const handleLoginSubmit = (e, loginForm) => {
  e.preventDefault();

  //get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      alert(MESSAGES.SUCCESS_LOGIN);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error logging in", errorMessage);

      let userErrorMessage = "";

      switch (errorCode) {
        case "auth/wrong-password":
          userErrorMessage = MESSAGES.ERROR_WRONG_PASSWORD;
          break;
        case "auth/too-many-requests":
          userErrorMessage = MESSAGES.ERROR_TOO_MANY_ATTEMPTS;
          break;
        default:
          userErrorMessage = MESSAGES.ERROR_LOGIN_GENERAL;
          break;
      }

      alert(userErrorMessage);
    })
    //clear form at end regardless
    .then(() => {
      loginForm.reset();
      // redirectPage("#yourRecipes");
    });
};

//TODO: ing & inst not saving??
const handleRecipeSubmit = async (e, recipeForm, currentUser) => {
  e.preventDefault();

  //don't destructure since recipes could be null
  const userId = currentUser.userId;

  // let recipes = [];
  let ingredients = [];
  let instructions = [];

  //keep these outside?
  ingredients = getValuesFromInputsByName("ingredients[]");
  instructions = getValuesFromInputsByName("instructions[]");

  let imageToUpload = document.getElementById("recipeImage").files[0];
  const imgUrl = await uploadImage(imageToUpload);
  //check if empty url in case had issue

  let recipe = {
    imgUrl: imgUrl ? imgUrl : "",
    name: recipeForm["recipeName"].value,
    description: recipeForm["recipeDescription"].value,
    time: recipeForm["recipeTotalTime"].value,
    servings: recipeForm["recipeServingSize"].value,
    ingredients,
    instructions,
  };

  console.log("handle recipe > recipe w/ url", recipe);

  firebase
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Recipes")
    .add(recipe);

  console.log("recipe created");

  recipeForm.reset();
  alert(MESSAGES.SUCCESS_RECIPE_CREATED);
  //set the image upload text back
  document.getElementById("imgUploadText").innerHTML = "Add Recipe Image";
};

//form event listeners
//add to document since these are dynamically created.
export const initFormListeners = (currentUser = null) => {
  document.addEventListener("submit", (e) => {
    // signup
    const signupForm = e.target.closest("#signup-form");
    if (signupForm) {
      handleSignupSubmit(e, signupForm);
    }

    //login form
    const loginForm = e.target.closest("#login-form");
    if (loginForm) {
      handleLoginSubmit(e, loginForm);
    }
    //TODO: fix recipeForm is not defined when on recipeForm and hit logout
    //maybe need to check if user???
    //or remove the listener on logout
    if (recipeForm) {
      handleRecipeSubmit(e, recipeForm, currentUser);
    }
  });
};

const getValuesFromInputsByName = (nameOfList) => {
  const elementList = document.getElementsByName(nameOfList);

  const valuesArray = Array.from(elementList).map((el) => el.value);
  return valuesArray;
};
