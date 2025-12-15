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

// Track current mouse position to ensure smooth paths
var currentX, currentY float64

// MoveMouseSmoothly moves the mouse to the target (x,y) using a Bézier curve.
func MoveMouseSmoothly(page *rod.Page, toX, toY float64) {
	startX, startY := currentX, currentY

	// Calculate control points for cubic bezier
	// P0 = start
	// P3 = destination (toX, toY)
	dist := math.Hypot(toX-startX, toY-startY)
	controlScale := dist / 2.0
	if controlScale < 10 {
		controlScale = 10
	}

	// Randomize control points
	// P1 and P2 deviate from the straight line to create a curve
	p1x := startX + (rand.Float64()*controlScale - controlScale/2)
	p1y := startY + (rand.Float64()*controlScale - controlScale/2)

	p2x := toX + (rand.Float64()*controlScale - controlScale/2)
	p2y := toY + (rand.Float64()*controlScale - controlScale/2)

	steps := int(dist / 5.0)
	if steps < 10 {
		steps = 10
	}
	if steps > 100 {
		steps = 100
	}

	for i := 0; i <= steps; i++ {
		t := float64(i) / float64(steps)
		bx := bezier(t, startX, p1x, p2x, toX)
		by := bezier(t, startY, p1y, p2y, toY)

		// Move mouse
		_ = page.Mouse.MoveTo(proto.Point{X: bx, Y: by})

		// Random tiny sleep
		time.Sleep(time.Duration(rand.Intn(5)) * time.Millisecond)
	}

	// Update tracking to final destination
	currentX, currentY = toX, toY
}

// bezier calculates cubic bezier point
func bezier(t float64, p0, p1, p2, p3 float64) float64 {
	return math.Pow(1-t, 3)*p0 +
		3*math.Pow(1-t, 2)*t*p1 +
		3*(1-t)*math.Pow(t, 2)*p2 +
		math.Pow(t, 3)*p3
}
