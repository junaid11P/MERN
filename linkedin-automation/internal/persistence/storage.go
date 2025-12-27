package persistence

import (
	"encoding/json"
	"os"
	"sync"
	"time"

	"github.com/junaid11P/MERN/linkedin-automation/pkg/logger"
)

type ActionState struct {
	SentRequests        map[string]time.Time `json:"sent_requests"`
	SentMessages        map[string]time.Time `json:"sent_messages"`
	AcceptedConnections map[string]time.Time `json:"accepted_connections"`
	MessageHistory      map[string][]string  `json:"message_history"`
}

type Storage struct {
	filePath string
	state    ActionState
	mu       sync.RWMutex
}

func New(filePath string) *Storage {
	s := &Storage{
		filePath: filePath,
		state: ActionState{
			SentRequests:        make(map[string]time.Time),
			SentMessages:        make(map[string]time.Time),
			AcceptedConnections: make(map[string]time.Time),
			MessageHistory:      make(map[string][]string),
		},
	}
	s.load()
	return s
}

func (s *Storage) load() {
	s.mu.Lock()
	defer s.mu.Unlock()

	data, err := os.ReadFile(s.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			logger.Info("Storage file not found, starting fresh.")
			return
		}
		logger.Errorf("Failed to read storage file: %v", err)
		return
	}

	err = json.Unmarshal(data, &s.state)
	if err != nil {
		logger.Errorf("Failed to unmarshal storage data: %v", err)
	}
}

func (s *Storage) save() {
	s.mu.RLock()
	defer s.mu.RUnlock()

	data, err := json.MarshalIndent(s.state, "", "  ")
	if err != nil {
		logger.Errorf("Failed to marshal storage data: %v", err)
		return
	}

	err = os.WriteFile(s.filePath, data, 0644)
	if err != nil {
		logger.Errorf("Failed to write storage file: %v", err)
	}
}

func (s *Storage) RecordSentRequest(profileUrl string) {
	s.mu.Lock()
	s.state.SentRequests[profileUrl] = time.Now()
	s.mu.Unlock()
	s.save()
}

func (s *Storage) WasRequestSent(profileUrl string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, exists := s.state.SentRequests[profileUrl]
	return exists
}

func (s *Storage) RecordAcceptedConnection(profileUrl string) {
	s.mu.Lock()
	s.state.AcceptedConnections[profileUrl] = time.Now()
	s.mu.Unlock()
	s.save()
}

func (s *Storage) RecordMessage(profileUrl string, message string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.state.MessageHistory[profileUrl] = append(s.state.MessageHistory[profileUrl], message)
	s.state.SentMessages[profileUrl+"_"+time.Now().Format(time.RFC3339)] = time.Now()
	s.save()
}

func (s *Storage) GetMessageCount(profileUrl string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.state.MessageHistory[profileUrl])
}

func (s *Storage) GetDailyActionCount(actionType string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	count := 0
	now := time.Now()

	switch actionType {
	case "request":
		for _, t := range s.state.SentRequests {
			if t.Year() == now.Year() && t.YearDay() == now.YearDay() {
				count++
			}
		}
	case "message":
		for _, t := range s.state.SentMessages {
			if t.Year() == now.Year() && t.YearDay() == now.YearDay() {
				count++
			}
		}
	}
	return count
}
