import Filter from './filter';
import Api from './backend-api';
import Store from './store';
import Provider from './provider';
import Card from './card';
import ExtraCard from './extra-card';
import CardDetails from './card-details';
import Search from './search';
import {default as statsInit, getStatsByTime} from './stats';

const Cards = {
  MAX_SHOW: 5,
  STEP: 5
};
const FILTERS_CONTAINER = document.querySelector(`.main-navigation`);
let SEARCH_INPUT;
const HEADER = document.querySelector(`.header`);
const STATS = document.querySelector(`.statistic`);
const FILMS = document.querySelector(`.films`);
const STATS_FILTERS = STATS.querySelector(`.statistic__filters`);
const NO_FILMS = FILMS.querySelector(`.films-list__title`);
const CONTAINERS = document.querySelectorAll(`.films-list__container`);
const CARDS_CONTAINER = CONTAINERS[0];
const TOP_RATED = CONTAINERS[1];
const MOST_COMMENTED = CONTAINERS[2];
const LOAD_MORE = document.querySelector(`.films-list__show-more`);

const AUTHORIZATION = `Basic eo0w590ik2988a=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const CARDS_STORE_KEY = `cards-store-key`;

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

const api = new Api({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: CARDS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});
export const statsButton = document.querySelector(`[href*=stats]`);
let cardsData = [];

window.addEventListener(`offline`, () => (document.title = `${document.title}[OFFLINE]`));
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncCards();
});


const getProfileRating = (data) => {
  const watchedCount = data.filter((item) => item.isWatched);
  const status = {
    [watchedCount.length < 10]: `novice`,
    [watchedCount.length > 10 && watchedCount.length < 20]: `fun`,
    [watchedCount.length > 20]: `movie buff`
  };
  const rating = document.querySelector(`.profile__rating`);
  rating.textContent = status[true];
};

const getFooterStats = (data) => {
  const footerStats = document.querySelector(`.footer__statistics p`);
  footerStats.textContent = `${data.length} movie${data.length > 1 ? `s` : ``} inside`;
};

const filterTypes = (data) => ({
  all: () => data,
  watchlist: () => data.filter((item) => item.isInWatchlist),
  history: () => data.filter((item) => item.isWatched),
  favorites: () => data.filter((item) => item.isFavorite)
});

const hideStatsOnFilter = () => {
  if (statsButton.classList.contains(`main-navigation__item--active`)) {
    statsButton.classList.remove(`main-navigation__item--active`);
    STATS.classList.add(`visually-hidden`);
    FILMS.classList.remove(`visually-hidden`);
  }
};

const createFilters = (data) => {
  FILTERS_CONTAINER.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`)
    .forEach((item) => item.parentElement.removeChild(item));
  const fragment = document.createDocumentFragment();
  let filters = [];

  CardsFilters.forEach(function (item) {
    const filter = new Filter(item);
    filter.render();
    const filteredData = filterTypes(data)[filter.id]();
    filter.setCount(filteredData);
    filters.push(filter);

    filter.onFilter = () => {
      SEARCH_INPUT.value = ``;
      filters.forEach((i) => i.setInactive());
      hideStatsOnFilter();
      filter.setActive();
      renderCards(CARDS_CONTAINER, filteredData);

      if (filteredData.length > Cards.STEP) {
        LOAD_MORE.classList.remove(`visually-hidden`);
      } else {
        LOAD_MORE.classList.add(`visually-hidden`);
      }
    };

    fragment.appendChild(filter.element);
  });

  const firstElement = FILTERS_CONTAINER.firstChild;
  FILTERS_CONTAINER.insertBefore(fragment, firstElement);
};


const updateFilter = (data) => {
  let activeIndex;
  FILTERS_CONTAINER.querySelectorAll(`.main-navigation__item`).forEach((item, i) => {
    if (item.classList.contains(`main-navigation__item--active`)) {
      activeIndex = i;
    }
  });

  createFilters(data);

  FILTERS_CONTAINER.querySelector(`[href*=all]`).classList.remove(`main-navigation__item--active`);
  FILTERS_CONTAINER.querySelectorAll(`.main-navigation__item`)[activeIndex].classList.add(`main-navigation__item--active`);

};

