const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  runCommand: (cmd, args) => {
    console.log('runCommand called with:', cmd, args);
    return ipcRenderer.invoke('run-command', cmd, args);
  },
  onOutput: (callback) => ipcRenderer.on('command-output', (_, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('command-error', (_, data) => callback(data)),
  writeFile: (filePath, content) => {
    return ipcRenderer.invoke('write-file', filePath, content);
  },
});
