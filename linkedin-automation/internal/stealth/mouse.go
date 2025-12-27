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

// MoveMouseSmoothly moves the mouse to the target (x,y) using a Bézier curve with overshoot and micro-corrections.
func MoveMouseSmoothly(page *rod.Page, toX, toY float64) {
	startX, startY := currentX, currentY

	// 1. Generate an overshoot target
	// Typically humans overshoot slightly (e.g., 2-5% of the distance)
	dist := math.Hypot(toX-startX, toY-startY)
	if dist < 5 {
		// Just move if distance is tiny
		_ = page.Mouse.MoveTo(proto.Point{X: toX, Y: toY})
		currentX, currentY = toX, toY
		return
	}

	overshootDist := dist * (0.02 + rand.Float64()*0.03) // 2-5% overshoot
	angle := math.Atan2(toY-startY, toX-startX)
	overshootX := toX + math.Cos(angle)*overshootDist
	overshootY := toY + math.Sin(angle)*overshootDist

	// 2. Move to overshoot target
	moveWithBezier(page, startX, startY, overshootX, overshootY, true)

	// 3. Micro-correction to exact target
	// Humans settle on the target with a final small movement
	RandomSleep(20*time.Millisecond, 50*time.Millisecond)
	moveWithBezier(page, overshootX, overshootY, toX, toY, false)

	currentX, currentY = toX, toY
}

func moveWithBezier(page *rod.Page, fromX, fromY, toX, toY float64, isPrimary bool) {
	dist := math.Hypot(toX-fromX, toY-fromY)
	controlScale := dist / 2.0
	if controlScale < 5 {
		controlScale = 5
	}

	// P1 and P2 deviate to create a curve
	p1x := fromX + (rand.Float64()*controlScale - controlScale/2)
	p1y := fromY + (rand.Float64()*controlScale - controlScale/2)
	p2x := toX + (rand.Float64()*controlScale - controlScale/2)
	p2y := toY + (rand.Float64()*controlScale - controlScale/2)

	steps := int(dist / 3.0)
	if isPrimary {
		if steps < 15 {
			steps = 15
		}
		if steps > 80 {
			steps = 80
		}
	} else {
		// Micro-correction steps
		steps = 5 + rand.Intn(5)
	}

	for i := 0; i <= steps; i++ {
		t := float64(i) / float64(steps)
		// Ease out / Ease in simulation
		// t = easeInOut(t)
		bx := bezier(t, fromX, p1x, p2x, toX)
		by := bezier(t, fromY, p1y, p2y, toY)

		_ = page.Mouse.MoveTo(proto.Point{X: bx, Y: by})

		// Random sleep to vary speed
		sleep := 2 + rand.Intn(4)
		if !isPrimary {
			sleep = 5 + rand.Intn(10) // Slower for correction
		}
		time.Sleep(time.Duration(sleep) * time.Millisecond)
	}
}

// bezier calculates cubic bezier point
func bezier(t float64, p0, p1, p2, p3 float64) float64 {
	return math.Pow(1-t, 3)*p0 +
		3*math.Pow(1-t, 2)*t*p1 +
		3*(1-t)*math.Pow(t, 2)*p2 +
		math.Pow(t, 3)*p3
}
