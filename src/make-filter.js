export default (filterName, count, index) => {
  const counter = ` <span class="main-navigation__item-count">${count}</span>`;
  let filterId;
  filterId = filterName.match(/\S*/)[0];
  return `<a href="#${filterId.toLowerCase()}" class="main-navigation__item">${filterName}${index === 0 ? `` : counter}</a>`;
};
