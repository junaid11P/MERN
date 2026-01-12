document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const launchBtn = document.getElementById('launchBtn');
    const gridContainer = document.getElementById('gridContainer');
    const loader = document.getElementById('loader');

    launchBtn.addEventListener('click', () => {
        let url = urlInput.value.trim();
        const useProxy = document.getElementById('proxyCheck').checked;

        if (!url) return;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        // Youtube Strategy: Use full watch URL to mimic human
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
        let isYoutube = false;
        if (ytMatch && ytMatch[1]) {
            isYoutube = true;
            url = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
        }

        if (!validateURL(url)) {
            alert('Please enter a valid URL');
            return;
        }

        renderGrid(url, isYoutube);
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') launchBtn.click();
    });

    function validateURL(string) {
        try { new URL(string); return true; } catch (_) { return false; }
    }

    async function renderGrid(url, isYoutube) {
        gridContainer.innerHTML = '';
        loader.classList.remove('hidden');
        await new Promise(resolve => setTimeout(resolve, 500));

        const totalFrames = parseInt(document.getElementById('gridSize').value) || 50;

        // Parse Proxies
        let proxies = [];

        // 1. Try to fetch fresh proxies from GitHub Source
        try {
            // User requested specific commit for HTTPS list
            const response = await fetch('https://raw.githubusercontent.com/iplocate/free-proxy-list/a7439879c7ff84ee2a71251d2f2d11b15b159713/protocols/https.txt');
            if (response.ok) {
                const text = await response.text();
                proxies = text.split(/[\n,]+/).map(p => p.trim()).filter(p => p);
                console.log(`Fetched ${proxies.length} proxies from GitHub`);
            } else {
                console.error('GitHub fetch failed:', response.status);
            }
        } catch (e) {
            console.warn('Failed to fetch GitHub proxies, falling back to manual input', e);
        }

        // 2. Fallback or Append Manual Input
        const proxyText = document.getElementById('proxyList').value.trim();
        const manualProxies = proxyText ? proxyText.split(/[\n,]+/).map(p => p.trim()).filter(p => p) : [];

        // If GitHub fetch failed or returned empty, use manual. 
        // Or you could concat them: proxies = [...proxies, ...manualProxies];
        if (proxies.length === 0) {
            proxies = manualProxies;
        }

        loader.classList.add('hidden');

        for (let i = 0; i < totalFrames; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-wrapper';
            wrapper.style.animation = 'fadeInUp 0.5s ease-out backwards';

            // --- 1. ELECTRON MODE (Webview) ---
            if (window.electronAPI) {
                const webview = document.createElement('webview');
                const partitionId = `persist:view_${Date.now()}_${i}`;
                webview.partition = partitionId;
                webview.src = url;
                webview.style.width = '100%';
                webview.style.height = '100%';
                webview.style.border = 'none';

                // Assign Proxy via IPC
                if (proxies.length > 0) {
                    const proxy = proxies[i % proxies.length];
                    await window.electronAPI.setProxy(partitionId, proxy);
                }

                if (isYoutube) {
                    // Random User Agent
                    const userAgents = [
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0",
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    ];
                    webview.useragent = userAgents[Math.floor(Math.random() * userAgents.length)];

                    // Injection Script (Advanced Human Behavior)
                    const script = `
                        console.log('Advanced Human Automation Started');
                        
                        // 1. Visibility & Focus Spoofing
                        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
                        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
                        window.dispatchEvent(new Event('focus'));

                        // 2. Playback Control Loop
                        setInterval(() => {
                            const v = document.querySelector('video');
                            if(v) { 
                                if(!v.muted) v.muted=true; 
                                if(v.paused) v.play().catch(e=>{}); 
                                if(v.ended) v.play();
                            }
                            // Ad Skipping
                            const skip = document.querySelector('.ytp-ad-skip-button') || document.querySelector('.ytp-skip-ad-button');
                            if(skip) { skip.click(); console.log('Ad Skipped'); }
                            const overlay = document.querySelector('.ytp-ad-overlay-close-button'); 
                            if(overlay) overlay.click();
                        }, 1000);

                        // 3. Human Interaction Simulation (Mouse & Scroll)
                        // Bots sit still. Humans fidget.
                        setInterval(() => {
                            // Random Mouse Movement
                            const x = Math.random() * window.innerWidth;
                            const y = Math.random() * window.innerHeight;
                            const event = new MouseEvent('mousemove', {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                clientX: x,
                                clientY: y
                            });
                            document.dispatchEvent(event);
                            
                            // Random Scrolling (Look at comments, look back at video)
                            const scrollChance = Math.random();
                            if (scrollChance > 0.9) {
                                // 10% chance to scroll down slightly
                                window.scrollBy({ top: 100, behavior: 'smooth' });
                                setTimeout(() => window.scrollBy({ top: -100, behavior: 'smooth' }), 2000);
                            }
                        }, 3000);
                    `;

                    webview.addEventListener('dom-ready', () => {
                        webview.setAudioMuted(true);
                        webview.executeJavaScript(script);
                    });

                    // --- PROXY RETRY LOGIC ---
                    // Free proxies fail often. If one fails, try another!
                    // Error codes: -100 to -200 are typically connection issues.
                    webview.addEventListener('did-fail-load', async (e) => {
                        console.warn(`Proxy failed for Window ${i} (Code: ${e.errorCode}). Retrying...`);

                        // Wait 2 seconds to avoid rapid looping
                        await new Promise(r => setTimeout(r, 2000));

                        // Pick new proxy
                        if (proxies.length > 0) {
                            const newProxy = proxies[Math.floor(Math.random() * proxies.length)];
                            await window.electronAPI.setProxy(partitionId, newProxy);
                            webview.reload();
                        }
                    });

                }
                wrapper.appendChild(webview);
            }
            // --- 2. WEB BROWSER MODE (Iframe Fallback) ---
            else {
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';

                let proxyIP = '';
                if (proxies.length > 0) {
                    proxyIP = proxies[i % proxies.length];
                }

                // Route through backend proxy which now handles 'proxy' param
                const target = encodeURIComponent(url);
                iframe.src = `http://localhost:3000/proxy?url=${target}&proxy=${encodeURIComponent(proxyIP)}`;

                wrapper.appendChild(iframe);
            }

            gridContainer.appendChild(wrapper);

            // Staggered Loading
            const delay = Math.floor(Math.random() * 600) + 200;
            await new Promise(resolve => setTimeout(resolve, delay));

            if (i % 5 === 0) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }
    }
});
