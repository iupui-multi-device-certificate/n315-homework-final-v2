// https://firebase.google.com/docs/reference/js/auth#autherrorcodes

export const MESSAGES = {
  ERROR_EMAIL_EXISTS: "Email already in use. Use another address.",
  ERROR_WEAK_PASSWORD:
    "Weak password. Please use a stronger password(minimum 6 characters).",
  ERROR_SIGNUP_GENERAL:
    "Error creating account. Please contact system admin if the issue persists.",
  ERROR_WRONG_PASSWORD: "Invalid password. Please try again.",
  ERROR_TOO_MANY_ATTEMPTS: "Too many attempts. Please try again later.",
  ERROR_LOGIN_GENERAL:
    "Login failed. Please try later. Please contact system admin if the issue persists.",
  SUCCESS_LOGIN: "Login successful",
  SUCCESS_ACCOUNT_CREATED: "Account created.",
  INFO_LOGOUT: "Logout successful.",
  ERROR_IMG_FILE_TYPE:
    "Please upload file having extensions .jpeg/.jpg/.png/ only.",
  ERROR_IMG_UPLOAD:
    "Image upload failed. Contact your admin for further assistance",
  SUCCESS_RECIPE_CREATED: "Recipe created.",
  ERROR_RECIPE_NOT_CREATED: "Error creating recipe. Please try again later.",
  CONFIRM_RECIPE_DELETE: "Are you sure you want to delete this recipe?",
  SUCCESS_RECIPE_DELETED: "Recipe deleted.",
  SUCCESS_RECIPE_UPDATED: "Recipe updated.",
  ERROR_RECIPE_NOT_UPDATED: "Error updating recipe. Please try again later.",
};
