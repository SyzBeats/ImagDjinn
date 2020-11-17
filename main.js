const path = require("path");
const os = require("os");
const { app, BrowserWindow, Menu } = require("electron");
const { ipcMain } = require("electron/main");
const imagemin = require("imagemin");
const slash = require("slash");
const imageminMozjpeg = require("imagemin-mozjpeg");
const { default: imageminPngquant } = require("imagemin-pngquant");
const { shell } = require("electron/common");

// set env
process.env.NODE_ENV = "development";
const isDevelopmentEnv = process.env.NODE_ENV !== "production" ? true : false;

// plattform
const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isLinux = process.platform === "linux";
let mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: "ImagDjinn",
		width: isDevelopmentEnv ? 800 : 500,
		height: 800,
		icon: `${__dirname}\\assets\\Icon_256x256.png`,
		resizable: isDevelopmentEnv,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	mainWindow.loadFile(`${__dirname}\\app\\html\\index.html`);

	if (isDevelopmentEnv) {
		mainWindow.webContents.openDevTools();
	}
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: "About ImagDjinn",
		width: 300,
		height: 300,
		icon: `${__dirname}\\assets\\Icon_256x256.png`,
		resizable: false,
	});

	aboutWindow.loadFile(`${__dirname}\\app\\html\\about.html`);
}

const menu = [
	// spread menu array in the beginning (in case on mac) to show upper menu
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: "About",
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	...(!isMac
		? [
				{
					label: "Help",
					submenu: [
						{
							label: "About",
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: "fileMenu",
	},
	...(isDevelopmentEnv
		? [
				{
					label: "Developer",
					submenu: [
						{ role: "reload" },
						{ role: "forcereload" },
						{ type: "separator" },
						{ role: "toggledevtools" },
					],
				},
		  ]
		: []),
];

/**
 * @description create a window when the electron app is ready
 * to start the process on system. Garbage collection initiated on close
 */
app.on("ready", () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on("closed", () => (mainWindow = null));
});

// hack for mac menus

/**
 * @description On macOS it is common for applications and their menu bar
 * to stay active until the user quits explicitly with Cmd + Q
 */
app.on("window-all-closed", () => {
	if (!isMac) {
		app.quit();
	}
});

/**
 * @description create the main window if there are no existing windows
 */
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

/** IPC MAIN Event */
ipcMain.on("image:minimize", (e, options) => {
	options.dest = path.join(__dirname, "/output");
	reduceImageSize(options);
});

/**
 * @description get the options that where selected in the renderer and build
 * the image based on the passed information
 * @param {object} options destructured options
 */
async function reduceImageSize({ imagePaths, quality, dest }) {
	try {
		// as PNG is [0, 1] range
		const pngQuality = quality / 100;

		for await (let path of imagePaths) {
			imagemin([slash(path)], {
				destination: dest,
				plugins: [
					imageminMozjpeg({ quality }),
					imageminPngquant({
						quality: [pngQuality, pngQuality],
					}),
				],
			});
		}

		// usability improvement to open the target folder
		await shell.openPath(dest);

		// to receive a notification in the renderer, we can emmit this event
		// and catch it in the frontend (renderer)
		await mainWindow.webContents.send("image:done");

		return;
	} catch (error) {
		console.log(error);
		return;
	}
}
