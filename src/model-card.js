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
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'actors': this.actors,
        'age_rating': this.ageRating,
        'alternative_title': this.altTitle,
        'description': this.description,
        'director': this.director,
        'genre': [...this.genre],
        'poster': this.poster,
        'release': {
          'date': this.releaseDate,
          'release_country': this.country
        },
        'runtime': this.duration,
        'title': this.title,
        'total_rating': this.rating,
        'writers': [...this.writers]
      },
      'user_details': {
        'personal_rating': this.userRating,
        'is_favorite': this.isInWatchlist,
        'watched': this.isWatched,
        'favorite': this.isFavorite
      }
    };
  }

  static parseCard(data) {
    return new ModelCard(data);
  }

  static parseCards(data) {
    return data.map(ModelCard.parseCard);
  }
}
