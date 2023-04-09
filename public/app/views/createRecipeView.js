//TODO: maybe add a flag so can toggle edit vs create
//TODO: dynamically generate ingredient/instruction item w/ button & use button to add new item
//TODO: clean up ids, etc. that don't need on ingredient/instruction

//on array inputs use name[] to indicate these belong to same array
//TODO: make this the div w/ the button
export const renderListItem = (itemType, placeHolderText, index) => `
  <div class="recipe-list-item">
    <input
      type="text"
      name="${itemType}[]"
      id="${itemType}-${index}"
      placeholder="${placeHolderText} #${index}"
      aria-label="${itemType}-${index}"
      class="form-element "
    />
    <button class="btn--round btn--rose btn--add btn--logged-in" >
      +
    </button>
  </div>
`;

//https://stackoverflow.com/questions/59716109/render-a-react-component-n-times
// https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
//use underscore not e like in https://www.carlrippon.com/repeat-element-n-times-in-jsx/
const n = 3;
const renderListItems = (itemType, placeHolderText) => `

  ${[...Array(n)]
    .map((_, i) => renderListItem(itemType, placeHolderText, i + 1))
    .join("")}
`;

export const createRecipeView = (currentUser) => `
  <section class="content section-recipe-form">
    <form class="recipe-form" id="recipeForm">      
      <h1 class="form-title">${
        currentUser
          ? `${currentUser.firstName}, create your recipe!`
          : `Sign in to create a recipe!`
      }</h1>
      <fieldset>
        <div class="file-input">
          <!-- extra div to get a custom placeholder since can't replace button text -->
          <div id="imgUploadText">Add Recipe Image</div>
          <input
            type="file"
            name="recipeImage"
            id="recipeImage"
            aria-label="recipeImage"
            class="form-element"
            accept="image/jpeg, image/png, image/jpg"
          />
          <!-- better would be to use a picture/paperclip combo icon with alt/tooltip for screen reader. this would translate across screen sizes better -->
          <label for="recipeImage" class="btn btn--file-selector btn--rose" id="attachFile"
            >Attach File</label
          >
        </div>

        <input
          type="text"
          name="recipeName"
          id="recipeName"
          placeholder="Recipe Name (required)"
          aria-label="recipeName"
          class="form-element"
          required
        />

        <input
          type="text"
          name="recipeDescription"
          id="recipeDescription"
          placeholder="Recipe Description"
          aria-label="recipeDescription"
          class="form-element"
        />

        <input
          type="text"
          name="recipeTotalTime"
          id="recipeTotalTime"
          placeholder="Recipe Total Time"
          aria-label="recipeTotalTime"
          class="form-element"
        />

        <input
          type="text"
          name="recipeServingSize"
          id="recipeServingSize"
          placeholder="Recipe Serving Size"
          aria-label="recipeServingSize"
          class="form-element"
        />
      </fieldset>
      <fieldset class="ingredientsList">
        <legend>Enter Ingredients:</legend>
        ${renderListItems("ingredient", "Ingredient")}
      </fieldset>
      <fieldset class="instructionsList">
        <legend>Enter Instructions:</legend>
        ${renderListItems("instruction", "Instructions")}
      </fieldset>
      <input
        type="submit"
        value="Create Recipe"
        class="btn btn--wide btn--rose btn--disabled btn--logged-in"
        name="createRecipe"
        id="createRecipe"
      />
    </form>
  </section> 
`;
