import { getTextAfterCharacter } from "../helpers.js";
import { recipeDetailView } from "../views/recipeDetailView.js";
import { MESSAGES } from "../messages.js";
import { renderListItem } from "../views/recipeFormView.js";
import { redirectPage, getItem } from "../helpers.js";

export const handleLogout = () => {
  firebase.auth().signOut();
  alert(MESSAGES.INFO_LOGOUT);

  /* 
    NOTE: this keeps the allRecipes array but in the console.logs the count of the number of items in the allRecipes array.
    Be aware because it looks like it wipes them out and it isn't.
  */
  redirectPage();
};

export const handleViewButtonClick = (e, currentUser) => {
  const currentId = getTextAfterCharacter(e.target.id, "-");
  itemClickHandler(currentId, recipeDetailView, currentUser.recipes);
};

export const handleDeleteButtonClick = async (e, currentUser) => {
  const currentId = getTextAfterCharacter(e.target.id, "-");

  if (confirm(MESSAGES.CONFIRM_RECIPE_DELETE)) {
    const result = await deleteRecipe(currentUser.userId, currentId);
    alert(result.message);

    window.location.reload();
  } else {
    console.log("Delete recipe canceled.");
  }
};

export const handleAddItemButtonClick = (e) => {
  const splitId = e.target.parentElement.id.split("-");

  const newId = parseInt(splitId[1]) + 1;

  //pass as object now, explicitly name the keys
  const newItem = renderListItem({
    itemType: splitId[0],
    item: null,
    index: newId,
  });
  e.target.parentElement.insertAdjacentHTML("afterend", newItem);
};

export const handleRecipeImageChange = (e) => {
  //check correct image format
  //https://www.geeksforgeeks.org/file-type-validation-while-uploading-it-using-javascript/#
  // https://dev.to/faddalibrahim/filtering-and-validating-file-uploads-with-javascript-327p

  const fileInput = e.target.files[0];

  const allowedExtensions = ["jpg", "jpeg", "png"];
  const { name: fileName } = fileInput;
  const fileExtension = fileName.split(".").pop();
  if (!allowedExtensions.includes(fileExtension)) {
    alert(MESSAGES.ERROR_IMG_FILE_TYPE);
    fileInput.value = null;
    //this ensures the text restores back to "Add Recipe Image"
    return false;
  }

  document.getElementById("imgUploadText").innerHTML = e.target.files[0].name;
};

//used internally

// see N315 HW06 for usage example
// click handler to get detail of item, e.g. blog & gallery items
//since we're only getting recipes make this more specific

// const getItem = (itemID, items) =>
//   items.find((item) => itemID == item.recipeId);

const itemClickHandler = (itemID, view, items) => {
  // const getItem = (itemID) => items.find((item) => itemID == item.recipeId);
  const requestedItem = getItem(itemID, items);

  const itemPage = view(requestedItem);

  //toogle the recipe hero off
  document.querySelector("html").classList.remove("recipe-hero");
  document.getElementById("app").innerHTML = itemPage;
};

//TODO: move this to separate file

const deleteRecipe = async (userId, recipeId) => {
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
