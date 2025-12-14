package main

import (
	"github.com/junaid11P/MERN/linkedin-automation/internal/automation"
	"github.com/junaid11P/MERN/linkedin-automation/internal/browser"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/config"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

func main() {
	logger.Info("Starting LinkedIn Automation Bot")

	// 1. Load Configuration
	// We read from .env if available, otherwise env vars.
	cfg := config.LoadConfig()

	// 2. Initialize Browser
	b := browser.New(cfg)
	defer b.Close()

	// 3. Initialize Bot
	bot := automation.New(b, cfg)

	// 4. Run Automation Flow
	err := bot.Login()
	if err != nil {
		logger.Fatal("Login failed: ", err)
	}

	logger.Info("Login success. waiting before search...")
	logger.Info("Login success. waiting before search...")

	// Example Search
	profiles, err := bot.SearchPeople("Intern", 1)
	if err != nil {
		logger.Error("Search failed: ", err)
	}

	for _, p := range profiles {
		logger.Info("Found Profile: ", p)
		// For safety in PoC, we intentionally don't auto-connect to randoms.
		bot.ConnectWithNote(p, "Hi, I'd like to connect!")
	}

	logger.Info("Automation finished successfully (PoC Mode).")
}
