import util from './util';
import createFilter from './make-filter';
import getCard from './get-card';
import createCard from './make-card';
import { create } from 'domain';

const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
const CARDS_COUNT = 7;
const CARDS_FILTERS = [`All movies`, `Watchlist`, `History`, `Favorites`];

createFilters();
createCards(CARDS_CONTAINER, CARDS_COUNT);
createCards(TOP_RATED, 2);
createCards(MOST_COMMENTED, 2);

FILTERS_CONTAINER.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  onFilterClick(evt);
});

function createFilters() {
  FILTERS_CONTAINER.innerHTML = ``;
  let filterTemplate = ``;
  CARDS_FILTERS.forEach(function (item, i) {
    filterTemplate += createFilter(
        item,
        util.getRandomInteger(0, 30),
        i
    );
  });
  FILTERS_CONTAINER.innerHTML = filterTemplate;
}

function onFilterClick(evt) {
  const target = evt.target;
  if (target.classList.contains(`main-navigation__item`)) {
    const activeElement = FILTERS_CONTAINER.querySelector(`.main-navigation__item--active`);
    if (activeElement) {
      activeElement.classList.remove(`main-navigation__item--active`);
    }
    target.classList.add(`main-navigation__item--active`);
    createCards(CARDS_CONTAINER, util.getRandomInteger(1, CARDS_COUNT));
  }
}

function createCards(container, count) {
  container.innerHTML = ``;
  let cardsTemplate = [];
  for (let i = 1; i <= count; i++) {
    cardsTemplate.push(createCard(getCard(), i));
  }
  container.innerHTML = cardsTemplate.join(``);
}

