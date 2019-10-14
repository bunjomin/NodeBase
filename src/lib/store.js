/**
 * Store
 * Controls read/write for stores,
 * belongs to a Base
 */

const fs = require('fs-extra'),
  globby = require('globby');

const __write = function ({ base, name, schema }) {
  console.log(base, name, schema);
  return;
};

export default class Store {
  constructor (base) {
    this.base = base;
    this.dir = base.dir;
  }

  create ({ name, schema }) {
    __write({ base: this.base, name, schema });
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