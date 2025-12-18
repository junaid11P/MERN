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
	// If not found, try "More" -> "Connect"
	if connectBtn == nil {
		logger.Warn("Connect button not found directly. Checking 'More' menu...")

		// Look for the "More actions" button.
		// Common selectors: button[aria-label^='More actions'], or text "More"
		moreBtn, err := page.Element("button[aria-label^='More actions']")
		if err != nil {
			// Try finding by text if aria-label fails
			moreElements := page.MustElements("button")
			for _, btn := range moreElements {
				if txt, _ := btn.Text(); txt == "More" {
					moreBtn = btn
					break
				}
			}
		}

		if moreBtn != nil {
			// Click "More"
			logger.Info("Clicking 'More' button...")
			stealth.RandomSleep(500*time.Millisecond, 1*time.Second)
			moreBtn.MustClick()
			stealth.RandomSleep(1*time.Second, 2*time.Second)

			// Now look for "Connect" in the dropdown items
			// Dropdown items are often div[role='button'] or similar.
			// We search all elements containing text "Connect" that are visible.

			// Get all elements with text "Connect"
			if options, err := page.ElementsX("//span[text()='Connect'] | //div[text()='Connect']"); err == nil {
				for _, opt := range options {
					if opt.MustVisible() {
						// Usually the clickable part is a parent div/button
						// We can try clicking the element itself or its parent
						connectBtn = opt
						logger.Info("Found Connect option in dropdown")
						break
					}
				}
			} else {
				// Fallback to searching all buttons/divs again if xpath fails or yields nothing useful
				// This is a bit broader
			}
		}

		if connectBtn == nil {
			logger.Error("Connect button not found even after checking 'More' menu.")
			return nil
		}
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
