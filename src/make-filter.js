export default class Filter {
  constructor(data) {
    this._counter = ` <span class="main-navigation__item-count">${data.count}</span>`;
    this._filterId = data.filterId;
    this._filterName = data.filterName;
    this._count = data.count;
    this._isActive = data.isActive;
  }

  get template() {
    return `<a href="#${this._filterId}" class="main-navigation__item ${this._isActive ? `main-navigation__item--active` : ``}">${this._filterName}${this._count === 0 ? `` : this._counter}</a>`;
  }
}
