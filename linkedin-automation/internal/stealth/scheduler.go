package stealth

import (
	"time"

	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// IsBusinessHours checks if the current time is within typical business hours (9 AM - 5 PM).
// This is a stealth technique to mimic human activity patterns.
func IsBusinessHours(bypass bool) bool {
	if bypass {
		logger.Info("Bypassing business hours check (Stealth Override).")
		return true
	}

	now := time.Now()
	hour := now.Hour()
	weekday := now.Weekday()

	// Mimic Monday to Friday, 9:00 AM to 5:00 PM
	if weekday == time.Saturday || weekday == time.Sunday {
		logger.Warn("Outside of business hours (Weekend). Avoiding activity for stealth.")
		return false
	}

	if hour < 9 || hour >= 17 {
		logger.Warnf("Outside of business hours (%d:00). Avoiding activity for stealth.", hour)
		return false
	}

	return true
}
