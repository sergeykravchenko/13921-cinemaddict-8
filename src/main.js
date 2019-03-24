import Filter from './filter';
import getCard from './get-card';
import Card from './card';
import CardDetails from './card-details';
import statsInit from './stats';

const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
const STATS = document.querySelector(`.statistic`);
const FILMS = document.querySelector(`.films`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
const CARDS_COUNT = 7;
const statsButton = document.querySelector(`[href*=stats]`);
const cardsData = createData(CARDS_COUNT);
const CardsFilters = [
  {
    filterName: `All movies`,
    filterId: `all`,
    count: cardsData.length,
    isActive: true
  },
  {
    filterName: `Watchlist`,
    filterId: `watchlist`,
    count: cardsData.filter((item) => item.isInWatchlist).length,
    isActive: false
  },
  {
    filterName: `History`,
    filterId: `history`,
    count: cardsData.filter((item) => item.isWatched).length,
    isActive: false
  },
  {
    filterName: `Favorites`,
    filterId: `favorites`,
    count: cardsData.filter((item) => item.isFavorite).length,
    isActive: false
  }
];

const filterTypes = {
  all: () => cardsData,
  watchlist: () => cardsData.filter((item) => item.isInWatchlist),
  history: () => cardsData.filter((item) => item.isWatched),
  favorites: () => cardsData.filter((item) => item.isFavorite)
};

createFilters();
renderCards(CARDS_CONTAINER, cardsData);
filteredBy(`rating`, TOP_RATED, 2);
filteredBy(`comments`, MOST_COMMENTED, 2);

statsButton.addEventListener(`click`, onStatsButtonClick);

function onStatsButtonClick(evt) {
  evt.preventDefault();
  const active = FILTERS_CONTAINER.querySelector(`.main-navigation__item--active`);
  active.classList.remove(`main-navigation__item--active`);
  statsButton.classList.add(`main-navigation__item--active`);
  FILMS.classList.add(`visually-hidden`);
  STATS.classList.remove(`visually-hidden`);
  statsInit(cardsData);
}

function createFilters() {
  const fragment = document.createDocumentFragment();

  CardsFilters.forEach(function (item) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      const data = filterTypes[filter.id]();
      renderCards(CARDS_CONTAINER, data);
    };

    filter.render();
    fragment.appendChild(filter.element);
  });
  const firstElement = FILTERS_CONTAINER.firstChild;
  FILTERS_CONTAINER.insertBefore(fragment, firstElement);
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
  data.forEach((item, i) => {
    const card = new Card(item);
    const cardDetails = new CardDetails(item);
    card.render();

    card.onClick = () => {
      cardDetails.render();
      document.body.appendChild(cardDetails.element);
    };

    cardDetails.onClick = (newObject) => {
      const updatedCard = updateCard(cardsData, i, newObject);

      card.update(updatedCard);
      document.body.removeChild(cardDetails.element);
      cardDetails.unrender();
    };

    card.onAddToWatchList = () => {
      item.isInWatchlist = !item.isInWatchlist;
      cardDetails.update(item);
    };

    card.onMarkAsWatched = () => {
      item.isWatched = !item.isWatched;
      cardDetails.update(item);
    };

    card.onAddToFavorite = () => {
      item.isFavorite = !item.isFavorite;
      cardDetails.update(item);
    };

    fragment.appendChild(card.element);
  });
  return fragment;
}

function updateCard(cards, i, newCard) {
  cards[i] = Object.assign({}, cards[i], newCard);
  return cards[i];
}

function createData(count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(getCard());
  }
  return result;
}
