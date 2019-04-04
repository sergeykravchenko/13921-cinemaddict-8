import ModelCard from './model-card';

const objectToArray = (object) => Object.keys(object).map((id) => object[id]);

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  updateCard({id, data}) {
    if (this._isOnline()) {
      return this._api.updateCard({id, data})
      .then((card) => {
        this._store.setItem({key: card.id, item: card.toRAW(card)});
        return card;
      });
    } else {
      const card = data;
      this._needSync = true;
      this._store.setItem({key: card.id, item: card});
      return Promise.resolve(ModelCard.parseCard(card));
    }
  }

  createCard({card}) {
    if (this._isOnline()) {
      return this._api.createCard({card})
      .then((cardItem) => {
        this._store.setItem({key: cardItem.id, item: cardItem.toRAW(card)});
        return cardItem;
      });
    } else {
      card.id = this._generateId();
      this._needSync = true;
      this._store.setItem({key: card.id, item: card});
      return Promise.resolve(ModelCard.parseCard(card));
    }
  }

  deleteCard({id}) {
    if (this._isOnline()) {
      return this._api.deleteCard({id})
      .then(() => {
        this._store.removeItem({key: id});
      });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getCards() {
    if (this._isOnline()) {
      return this._api.getCards()
      .then((cards) => {
        cards.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
        return cards;
      });
    } else {
      const rawCardsMap = this._store.getAll();
      const rawCards = objectToArray(rawCardsMap);
      const cards = ModelCard.parseCards(rawCards);

      return Promise.resolve(cards);
    }
  }

  syncCards() {
    return this._api.syncCards({cards: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
