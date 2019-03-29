import Component from './component';
import {STATS, FILMS, statsButton} from './main';

export default class Filter extends Component {
  constructor(data) {
    super();
    this._name = data.filterName;
    this.id = data.filterId;
    this._count = data.count;
    this._counter = ` <span class="main-navigation__item-count">${data.count}</span>`;
    this._isActive = data.isActive;
    this._element = null;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<a href="#${this.id}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">${this._name}${!this._count ? `` : this._counter}</a>`;
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

  createListeners() {
    this._element.addEventListener(`click`, this._onFilterClick);
  }

  removeListeners() {
    this._element.removeEventListener(`click`, this._onFilterClick);
  }
}
