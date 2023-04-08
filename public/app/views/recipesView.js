// SEMANTIC NOTE: updated view, edit, delete to buttons instead of anchor tags since they have to do something to load page, delete, etc. could just as easily open a modal as go to new page
//https://www.webaxe.org/proper-use-buttons-links/
//https://a11y-101.com/design/button-vs-link

const dummyImgUrl =
  "https://dummyimage.com/300x263/fcbcb8/393939.png&text=No+Image";

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
    <button
      class="btn btn--small btn--naplesYellow btn--edit"
      id="editButton-${recipeItem.recipeId}"
      >Edit
    </button>
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

//TODO: fix - check for which view (yourRecipes vs. browseRecipes", not logged in
export const recipesView = (currentUser) => `
<section class="content section-recipes ${
  currentUser ? `your-recipes` : `browse-recipes`
}">
  <div class="recipe-content">
    <h1 class="section-title">${
      currentUser
        ? currentUser.firstName != ""
          ? `${currentUser.firstName}, here are your recipes!`
          : `Here are your recipes!`
        : `Recipes: Try some today!`
    }</h1>
    <div class="cards">
      ${
        currentUser
          ? currentUser.recipes
            ? renderRecipeItems(currentUser.recipes)
            : `No recipes yet.`
          : `<p>Log in to see your recipes</p>`
      }
    </div>
  </div>
</section>

`;
