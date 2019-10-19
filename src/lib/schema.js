export default class Schema {
  constructor({ store, schemaConfig }) {
    const fs = require('fs-extra');
    this.store = store;
    this.config = schemaConfig;
    fs.writeJSONSync(store.schemaPath, schemaConfig);
  }

  /**
   * Compare value to schema
   */
  validate(payload) {
    if (!payload.length) return false;
    return true;
  }
}
