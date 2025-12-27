package automation

import (
	"math/rand/v2"
	"strings"
	"time"

	"github.com/go-rod/rod"
	"github.com/junaid11P/MERN/linkedin-automation/internal/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// ConnectWithNote navigates to a profile and sends a connection request with a note
func (b *Bot) ConnectWithNote(profileUrl string, note string) error {
	page := b.Browser.Page

	// Stealth Check: Business Hours
	if !stealth.IsBusinessHours(b.Config.BypassScheduler) {
		return nil
	}

	// Rate Limit Check
	if b.Storage.GetDailyActionCount("request") >= b.Config.RateLimits.MaxConnectsPerDay {
		logger.Warn("Daily connection request limit reached. Skipping.")
		return nil
	}

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
		txt, _ := btn.Text()
		trimmed := strings.TrimSpace(strings.ToLower(txt))
		if trimmed == "connect" || trimmed == "follow" { // LinkedIn sometimes uses "Follow" for influencers/non-connections
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
				txt, _ := btn.Text()
				trimmed := strings.TrimSpace(strings.ToLower(txt))
				if trimmed == "more" || trimmed == "more actions" {
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

			// Get all elements with text "Connect" (case-insensitive via xpath)
			if options, err := page.ElementsX("//span[translate(text(), 'CONNECT', 'connect')='connect'] | //div[translate(text(), 'CONNECT', 'connect')='connect']"); err == nil {
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
	// Add random offset within the button (e.g., center +/- 10%)
	offsetX := (rand.Float64() - 0.5) * box.Width * 0.2
	offsetY := (rand.Float64() - 0.5) * box.Height * 0.2
	centerX := box.X + box.Width/2 + offsetX
	centerY := box.Y + box.Height/2 + offsetY
	stealth.MoveMouseSmoothly(page, centerX, centerY)
	connectBtn.MustClick()
	stealth.RandomSleep(1*time.Second, 2*time.Second)

	// Modal opens: "Add a note" or "Send"
	// Look for "Add a note" - sometimes it's by aria-label, sometimes by text
	var addNoteBtn *rod.Element
	if btn, err := page.Element("button[aria-label='Add a note']"); err == nil {
		addNoteBtn = btn
	} else {
		// Try finding by text
		btns := page.MustElements("button")
		for _, b := range btns {
			txt, _ := b.Text()
			if strings.Contains(strings.ToLower(txt), "add a note") {
				addNoteBtn = b
				break
			}
		}
	}

	if addNoteBtn != nil {
		logger.Info("Adding note...")
		addNoteBtn.MustClick()
		stealth.RandomSleep(500*time.Millisecond, 1*time.Second)

		// Type Message
		textArea := page.MustElement("textarea")

		// Truncate note if it exceeds LinkedIn's 300 character limit
		finalNote := note
		if len(finalNote) > 300 {
			logger.Warnf("Note too long (%d chars). Truncating to 300.", len(finalNote))
			finalNote = finalNote[:300]
		}

		stealth.TypeWithMistakes(textArea, finalNote)
		stealth.RandomSleep(1*time.Second, 2*time.Second)

		// Send
		var sendBtn *rod.Element
		if btn, err := page.Element("button[aria-label='Send now']"); err == nil {
			sendBtn = btn
		} else if btn, err := page.Element("button[aria-label='Send']"); err == nil {
			sendBtn = btn
		}

		if sendBtn != nil {
			sBox := sendBtn.MustShape().Box()
			// Random offset for send button too
			sOffsetX := (rand.Float64() - 0.5) * sBox.Width * 0.2
			sOffsetY := (rand.Float64() - 0.5) * sBox.Height * 0.2
			sCenterX := sBox.X + sBox.Width/2 + sOffsetX
			sCenterY := sBox.Y + sBox.Height/2 + sOffsetY
			stealth.MoveMouseSmoothly(page, sCenterX, sCenterY)
			sendBtn.MustClick()
			logger.Info("Connection Request Sent!")
			b.Storage.RecordSentRequest(profileUrl)
		}
	} else {
		// Just send without note if button is "Send" or "Connect"
		// Logic depends on popup state
		// ...
	}

	// Daily Limit Check would trigger error here if exceeded (implemented in caller or wrapper)

	return nil
}

// MessagePerson navigates to a profile and sends a direct message
func (b *Bot) MessagePerson(profileUrl string, message string) error {
	page := b.Browser.Page

	// Stealth Check: Business Hours
	if !stealth.IsBusinessHours(b.Config.BypassScheduler) {
		return nil
	}

	// Rate Limit Check
	if b.Storage.GetDailyActionCount("message") >= b.Config.RateLimits.MaxMessagesPerDay {
		logger.Warn("Daily message limit reached. Skipping.")
		return nil
	}

	logger.Infof("Visiting profile to message: %s", profileUrl)
	page.MustNavigate(profileUrl)
	page.MustWaitLoad()
	stealth.RandomSleep(3*time.Second, 5*time.Second)

	// 1. Find "Message" button
	var messageBtn *rod.Element
	buttons := page.MustElements("button")
	for _, btn := range buttons {
		txt, _ := btn.Text()
		if strings.TrimSpace(strings.ToLower(txt)) == "message" {
			messageBtn = btn
			break
		}
	}

	if messageBtn == nil {
		logger.Warn("Message button not found. They might not be a connection.")
		return nil
	}

	logger.Info("Clicking Message button...")
	messageBtn.MustClick()
	stealth.RandomSleep(2*time.Second, 3*time.Second)

	// 2. LinkedIn messaging usually opens a small overlay or switches to Messaging page
	// If it's the overlay, we look for the active message box
	// Note: LinkedIn classes are dynamic, we use a broad selector
	msgBox, err := page.Element("div[role='textbox']")
	if err != nil {
		// Try fallback if overlay didn't open or selector changed
		logger.Error("Could not find message textbox.")
		return err
	}

	logger.Info("Typing message...")
	stealth.TypeWithMistakes(msgBox, message)
	stealth.RandomSleep(1*time.Second, 2*time.Second)

	// 3. Click Send
	// Often a button with text "Send" or a specific class
	sendBtn, err := page.Element("button[type='submit'].msg-form__send-button")
	if err != nil {
		// Fallback to searching by text
		btns := page.MustElements("button")
		for _, btn := range btns {
			txt, _ := btn.Text()
			if strings.TrimSpace(strings.ToLower(txt)) == "send" {
				sendBtn = btn
				break
			}
		}
	}

	if sendBtn != nil {
		sendBtn.MustClick()
		logger.Info("Message Sent!")
		b.Storage.RecordMessage(profileUrl, message)
	} else {
		logger.Error("Send button not found.")
		return nil
	}

	stealth.RandomSleep(2*time.Second, 3*time.Second)
	return nil
}

// AcceptInvitations navigates to the My Network page and accepts all pending invitations
func (b *Bot) AcceptInvitations() error {
	page := b.Browser.Page

	logger.Info("Navigating to Invitations...")
	page.MustNavigate("https://www.linkedin.com/mynetwork/invitation-manager/")
	page.MustWaitLoad()
	stealth.RandomSleep(3*time.Second, 5*time.Second)

	// Find all "Accept" buttons
	// Usually: button[aria-label^='Accept']
	acceptBtns, err := page.Elements("button[aria-label^='Accept invitation from']")
	if err != nil || len(acceptBtns) == 0 {
		logger.Info("No pending invitations found.")
		return nil
	}

	logger.Infof("Found %d pending invitations.", len(acceptBtns))

	for i, btn := range acceptBtns {
		logger.Infof("Accepting invitation %d...", i+1)
		btn.MustClick()
		stealth.RandomSleep(1*time.Second, 3*time.Second)
	}

	return nil
}

// ProcessAcceptedConnections scans the "My Network" or "Messaging" page for new connections and sends follow-ups
func (b *Bot) ProcessAcceptedConnections(template string) error {
	page := b.Browser.Page

	logger.Info("Navigating to My Network to find new connections...")
	page.MustNavigate("https://www.linkedin.com/mynetwork/invite-connect/connections/")
	page.MustWaitLoad()
	stealth.RandomSleep(3*time.Second, 5*time.Second)

	// Human-like scroll
	stealth.ScrollHuman(page)

	// Collect connection links
	// Broad selectors for connection cards
	selectors := []string{
		".mn-connection-card__link",
		"a.mn-connection-card__picture",
		".mn-connection-card a[href*='/in/']",
		"a[href*='/in/']", // Last resort fallback
	}

	var links rod.Elements
	for _, sel := range selectors {
		els, err := page.Elements(sel)
		if err == nil && len(els) > 0 {
			links = els
			logger.Debugf("Found %d connection links with selector: %s", len(els), sel)
			break
		}
	}

	if len(links) == 0 {
		logger.Warn("No connections found on the first page with any selector.")
		return nil
	}

	for _, linkEl := range links {
		href, _ := linkEl.Attribute("href")
		if href == nil {
			continue
		}
		profileUrl := *href
		if !strings.HasPrefix(profileUrl, "http") {
			profileUrl = "https://www.linkedin.com" + profileUrl
		}
		// Clean URL
		profileUrl = strings.Split(profileUrl, "?")[0]

		// Check if we already followed up
		if b.Storage.GetMessageCount(profileUrl) > 0 {
			continue
		}

		// Get name for template
		name := "there"
		if nameEl, err := linkEl.Element(".mn-connection-card__name"); err == nil {
			name = nameEl.MustText()
		}

		// Interpolate template
		message := strings.ReplaceAll(template, "{name}", name)

		logger.Infof("Sending follow-up to %s", name)
		if err := b.MessagePerson(profileUrl, message); err != nil {
			logger.Errorf("Failed to message %s: %v", name, err)
		}

		// Respect rate limits: only process a few at a time in this PoC
	}

	return nil
}
