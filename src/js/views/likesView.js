import { 
    elements 
} from './base';
import {
    updateTitleLength,
} from './searchView';

export const toggleLikeButton = (isLiked) => {
    // <use href="img/icons.svg#icon-heart-outlined"></use>
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.header__likes use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numOfLikes) => {
    elements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = ({id, title, author, img}) => {
    const markup = `
        <li>
            <a class="likes__link" href="#${id}">
                <figure class="likes__fig">
                    <img src="${img}" alt="${title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${updateTitleLength(title)}</h4>
                    <p class="likes__author">${author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    if (el) el.parentElement.removeChild(el);
};



