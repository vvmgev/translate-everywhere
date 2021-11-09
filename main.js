// Modules to control application life and create native browser window
const {app, BrowserWindow, screen, globalShortcut, Tray, Menu, ipcMain} = require('electron')
const path = require('path')
const { readText } = require('./Clipboard');
const { hideShowShortcut, escapeShortcut, translateRu, translateHy } = require('./constats')
const { initTranslation } = require('./translation');
function createWindow () {
  // Create the browser window.
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const width = Math.round(screenWidth - screenWidth * 20 / 100);
  const height =  Math.round(screenHeight - screenHeight * 20 / 100);
  const mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    frame: false,
    resizable: true,
  })

  mainWindow.on('resize', function () {
    var size   = mainWindow.getSize();
    var width  = size[0];
    var height = size[1];
});


    const addTranslation = initTranslation();
    const russianTl = addTranslation(translateRu, 
        { x: 0, y: 0, width, height: Math.round(height / 2)},
        {
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }
    )
    const armenianTl = addTranslation(translateHy, 
        { x: 0, y: Math.round(height / 2), width: width - 0, height: Math.round(height / 2)},
        {
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        }
    )
    russianTl.view.setAutoResize({width: true, height: true, horizontal: true, vertical: true});
    armenianTl.view.setAutoResize({width: true, height: true, horizontal: true, vertical: true});
    mainWindow.addBrowserView(russianTl.view);
    mainWindow.addBrowserView(armenianTl.view);
    
    ipcMain.on("input", (event, args) => {
      russianTl.view.webContents.send('translate', args);
      armenianTl.view.webContents.send('translate', args);
    });

  // and load the index.html of the app.
  // mainWindow.loadURL("https://translate.google.com/?sl=auto&tl=ru&op=translate");

  // Open the DevTools.
  // russianTl.view.webContents.openDevTools();

  const showWindow = () => {
    mainWindow.show();
    mainWindow.focus();
    globalShortcut.register(escapeShortcut, () => {
      if(mainWindow.isVisible()) mainWindow.hide();
      globalShortcut.unregister(escapeShortcut);
    });
  };

  globalShortcut.register(hideShowShortcut, () => {
      russianTl.view.webContents.send('translate', readText());
      armenianTl.view.webContents.send('translate', readText());
    showWindow();
  });

  mainWindow.on('blur', () => {
    mainWindow.hide();
    globalShortcut.unregister(escapeShortcut);
  });
}


const createTray = () => {
    let tray = null
    app.whenReady().then(() => {
      tray = new Tray(path.resolve(__dirname, './translate.png'))
      const contextMenu = Menu.buildFromTemplate([
        { label: 'exit', type: 'normal', click: () => {appQuit()} },
      ])
      tray.setToolTip('Translate everywhere');
      tray.setContextMenu(contextMenu)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })



})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') appQuit()
})

const appQuit = () => {
  app.quit();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
