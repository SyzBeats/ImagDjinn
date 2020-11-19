const { dialog } = require("electron");
const {
  setOutputDirectory,
  getOutputDirectory,
} = require("./functions.storage");

module.exports = {
  /**
   * @description settings will be opened to select the new output path and store it in the
   * app data storage (currently default store)
   */
  openSettingsModal: async (mainWindow) => {
    try {
      const dir = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      const newFilePath = dir.filePaths[0];
      await setOutputDirectory(newFilePath);

      await mainWindow.webContents.send("settings:open", {
        directory: dir.filePaths[0],
      });

      return;
    } catch (error) {
      console.log(error);
    }
  },
};
