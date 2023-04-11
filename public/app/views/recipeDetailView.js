import { dummyImgUrl } from "../helpers.js";

const renderListItem = (listItem) => `
  <li>${listItem}</li>
`;
const renderListItems = (listItems) => `
  ${listItems.map((listItem) => renderListItem(listItem)).join("")}
`;

export const recipeDetailView = (recipe) => `
  <section class="view-recipe content">
    <div class="close-holder">
      <button class="btn--close"><span class="sr-only">Close</span></button>
    </div>
    <div class="top">
      <header class="recipe-header">
        <h1 class="recipe-title">${recipe.name}</h1>
        <div class="detail-image-holder">
          <img src="${
            recipe.imgUrl != "" ? recipe.imgUrl : dummyImgUrl
          }" alt="" />
        </div>
      </header>
      <section class="overview">
        <h2 class="subtitle">Description:</h2>
        <p class="recipe-description">
          ${recipe.description}
        </p>
        <p>Total Time:</p>
        <p>${recipe.time}</p>
        <p>Servings:</p>
        <p>${recipe.servings}</p>
      </section>
    </div>
    <section class="ingredients">
      <h2 class="subtitle">Ingredients:</h2>
      <ul class="ingredient-list">
      ${renderListItems(recipe.ingredients)}
      </ul>
    </section>

    <section class="instructions">
      <h2 class="subtitle">Instructions</h2>
      <ol class="instruction-list">
        ${renderListItems(recipe.instructions)}
      </ol>
    </section>
    <button class="btn btn--small btn--naplesYellow" id="editButton">
      Edit
    </button>
  </section>
`;
