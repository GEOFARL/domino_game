import { convertOutOfSimple, convertToSimple } from './conversionFunc';

export default class LocalStorageManager {
  constructor(storeKey) {
    this.storeKey = storeKey;
  }

  saveBoards(boards) {
    localStorage.setItem(
      this.storeKey,
      JSON.stringify(convertToSimple(boards))
    );
  }

  getBoards() {
    return convertOutOfSimple(JSON.parse(localStorage.getItem(this.storeKey)));
  }

  existBoards() {
    return localStorage.getItem(this.storeKey);
  }
}
