const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const isMac = process.platform === 'darwin';
const isDev = require('electron-is-dev');
// const isDev = true;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1250 : 950,
    height: 760,
    icon: path.join(__dirname, '..', 'assets', 'domino-icon.png'),
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
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
  // { role: 'viewMenu' },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      ...(isDev ? [{ role: 'toggleDevTools' }] : []),
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
      },
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

ipcMain.handle('board:get', (e, filename) => getBoard(filename));

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
    `/Users/geofarl/Documents/Курсова/domino_game/savedSolutions/${getTime()}.txt`,
    formatOutput(board),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

async function getBoard(filename) {
  // 2023-06-02_10:40:31.529Z.txt
  // 2023-06-02_16:30:35.311Z.txt
  // 2023-06-02_16:30:50.126Z.txt
  // 2023-06-02_16:33:22.151Z.txt
  try {
    const fileStream = fs.createReadStream(
      `/Users/geofarl/Documents/Курсова/domino_game/savedSolutions/${filename}`
    );
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const board = [];
    for await (const line of rl) {
      const result = line.split(',').map((val) => {
        if (!Number.isNaN(parseInt(val.trim(), 10))) {
          return parseInt(val.trim(), 10);
        }
        return val.trim().slice(1, -1);
      });
      board.push(result);
    }
    return board;
  } catch (err) {
    return 'Cannot open this file';
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
