/* eslint-disable no-console */
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


/**
 * 
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes 
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        try {
            state.search = new Search(query);
            
            searchView.clearInput();
            searchView.clearPrevResults();
            renderLoader(elements.searchRes);
    
            await state.search.getResults();
    
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            clearLoader();
            alert('Error searching recipes');
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);

        searchView.clearPrevResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI for changes
        searchView.highlightSelected(id);
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create Recipe object
        state.recipe = new Recipe(id);
        
        try {
            // Get Recipe data
            await state.recipe.getRecipe();
    
            // Calc time abf servings
            state.recipe.calculateTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch(error) {
            clearLoader();
            alert('Error processing recipe');
            console.log(error);
        }
    }
}; 

['hashchange'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el);
        listView.renderItem(item);
    });
};

//Handle update and delete list items events
elements.shoppingList.addEventListener('click', e => {
    const itemId = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        listView.deleteItem(itemId);
        state.list.deleteItem(itemId);
    } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {
        const input = e.target.closest('.shopping__count-value');
        const value = parseFloat(input.value, 10);
        state.list.updateCount(itemId, value);
    }
});

/**
 * LIKES CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }

    const currId = state.recipe.id;
    if (!state.likes.isLiked(currId)) {
        const newLike = state.likes.addLike(state.recipe);

        likesView.toggleLikeButton(true);

        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currId);

        likesView.toggleLikeButton(false);

        likesView.deleteLike(currId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on the page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.retrieveData();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', el => {
    if (el.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (el.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (el.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add to shopping list button is clicked
        controlList();
    } else if (el.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

