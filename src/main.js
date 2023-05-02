const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const isMac = process.platform === 'darwin';
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1250 : 950,
    height: 670,
    icon: path.join(__dirname, 'assets', 'domino-icon.png'),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      ...(isDev ? [{ role: 'toggleDevTools' }] : []),
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('solution:save', (e, board) => {
  console.log('invoked');
  saveFile(board);
});

function formatOutput(board) {
  let text = '';
  board.forEach((row) => {
    text = text.concat(`${row.toString()}\n`);
  });
  console.log(text);
  return text;
}

function getTime() {
  let date = new Date();
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T').join('_');
}

async function saveFile(board) {
  fs.writeFile(
    path.join(__dirname, '..', 'savedSolutions', `${getTime()}.txt`),
    formatOutput(board),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
