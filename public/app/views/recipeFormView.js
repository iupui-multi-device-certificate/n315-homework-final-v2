//TODO: recipeDescription - make textarea with character limit so fits detail page

//on array inputs use name[] to indicate these belong to same array

//set type as button to prevent it from submitting form
// https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
export const renderListItem = ({ itemType, item = null, index }) => `
  <div class="recipe-list-item" id="${itemType}-${index}">
    <input
      type="text"
      name="${itemType}s[]"
      id="input-${itemType}-${index}"
      placeholder="${
        itemType.charAt(0).toUpperCase() + itemType.slice(1)
      } #${index}"
      aria-label="input-${itemType}-${index}"
      class="form-element "
      value="${item ? item : ""}"
    />
    <button type="button" class="btn--round btn--rose btn--addItem btn--logged-in" >
      +
    </button>
  </div>
`;

//https://stackoverflow.com/questions/59716109/render-a-react-component-n-times
// https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx-and-lodash
//use underscore not e like in https://www.carlrippon.com/repeat-element-n-times-in-jsx/
const n = 3;
const renderInitialListItems = (itemType) => `

  ${[...Array(n)]
    .map((_, i) => renderListItem({ itemType, item: null, index: i + 1 }))
    .join("")}
`;

const renderListItems = (itemType, items) => `

  ${items
    .map((item, i) => renderListItem({ itemType, item, index: i + 1 }))
    .join("")}
`;

//Skip trying to get previous image info since long URL & has token. In real life, this would have a drag/drop photo uploader that would make it to allow preload & view image.
// Use hidden input to pass recipeId when editing
export const recipeFormView = ({
  currentUser,
  editRecipe = false,
  currentRecipe = null,
}) => `
  <section class="content section-recipe-form">
  <form class="recipe-form ${
    editRecipe ? "recipe-edit" : ""
  }" id="recipe-form">      
      <div class="close-holder">
        <button class="btn--close" id="close-recipe-form"><span class="sr-only">Close</span></button>
      </div>
    <h1 class="form-title">${
      currentUser
        ? `${currentUser.firstName}, ${
            editRecipe ? "edit" : "create"
          } your recipe!`
        : `Sign in to create a recipe!`
    }</h1>
      <fieldset>
        <div class="file-input">
          <!-- extra div to get a custom placeholder since can't replace button text -->
          <div id="imgUploadText">${
            editRecipe ? "Edit Recipe Image" : "Add Recipe Image"
          }</div>
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
          value="${currentRecipe ? currentRecipe.name : ""}"
          required
        />
        
        <input
          type="text"
          name="recipeDescription"
          id="recipeDescription"
          placeholder="Recipe Description"
          aria-label="recipeDescription"
          class="form-element"
          value="${currentRecipe ? currentRecipe.description : ""}"
        />

        <input
          type="text"
          name="recipeTotalTime"
          id="recipeTotalTime"
          placeholder="Recipe Total Time"
          aria-label="recipeTotalTime"
          class="form-element"
          value="${currentRecipe ? currentRecipe.time : ""}"
        />

        <input
          type="text"
          name="recipeServingSize"
          id="recipeServingSize"
          placeholder="Recipe Serving Size"
          aria-label="recipeServingSize"
          class="form-element"
          value="${currentRecipe ? currentRecipe.servings : ""}"
        />
      </fieldset>
      <fieldset class="ingredientsList">
        <legend>Enter Ingredients:</legend>
        ${
          currentRecipe
            ? renderListItems("ingredient", currentRecipe.ingredients)
            : renderInitialListItems("ingredient")
        }
      </fieldset>
      <fieldset class="instructionsList">
        <legend>Enter Instructions:</legend>
        ${
          currentRecipe
            ? renderListItems("instruction", currentRecipe.instructions)
            : renderInitialListItems("instruction")
        }
      </fieldset>
      <input type="hidden" value="${
        editRecipe ? currentRecipe.recipeId : ""
      }" id="recipeIdInput"/>
      <input
        type="submit"
        value="${editRecipe ? "Submit Changes" : "Create Recipe"}"
        class="btn btn--wide btn--rose btn--disabled btn--logged-in"
        name="submitRecipe"
        id="submitRecipe"
      />
    </form>
  </section> 
`;
