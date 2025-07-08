const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {

  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  runCommand: (id, cmd, args) => {
    console.log('runCommand called with:', id, cmd, args);
    return ipcRenderer.invoke('run-command', id, cmd, args);
  },
  stopCommand: (id) => {
    console.log("stopCommand id ==> ", id);
    return ipcRenderer.invoke('stop-command', id);
  },
  onOutput: (id, callback) => {
    console.log("remove listeners for", id);
    ipcRenderer.removeAllListeners(`command-output-${id}`);

    const beforeCount = ipcRenderer.listenerCount(`command-output-${id}`);
    console.log("Listener count before adding new:", beforeCount);

    ipcRenderer.on(`command-output-${id}`, (_, data) => callback(data));

    const afterCount = ipcRenderer.listenerCount(`command-output-${id}`);
    console.log("Listener count after adding new:", afterCount);
  },

  onError: (id, callback) => {
    ipcRenderer.removeAllListeners(`command-error-${id}`);
    ipcRenderer.on(`command-error-${id}`, (_, data) => callback(data));
  },

  writeFile: (filePath, content) => {
    return ipcRenderer.invoke('write-file', filePath, content);
  },
  clearLogs: (filePath, content) => {
    return ipcRenderer.invoke('clear-logs', filePath, content);
  },
  writeStdin: (id, message) => {
    return ipcRenderer.invoke('write-stdin', id, message);
  },
  removeAllOutput: (id) => ipcRenderer.removeAllListeners(`command-output-${id}`),
  removeAllError: (id) => ipcRenderer.removeAllListeners(`command-error-${id}`)

});
