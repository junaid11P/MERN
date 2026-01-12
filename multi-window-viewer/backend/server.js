const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500, // Increased for web deployment
    message: 'Too many requests'
});
app.use('/proxy', limiter);

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Proxy Endpoint
app.get('/proxy', async (req, res) => {
    let { url, proxy } = req.query;

    if (!url) return res.status(400).send('URL is required');

    try {
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        // Configure Axios Options
        const axiosOptions = {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            validateStatus: () => true,
            timeout: 10000 // 10 second timeout
        };

        // Apply Proxy if provided
        if (proxy) {
            try {
                // Determine Agent based on protocol
                if (proxy.startsWith('socks')) {
                    // SOCKS5/4
                    const agent = new SocksProxyAgent(proxy);
                    axiosOptions.httpAgent = agent;
                    axiosOptions.httpsAgent = agent;
                    console.log(`Using SOCKS Proxy: ${proxy}`);
                } else {
                    // HTTP/HTTPS
                    let proxyUrl = proxy;
                    if (!proxyUrl.startsWith('http')) proxyUrl = 'http://' + proxyUrl;

                    const agent = new HttpsProxyAgent(proxyUrl);
                    axiosOptions.httpAgent = agent;
                    axiosOptions.proxy = false;
                    console.log(`Using HTTP Proxy: ${proxyUrl}`);
                }
            } catch (err) {
                console.warn('Invalid Proxy structure, skipping:', proxy, err.message);
            }
        }

        const response = await axios.get(url, axiosOptions);

        // Set Headers
        const contentType = response.headers['content-type'] || 'text/html';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.removeHeader('X-Frame-Options');
        res.removeHeader('Content-Security-Policy');

        let data = response.data;

        // If it's HTML, inject <base> tag AND Automation Script
        if (contentType.includes('text/html')) {
            let html = data.toString('utf-8');
            const baseTag = `<base href="${url}" target="_blank">`;
            // Automation Script for Iframe/Web Mode
            const automationScript = `
             <script>
             (function() {
                 console.log('Backend Injected Automation Started');
                 Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
                 Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
                 setInterval(() => {
                     const v = document.querySelector('video');
                     if(v) { 
                         if(!v.muted) v.muted=true; 
                         if(v.paused) v.play().catch(e=>{}); 
                         if(v.ended) v.play();
                     }
                     const skip = document.querySelector('.ytp-ad-skip-button') || document.querySelector('.ytp-skip-ad-button');
                     if(skip) skip.click();
                     const overlay = document.querySelector('.ytp-ad-overlay-close-button'); 
                     if(overlay) overlay.click();
                 }, 1000);
             })();
             </script>
         `;

            if (html.includes('<head>')) {
                html = html.replace('<head>', `<head>${baseTag}`);
            } else if (html.includes('<html>')) {
                html = html.replace('<html>', `<html><head>${baseTag}</head>`);
            } else {
                html = baseTag + html;
            }

            if (html.includes('</body>')) {
                html = html.replace('</body>', `${automationScript}</body>`);
            } else {
                html += automationScript;
            }

            res.send(html);
        } else {
            res.send(data);
        }

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).send(`Error fetching content: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
