import Component from './component';

export default class Search extends Component {
  constructor() {
    super();
    this._onSearchInput = this._onSearchInput.bind(this);
  }

  set onSearch(fn) {
    this._onSearch = fn;
  }

  get template() {
    return `<form class="header__search search">
      <input type="text" name="search" class="search__field" placeholder="Search">
      <button type="submit" class="visually-hidden">Search</button>
    </form>`;
  }

  _onSearchInput() {
    const filterChars = this._element.querySelector(`.search__field`).value;

    if (typeof this._onSearch === `function`) {
      this._onSearch(filterChars);
    }
  }


  createListeners() {
    this._element.querySelector(`.search__field`).addEventListener(`input`, this._onSearchInput);
  }

  removeListeners() {
    this._element.querySelector(`.search__field`).removeEventListener(`input`, this._onSearchInput);
  }
}
