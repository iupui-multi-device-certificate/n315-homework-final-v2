// SEMANTIC NOTE: updated view, edit, delete to buttons instead of anchor tags since they have to do something to load page, delete, etc. could just as easily open a modal as go to new page
//https://www.webaxe.org/proper-use-buttons-links/
//https://a11y-101.com/design/button-vs-link

//TODO: fix CSS - buttons are moved to the right :(

const renderRecipeItem = (recipeItem) => `
<div class="card">
  <div class="card-row">
    <div class="image-holder">
      <img
        src=${recipeItem.imgThumbURL}
        alt="${recipeItem.name}"
      />

      <div class="btn-overlay ">
        <button
          class="btn btn--small btn--naplesYellow btn--view"
          id="view-${recipeItem.id}"
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
      class="btn btn--small btn--naplesYellow"
      id="editButton"
      >Edit
    </button>
    <button
      class="btn btn--small btn--naplesYellow"
      id="deleteButton"
      >Delete
    </button>
  </div>
</div>

`;

const renderRecipeItems = (recipeItems) => `
${recipeItems.map((recipeItem) => renderRecipeItem(recipeItem)).join("")}
`;

//destructure
//TODO: how can I re-use for browse recipes? need a default for recipes - can I destructure further or maybe use spread operator when send it over?
//TODO: check if user logged in but no recipes and add button to create recipess
export const recipesView = ({ userDocData, isLoggedIn }) => `
<section class="content section-recipes ${
  isLoggedIn ? `your-recipes` : `browse-recipes`
}">
  <div class="recipe-content">
    <h1 class="section-title">${
      isLoggedIn && userDocData.firstName != ""
        ? `${userDocData.firstName}, here are your recipes!`
        : `Recipes: Try some today!`
    }</h1>
    <div class="cards">
      ${
        isLoggedIn
          ? renderRecipeItems(userDocData.recipes)
          : `<p>Log in to see your recipes</p>`
      }
    </div>
  </div>
</section>

`;
