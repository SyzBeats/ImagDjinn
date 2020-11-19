const storage = require("electron-json-storage");
const slash = require("slash");
const util = require("util");
//init file path

module.exports = {
  /**
   * @description get the default path where settings are stored
   */
  getDefaultPath: () => {
    try {
      const path = storage.getDefaultDataPath();
      return path;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * @description get the current path that is set as data store
   */
  getCurrentPath: () => {
    try {
      const path = storage.getDataPath();
      return path;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * @description set the data store by system path
   * @param {string} path
   */
  setDataPath: (path) => {
    try {
      storage.setDataPath(slash(path));
      return;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * @description: set the new output directory for images
   * @param {string} dir
   */
  setOutputDirectory: async (dir) => {
    const setAsync = util.promisify(storage.set);
    return await setAsync("outDir", { directory: slash(dir) });
  },

  /**
   * @description get the current output directory that receives the
   * reduced images
   */
  getOutputDirectory: async () => {
    const getAsync = util.promisify(storage.get);
    return await getAsync("outDir");
  },
};