const createExtraCards = (data) => {
  let fragment = document.createDocumentFragment();
  data.forEach((item) => {
    let extraCard = new ExtraCard(item);
    let cardDetails = new CardDetails(item);
    extraCard.render();

    extraCard.onClick = () => {
      cardDetails.render();
      document.body.appendChild(cardDetails.element);
    };

    cardDetails.onAddComment = (newComment) => {
      cardDetails.defaultCommentBg();
      cardDetails.onCommentBlock();
      item.comments = newComment;
      provider.updateCard({id: extraCard.id, data: extraCard.toRAW(item)})
        .then((newCard) => {
          cardDetails.onCommentSucces();
          cardDetails.update(newCard);
          cardDetails.updateComments();
          cardDetails.updateCommentStatus();
        })
        .catch(() => {
          cardDetails.onCommentError();
          cardDetails.onCommentUnblock();
        });
    };

    cardDetails.onDeleteComment = (newComment) => {
      item.comments = newComment;
      provider.updateCard({id: extraCard.id, data: extraCard.toRAW(item)})
        .then((newCard) => {
          cardDetails.update(newCard);
          cardDetails.updateComments();
          cardDetails.updateCommentStatus();
        })
        .catch((err) => {
          throw err;
        });
    };

    cardDetails.onChangeRating = (newRating) => {
      cardDetails.defaultRatingBg();
      cardDetails.onRatingBlock();
      item.userRating = newRating;
      provider.updateCard({id: extraCard.id, data: extraCard.toRAW(item)})
        .then((newCard) => {
          cardDetails.onRatingUnblock();
          item = newCard;
          cardDetails.update(item);
        })
        .catch(() => {
          cardDetails.onRatingError();
          cardDetails.onRatingUnblock();
        });
    };

    cardDetails.onClose = (newObject) => {
      provider.updateCard({id: extraCard.id, data: extraCard.toRAW(newObject)})
        .then((newCard) => {
          item = newCard;
          extraCard.update(item);
          document.body.removeChild(cardDetails.element);
          cardDetails.unrender();
        })
        .catch((err) => {
          throw err;
        });
    };

    fragment.appendChild(extraCard.element);
  });
  return fragment;
};

const filteredBy = (type, container, count, data) => {
  container.innerHTML = ``;
  const template = data.slice();
  const sortTemplate = template.sort((a, b) => b[type] - a[type]);
  const fillCards = sortTemplate.slice(0, count).map((item) => item);
  const cards = createExtraCards(fillCards);
  container.appendChild(cards);
};

