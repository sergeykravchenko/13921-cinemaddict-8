import Component from './component';
import util from './util';
import moment from 'moment';

export default class cardDetails extends Component {
  constructor(data) {
    super();
    this.id = data.id;
    this._actors = data.actors;
    this._ageRating = data.ageRating;
    this._altTitle = data.altTitle;
    this._description = data.description;
    this._director = data.director;
    this._genre = data.genre;
    this._poster = data.poster;
    this._releaseDate = data.releaseDate;
    this._watchingDate = data.watchingDate;
    this._country = data.country;
    this._duration = data.duration;
    this._title = data.title;
    this._rating = data.rating;
    this._writers = data.writers;
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
    this._onAddComment = null;
    this._onDeleteComment = null;
    this._onChangeRating = null;
    this._onClose = null;
    this._onClick = null;
    this._element = null;
    this._emojis = {
      'sleeping': `😴`,
      'neutral-face': `😐`,
      'grinning': `😀`
    };
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onEscPress = this._onEscPress.bind(this);
    this._onAddCommentClick = this._onAddCommentClick.bind(this);
    this._onChangeRatingClick = this._onChangeRatingClick.bind(this);
    this._onChangeEmoji = this._onChangeEmoji.bind(this);
    this.onCommentUnblock = this.onCommentUnblock.bind(this);
    this.onRatingUnblock = this.onRatingUnblock.bind(this);
    this._onAddToWatchListClick = this._onAddToWatchListClick.bind(this);
    this._onMarkAsWatchedClick = this._onMarkAsWatchedClick.bind(this);
    this._onAddToFavoriteClick = this._onAddToFavoriteClick.bind(this);
    this._onDeleteCommentClick = this._onDeleteCommentClick.bind(this);
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

  set onAddComment(fn) {
    this._onAddComment = fn;
  }

  set onDeleteComment(fn) {
    this._onDeleteComment = fn;
  }

  set onChangeRating(fn) {
    this._onChangeRating = fn;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  get template() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${this._poster}" alt="${this._title}">

          <p class="film-details__age">${this._ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">${this._altTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._rating}</p>
              <p class="film-details__user-rating">Your rate <span>${this._userRating.toFixed()}</span></p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${[...this._writers].join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${[...this._actors].join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(this._releaseDate).format(`D MMMM YYYY`)} (${this._country})</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${this._duration} min</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${[...this._genre].map((item) => (`
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
        <div class="film-details__user-rating-controls ${this._comments.some((item) => item.user) ? `` : `visually-hidden`}">
          <span class="film-details__watched-status film-details__watched-status--active"></span>
          <button class="film-details__watched-reset" type="button">undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

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

  updateComments() {
    this._element.querySelector(`.film-details__comments-list`).innerHTML = this._getCommentsTemplate();
    this._element.querySelector(`.film-details__comments-count`).textContent = this._comments.length;
  }

  updateCommentStatus() {
    if (this._comments.some((item) => item.user)) {
      this._element.querySelector(`.film-details__watched-status`).textContent = `Comment added`;
    } else {
      this._element.querySelector(`.film-details__watched-status`).textContent = `Comment deleted`;
      this._element.querySelector(`.film-details__watched-reset`).classList.add(`visually-hidden`);
    }
  }

  onRatingBlock() {
    this._element.querySelectorAll(`.film-details__user-rating-input`)
      .forEach((item) => (item.disabled = true));
  }

  onRatingUnblock() {
    this._element.querySelectorAll(`.film-details__user-rating-input`)
      .forEach((item) => (item.disabled = false));
  }

  defaultRatingBg() {
    const label = this._element.querySelector(`.film-details__user-rating-input:checked + label`);
    this._setBgColor(label);
  }

  onRatingError() {
    const form = this._element.querySelector(`.film-details__inner`);
    const label = this._element.querySelector(`.film-details__user-rating-input:checked + label`);
    this._onError(label, form, this.onRatingUnblock);
  }

  onCommentBlock() {
    this._element.querySelector(`.film-details__comment-input`).disabled = true;
  }

  onCommentUnblock() {
    this._element.querySelector(`.film-details__comment-input`).disabled = false;
  }

  onCommentSucces() {
    this.onCommentUnblock();
    this._element.querySelector(`.film-details__comment-input`).value = ``;
    this._element.querySelector(`.film-details__add-emoji`).checked = false;
  }

  defaultCommentBg() {
    const textarea = this._element.querySelector(`.film-details__comment-input`);
    this._setBgColor(textarea);
  }

  onCommentError() {
    const input = this._element.querySelector(`.film-details__comment-input`);
    const form = this._element.querySelector(`.film-details__inner`);
    this._onError(input, form, this.onCommentUnblock);
  }


  _onCloseClick() {
    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
  }

  _onEscPress(evt) {
    util.onPressedKey(evt, util.KEY_CODE.ESC, this._onCloseClick);
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

  _createRating() {
    const ratingMax = 9;
    let rating = ``;
    for (let i = 1; i <= ratingMax; i++) {
      rating += `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === +this._userRating.toFixed() ? `checked` : ``}>
        <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>
      `;
    }
    return rating;
  }

  _onChangeRatingClick() {
    this._userRating = +this._element.querySelector(`.film-details__user-rating-input:checked`).value;
    this._element.querySelector(`.film-details__user-rating span`).textContent = this._userRating;

    if (typeof this._onChangeRating === `function`) {
      this._onChangeRating(this._userRating);
    }
  }

  _onAddCommentClick(evt) {
    if (evt.ctrlKey && evt.keyCode === util.KEY_CODE.ENTER) {
      evt.preventDefault();
      const textarea = this._element.querySelector(`.film-details__comment-input`);
      const newComment = {
        author: `I'am`,
        date: Date.now(),
        comment: textarea.value,
        emotion: this._element.querySelector(`.film-details__emoji-item:checked`).value,
        user: true
      };

      this._comments.push(newComment);
      this._element.querySelector(`.film-details__user-rating-controls`).classList.remove(`visually-hidden`);

      if (typeof this._onAddComment === `function`) {
        this._onAddComment(this._comments);
      }
    }
  }

  _onDeleteCommentClick(evt) {
    evt.preventDefault();
    let i = this._comments.length - 1;
    while (i > 0 && !this._comments[i].user) {
      i -= 1;
    }

    if (this._comments[i].user) {
      this._comments.splice(i, 1);
    }

    if (typeof this._onDeleteComment === `function`) {
      this._onDeleteComment(this._comments);
    }
  }

  _onChangeEmoji() {
    const emoji = this._element.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    this._element.querySelector(`.film-details__add-emoji-label`).textContent = emoji;
  }

  _getCommentsTemplate() {
    return this._comments.map((item) => (`
    <li class="film-details__comment">
    <span class="film-details__comment-emoji">${this._emojis[item.emotion]}</span>
    <div>
      <p class="film-details__comment-text">${item.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${moment(item.date).fromNow()}</span>
      </p>
    </div>
  </li>
    `)).join(``);
  }

  _onError(element, parent, unblock) {
    const ANIMATION_TIMEOUT = 600;
    element.style.backgroundColor = `#ff0000`;
    parent.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    unblock();

    setTimeout(() => {
      this._element.querySelector(`.film-details__inner`).style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  _setBgColor(element, color = ``) {
    element.style.backgroundColor = color;
  }

  _onAddToWatchListClick() {
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList();
    }
  }

  _onMarkAsWatchedClick() {
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched();
    }
  }

  _onAddToFavoriteClick() {
    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite();
    }
  }

  update(data) {
    this._userRating = data.userRating;
    this._comments = data.comments;
    this._isInWatchlist = data.isInWatchlist;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
  }

  createListeners() {
    document.addEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._onCloseClick);
    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((item) => {
      item.addEventListener(`change`, this._onChangeEmoji);
    });
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.addEventListener(`click`, this._onChangeRatingClick);
    });
    this._element.querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._onAddCommentClick);
    this._element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this._onAddToFavoriteClick);
    this._element.querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, this._onDeleteCommentClick);
  }

  removeListeners() {
    document.addEventListener(`keydown`, this._onEscPress);
    this._element.querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._onCloseClick);
    this._element.querySelectorAll(`.film-details__emoji-item`).forEach((item) => {
      item.removeEventListener(`change`, this._onChangeEmoji);
    });
    this._element.querySelectorAll(`.film-details__user-rating-input`).forEach((item) => {
      item.removeEventListener(`click`, this._onChangeRatingClick);
    });
    this._element.querySelector(`.film-details__comment-input`).removeEventListener(`keydown`, this._onAddCommentClick);
    this._element.querySelector(`.film-details__control-label--watchlist`)
      .removeEventListener(`click`, this._onAddToWatchListClick);
    this._element.querySelector(`.film-details__control-label--watched`)
      .removeEventListener(`click`, this._onMarkAsWatchedClick);
    this._element.querySelector(`.film-details__control-label--favorite`)
      .removeEventListener(`click`, this._onAddToFavoriteClick);
    this._element.querySelector(`.film-details__watched-reset`)
      .removeEventListener(`click`, this._onDeleteCommentClick);
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
}
