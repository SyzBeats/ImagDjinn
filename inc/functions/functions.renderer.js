const { ipcRenderer } = require("electron");

module.exports = {
  setOutputPath: async (path) => {
    ipcRenderer.send("set:ouputPath", { path });
    return;
  },
};
