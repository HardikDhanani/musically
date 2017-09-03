export default class Cache {
  constructor() {
    this._cache = {};
  }

  exists(key) {
    return this._cache.hasOwnProperty(key) && this._cache[key];
  }

  get(key) {
    return this._cache[key];
  }

  save(key, data) {
    this._cache[key] = data;
  }
}