package stealth

import (
	"math"
	"math/rand"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
)

// Point represents a coordinate
type Point struct {
	X, Y float64
}

// MoveMouseSmoothly moves the mouse to the target (x,y) somewhat naturally.
// It uses a simple overshooting method to simulate a human hand that isn't perfectly precise.
func MoveMouseSmoothly(page *rod.Page, toX, toY float64) {
	// Add some randomness to the target first (overshoot)
	overshootX := toX + (rand.Float64()*20 - 10)
	overshootY := toY + (rand.Float64()*20 - 10)

	// Direct CDP call for Mouse Move
	move := func(x, y float64) {
		_ = page.Mouse.MoveTo(proto.Point{X: x, Y: y})
	}

	move(overshootX, overshootY)
	time.Sleep(time.Millisecond * time.Duration(rand.Intn(100)+50))
	move(toX, toY)
}

// Function to calculate cubic bezier points
func bezier(t float64, p0, p1, p2, p3 float64) float64 {
	return math.Pow(1-t, 3)*p0 +
		3*math.Pow(1-t, 2)*t*p1 +
		3*(1-t)*math.Pow(t, 2)*p2 +
		math.Pow(t, 3)*p3
}
