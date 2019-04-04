const util = {
  KEY_CODE: {
    ESC: 27,
    ENTER: 13
  },
  onPressedKey: (evt, keycode, action) => {
    if (evt.keyCode === keycode) {
      action();
    }
  },
  getRandom: (max, min = 0) => Math.random() * (max - min) + min,
  getRandomInteger: (max, min = 0) => Math.floor(util.getRandom(max, min)),
  getRandomBoolean: () => [true, false][util.getRandomInteger(2)],
  getRandomFrom: (array) => array[util.getRandomInteger(array.length)],
  getRandomsFrom: (array, count) => {
    array = array.slice();
    let result = [];
    let randomCount = util.getRandomInteger(count, 1);
    for (let i = 0; i < randomCount; i++) {
      const randomIndex = util.getRandomInteger(array.length);
      result.push(array[randomIndex]);
      array.splice(array[randomIndex], 1);
    }
    return result;
  },
  createElement: (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }
};

export default util;
