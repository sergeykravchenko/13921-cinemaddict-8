import Component from './component';

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

  set onFilter(fn) {
    this._onFilter = fn;
  }

  get template() {
    return `<a href="#${this.id}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">${this._name} <span class="main-navigation__item-count ${this.id === `all` && !this._count ? `visually-hidden` : ``}">${this._count}</span></a>`;
  }

  setCount(data) {
    this._count = data.length;
    this._updateCount();
  }

  setInactive() {
    this._element.classList.remove(`main-navigation__item--active`);
  }

  setActive() {
    this._element.classList.add(`main-navigation__item--active`);
  }

  _updateCount() {
    const counter = this._element.querySelector(`.main-navigation__item-count`);
    counter.textContent = this._count;
    if (this._count !== 0 && this.id !== `all`) {
      counter.classList.remove(`visually-hidden`);
    } else {
      counter.classList.add(`visually-hidden`);
    }
  }

  _onFilterClick() {
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
