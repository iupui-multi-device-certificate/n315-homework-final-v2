import { MESSAGES } from "../messages.js";

export const addRecipe = async (userId, recipe) => {
  let result = {
    success: false,
    message: "",
  };
  await firebase
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Recipes")
    .add(recipe)
    .then((docRef) => {
      console.log(MESSAGES.SUCCESS_RECIPE_CREATED + " RecipeID:", docRef.id);

      result = {
        success: true,
        message: MESSAGES.SUCCESS_RECIPE_CREATED,
      };
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      result = {
        success: false,
        message: MESSAGES.ERROR_RECIPE_NOT_CREATED,
      };
    });
  return result;
};

export const deleteRecipe = async (userId, recipeId) => {
  let result = {
    success: false,
    message: "",
  };
  await firebase
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Recipes")
    .doc(recipeId)
    .delete()
    .then(() => {
      console.log("recipe deleted with id", recipeId);

      result = {
        success: true,
        message: MESSAGES.SUCCESS_RECIPE_DELETED + " Recipe id: " + recipeId,
      };
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
      result = {
        success: false,
        message: MESSAGES.ERROR_RECIPE_NOT_CREATED,
      };
    });
  return result;
};

//TODO: rename/rework since we're just getting a recipe, it's not generic
export const getRecipe = (itemID, items) =>
  items.find((item) => itemID == item.recipeId);
