package main

import (
	"github.com/junaid11P/MERN/linkedin-automation/internal/automation"
	"github.com/junaid11P/MERN/linkedin-automation/internal/browser"
	"github.com/junaid11P/MERN/linkedin-automation/internal/persistence"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/config"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

func main() {
	logger.Info("Starting LinkedIn Automation Bot")

	// 1. Load Configuration
	// We read from .env if available, otherwise env vars.
	cfg := config.LoadConfig()

	// 2. Initialize Storage
	storage := persistence.New("user_data/storage.json")

	// 3. Initialize Browser
	b := browser.New(cfg)
	defer b.Close()

	// 4. Initialize Bot
	bot := automation.New(b, cfg, storage)

	// 5. Run Automation Flow
	err := bot.Login()
	if err != nil {
		logger.Fatal("Login failed: ", err)
	}

	logger.Info("Login success. Checking for pending invitations...")
	err = bot.AcceptInvitations()
	if err != nil {
		logger.Error("AcceptInvitations failed: ", err)
	}

	logger.Info("Processing newly accepted connections for follow-ups...")
	err = bot.ProcessAcceptedConnections("Hi {name}, thanks for connecting! I'd love to chat about your experience.")
	if err != nil {
		logger.Error("ProcessAcceptedConnections failed: ", err)
	}

	// 6. Search and Connect
	profiles, err := bot.SearchPeople("fresher", 1)
	if err != nil {
		logger.Error("Search failed: ", err)
	}

	for _, p := range profiles {
		logger.Info("Found Profile: ", p)
		// For safety in PoC, we intentionally don't auto-connect to randoms.
		bot.ConnectWithNote(p, "Hi, I'd like to connect!")

		// Demo: Message someone (assuming they are already a connection or it's a test profile)
		// bot.MessagePerson(p, "Hi, this is an automated message test.")
	}

	logger.Info("Automation finished successfully.")
}
