// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, Tray} = require('electron')
const { readText } = require('./Clipboard');
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL("https://translate.google.com");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  const showWindow = () => {
    mainWindow.show();
    mainWindow.focus();
  };

  const registerListener = () => {
    const hideShowShortcut = 'CommandOrControl+L';
    globalShortcut.register(hideShowShortcut, () => {
      mainWindow.webContents.send('translate', readText());
      showWindow();
    });
  
    const escapeShortcut = 'Escape';
    globalShortcut.register(escapeShortcut, () => {
      if(mainWindow.isVisible()) mainWindow.hide();
    });
  
    mainWindow.on('blur', () => {
      mainWindow.hide();
    });
  };

  registerListener();

}


const createTray = () => {
    let tray = null
    app.whenReady().then(() => {
      tray = new Tray('./translate.png')
      tray.setToolTip('Translate everywhere')
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  createTray();

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
