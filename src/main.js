const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: false,
    frame: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    opacity: 0.97,
    title: "UniPeek",
    // useContentSize: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // nodeIntegration: true
    },
    backgroundColor: "#eee9e7",
    // 238 233 231
    type: "panel",
    vibrancy: "appearance-based"
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// right way
let tray = null
app.whenReady().then(() => {
  // createWindow();
  app.dock.hide();

  let imagesPath = app.isPackaged ? path.join(process.resourcesPath, "images") : "images";

  let icon = nativeImage.createFromPath(path.join(imagesPath, '/iconTemplate.png'));
  icon = icon.resize({ width: 16 });
  icon.setTemplateImage(true);
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open/Hide',
      type: 'normal',
      click: function () {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        } else {
          BrowserWindow.getAllWindows()[0].close();

        }
      }
    },
  ]);
  tray.setToolTip('UniPeek -- a Unicode character inspector');
  tray.setContextMenu(contextMenu);

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// const {ipcMain} = require('electron')
// ipcMain.on('resize-me-please', (event, w, h) => {
//   let browserWindow = BrowserWindow.fromWebContents(event.sender)
//   browserWindow.setSize(w,h)
// })