/**
 * @description handlers and events for submitting data and events from renderer
 * to the main process.
 * @author Simeon Zimmermann
 * @version 1.0
 */

const path = require("path");
const { ipcRenderer } = require("electron");

/** @type {HTMLFormElement} */
const form = document.querySelector("#image-form");

/** @type {HTMLElement} */
const slider = document.querySelector("#slider");

/** @type {HTMLElement} */
const image = document.querySelector("#img");

document.querySelector("#output-path").innerText = path.join(
  __dirname,
  "../../output",
);

/**
 * @description:
 */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  /** @type {string[]} */
  const imagePaths = Object.values(image.files).map((key) => key.path);

  const quality = slider.value;

  ipcRenderer.send("image:minimize", { imagePaths, quality });
});

// get message from webContents to indicate that the rendering is finished
ipcRenderer.on("image:done", () => {
  M.toast({
    html: `Image resized to ${slider.value}% quality`,
  });
});
