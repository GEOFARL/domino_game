const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dominoAPI', {
  saveSolution: (board) => {
    console.log('sent');
    ipcRenderer.send('solution:save', board);
  },
});
