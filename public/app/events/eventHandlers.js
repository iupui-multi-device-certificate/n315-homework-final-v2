import { getTextAfterCharacter } from "../helpers.js";
import { recipeDetailView } from "../views/recipeDetailView.js";
import { MESSAGES } from "../messages.js";
import { renderListItem } from "../views/createRecipeView.js";

export const handleLogout = () => {
  firebase.auth().signOut();
  alert(MESSAGES.INFO_LOGOUT);
};

export const handleViewButtonClick = (e, currentUser) => {
  const currentId = getTextAfterCharacter(e.target.id, "-");
  itemClickHandler(currentId, recipeDetailView, currentUser.recipes);
};

export const handleAddItemButtonClick = (e) => {
  const splitId = e.target.parentElement.id.split("-");
  const newId = parseInt(splitId[1]) + 1;
  const newItem = renderListItem(splitId[0], newId);
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

// see N315 HW06 for usage example
// click handler to get detail of item, e.g. blog & gallery items
//since we're only getting recipes make this more specific
//used internally
const itemClickHandler = (itemID, view, items) => {
  const getItem = (itemID) => items.find((item) => itemID == item.recipeId);
  const requestedItem = getItem(itemID);

  const itemPage = view(requestedItem);

  //toogle the recipe hero off
  document.querySelector("html").classList.remove("recipe-hero");
  document.getElementById("app").innerHTML = itemPage;
};
