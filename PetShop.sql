-- Create the PetShop database
CREATE DATABASE PetShop;
USE PetShop;

-- Create User table
CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- Create Pet table
CREATE TABLE Pet (
    PetID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Species VARCHAR(50) NOT NULL,
    Breed VARCHAR(50),
    Age INT,
    Gender VARCHAR(10),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Create Adoption_Details table
CREATE TABLE Adoption_Details (
    AdoptionID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    PetID INT,
    AdoptionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PetID) REFERENCES Pet(PetID)
);