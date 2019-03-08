import util from './util';

export default class Card {
  constructor(data) {
    this._poster = data.poster;
    this._title = data.title;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._description = data.description;
    this._comments = data.comments;
    this._onClick = null;
    this._element = null;
    this._onCommentsClick = this._onCommentsClick.bind(this);
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    return typeof this._onClick === `function` && this._onClick();
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onClick = fn;
  }

  get template() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${this._year}</span>
      <span class="film-card__duration">${this._duration}</span>
      <span class="film-card__genre">${this._genre}</span>
    </p>
    <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${this._description}</p>
    <button class="film-card__comments">${this._comments} comments</button>

    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"><!--Add to watchlist--> WL</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"><!--Mark as watched-->WTCHD</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite"><!--Mark as favorite-->FAV</button>
    </form>
    </article>`;
  }

  render() {
    this._element = util.createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
  }

  unbind() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
  }
}
