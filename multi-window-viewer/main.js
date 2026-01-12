const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// ... (Server code remains same approx) ... 
// We will just replace the top imports and the bottom window creation logic
// To avoid replacing the huge server block, I will focus on the IPC and Window parts
// But wait, the tool requires contiguous block. I'll stick to the window/ipc parts.

// --- 1. Internal Backend Server ---
const serverApp = express();
const PORT = 3000;

serverApp.use(cors());
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100, message: 'Too many requests' });
serverApp.use('/proxy', limiter);
serverApp.use(express.static(path.join(__dirname, 'frontend')));

serverApp.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend/index.html')));

// Proxy endpoint (Legacy fallback)
serverApp.get('/proxy', async (req, res) => {
    // ... (Existing proxy logic) ...
    let { url } = req.query;
    if (!url) return res.status(400).send('URL is required');
    try {
        if (!url.startsWith('http')) url = 'https://' + url;
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
            validateStatus: () => true
        });
        const contentType = response.headers['content-type'] || 'text/html';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');
        res.send(response.data);
    } catch (e) { res.status(500).send(e.message); }
});

let serverInstance;
function startServer() {
    return new Promise((resolve) => {
        serverInstance = serverApp.listen(PORT, () => {
            console.log(`Internal server running on http://localhost:${PORT}`);
            resolve();
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, assuming external server is running.`);
                resolve();
            } else { console.error(err); }
        });
    });
}

// --- 2. Disable Background Throttling ---
// Crucial for running 50+ videos simultaneously
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// --- IPC Handler for Proxies ---
// --- IPC Handler for Proxies ---
ipcMain.handle('set-proxy', async (event, partition, proxyRule) => {
    const ses = session.fromPartition(partition);

    // Removed manual header spoofing.
    // We are switching to full-page navigation which works best with default headers.

    if (proxyRule) {
        await ses.setProxy({ proxyRules: proxyRule });
        console.log(`Set proxy for ${partition}: ${proxyRule}`);
    } else {
        await ses.setProxy({});
    }
    return true;
});

// --- 2. Electron Window ---
function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        title: "Multi-Window Viewer",
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true, // Auto-enable webview tag
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadURL(`http://localhost:${PORT}`);
}

app.whenReady().then(async () => {
    await startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
    // Close server when app closes
    if (serverInstance) serverInstance.close();
});
