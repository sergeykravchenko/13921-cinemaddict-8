export default class ModelCard {
  constructor(data) {
    this.id = data[`id`];
    this.actors = new Set(data.film_info[`actors`]) || ``;
    this.ageRating = data.film_info[`age_rating`] || ``;
    this.altTitle = data.film_info[`alternative_title`] || ``;
    this.description = data.film_info[`description`] || ``;
    this.director = data.film_info[`director`] || ``;
    this.genre = new Set(data.film_info[`genre`]) || [];
    this.poster = data.film_info[`poster`] || ``;
    this.releaseDate = new Date(data.film_info.release[`date`]) || ``;
    this.country = data.film_info.release[`release_country`] || ``;
    this.duration = data.film_info[`runtime`] || ``;
    this.title = data.film_info[`title`] || ``;
    this.rating = data.film_info[`total_rating`] || ``;
    this.writers = new Set(data.film_info[`writers`]) || [];
    this.comments = data[`comments`] || [];
    this.userRating = data.user_details[`personal_rating`] || ``;
    this.isInWatchlist = Boolean(data.user_details[`watchlist`]);
    this.isWatched = Boolean(data.user_details[`already_watched`]);
    this.isFavorite = Boolean(data.user_details[`favorite`]);
  }

  toRAW() {
    return {
      'user_details': {
        'personal_rating': this.userRating,
        'comments': this.comments,
        'is_favorite': this.isInWatchlist,
        'watched': this.isWatched,
        'favorite': this.isFavorite
      }
    };
  }

  static parseTask(data) {
    return new ModelCard(data);
  }

  static parseTasks(data) {
    return data.map(ModelCard.parseTask);
  }
}
