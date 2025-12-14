package automation

import (
	"errors"
	"strings"
	"time"

	"github.com/go-rod/rod/lib/proto"
	"github.com/junaid11P/MERN/linkedin-automation/internal/browser"
	"github.com/junaid11P/MERN/linkedin-automation/internal/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/config"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

type Bot struct {
	Browser *browser.Browser
	Config  *config.Config
}

func New(b *browser.Browser, cfg *config.Config) *Bot {
	return &Bot{
		Browser: b,
		Config:  cfg,
	}
}

// Login performs the login flow
func (b *Bot) Login() error {
	page := b.Browser.Page
	logger.Info("Navigating to LinkedIn Login...")

	page.MustNavigate("https://www.linkedin.com/login")
	page.MustWaitLoad()

	// Check if already logged in (look for feed or profile icon)
	// If cookies worked, we might be redirected to feed
	if strings.Contains(page.MustInfo().URL, "feed") {
		logger.Info("Already logged in (Session persisted).")
		return nil
	}

	// Find Username field
	logger.Debug("Typing username...")
	usernameEl, err := page.Element("#username")
	if err != nil {
		// Possibly different login page layout
		return errors.New("username field not found")
	}

	// Human-like typing
	stealth.TypeWithMistakes(usernameEl, b.Config.LinkedInEmail)
	stealth.RandomSleep(500*time.Millisecond, 1000*time.Millisecond)

	// Find Password field
	logger.Debug("Typing password...")
	passwordEl := page.MustElement("#password")
	stealth.TypeWithMistakes(passwordEl, b.Config.LinkedInPassword)
	stealth.RandomSleep(500*time.Millisecond, 1500*time.Millisecond)

	// Click Sign In with mouse
	signInBtn := page.MustElement("button[type=submit]")

	// Get element center for mouse move
	// We'll use our stealth move
	box := signInBtn.MustShape().Box()
	centerX, centerY := box.X+box.Width/2, box.Y+box.Height/2

	stealth.MoveMouseSmoothly(page, centerX, centerY)
	stealth.RandomSleep(200*time.Millisecond, 500*time.Millisecond)
	page.Mouse.MustClick(proto.InputMouseButtonLeft)

	// Construct generic Wait
	logger.Info("Waiting for navigation...")
	page.MustWaitLoad()
	stealth.RandomSleep(2*time.Second, 5*time.Second)

	// Detect 2FA or Captcha
	if strings.Contains(page.MustInfo().URL, "challenge") || strings.Contains(page.MustInfo().URL, "checkpoint") {
		logger.Warn("Security Checkpoint detected (2FA/Captcha). Please solve it manually in the browser window.")
		logger.Info("Waiting 60 seconds for manual intervention...")
		time.Sleep(60 * time.Second)
	}

	// Verify success
	if strings.Contains(page.MustInfo().URL, "feed") || strings.Contains(page.MustElement("title").MustText(), "Feed") {
		logger.Info("Login Successful!")
		return nil
	}

	// Check for errors
	if errEl, err := page.Element(".error-password"); err == nil {
		return errors.New("login failed: " + errEl.MustText())
	}

	return nil
}
