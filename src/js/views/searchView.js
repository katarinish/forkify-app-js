import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const updateTitleLength = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if ((acc += cur.length) <= limit) {
                newTitle.push(cur);
            }
    
            return acc;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${updateTitleLength(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (currPage, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? currPage - 1  : currPage + 1}>
        <span>Page ${type === 'prev' ? currPage - 1  : currPage + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //render only next button
        button = createButton(page, 'next');
    } else if (page < pages) {
        //render both
        button = `
            ${createButton(page, 'prev')} 
            ${createButton(page, 'next')}
        `;
    } else if(page === pages) {
        //render only previous button
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearPrevResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
    Array
        .from(document.querySelectorAll('.results__link'))
        .forEach(el => el.classList.remove('results__link--active'));
        
    const linkToHighLight = document.querySelector(`.results__link[href*="${id}"]`); 
    if (linkToHighLight) linkToHighLight.classList.add('results__link--active');
};


