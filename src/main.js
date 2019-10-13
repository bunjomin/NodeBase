const fs = require('../node_modules/fs-extra/lib/index.js');

/**
 * Our primary function, used to instantiate a base on a directory
 * @param {String} basedir The resolved absolute path to our base dir
 */
const __base = function base (basedir) {
  try {
    fs.ensureDirSync(basedir);
  } catch (err) {
    console.log(err);
  }

  this.dir = basedir;

  // Check if any stores exist within the base, if so
  // we're resuming a base rather than creating a new one
  const stores = fs.readdirSync(basedir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (!stores.length) console.log('New base instantiated');

  else console.log(stores);

  return this;
};

export default __base;
