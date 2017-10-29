// @flow

export default class Cache {
  _cache: { [string]: any };

  constructor() {
    this._cache = {};
  }

  exists(key: string) {
    return this._cache.hasOwnProperty(key) && this._cache[key];
  }

  get(key: string): any {
    return this._cache[key];
  }

  save(key: string, data: any) {
    this._cache[key] = data;
  }
}