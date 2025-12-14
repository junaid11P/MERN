package browser

import (
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/go-rod/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/config"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

type Browser struct {
	RodBrowser *rod.Browser
	Page       *rod.Page
	Config     *config.Config
}

func New(cfg *config.Config) *Browser {
	// Configure Launcher (Path, Headless, UserData)
	l := launcher.New().
		Headless(cfg.HeadlessMode).
		UserDataDir(cfg.UserDataDir) // Persist cookies/session

	if !cfg.HeadlessMode {
		l = l.Devtools(true) // Open DevTools in headful mode for debugging
	}

	url, err := l.Launch()
	if err != nil {
		logger.Fatal("Failed to launch browser:", err)
	}

	// Create Browser instance
	b := rod.New().ControlURL(url).MustConnect()
	b.SlowMotion(cfg.SlowMotion) // Human-like delay between actions

	// Create Page with Stealth
	// stealth.JS provides standard concealment scripts
	page := b.MustPage()

	// Apply comprehensive stealth
	page.MustEvalOnNewDocument(stealth.JS)

	// Randomize User Agent
	ua := "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	page.MustSetUserAgent(&proto.NetworkSetUserAgentOverride{
		UserAgent:      ua,
		AcceptLanguage: "en-US,en;q=0.9",
	})

	// Set Viewport to random common usage
	page.MustSetViewport(1440, 900, 1.0, false)

	logger.Info("Browser initialized with Stealth Mode")

	return &Browser{
		RodBrowser: b,
		Page:       page,
		Config:     cfg,
	}
}

func (b *Browser) Close() {
	b.RodBrowser.MustClose()
}
