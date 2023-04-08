import { uploadImage } from "./helpers.js";

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
        console.log("account created", cred.user);
        return firebase.firestore().collection("Users").doc(cred.user.uid).set({
          firstName,
          lastName,
          email,
          // recipes: [],
        });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error creating account", errorMessage);
    })
    //clear form at end regardless
    .then(() => {
      signupForm.reset();
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
      loginForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error logging in", errorMessage);
    });
};

const handleRecipeSubmit = (e, recipeForm, currentUser) => {
  e.preventDefault();

  //don't destructure since recipes could be null
  const userId = currentUser.userId;

  // let recipes = [];
  let ingredients = [];
  let instructions = [];

  //TODO: instruction needs to include the step number
  //or set the id??
  let instruction = {
    stepNumber: 1,
    text: "",
  };

  //keep these outside?
  ingredients = getValuesFromInputsByName("ingredients[]");
  instructions = getValuesFromInputsByName("instructions[]");

  let imageToUpload = document.getElementById("recipeImage").files[0];

  let recipe = {
    imgUrl: "",
    name: recipeForm["recipeName"].value,
    description: recipeForm["recipeDescription"].value,
    time: recipeForm["recipeTotalTime"].value,
    servings: recipeForm["recipeServingSize"].value,
    ingredients,
    instructions,
  };

  //works, you have to drill down in firebase to actually see it
  //use add to get the docid back
  //https://stackoverflow.com/questions/48740430/firestore-how-to-get-document-id-after-adding-a-document-to-a-collection
  firebase
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Recipes")
    .add(recipe)
    .then((docRef) => {
      uploadImage(imageToUpload, userId, docRef.id);
    });

  console.log("recipe created");

  recipeForm.reset();
  //set the image upload text back
  document.getElementById("imgUploadText").innerHTML = "Add Recipe Image";
};

//form event listeners
//add to document since these are dynamically created.
export const initFormListeners = (currentUser) => {
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
