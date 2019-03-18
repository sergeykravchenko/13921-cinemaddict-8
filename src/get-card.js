import util from './util';
import moment from 'moment';

const DESCRIPTION_COUNT = 3;
const RATING_MAX = 10;
const ACTORS_MAX = 10;
const GENRES_MAX = 3;
const USER_DEFAULT_RATING = 5;

const Time = {
  YEAR: 365,
  MS_IN_DAY: 86400000,
  HOUR: 3600000,
};

const posters = new Set([
  `accused.jpg`,
  `blackmail.jpg`,
  `blue-blazes.jpg`,
  `fuga-da-new-york.jpg`,
  `moonrise.jpg`,
  `three-friends.jpg`,
]);

const titles = new Set([
  `The Lord of the Rings: The Fellowship of the Ring`,
  `The Lord of the Rings: The Two Towers`,
  `The Lord of the Rings: The Return of the King`,
  `The Hobbit: An Unexpected Journey`,
  `The Hobbit: The Desolation of Smaug`,
  `The Hobbit: The Battle of the Five Armies`,
  `Star Wars: Episode I - The Phantom Menace`,
  `Star Wars: Episode II - Attack of the Clones`,
  `Star Wars: Episode III - Revenge of the Sith`,
  `Star Wars: Episode IV: A New Hope`,
  `Star Wars: Episode V - The Empire Strikes Back`,
  `Star Wars: Episode VI - Return of the Jedi`,
  `Green Book`,
  `Forrest Gump`,
  `Gladiator `
]);

const actors = new Set([
  `Ewan McGregor`,
  `Natalie Portman`,
  `Hayden Christensen`,
  `Samuel L. Jackson`,
  `Elijah Wood`,
  `Ian McKellen`,
  `Viggo Mortensen`,
  `Orlando Bloom`,
  `Sean Bean`,
  `Sean Astin`,
  `Christopher Lee`,
  `Cate Blanchett`
]);

const countries = new Set([
  `USA`,
  `Canada`,
  `Russia`,
  `Germany`,
  `France`,
  `Spain`,
  `Italy`,
  `Australia`
]);

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus`
];

const genres = new Set([
  `Action`,
  `Drama`,
  `Fantasy`,
  `Adventure`,
  `Comedy`,
  `Romance`,
  `History`
]);

const ageLimit = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`,
];

export default () => ({
  poster: util.getRandomFrom([...posters]),
  title: util.getRandomFrom([...titles]),
  actors: util.getRandomsFrom([...actors], ACTORS_MAX, 1).join(`, `),
  country: util.getRandomFrom([...countries]),
  rating: util.getRandom(RATING_MAX).toFixed(1),
  userRating: USER_DEFAULT_RATING,
  releaseDate: Date.now() + util.getRandomInteger(Time.YEAR + 1, (-Time.YEAR) * 15) * util.getRandomInteger(Time.MS_IN_DAY),
  duration: util.getRandomInteger(Time.HOUR * 2.5, Time.HOUR),
  genre: util.getRandomsFrom([...genres], GENRES_MAX, 1),
  ageLimit: util.getRandomFrom(ageLimit),
  description: util.getRandomsFrom(descriptions, DESCRIPTION_COUNT, 1).join(` `),
  comments: [
    {
      author: `Tim Macoveev`,
      date: moment(),
      text: `So long-long story, boring!`,
      emoji: `😴`
    }
  ],
  isInWatchlist: util.getRandomBoolean(),
  isWatched: util.getRandomBoolean(),
  isFavorite: util.getRandomBoolean()
});
