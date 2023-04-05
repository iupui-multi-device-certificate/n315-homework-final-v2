export const createRecipeView = () => `<section class="content section-recipe-form">
<form class="recipe-form" onsubmit="event.preventDefault();">
  <div class="form-title">Hey Michael, create your recipe!</div>
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
      <!-- better would be to use an picture/paperclip combo icon with alt/tooltip for screen reader. this would translate across screen sizes better -->
      <label for="recipeImage" class="btn btn--file-selector btn--rose"
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
      name="ingredient-1"
      id="ingredient-1"
      placeholder="Ingredient #1"
      aria-label="ingredient-1"
      class="form-element"
    />
    <input
      type="text"
      name="ingredient-2"
      id="ingredient-2"
      placeholder="Ingredient #2"
      aria-label="ingredient-2"
      class="form-element"
    />
    <div class="last-row">
      <input
        type="text"
        name="ingredient-3"
        id="ingredient-3"
        placeholder="Ingredient #3"
        aria-label="ingredient-3"
        class="form-element"
      />
      <button class="btn--round btn--rose btn--add" id="addIngredient">
        +
      </a>
    </div>
  </fieldset>
  <fieldset>
    <legend>Enter Instructions:</legend>
    <input
      type="text"
      name="instruction-1"
      id="instruction-1"
      placeholder="Instruction #1"
      aria-label="instruction-1"
      class="form-element"
    />
    <input
      type="text"
      name="instruction-2"
      id="instruction-2"
      placeholder="Instruction #2"
      aria-label="instruction-2"
      class="form-element"
    />
    <div class="last-row">
      <input
        type="text"
        name="instruction-3"
        id="instruction-3"
        placeholder="Instruction #3"
        aria-label="instruction-3"
        class="form-element"
      />
      <button class="btn--round btn--rose btn--add" id="addInstruction">
        +
      </a>
    </div>
  </fieldset>
  <input
    type="submit"
    value="Create Recipe"
    class="btn btn--wide btn--rose"
    name="createRecipe"
    id="createRecipe"
  />
</form>
</section> `;