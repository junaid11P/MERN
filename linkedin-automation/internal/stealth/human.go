package stealth

import (
	"math/rand"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/input"
	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

// RandomSleep sleeps for a random duration between min and max duration
func RandomSleep(min, max time.Duration) {
	delta := max - min
	if delta <= 0 {
		time.Sleep(min)
		return
	}
	r := rand.Int63n(int64(delta))
	time.Sleep(min + time.Duration(r))
}

// TypeWithMistakes simulates human typing with variable speed and occasional mistakes
func TypeWithMistakes(el *rod.Element, text string) {
	// Base typing speed (characters per minute ~ 300 cpm => 200ms per char avg)
	// We want it faster for automation but realistic. ~100-250ms per keystroke.

	for _, char := range text {
		// 1. Random delay before keystroke
		RandomSleep(50*time.Millisecond, 200*time.Millisecond)

		// 2. Chance of mistake (e.g., 5%)
		if rand.Float32() < 0.05 {
			// Type wrong char
			wrongChar := string(char + 1) // simplistic wrong char
			el.Input(wrongChar)
			RandomSleep(100*time.Millisecond, 300*time.Millisecond)

			// Correction: Backspace
			el.Page().KeyActions().Press(input.Backspace).MustDo()
			RandomSleep(100*time.Millisecond, 300*time.Millisecond)
		}

		// 3. Type correct char
		el.Input(string(char))
	}
}

// ScrollHuman scrolls the page in steps with random pauses to simulate reading
func ScrollHuman(page *rod.Page) {
	// Scroll down in chunks
	height := 0.0
	// Get total height (approximation) - can loop until bottom
	for i := 0; i < 5; i++ { // Just a few scrolls for now
		scrollAmount := float64(rand.Intn(300) + 200) // 200-500px
		height += scrollAmount

		// Use mouse wheel for more natural scroll
		page.Mouse.Scroll(0, scrollAmount, 5) // 5 steps for smoothness

		logger.Debugf("Scrolled down by %.0f px", scrollAmount)
		RandomSleep(1*time.Second, 3*time.Second) // Read content
	}
}
