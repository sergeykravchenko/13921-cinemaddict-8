import Component from './component';
import moment from 'moment';

const MAX_LENGTH = 140;

export default class Card extends Component {
  constructor(data) {
    super();
    this.id = data.id;
    this._poster = data.poster;
    this._title = data.title;
    this._rating = data.rating;
    this._releaseDate = data.releaseDate;
    this._watchingDate = data.watchingDate;
    this._duration = data.duration;
    this._genre = data.genre;
    this._description = data.description;
    this._onAddToWatchList = null;
    this._onMarkAsWatched = null;
    this._onAddToFavorite = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
    this._onAddToFavoriteClick = this._onAddToFavoriteClick.bind(this);
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    return typeof this._onClick === `function` && this._onClick();
  }

  _commentsCountsTemplate() {
    return `${this._comments.length} comment${this._comments.length > 1 ? `s` : ``}`;
  }

  _updateCommentsCount() {
    this._element.querySelector(`.film-card__comments`).innerHTML = this._commentsCountsTemplate();
  }

  _onAddToWatchListClick(evt) {
    evt.preventDefault();
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList();
    }
  }

  _onMarkAsWatchedClick(evt) {
    evt.preventDefault();
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched();
    }
  }

  _onAddToFavoriteClick(evt) {
    evt.preventDefault();
    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite();
    }
  }

  get duration() {
    const hours = (this._duration / 60).toFixed();
    const minutes = this._duration - hours * 60;
    return {hours, minutes};
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onAddToFavorite(fn) {
    this._onAddToFavorite = fn;
  }

  get template() {
    return `<article class="film-card visually-hidden">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(this._releaseDate).year()}</span>
      <span class="film-card__duration">${this.duration.hours}h&nbsp;${this.duration.minutes}m</span>
      <span class="film-card__genre">${[...this._genre][0]}</span>
    </p>
    <img src="${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description.length < MAX_LENGTH ? this._description.substr(0, MAX_LENGTH) + `...` : this._description}</p>
    <button class="film-card__comments">${this._commentsCountsTemplate()}</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">FAV</button>
    </form>
    </article>`;
  }

  createListeners() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .addEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .addEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-card__controls-item--favorite`)
        .addEventListener(`click`, this._onAddToFavoriteClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
    this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
        .removeEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
        .removeEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-card__controls-item--favorite`)
        .removeEventListener(`click`, this._onAddToFavoriteClick);
  }

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
    this._updateCommentsCount();
  }

  toRAW(data) {
    return {
      'id': this.id,
      'comments': data.comments,
      'film_info': {
        'actors': this.actors,
        'age_rating': this.ageRating,
        'alternative_title': this.altTitle,
        'description': this.description,
        'director': this.director,
        'genre': this.genre,
        'poster': this.poster,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.duration,
        'title': this.title,
        'total_rating': this.rating,
        'writers': this.writers
      },
      'user_details': {
        'personal_rating': data.userRating,
        'watchlist': data.isInWatchlist,
        'already_watched': data.isWatched,
        'favorite': data.isFavorite,
        'watching_date': data.watchingDate
      }
    };
  }
}