const createCards = (data) => {
  let fragment = document.createDocumentFragment();
  data.forEach((item, i) => {
    let card = new Card(item);
    let cardDetails = new CardDetails(item);
    card.render();

    const onAddToWatchList = () => {
      item.isInWatchlist = !item.isInWatchlist;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
          return provider.getCards();
        })
        .then(updateFilter)
        .catch((err) => {
          throw err;
        });
    };

    const onMarkAsWatched = () => {
      item.isWatched = !item.isWatched;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
          return provider.getCards();
        })
        .then((newData) => {
          cardsData = newData;
          updateFilter(newData);
          getProfileRating(newData);
        })
        .catch((err) => {
          throw err;
        });
    };

    const onAddToFavorite = () => {
      item.isFavorite = !item.isFavorite;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          item = newCard;
          cardDetails.update(item);
          return provider.getCards();
        })
        .then(updateFilter)
        .catch((err) => {
          throw err;
        });
    };

    if (i < Cards.MAX_SHOW) {
      card.element.classList.remove(`visually-hidden`);
    }

    card.onClick = () => {
      cardDetails.render();
      document.body.appendChild(cardDetails.element);
    };

    cardDetails.onAddComment = (newComment) => {
      cardDetails.defaultCommentBg();
      cardDetails.onCommentBlock();
      item.comments = newComment;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          cardDetails.onCommentSucces();
          cardDetails.update(newCard);
          cardDetails.updateComments();
          cardDetails.updateCommentStatus();
        })
        .catch(() => {
          cardDetails.onCommentError();
          cardDetails.onCommentUnblock();
        });
    };

    cardDetails.onDeleteComment = (newComment) => {
      item.comments = newComment;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          cardDetails.update(newCard);
          cardDetails.updateComments();
          cardDetails.updateCommentStatus();
        })
        .catch((err) => {
          throw err;
        });
    };

    cardDetails.onChangeRating = (newRating) => {
      cardDetails.defaultRatingBg();
      cardDetails.onRatingBlock();
      item.userRating = newRating;
      provider.updateCard({id: card.id, data: card.toRAW(item)})
        .then((newCard) => {
          cardDetails.onRatingUnblock();
          item = newCard;
          cardDetails.update(item);
        })
        .catch(() => {
          cardDetails.onRatingError();
          cardDetails.onRatingUnblock();
        });
    };

    cardDetails.onClose = (newObject) => {
      provider.updateCard({id: card.id, data: card.toRAW(newObject)})
        .then((newCard) => {
          item = newCard;
          card.update(item);
          document.body.removeChild(cardDetails.element);
          cardDetails.unrender();
        })
        .catch((err) => {
          throw err;
        });
    };

    card.onAddToWatchList = onAddToWatchList;
    cardDetails.onAddToWatchList = onAddToWatchList;

    card.onMarkAsWatched = onMarkAsWatched;
    cardDetails.onMarkAsWatched = onMarkAsWatched;

    card.onAddToFavorite = onAddToFavorite;
    cardDetails.onAddToFavorite = onAddToFavorite;

    fragment.appendChild(card.element);
  });
  return fragment;
};

const renderCards = (container, data) => {
  container.innerHTML = ``;
  const cards = createCards(data);
  container.appendChild(cards);
};

const onStatsButtonClick = (evt) => {
  evt.preventDefault();
  const active = FILTERS_CONTAINER.querySelector(`.main-navigation__item--active`);
  active.classList.remove(`main-navigation__item--active`);
  statsButton.classList.add(`main-navigation__item--active`);
  FILMS.classList.add(`visually-hidden`);
  STATS.classList.remove(`visually-hidden`);
  STATS_FILTERS.classList.remove(`visually-hidden`);
  statsInit(cardsData);
};

statsButton.addEventListener(`click`, onStatsButtonClick);
onLoadCards();

provider.getCards()
  .then((cards) => {
    cardsData = cards;
    createFilters(cards);
    renderCards(CARDS_CONTAINER, cards);
    filteredBy(`rating`, TOP_RATED, 2, cards);
    filteredBy(`comments`, MOST_COMMENTED, 2, cards);
    getFooterStats(cards);
    getProfileRating(cards);
  })
  .then(onLoadCardsEnd)
  .catch(onLoadCardsError);

const renderBySearch = (data, chars) => {
  const result = data.filter((item) => item.title.toLowerCase().includes(chars));
  renderCards(CARDS_CONTAINER, result);
};

const renderSearch = () => {
  const search = new Search();
  const status = HEADER.querySelector(`.header__profile`);
  search.render();
  HEADER.insertBefore(search.element, status);
  SEARCH_INPUT = search.element.querySelector(`.search__field`);

  search.onSearch = (chars) => {
    renderBySearch(cardsData, chars);
  };
};

renderSearch();

STATS_FILTERS.addEventListener(`change`, (evt) => {
  getStatsByTime(evt, cardsData);
});

const onLoadMoreClick = (evt) => {
  evt.preventDefault();
  const hiddenCards = CARDS_CONTAINER.querySelectorAll(`.film-card.visually-hidden`);
  Array.from(hiddenCards).slice(0, Cards.STEP).forEach((item) => item.classList.remove(`visually-hidden`));

  if (!CARDS_CONTAINER.querySelector(`.film-card.visually-hidden`)) {
    evt.target.classList.add(`visually-hidden`);
  }
};

LOAD_MORE.addEventListener(`click`, onLoadMoreClick);

