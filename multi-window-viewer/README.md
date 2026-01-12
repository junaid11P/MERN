# Multi-Window Viewer

A powerful web application that allows you to view multiple instances of any URL simultaneously, each with isolated sessions and unique proxy IPs.

## Features

- 🌐 **Multi-Window Display**: View 10, 25, 50, or 100 instances simultaneously
- 🔒 **Session Isolation**: Each window operates independently (incognito-like)
- 🌍 **Proxy Support**: Automatic proxy rotation from GitHub's free proxy list
- 🎭 **Human Simulation**: Mimics real user behavior (mouse movement, scrolling)
- 🎥 **YouTube Optimized**: Auto-play, mute, and ad-skipping
- 📱 **Mobile Friendly**: Responsive design works on all devices
- ⚡ **Staggered Loading**: Human-like loading patterns

## Deployment on Render

### Quick Deploy

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: multi-window-viewer
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (or upgrade for better performance)

3. **Access Your App**:
   - Render will provide a URL like: `https://multi-window-viewer.onrender.com`

## Local Development

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Run web version
npm start

# Run Electron desktop version
npm run electron
```

### Environment Variables

For Render deployment, no environment variables are required. The app uses:
- `PORT`: Automatically set by Render (defaults to 3000 locally)

## Usage

1. **Enter URL**: Type any website URL in the input field
2. **Select Grid Size**: Choose 10, 25, 50, or 100 screens
3. **Enable Proxy** (Optional): Check "Unblock (Proxy)" to use proxy rotation
4. **Launch**: Click "Open Screens"

### YouTube Tips
- The app automatically converts YouTube links to the correct format
- Videos are auto-muted to prevent audio chaos
- Ads are automatically skipped

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Proxy Handling**: Axios with SOCKS/HTTP proxy agents
- **Desktop Version**: Electron (optional)

## Features in Detail

### Proxy Rotation
- Automatically fetches fresh HTTPS proxies from GitHub
- Round-robin assignment to each window
- Auto-retry with new proxy on failure

### Human Behavior Simulation
- Random mouse movements
- Occasional scrolling
- Visibility API spoofing
- Varied user agents

### Session Isolation
- Each iframe operates independently
- No shared cookies or storage
- Simulates multiple real users

## Limitations

- Free proxies may be slow or unreliable
- Some websites block iframe embedding
- YouTube embed restrictions may apply to certain videos
- Mobile devices may struggle with 50+ windows

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
