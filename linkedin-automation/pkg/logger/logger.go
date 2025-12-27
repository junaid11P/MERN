package logger

import (
	"log"
	"os"
)

type Level int

const (
	DEBUG Level = iota
	INFO
	WARN
	ERROR
)

var (
	debugLogger = log.New(os.Stdout, "DEBUG: ", log.Ldate|log.Ltime|log.Lshortfile)
	infoLogger  = log.New(os.Stdout, "INFO:  ", log.Ldate|log.Ltime)
	warnLogger  = log.New(os.Stdout, "WARN:  ", log.Ldate|log.Ltime|log.Lshortfile)
	errorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
)

func Debug(v ...interface{}) {
	debugLogger.Println(v...)
}

func Debugf(format string, v ...interface{}) {
	debugLogger.Printf(format, v...)
}

func Info(v ...interface{}) {
	infoLogger.Println(v...)
}

func Infof(format string, v ...interface{}) {
	infoLogger.Printf(format, v...)
}

func Warn(v ...interface{}) {
	warnLogger.Println(v...)
}

func Warnf(format string, v ...interface{}) {
	warnLogger.Printf(format, v...)
}

func Error(v ...interface{}) {
	errorLogger.Println(v...)
}

func Errorf(format string, v ...interface{}) {
	errorLogger.Printf(format, v...)
}

func Fatal(v ...interface{}) {
	errorLogger.Fatal(v...)
}
