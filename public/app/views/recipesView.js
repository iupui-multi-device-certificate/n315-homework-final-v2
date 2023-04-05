export const recipesView = (userData = null) =>
`    <h1 class="section-title">${
  userData
    ? `${userData.firstName}, here are your recipes!`
    : `Recipes: Try some today!`
}</h1>`;