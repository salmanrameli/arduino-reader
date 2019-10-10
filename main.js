const {app, BrowserWindow, Menu, dialog} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const ipcMain = require('electron').ipcMain

const Store = require('electron-store');
const store = new Store();

let mainWindow

function stringToBool(val) {
  return (val + '').toLowerCase() === 'true';
}

function initWindow() {
  let winWidth = 1024
  let winHeight = 768
  let windowIsResizable
  let windowHasFrame = true

  if(store.get('winWidth') !== undefined && store.get('winHeight') !== undefined) {
    winWidth = store.get('winWidth')
    winHeight = store.get('winHeight')
  }

  if(store.get('windowIsResizable') === undefined) {
    windowIsResizable = true
  } else {
    windowIsResizable = store.get('windowIsResizable')
  }

  if(store.get('windowHasFrame') !== undefined) {
    windowHasFrame = store.get('windowHasFrame')
  }

  createWindow(winWidth, winHeight, windowIsResizable, windowHasFrame)
}

function createWindow (winWidth, winHeight, windowIsResizable, windowHasFrame) {
  mainWindow = new BrowserWindow({
    width: parseInt(winWidth, 10),
    height: parseInt(winHeight, 10),
    resizable: stringToBool(windowIsResizable),
    titleBarStyle: stringToBool(windowHasFrame) ? "default" : "hidden",
    webPreferences: {
      nodeIntegration: false,
      preload: path.resolve(`${__dirname}/public/renderer.js`),
    },
    icon: path.resolve(`${__dirname}/../assets/icon.png`)
  })

  mainWindow.center()

  mainWindow.loadURL(
		isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '/build/index.html')}`
	)

  const menu = Menu.buildFromTemplate(menubar)
  Menu.setApplicationMenu(menu)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', initWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) initWindow()
})

ipcMain.on('connection-error', (event, arg) => {
  let errorMessage = `${arg} has been disconnected due to timeout error`
  
	dialog.showErrorBox("Connection Error", errorMessage)
})

let menubar = [
  ...(process.platform === 'darwin' ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { label: 'Preferences', click() { mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`) } },  
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      { label: 'View Youtube', click() { mainWindow.loadURL("https://www.youtube.com") } },
      { type: 'separator' },
      ...(process.platform === 'darwin' ? [] : [
        { label: 'Preferences', click() { mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`) } },  
        { type: 'separator' },
      ]),
      process.platform === 'darwin' ? 
      { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(process.platform === 'darwin' ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(process.platform === 'darwin' ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
  }
]