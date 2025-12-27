package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	LinkedInEmail    string
	LinkedInPassword string
	HeadlessMode     bool
	SlowMotion       time.Duration
	UserDataDir      string
	BypassScheduler  bool
	RateLimits       RateLimits
}

type RateLimits struct {
	MaxConnectsPerDay int
	MaxMessagesPerDay int
}

// LoadConfig reads configuration from .env and environment variables
func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: .env file not found, relying on environment variables")
	}

	return &Config{
		LinkedInEmail:    getEnv("LINKEDIN_EMAIL", ""),
		LinkedInPassword: getEnv("LINKEDIN_PASSWORD", ""),
		HeadlessMode:     getEnvAsBool("HEADLESS_MODE", false),
		SlowMotion:       time.Duration(getEnvAsInt("SLOW_MOTION_MS", 10)) * time.Millisecond,
		UserDataDir:      getEnv("USER_DATA_DIR", "./user_data"),
		BypassScheduler:  getEnvAsBool("BYPASS_SCHEDULER", false),
		RateLimits: RateLimits{
			MaxConnectsPerDay: getEnvAsInt("MAX_CONNECTS_PER_DAY", 20),
			MaxMessagesPerDay: getEnvAsInt("MAX_MESSAGES_PER_DAY", 30),
		},
	}
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

func getEnvAsBool(key string, defaultVal bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultVal
}
