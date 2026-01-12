const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setProxy: (partition, proxyRule) => ipcRenderer.invoke('set-proxy', partition, proxyRule)
});
