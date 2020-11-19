const { dialog } = require("electron");
const {
  setOutputDirectory,
  getOutputDirectory,
} = require("./functions.storage");

module.exports = {
  openSettingsModal: async (mainWindow) => {
    try {
      const dir = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      const newFilePath = dir.filePaths[0];
      await setOutputDirectory(newFilePath);
      // set new path in system to persist data

      await mainWindow.webContents.send("settings:open", {
        directory: dir.filePaths[0],
      });

      return;
    } catch (error) {
      console.log(error);
    }
  },
};
