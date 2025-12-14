package automation

import (
	"fmt"
	"time"

	"github.com/junaid11P/MERN/linkedin-automation/internal/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// SearchPeople iterates through search results for a given query
// Returns a list of profile URLs
func (b *Bot) SearchPeople(query string, maxPages int) ([]string, error) {
	page := b.Browser.Page

	logger.Infof("Searching for: %s", query)
	// Navigate to search URL
	searchUrl := fmt.Sprintf("https://www.linkedin.com/search/results/people/?keywords=%s", query)
	page.MustNavigate(searchUrl)
	page.MustWaitLoad()
	stealth.RandomSleep(2*time.Second, 4*time.Second)

	var allProfiles []string

	for i := 0; i < maxPages; i++ {
		logger.Infof("Processing Search Page %d", i+1)

		// Human-like scroll to load elements
		stealth.ScrollHuman(page)

		// Collect profile links
		// Selector for search result links (typically app-aware-link inside search results)
		// Note provided selectors are approximate as LinkedIn classes change.
		// We use partial href matching which is more robust.

		elements := page.MustElements("a[href*='/in/']")

		pageProfiles := make(map[string]bool)
		for _, el := range elements {
			link, err := el.Attribute("href")
			if err == nil && link != nil {
				// Clean URL (remove query params)
				cleanLink := *link
				if idx := 0; idx < len(cleanLink) {
					// Minimal cleaning, mostly just ensure it's a profile
					if !pageProfiles[cleanLink] {
						pageProfiles[cleanLink] = true
						allProfiles = append(allProfiles, cleanLink)
					}
				}
			}
		}

		logger.Infof("Found %d profiles on page %d", len(pageProfiles), i+1)

		// Pagination: "Next" button
		// usually a button with text "Next" or aria-label="Next"
		if i < maxPages-1 {
			if nextPageBtn, err := page.Element("button[aria-label='Next']"); err == nil {
				box := nextPageBtn.MustShape().Box()
				stealth.MoveMouseSmoothly(page, box.X+box.Width/2, box.Y+box.Height/2)
				nextPageBtn.MustClick()
				page.MustWaitLoad()
				stealth.RandomSleep(3*time.Second, 6*time.Second)
			} else {
				logger.Warn("Next button not found, stopping search.")
				break
			}
		}
	}

	return allProfiles, nil
}
