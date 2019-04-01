import Filter from './filter';
import Api from './backend-api';
import Card from './card';
import CardDetails from './card-details';
import statsInit from './stats';

const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
export const STATS = document.querySelector(`.statistic`);
export const FILMS = document.querySelector(`.films`);
const NO_FILMS = FILMS.querySelector(`.films-list__title`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
export const statsButton = document.querySelector(`[href*=stats]`);

const AUTHORIZATION = `Basic eo0w590ik2988a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const api = new Api({endPoint: END_POINT, authorization: AUTHORIZATION});

const onLoadCards = () => {
  CARDS_CONTAINER.classList.add(`visually-hidden`);
  NO_FILMS.classList.remove(`visually-hidden`);
  NO_FILMS.innerHTML = `Loading movies...`;
};

const onLoadCardsError = () => {
  NO_FILMS.innerHTML = `Something went wrong while loading movies. Check your connection or try again later`;
};

const onLoadCardsEnd = () => {
  CARDS_CONTAINER.classList.remove(`visually-hidden`);
  NO_FILMS.classList.add(`visually-hidden`);
};

const CardsFilters = [
  {
    filterName: `All movies`,
    filterId: `all`,
    count: ``,
    isActive: true
  },
  {
    filterName: `Watchlist`,
    filterId: `watchlist`,
    count: ``,
    isActive: false
  },
  {
    filterName: `History`,
    filterId: `history`,
    count: ``,
    isActive: false
  },
  {
    filterName: `Favorites`,
    filterId: `favorites`,
    count: ``,
    isActive: false
  }
];

const filterTypes = (data) => ({
  all: () => data,
  watchlist: () => data.filter((item) => item.isInWatchlist),
  history: () => data.filter((item) => item.isWatched),
  favorites: () => data.filter((item) => item.isFavorite)
});

const createFilters = (data) => {
  const fragment = document.createDocumentFragment();

  CardsFilters.forEach(function (item) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      const result = filterTypes(data)[filter.id]();
      renderCards(CARDS_CONTAINER, result);
    };

    filter.render();
    fragment.appendChild(filter.element);
  });
  const firstElement = FILTERS_CONTAINER.firstChild;
  FILTERS_CONTAINER.insertBefore(fragment, firstElement);
};

const filteredBy = (type, container, count, data) => {
  container.innerHTML = ``;
  const template = data.slice();
  const sortTemplate = template.sort((a, b) => b[type] - a[type]);
  const fillCards = sortTemplate.slice(0, count).map((item) => item);
  const cards = createCards(fillCards);
  container.appendChild(cards);
};

const createCards = (data) => {
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let card = new Card(item);
    let cardDetails = new CardDetails(item);
    card.render();

    card.onClick = () => {
      cardDetails.render();
      document.body.appendChild(cardDetails.element);
    };

    cardDetails.onAddComment = (newComments) => {
      cardDetails.defaultCommentBg();
      cardDetails.onCommentBlock();
      api.updateCard({id: card.id, data: {comments: newComments}})
        .then((newCard) => {
          cardDetails.onCommentSucces();
          cardDetails.update(newCard);
          cardDetails.updateComments();
        })
        .catch(() => {
          cardDetails.onCommentError();
          cardDetails.onCommentUnblock();
        });
    };

    cardDetails.onClose = (newObject) => {
      cardDetails.defaultRatingBg();
      cardDetails.onRatingBlock();
      api.updateCard({id: card.id, data: card.toRAW(newObject)})
        .then((newCard) => {
          cardDetails.onRatingUnblock();
          item = newCard;
          card.update(item);
          document.body.removeChild(cardDetails.element);
          cardDetails.unrender();
        })
        .catch(() => {
          cardDetails.onRatingError();
          cardDetails.onRatingUnblock();
        });
    };

    card.onAddToWatchList = () => {
      item.isInWatchlist = !item.isInWatchlist;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    cardDetails.onAddToWatchList = () => {
      item.isInWatchlist = !item.isInWatchlist;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    card.onMarkAsWatched = () => {
      item.isWatched = !item.isWatched;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    cardDetails.onMarkAsWatched = () => {
      item.isWatched = !item.isWatched;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    card.onAddToFavorite = () => {
      item.isFavorite = !item.isFavorite;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    cardDetails.onAddToFavorite = () => {
      item.isFavorite = !item.isFavorite;
      api.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
        })
        .catch();
    };

    fragment.appendChild(card.element);
  });
  return fragment;
};

const renderCards = (container, data) => {
  container.innerHTML = ``;
  const cards = createCards(data);
  container.appendChild(cards);
};

let cardsData = [];

const onStatsButtonClick = (evt) => {
  evt.preventDefault();
  const active = FILTERS_CONTAINER.querySelector(`.main-navigation__item--active`);
  active.classList.remove(`main-navigation__item--active`);
  statsButton.classList.add(`main-navigation__item--active`);
  FILMS.classList.add(`visually-hidden`);
  STATS.classList.remove(`visually-hidden`);
  statsInit(cardsData);
};

statsButton.addEventListener(`click`, onStatsButtonClick);
onLoadCards();

api.getCards()
  .then((cards) => {
    cardsData = cards;
    createFilters(cards);
    renderCards(CARDS_CONTAINER, cards);
    filteredBy(`rating`, TOP_RATED, 2, cards);
    filteredBy(`comments`, MOST_COMMENTED, 2, cards);
  })
  .then(onLoadCardsEnd)
  .catch(onLoadCardsError);

