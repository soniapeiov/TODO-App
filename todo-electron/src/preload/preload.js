const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getItems:   ()       => ipcRenderer.invoke('get-items'),
  saveItem:   (item)   => ipcRenderer.invoke('save-item', item),
  deleteItem: (id)     => ipcRenderer.invoke('delete-item', id)
});