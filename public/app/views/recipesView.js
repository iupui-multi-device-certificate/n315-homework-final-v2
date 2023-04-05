//destructure
export const recipesView = ({ userDocData, isLoggedIn }) =>
  `    <h1 class="section-title">${
    isLoggedIn
      ? `${userDocData.firstName}, here are your recipes!`
      : `Recipes: Try some today!`
  }</h1>`;
