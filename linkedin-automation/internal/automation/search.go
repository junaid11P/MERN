package automation

import (
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/go-rod/rod"
	"github.com/junaid11P/MERN/linkedin-automation/internal/stealth"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// SearchPeople iterates through search results for a given query
// Returns a list of profile URLs
func (b *Bot) SearchPeople(query string, maxPages int) ([]string, error) {
	page := b.Browser.Page

	logger.Infof("Searching for: %s", query)
	// Navigate to search URL with proper encoding
	encodedQuery := url.QueryEscape(query)
	searchUrl := fmt.Sprintf("https://www.linkedin.com/search/results/people/?keywords=%s&origin=GLOBAL_SEARCH_HEADER", encodedQuery)
	page.MustNavigate(searchUrl)
	page.MustWaitLoad()
	stealth.RandomSleep(3*time.Second, 5*time.Second)

	var allProfiles []string

	for i := 0; i < maxPages; i++ {
		logger.Infof("Processing Search Page %d", i+1)

		// Wait for search results container to be visible
		// This is a common container for search results
		if _, err := page.Element(".reusable-search__entity-result-list"); err != nil {
			logger.Warn("Search results container not found, trying fallback behavior...")
		}

		// Human-like scroll to load elements
		stealth.ScrollHuman(page)
		stealth.RandomSleep(1*time.Second, 2*time.Second)

		// Collect profile links
		// We look for links containing /in/ that are likely profile links in search results
		var elements rod.Elements

		// Try a few common selectors for search result titles
		selectors := []string{
			".entity-result__title-line a.app-aware-link",
			"span.entity-result__title-text a",
			"a.app-aware-link",
			".reusable-search__result-container a[href*='/in/']",
		}

		for _, sel := range selectors {
			els, err := page.Elements(sel)
			if err == nil && len(els) > 0 {
				elements = els
				logger.Debugf("Found %d elements with selector: %s", len(els), sel)
				break
			}
		}

		if len(elements) == 0 {
			logger.Warn("No elements found with primary selectors, using fallback...")
			elements = page.MustElements("a[href*='/in/']")
		}

		pageProfiles := make(map[string]bool)
		for _, el := range elements {
			link, err := el.Attribute("href")
			if err == nil && link != nil {
				href := *link
				// Skip non-profile links
				if !strings.Contains(href, "/in/") || strings.Contains(href, "/in/search") || strings.Contains(href, "/in/ACo") {
					continue
				}

				// Normalize URL
				if !strings.HasPrefix(href, "http") {
					href = "https://www.linkedin.com" + href
				}
				cleanLink := strings.Split(href, "?")[0]

				// Basic validation and duplicate detection
				if len(cleanLink) > 28 && !pageProfiles[cleanLink] && !b.Storage.WasRequestSent(cleanLink) {
					pageProfiles[cleanLink] = true
					allProfiles = append(allProfiles, cleanLink)
				}
			}
		}

		logger.Infof("Found %d total unique profiles so far", len(allProfiles))

		// Pagination: "Next" button
		if i < maxPages-1 {
			if nextPageBtn, err := page.Element("button[aria-label='Next']"); err == nil {
				// Ensure it's not disabled
				if disabled, _ := nextPageBtn.Attribute("disabled"); disabled == nil {
					box := nextPageBtn.MustShape().Box()
					stealth.MoveMouseSmoothly(page, box.X+box.Width/2, box.Y+box.Height/2)
					nextPageBtn.MustClick()
					page.MustWaitLoad()
					stealth.RandomSleep(3*time.Second, 6*time.Second)
				} else {
					logger.Info("Next button is disabled. Reached end of results.")
					break
				}
			} else {
				logger.Warn("Next button not found, stopping search.")
				break
			}
		}
	}

	return allProfiles, nil
}
