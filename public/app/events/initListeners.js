import { toggleMobileMenu } from "../helpers.js";

import {
  handleLoginSubmit,
  handleSignupSubmit,
  handleRecipeSubmit,
} from "./formHandlers.js";

import {
  handleLogout,
  handleAddItemButtonClick,
  handleRecipeImageChange,
  handleViewButtonClick,
  handleDeleteButtonClick,
} from "./eventHandlers.js";

import { redirectPage } from "../helpers.js";

//add to document since these are dynamically created.

export const initListeners = () => {
  //add generic click listners
  document.addEventListener("click", (e) => {
    if (e.target.id === "#logout") {
      handleLogout();
    }

    if (
      e.target.classList.contains("hamburger") ||
      e.target.classList.contains("bar") ||
      e.target.classList.contains("nav-link")
    ) {
      toggleMobileMenu();
    }

    if (e.target.classList.contains("btn--addItem")) {
      handleAddItemButtonClick(e);
    }

    if (e.target.classList.contains("btn--close")) {
      //TODO: fix reload flashes [low priority]
      //have to reload b/c using anchors/ routing to load & not click handler
      //cleans out so createRecipe loads instead of editRecipe
      if (e.target.id === "close-recipe-form") {
        //make sure this does not submit the form
        e.preventDefault();
        if (e.target.form.classList.contains("recipe-edit")) {
          redirectPage("#yourRecipes");
          //this cleans it out so not cached in createRecipe
          window.location.reload();
        }
      }

      if (e.target.id === "close-recipe-detail") {
        window.location.reload();
      }
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "recipeImage") {
      handleRecipeImageChange(e);
    }
  });

  //auth form event listeners
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
  });
};

//only add listeners if user logged in
export const initLoggedInListeners = (currentUser) => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn--view") && currentUser) {
      handleViewButtonClick(e, currentUser);
    }

    if (e.target.classList.contains("btn--delete") && currentUser) {
      handleDeleteButtonClick(e, currentUser);
    }
  });

  document.addEventListener("submit", (e) => {
    if (e.target.classList.contains("recipe-form") && currentUser) {
      handleRecipeSubmit(e, currentUser);
    }
  });
};
