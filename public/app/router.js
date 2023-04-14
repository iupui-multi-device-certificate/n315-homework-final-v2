import { homeView } from "./views/homeView.js";
import { recipesView } from "./views/recipesView.js";
import { recipeFormView } from "./views/recipeFormView.js";
import { loginView } from "./views/loginView.js";

import { toggleCurrentPage, toggleRecipeHero } from "./helpers.js";

//just provide name of view to map to route, render will actually call the function
const routes = {
  "#home": homeView,
  "#browse": recipesView,
  "#createRecipe": recipeFormView,
  "#editRecipe": recipeFormView,
  "#yourRecipes": recipesView,
  "#login": loginView,
};

export const render = (locals) => {
  const { currentUser, allRecipes } = locals;
  const path = window.location;

  locals.browseRecipes = false;

  const hashArray = path.hash.split("/");

  const hashTag = hashArray[0] !== "" ? hashArray[0] : "#home";

  console.log(`hash: ${hashTag}`, "locals", locals);

  if (hashTag === "#browse") {
    locals.browseRecipes = true;
  } else if (hashTag === "#editRecipe") {
    locals.editRecipe = true;
    locals.recipeId = hashArray[1];
  }

  if (currentUser) {
    //filter in the render and set user's recipes so this is live from allRecipes, not just in the setup
    currentUser.recipes = allRecipes.filter(
      (recipe) => recipe.ownerId === currentUser.userId
    );
  }

  const page = locals ? routes[hashTag](locals) : routes[hashTag]();

  toggleRecipeHero(hashTag);
  toggleCurrentPage(hashTag);

  document.querySelector("#app").innerHTML = page;
};
