import ModelCard from './model-card';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const StatusCode = {
  OK: 200,
  REDIRECT: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const checkStatus = (response) => {
  if (response.status >= StatusCode.OK && response.status < StatusCode.REDIRECT) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);

};

const toJSON = (response) => {
  return response.json();
};

export default class Api {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelCard.parseCards);
  }

  createCard({card}) {
    return this._load({
      url: `movies`,
      method: Method.POST,
      body: JSON.stringify(card),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelCard.parseCard);
  }

  updateCard({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelCard.parseCard);
  }

  deleteCard({id}) {
    return this._load({url: `movies/${id}`, method: Method.DELETE});
  }

  syncCards({cards}) {
    return this._load({
      url: `movies/sync`,
      method: `POST`,
      body: JSON.stringify(cards),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
