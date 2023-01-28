import { MODEL_CLOSE_SEC, RERENDER_FORM_SEC } from './config.js';
import recipieView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
// https://forkify-v2.netlify.app/

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    recipieView.renderSpinner();

    await model.loadRecipie(id);

    recipieView.render(model.state.recipe);
  } catch (err) {
    recipieView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial page
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render initial page
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipie servings in the state
  model.updateServings(newServings);

  // 2) Update the recipie view
  recipieView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipieView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload Recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipieView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.closeWindow();
      setTimeout(function () {
        addRecipeView.render();
      }, RERENDER_FORM_SEC * 1000);
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('❌❌❌', err);
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      addRecipeView.render();
    }, MODEL_CLOSE_SEC * 1000);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipieView.addHandlerRender(controlRecipes);
  recipieView.addHandlerUpdateServings(controlServings);
  recipieView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
