const storage = require("electron-json-storage");
const slash = require("slash");
const util = require("util");
//init file path

module.exports = {
  getDefaultPath: () => {
    try {
      const path = storage.getDefaultDataPath();
      return path;
    } catch (error) {
      console.log(error);
    }
  },

  getCurrentPath: () => {
    try {
      const path = storage.getDataPath();
      return path;
    } catch (error) {
      console.log(error);
    }
  },

  setDataPath: (path) => {
    try {
      storage.setDataPath(path);
      return;
    } catch (error) {
      console.log(error);
    }
  },

  setOutputDirectory: async (dir) => {
    const setAsync = util.promisify(storage.set);
    return await setAsync("outDir", { directory: slash(dir) });
  },

  getOutputDirectory: async () => {
    const getAsync = util.promisify(storage.get);
    return await getAsync("outDir");
  },
};
