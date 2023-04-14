# N315

## Homework Final - version 2.0

Firebase URL:
https://rah-iupui-n315-final.web.app

## DESCRIPTION

The Jungle Cook is a Vanilla JavaScript Single-Page CRUD Application that allows users to create and edit recipes, as well as view their recipes or browse for recipes.

## NOTES

- Appearance per this Adobe XD: https://xd.adobe.com/spec/000d9233-c620-4eb6-5884-adaea1a04abb-763c/
- Vanilla JavaScript Single-Page Application using Hash Routing
- Using an MVC approach using template literals for the views
- This is 100% client-side (no Node/Express)
- Using Firestore for authentication
- Trying to avoid jQuery (instructor taught this mostly)
- Makes use of things learned from Net Ninja - Lessons 1-15 (https://www.youtube.com/watch?v=aN1LnNq4z54&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ, https://github.com/iamshaunjp/firebase-auth)

## What's new in version 2.0

- Implements CRUD
- Implements passing data to the routes via a locals variable (similar to Express)
- Implements user feedback and error handling
- Implements browse recipes which shows all recipes not just the user's recipes (re-uses the view page)

## ISSUES

- Initial load has an error about the recipeForm not being defined but this does not impact usage (see console.log).
- Font loading issue in Firefox:
  - downloadable font: maxp: Bad maxZones: 3 (font-family: "Gill Sans" style:normal weight:300 stretch:100 src index:0) source: http://localhost:5000/css/fonts/GillSans-Light.ttf
  - Potential would be to use modern woff fonts which are web safe fonts rather than desktop fonts.
  - Prefereably should be using fallback fonts regardless.

## Data model

- User - email, password via Firestore Auth
- Users collection:
  - Doc id set to user.uid
  - firstName
  - lastName,
  - recipes (array)

## What I learned

- If I were starting from scratch, I would look into making use of the Firestore Cloud Functions to set up an API around my database. This would result in much cleaner code and allow the use of the fetch API. Results would still need to be cached in state.
- In real life, I would look into using the Firebase Auth UI instead of doing such things from scratch.
- Using LocalStorage would have been an easier option, but then I would not have learned the state part as thoroughly and appreciate the need for frameworks like React.

## TODO
