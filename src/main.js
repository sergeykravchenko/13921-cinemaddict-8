import util from './util';
import createFilter from './make-filter';
import getCard from './get-card';
import Card from './card';
import CardDetails from './card-details';

const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
const CARDS_COUNT = 7;
const CARDS_FILTERS = [`All movies`, `Watchlist`, `History`, `Favorites`];
const cardsData = createData(CARDS_COUNT);

createFilters();
renderCards(CARDS_CONTAINER, cardsData);
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
    renderCards(CARDS_CONTAINER, util.getRandomsFrom(cardsData, util.getRandomInteger(1, CARDS_COUNT)));
  }
}

function filteredBy(type, container, count) {
  container.innerHTML = ``;
  const template = cardsData.slice();
  const sortTemplate = template.sort((a, b) => b[type] - a[type]);
  const fillCards = sortTemplate.slice(0, count).map((item) => item);
  const cards = createCards(fillCards);
  container.appendChild(cards);
}

function renderCards(container, data) {
  container.innerHTML = ``;
  const fillCards = data.map((item) => item);
  const cards = createCards(fillCards);
  container.appendChild(cards);
}

function createCards(data) {
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    const card = new Card(item);
    const cardDetails = new CardDetails(item);
    card.render();

    card.onClick = () => {
      cardDetails.render();
      document.body.appendChild(cardDetails.element);
    };

    cardDetails.onClick = (newObject) => {
      card.comments = newObject.comments;
      card.isInWatchlist = newObject.isInWatchlist;
      card.isWatched = newObject.isWatched;
      card.isFavorite = newObject.isFavorite;

      card.update(card);
      document.body.removeChild(cardDetails.element);
      cardDetails.unrender();
    };

    fragment.appendChild(card.element);
  });
  return fragment;
}

function createData(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(getCard());
  }
  return result;
}
