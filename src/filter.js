import Component from './component';
import {STATS, FILMS, statsButton} from './main';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.filterName;
    this.id = data.filterId;
    this._isActive = data.isActive;
    this._count = null;
    this._element = null;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  _updateCount() {
    const counter = this._element.querySelector(`.main-navigation__item-count`);
    counter.textContent = this._count;
    if (this._count !== 0) {
      counter.classList.remove(`visually-hidden`);
    } else {
      counter.classList.add(`visually-hidden`);
    }
  }

  _onFilterClick(evt) {
    evt.preventDefault();
    const target = evt.target.closest(`.main-navigation__item`);
    const activeElement = target.parentElement.querySelector(`.main-navigation__item--active`);
    if (activeElement) {
      activeElement.classList.remove(`main-navigation__item--active`);
    }
    target.classList.add(`main-navigation__item--active`);

    if (activeElement === statsButton) {
      STATS.classList.add(`visually-hidden`);
      FILMS.classList.remove(`visually-hidden`);
    }

    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<a href="#${this.id}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">${this._name} <span class="main-navigation__item-count ${this._count ? `` : `visually-hidden`}">${this._count}</span></a>`;
  }

  setCount(data) {
    this._count = data.length;
    this._updateCount();
  }

  createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}
