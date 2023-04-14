import { MESSAGES } from "./messages.js";

//use JS not :active b/c underline is partial
export const toggleCurrentPage = (currentPageHash) => {
  //https://codepen.io/Coding-in-Public/pen/MWroExJ
  //except also need to remove from rest when change page
  //get their hash not href (which is the whole link)

  document.querySelectorAll(".nav-menu .nav-link").forEach((navLink) => {
    //just get the anchor tags
    if (navLink.tagName === "A") {
      //use aria-current for accessibility reasons

      //remove aria-current from everywhere first
      navLink.removeAttribute("aria-current", "page");

      if (navLink.hash === currentPageHash && navLink.hash != "#login") {
        navLink.setAttribute("aria-current", "page");
      }
    }
  });
};

//toggle recipe-hero on html since this was only way I could get it full page at this time
export const toggleRecipeHero = (currentPageHash) => {
  document
    .querySelector("html")
    .classList.toggle(
      "recipe-hero",
      currentPageHash === "#browse" || currentPageHash === "#yourRecipes"
    );
};

export const toggleMobileMenu = () => {
  document.querySelector(".hamburger").classList.toggle("active");
  document.querySelector(".nav-menu").classList.toggle("active");
};

export const getTextAfterCharacter = (string, character) => {
  return string.substring(string.indexOf(character) + 1);
};

/* 
  RESOURCES:
  https://firebase.google.com/docs/storage/web/upload-files
  https://www.geeksforgeeks.org/how-to-upload-image-using-html-and-javascript-in-firebase/#
  https://www.tutorialspoint.com/how-to-upload-an-image-using-html-and-javascript-in-firebase#
  https://github.com/machadop1407/firebase-file-upload/blob/main/src/App.js

  this helped the most with the promise stuff b/c showed how to call it
  https://www.learningsomethingnew.com/how-to-make-an-image-uploading-app-with-vue-quasar-firebase-storage-and-cordova-part-1
*/
//NOTE: handler that calls this needs to be async & await the result
export const uploadImage = async (imageUpload) => {
  if (imageUpload == null) {
    console.log("no image selected");
    return;
  }

  const imageName = +new Date() + "-" + imageUpload.name;
  const metadata = {
    contentType: imageUpload.type,
  };

  return new Promise((resolve, reject) => {
    const storageRef = firebase.storage().ref();
    let uploadTask = storageRef
      .child("images/" + imageName)
      .put(imageUpload, metadata);
    uploadTask.on(
      "state_changed",
      function (snapshot) {},
      function (error) {
        console.log(error);
        alert(MESSAGES.ERROR_IMG_UPLOAD);
        reject(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("Uploaded a blob or file!");
          console.log("got downloadURL: ", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};

//todo: move this to router
export const redirectPage = (pageHash = "#home") => {
  window.location.assign(window.location.origin + `/${pageHash}`);
};

export const dummyImgUrl =
  "https://dummyimage.com/468x421/fcbcb8/393939.png&text=No+Image";

export const toggleShowLoggedIn = (currentUser) => {
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const loggedInButtons = document.querySelectorAll(".btn--logged-in");

  if (currentUser) {
    loggedInLinks.forEach((item) => (item.hidden = false));
    loggedOutLinks.forEach((item) => (item.hidden = true));

    loggedInButtons.forEach((item) => (item.disabled = false));
  } else {
    loggedInLinks.forEach((item) => (item.hidden = true));
    loggedOutLinks.forEach((item) => (item.hidden = false));

    loggedInButtons.forEach((item) => (item.disabled = true));
  }
};

//TODO: rename/rework since we're just getting a recipe, it's not generic
export const getItem = (itemID, items) =>
  items.find((item) => itemID == item.recipeId);
