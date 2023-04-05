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
export const itemClickHandler = (itemID, view, items) => {
  const getItem = (itemID) => items.find((item) => itemID == item.id);
  const requestedItem = getItem(itemID);
  const itemPage = view(requestedItem);

  $("#app").html(itemPage);
};
