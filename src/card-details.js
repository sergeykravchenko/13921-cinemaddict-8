import Component from './component';
import util from './util';
import moment from 'moment';

export default class cardDetails extends Component {
  constructor(data) {
    super();
    this._poster = data.poster;
    this._title = data.title;
    this._originalTitle = this._title;
    this._actors = data.actors;
    this._releaseDate = data.releaseDate;
    this._duration = data.duration;
    this._country = data.country;
    this._genre = data.genre;
    this._rating = data.rating;
    this._userRating = data.userRating;
    this._ageLimit = data.ageLimit;
    this._description = data.description;
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
    this._onClick = null;
    this._element = null;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onAddComment = this._onAddComment.bind(this);
    this._onChangeRating = this._onChangeRating.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
  }

  _onCloseClick() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onClick === `function`) {
      this._onClick(newData);
    }

    this.update(newData);
  }

  _processForm(formData) {
    const entry = {
      userRating: this._userRating,
      comments: this._comments,
      isInWatchlist: this._isInWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite
    };

    const cardDetailsMapper = cardDetails.createMapper(entry);

    for (const [property, value] of formData.entries()) {
      if (cardDetailsMapper[property]) {
        cardDetailsMapper[property](value);
      }
    }

    return entry;
  }

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
  }

  static createMapper(target) {
    return {
      rating: (value) => (target.userRating = value),
      comments: (value) => (target.comments = value),
      watchlist: (value) => (target.isInWatchlist = value),
      watched: (value) => (target.isWatched = value),
      favorite: (value) => (target.isFavorite = value)
    };
  }

  _onAddComment(evt) {
    if (evt.keyCode === util.ENTER_KEYCODE) {
      evt.preventDefault();
      const textarea = this._element.querySelector(`.film-details__comment-input`);
      const newComment = {
        author: `I'am`,
        date: Date.now(),
        text: textarea.value,
        emoji: this._element.querySelector(`.film-details__add-emoji-label`).textContent
      };

      this._comments.push(newComment);
      textarea.value = ``;
      this._element.querySelector(`.film-details__add-emoji`).checked = false;
      this._element.querySelector(`.film-details__comments-list`).innerHTML = this._getCommentsTemplate();
      this._element.querySelector(`.film-details__comments-count`).textContent = this._comments.length;
    }
  }

  _onChangeRating() {
    this._userRating = this._element.querySelector(`.film-details__user-rating-input:checked`).value;
    this._element.querySelector(`.film-details__user-rating span`).textContent = this._userRating;
  }

  _onChangeEmoji() {
    const emoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = emoji;
  }

  _createRating() {
    const ratingMax = 9;
    let rating = ``;
    for (let i = 1; i <= ratingMax; i++) {
      rating += `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === this._userRating ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>
      `;
    }
    return rating;
  }

  _getCommentsTemplate() {
    return this._comments.map((item) => (`
    <li class="film-details__comment">
    <span class="film-details__comment-emoji">${item.emoji}</span>
    <div>
      <p class="film-details__comment-text">${item.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${moment(item.date).fromNow()}</span>
      </p>
    </div>
  </li>
    `)).join(``);
  }

  get template() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="images/posters/${this._poster}" alt="incredables-2">

          <p class="film-details__age">${this._ageLimit}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">${this._originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._rating}</p>
              <p class="film-details__user-rating">Your rate <span>${this._userRating}</span></p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">Brad Bird</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">Brad Bird</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(this._releaseDate).format(`D MMMM YYYY`)} (${this._country})</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${moment.duration(this._duration).asMinutes().toFixed()} min</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${this._genre.map((item) => (`
                <span class="film-details__genre">${item}</span>
                `)).join(` `)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${this._description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isInWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>

      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comment${this._comments.length > 1 ? `s` : ``} <span class="film-details__comments-count">${this._comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${this._getCommentsTemplate()}
        </ul>

        <div class="film-details__new-comment">
          <div>
            <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
            <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
              <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
              <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
            </div>
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
          </label>
        </div>
      </section>

      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
          <button class="film-details__watched-reset" type="button">undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">Incredibles 2</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${this._createRating()}
            </div>
          </section>
        </div>
      </section>
    </form>
  </section>`;
  }

  createListeners() {
    this._element.querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, this._onCloseClick);
    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((item) => {
      item.addEventListener(`change`, this._onChangeEmoji);
    });
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.addEventListener(`click`, this._onChangeRating);
    });
    this._element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddComment);
  }

  removeListeners() {
    this._element.querySelector(`.film-details__close-btn`)
        .removeEventListener(`click`, this._onCloseClick);
    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((item) => {
      item.removeEventListener(`change`, this._onChangeEmoji);
    });
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.removeEventListener(`click`, this._onChangeRating);
    });
    this._element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._onAddComment);
  }
}
