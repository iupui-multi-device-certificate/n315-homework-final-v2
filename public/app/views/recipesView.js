// SEMANTIC NOTE: updated view, edit, delete to buttons instead of anchor tags since they have to do something to load page, delete, etc. could just as easily open a modal as go to new page
//https://www.webaxe.org/proper-use-buttons-links/
//https://a11y-101.com/design/button-vs-link

import { dummyImgUrl } from "../helpers.js";

const renderRecipeItem = (recipeItem) => `
<div class="card">
  <div class="card-row">
    <div class="image-holder">
      <img
        src=${recipeItem.imgUrl != "" ? recipeItem.imgUrl : dummyImgUrl}
        alt="${recipeItem.name}"
      />

      <div class="btn-overlay ">
        <button
          class="btn btn--small btn--naplesYellow btn--view"
          id="view-${recipeItem.recipeId}"
        >
          View
        </button>
      </div>
    </div>
    <div class="card-body">
      <h1 class="card-title underline">${recipeItem.name}</h1>
      <p class="card-text">
      ${recipeItem.description}
      </p>
      <p class="time">
        <img src="./images/recipes/time.png" alt="time" />
        <span>${recipeItem.time}</span>
      </p>
      <p class="servings">
        <img src="./images/recipes/servings.png" alt="servings" />
        <span>${recipeItem.servings}</span>
      </p>
    </div>
  </div>

  <div class="button-holder">
    <a 
      href="#editRecipe/${
        recipeItem.recipeId
      }" class="btn btn--small btn--naplesYellow btn--edit">Edit
    </a>
    <button
      class="btn btn--small btn--naplesYellow btn--delete"
      id="deleteButton-${recipeItem.recipeId}"
      >Delete
    </button>
  </div>
</div>

`;

const renderRecipeItems = (recipeItems) => `
${recipeItems.map((recipeItem) => renderRecipeItem(recipeItem)).join("")}
`;

export const recipesView = ({
  currentUser,
  allRecipes,
  browseRecipes = true,
}) => `
<section class="content section-recipes ${
  browseRecipes ? `browse-recipes` : `your-recipes`
}">
  <div class="recipe-content">
    <h1 class="section-title">${
      browseRecipes
        ? `Recipes: Try some today!`
        : currentUser.firstName != ""
        ? `${currentUser.firstName}, here are your recipes!`
        : `Here are your recipes!`
    }</h1>
    <div class="cards">
      ${
        browseRecipes
          ? renderRecipeItems(allRecipes)
          : currentUser.recipes
          ? renderRecipeItems(currentUser.recipes)
          : `No recipes yet.`
      }
    </div>
  </div>
</section>

`;
