function hasWhiteSpace(string) {
  return /\s/g.test(string);
}

export default (filterName, count, index) => {
  const counter = ` <span class="main-navigation__item-count">${count}</span>`;
  let filterId;
  if (hasWhiteSpace(filterName)) {
    filterId = filterName.split(` `)[0];
  } else {
    filterId = filterName;
  }
  return `<a href="#${filterId.toLowerCase()}" class="main-navigation__item">${filterName}${index === 0 ? `` : counter}</a>`;
};
