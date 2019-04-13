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
    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._comments = data.comments;
  }

  get duration() {
    const hours = (this._duration / 60).toFixed();
    const minutes = this._duration - hours * 60;
    return {hours, minutes};
  }

  get template() {
    return `<article class="film-card">
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
    </article>`;
  }

  toRAW(data) {
    return {
      'comments': data.comments,
      'user_details': {
        'personal_rating': data.userRating,
        'watching_date': data.watchingDate
      }
    };
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

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._updateCommentsCount();
  }

  createListeners() {
    this._element.querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._onCommentsClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-card__comments`)
        .removeEventListener(`click`, this._onCommentsClick);
  }
}
