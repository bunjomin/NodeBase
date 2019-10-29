import Schema from './schema';
import { uuid } from './utils';

const fs = require('fs-extra'),
  path = require('path');

/**
 * Store
 * Handles JSON read/write
 */
class Store {
  constructor({ base, identifier, name, schemaConfig }) {
    if (!schemaConfig.length) throw new Error('Invalid schema config!', schemaConfig);
    this.base = base;
    this.dir = path.resolve(base.dir, name);
    fs.ensureDir(path.resolve(this.dir));
    this.schemaPath = path.resolve(this.dir, 'schema.json');
    this.dataPath = path.resolve(this.dir, 'data.json');
    // Set schemaConfig to what was passed in
    this.schemaConfig = schemaConfig;
    // By default we're creating a new schema
    this.data = [];
    // If schema.json already exists, we're loading an existing store
    if (fs.existsSync(this.schemaPath)) {
      // Set existing schema
      this.schemaConfig = fs.readJSONSync(this.schemaPath);
      // Load data if present
      if (fs.existsSync(this.dataPath)) this.data = fs.readJSONSync(this.dataPath);
    }
    this.schema = new Schema({ store: this, schemaConfig: this.schemaConfig });
    this.name = name;
    this.identifier = identifier;
  }

  /**
   * Store.add
   * Insert new entries to the store
   * @param {Array} payload Entries to be added
   *  [{
   *    first: 'Test',
   *    last: 'Jackson',
   *    email: 'tjackson@example.com'
   *  }]
   */
  async add(payload) {
    if (!this.schema.validate(payload)) throw new Error('Invalid payload passed to Store.add', payload);
    let added = [];
    payload.map(p => {
      const identifier = uuid();
      this.data[identifier] = p;
      added.push(identifier);
    });
    await this.saveData();
    return added;
  }

  /**
   * Store.remove
   * Remove entries from the store
   * @param {Array} payload Identifiers to be removed
   * ['b7ae0315-d612-4f93-a5bb-92cbd839eeb6', 'ee0a3193-912f-4b73-a3a3-f4e7a279f88d']
   */
  async remove(payload) {
    if (!(payload instanceof Array)) throw new Error('Invalid payload passed to Store.remove', payload);
    const matches = Object.keys(this.data).filter(identifier => payload.indexOf(identifier) > -1);
    if (!matches.length) throw new Error('No valid identifiers passed to Store.remove', payload);
    matches.map(value => delete this.data[value]);
    await this.saveData();
    return true;
  }

  async saveData() {
    await fs.writeJson(this.dataPath, Object.assign({}, this.data), { spaces: 2 });
  }
}

/**
 * StoreController
 * Controls stores for a base.
 */
export default class StoreController {
  constructor(base) {
    this.base = base;
    this.dir = base.dir;
    this.stores = {};
  }

  /**
   * Create
   * Instantiate a new Store and return it.
   */
  create({ name, schemaConfig }) {
    const identifier = uuid(),
      store = new Store({ base: this.base, identifier, name, schemaConfig });
    this.stores[identifier] = store;
    return this.stores[identifier];
  }

  get(identifier) {
    return this.stores[identifier] || null;
  }
}
