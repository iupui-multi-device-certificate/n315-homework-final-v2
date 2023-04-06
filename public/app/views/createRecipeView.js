//TODO: maybe add a flag so can toggle edit vs create
//TODO: dynamically generate ingredient/instruction item w/ button & use button to add new item
//TODO: clean up ids, etc. that don't need on ingredient/instruction

//on array inputs use name[] to indicate these belong to same array

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
          <div>Add Recipe Image</div>
          <input
            type="file"
            name="recipeImage"
            id="recipeImage"
            aria-label="recipeImage"
            class="form-element"
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
          placeholder="Recipe Name"
          aria-label="recipeName"
          class="form-element"
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
      <fieldset>
        <legend>Enter Ingredients:</legend>
        <input
          type="text"
          name="ingredients[]"
          id="ingredient-1"
          placeholder="Ingredient #1"
          aria-label="ingredient-1"
          class="form-element"
        />
        <input
          type="text"
          name="ingredients[]"
          id="ingredient-2"
          placeholder="Ingredient #2"
          aria-label="ingredient-2"
          class="form-element"
        />
        <div class="last-row">
          <input
            type="text"
            name="ingredients[]"
            id="ingredient-3"
            placeholder="Ingredient #3"
            aria-label="ingredient-3"
            class="form-element"
          />
          <button class="btn--round btn--rose btn--add btn--logged-in" id="addIngredient"">
            +
          </a>
        </div>
      </fieldset>
      <fieldset>
        <legend>Enter Instructions:</legend>
        <input
          type="text"
          name="instructions[]"
          id="instruction-1"
          placeholder="Instruction #1"
          aria-label="instruction-1"
          class="form-element"
        />
        <input
          type="text"
          name="instructions[]"
          id="instruction-2"
          placeholder="Instruction #2"
          aria-label="instruction-2"
          class="form-element"
        />
        <div class="last-row">
          <input
            type="text"
            name="instructions[]"
            id="instruction-3"
            placeholder="Instruction #3"
            aria-label="instruction-3"
            class="form-element"
          />
          <button class="btn--round btn--rose btn--add btn--logged-in" id="addInstruction">
            +
          </a>
        </div>
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
