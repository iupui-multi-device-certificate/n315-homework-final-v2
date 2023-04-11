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
} from "./eventHandlers.js";

//add to document since these are dynamically created.
//form event listeners
export const initListeners = (currentUser = null) => {
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

    //recipeForm not defined error occurred b/c had set id of form to recipeForm and was using directly instead of checking for closest.
    const recipeForm = e.target.closest("#recipe-form");
    if (recipeForm) {
      handleRecipeSubmit(e, recipeForm, currentUser);
    }
  });

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
      window.location.reload();
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "recipeImage") {
      handleRecipeImageChange(e);
    }
  });
};
