var path = require('path');
var fs = require('fs');

module.exports = function(filePath, dontIncludePWD) {
  var orig, p, root, stat;
  p = filePath || path.join(__filename, '../../');
  stat = fs.lstatSync(p);
  if (stat.isSymbolicLink()) {
    p = fs.readlinkSync(p);
  }
  root = path.dirname(p);
  orig = process.env.NODE_PATH ? process.env.NODE_PATH : '';
  if (filePath) {
    process.env.NODE_PATH = path.join(root, '../libs') + path.delimiter + orig;
  } else {
    process.env.NODE_PATH = root + path.delimiter + orig;
  }
  if (dontIncludePWD !== true) {
    process.env.NODE_PATH = process.env.PWD + ":" + process.env.NODE_PATH;
  }

  // Include yarn package path for monorepos
  // TODO: generalize support
  if (process.env.ROOTPATH_MONOREPO_SUPPORT) {
    var packagePath = new Error().stack.split('\n')[2].match('/.*kitchenmate/(services|packages)/[^/]*')[0]
    process.env.NODE_PATH = packagePath + ":" + process.env.NODE_PATH
  }

  return require('module')._initPaths();
};