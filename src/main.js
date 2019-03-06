import util from './util';
import createFilter from './make-filter';
import getCard from './get-card';
import createCard from './make-card';

const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
const CARDS_COUNT = 7;
const CARDS_FILTERS = [`All movies`, `Watchlist`, `History`, `Favorites`];
const cardsData = createData(CARDS_COUNT);

createFilters();
createCards(CARDS_CONTAINER, cardsData);
filteredBy(`rating`, TOP_RATED, 2);
filteredBy(`comments`, MOST_COMMENTED, 2);

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

function filteredBy(type, container, count) {
  container.innerHTML = ``;
  const template = cardsData.slice();
  const sortTemplate = template.sort((a, b) => b[type] - a[type]);
  const result = sortTemplate.slice(0, count).map((item) => createCard(item));;
  container.innerHTML = result.join(``);
}

function createCards(container, data) {
  container.innerHTML = ``;
  const template = data.map((item) => createCard(item));
  container.innerHTML = template.join(``);
}

function createData(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(getCard());
  }
  return result;
}

