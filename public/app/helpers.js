//use JS not :active underline is partial & using :after pseudo-selector
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

//TODO: use the following for the view button on recipes
// const handleViewButtonClick = (e) => {
//   const currentId = extractTextByCharacter(e.currentTarget.id, "-");
//   itemClickHandler(currentId, recipeDetailView, testRecipes);
// };

export const extractTextByCharacter = (string, character) => {
  return string.substring(string.indexOf(character) + 1);
};

// see N315 HW06 for usage example
// click handler to get detail of item, e.g. blog & gallery items
//since we're only getting recipes make this more specific
export const itemClickHandler = (itemID, view, items) => {
  console.log("itemClickHandler > items", items);
  // console.log("itemClickHandler > itemId", itemID);

  const getItem = (itemID) => items.find((item) => itemID == item.recipeId);
  const requestedItem = getItem(itemID);

  console.log("itemClickHandler > requestedItem", requestedItem);
  const itemPage = view(requestedItem);

  document.getElementById("app").innerHTML = itemPage;
};

/* 
  RESOURCES:
  https://firebase.google.com/docs/storage/web/upload-files
  https://www.geeksforgeeks.org/how-to-upload-image-using-html-and-javascript-in-firebase/#
  https://www.tutorialspoint.com/how-to-upload-an-image-using-html-and-javascript-in-firebase#
  https://github.com/machadop1407/firebase-file-upload/blob/main/src/App.js
*/

//TODO: error handling - message about image type accepted
export const uploadImage = (imageUpload, userId, recipeId) => {
  if (imageUpload == null) {
    console.log("no image selected");
    return;
  }

  console.log("upload img recipeId", recipeId);
  const imageName = +new Date() + "-" + imageUpload.name;
  const metadata = {
    contentType: imageUpload.type,
  };

  const storageRef = firebase.storage().ref();

  // Upload file and metadata to the object 'images/mountains.jpg'
  // var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
  var uploadTask = storageRef
    .child("images/" + imageName)
    .put(imageUpload, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        firebase
          .firestore()
          .collection("Users")
          .doc(userId)
          .collection("Recipes")
          .doc(recipeId)
          .update({ imgUrl: downloadURL });
      });
    }
  );
};
