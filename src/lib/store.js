/**
 * Store class, controls read/write for stores,
 * belongs to a Base
 */

const __write = function () {
  return;
};

export default class Store {
  constructor (base) {
    this.base = base;
    this.dir = base.dir;
  }

  create () {
    __write();
  }

  read () {
    // R
  }

  update () {
    // U
  }

  delete () {
    // D
  }
}