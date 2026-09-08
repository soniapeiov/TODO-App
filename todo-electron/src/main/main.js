const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');
const db = require('../../database');

function createWindow() {
  const win = new BrowserWindow({
  width: 400,
  height: 700,
  webPreferences: {
    preload: join(__dirname, '../preload/preload.js'),
    nodeIntegration: false,
    contextIsolation: true
  }
});
  win.loadFile(join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(async () => {
  await db.initDatabase(app.getPath('userData'));

  ipcMain.handle('get-items', () => db.getItems());
  ipcMain.handle('save-item', (event, item) => db.saveItem(item, app.getPath('userData')));
  ipcMain.handle('delete-item', (event, id) => db.deleteItem(id, app.getPath('userData')));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});