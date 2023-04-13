//NOTE: don't use redirect page from form - looks like logged user out

import { uploadImage } from "../helpers.js";
import { MESSAGES } from "../messages.js";
// import { redirectPage } from "./helpers.js";

export const handleSignupSubmit = (e, signupForm) => {
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

export const handleLoginSubmit = (e, loginForm) => {
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

export const handleRecipeSubmit = async (e, recipeForm, currentUser) => {
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

  const result = await addRecipe(userId, recipe);

  recipeForm.reset();
  alert(result.message);
  //set the image upload text back
  document.getElementById("imgUploadText").innerHTML = "Add Recipe Image";
};

const getValuesFromInputsByName = (nameOfList) => {
  const elementList = document.getElementsByName(nameOfList);

  const valuesArray = Array.from(elementList).map((el) => el.value);
  return valuesArray;
};

const addRecipe = async (userId, recipe) => {
  let result = {
    success: false,
    message: "",
  };
  await firebase
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Recipes")
    .add(recipe)
    .then((docRef) => {
      console.log(MESSAGES.SUCCESS_RECIPE_CREATED + " RecipeID:", docRef.id);

      result = {
        success: true,
        message: MESSAGES.SUCCESS_RECIPE_CREATED,
      };
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      result = {
        success: false,
        message: MESSAGES.ERROR_RECIPE_NOT_CREATED,
      };
    });
  return result;
};
