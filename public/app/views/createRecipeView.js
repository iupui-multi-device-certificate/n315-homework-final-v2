//TODO: maybe add a flag so can toggle edit vs create

//on array inputs use name[] to indicate these belong to same array

//set type as button to prevent it from submitting form
// https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
export const renderListItem = (itemType, index) => `
  <div class="recipe-list-item" id="${itemType}-${index}">
    <input
      type="text"
      name="${itemType}[]"
      id="input-${itemType}-${index}"
      placeholder="${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      } #${index}"
      aria-label="input-${itemType}-${index}"
      class="form-element "
    />
    <button type="button" class="btn--round btn--rose btn--add btn--logged-in" >
      +
    </button>
  </div>
`;

//https://stackoverflow.com/questions/59716109/render-a-react-component-n-times
// https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
//use underscore not e like in https://www.carlrippon.com/repeat-element-n-times-in-jsx/
const n = 3;
const renderListItems = (itemType) => `

  ${[...Array(n)].map((_, i) => renderListItem(itemType, i + 1)).join("")}
`;

export const createRecipeView = ({currentUser}) => `
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
        ${renderListItems("ingredient")}
      </fieldset>
      <fieldset class="instructionsList">
        <legend>Enter Instructions:</legend>
        ${renderListItems("instruction")}
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
