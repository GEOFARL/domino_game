import { convertOutOfSimple, convertToSimple } from '../helpers/conversionFunc';

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
    return (
      localStorage.getItem(this.storeKey) !== null &&
      localStorage.getItem(this.storeKey).length !== 0
    );
  }

  removeBoards() {
    localStorage.removeItem(this.storeKey);
  }
}
