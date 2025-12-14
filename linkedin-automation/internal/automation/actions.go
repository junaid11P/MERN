package automation

import (
	"time"

	"github.com/go-rod/rod"
	"github.com/junaid11P/MERN/linkedin-automation/internal/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// ConnectWithNote navigates to a profile and sends a connection request with a note
func (b *Bot) ConnectWithNote(profileUrl string, note string) error {
	page := b.Browser.Page

	logger.Infof("Visiting profile: %s", profileUrl)
	page.MustNavigate(profileUrl)
	page.MustWaitLoad()
	stealth.RandomSleep(3*time.Second, 5*time.Second)
	stealth.ScrollHuman(page) // Look like we are reading the profile

	// Find the "Connect" button. It might be in the "More" dropdown.
	// 1. Try primary buttons
	buttons := page.MustElements("button")
	var connectBtn *rod.Element

	for _, btn := range buttons {
		if txt, _ := btn.Text(); txt == "Connect" {
			connectBtn = btn
			break
		}
	}

	// If not found, try "More" -> "Connect"
	// (Simplified logic for PoC)
	if connectBtn == nil {
		logger.Warn("Connect button not found directly. Checking 'More' menu...")
		// Assuming we might need to click "More"
		// This is complex as selectors vary dynamically.
		// For PoC, we return if direct connect isn't found to avoid breaking.
		return nil
	}

	logger.Info("Clicking Connect...")
	box := connectBtn.MustShape().Box()
	centerX := box.X + box.Width/2
	centerY := box.Y + box.Height/2
	stealth.MoveMouseSmoothly(page, centerX, centerY)
	connectBtn.MustClick()
	stealth.RandomSleep(1*time.Second, 2*time.Second)

	// Modal opens: "Add a note" or "Send"
	// Look for "Add a note"
	if addNoteBtn, err := page.Element("button[aria-label='Add a note']"); err == nil {
		logger.Info("Adding note...")
		addNoteBtn.MustClick()
		stealth.RandomSleep(500*time.Millisecond, 1*time.Second)

		// Type Message
		textArea := page.MustElement("textarea")
		stealth.TypeWithMistakes(textArea, note)
		stealth.RandomSleep(1*time.Second, 2*time.Second)

		// Send
		if sendBtn, err := page.Element("button[aria-label='Send now']"); err == nil {
			sBox := sendBtn.MustShape().Box()
			sCenterX := sBox.X + sBox.Width/2
			sCenterY := sBox.Y + sBox.Height/2
			stealth.MoveMouseSmoothly(page, sCenterX, sCenterY)
			sendBtn.MustClick()
			logger.Info("Connection Request Sent!")
		}
	} else {
		// Just send without note if button is "Send" or "Connect"
		// Logic depends on popup state
		// ...
	}

	// Daily Limit Check would trigger error here if exceeded (implemented in caller or wrapper)

	return nil
}
