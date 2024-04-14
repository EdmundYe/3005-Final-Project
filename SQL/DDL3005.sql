--CREATE DATABASE HealthAndFitnessClubSystem;

-- Member Table 
CREATE TABLE Member (
    Member_ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);

-- Payment Table
CREATE TABLE Payment (
    Member_ID INTEGER REFERENCES Member(Member_ID),
    Service VARCHAR(255) NOT NULL
);

-- Trainer Table
CREATE TABLE Trainer (
    Name VARCHAR(255) PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Specialization VARCHAR(255) NOT NULL,
    Clock_In TIME NOT NULL,
    Clock_Out TIME NOT NULL
);

-- Room Table
CREATE TABLE Room (
    Room_ID SERIAL PRIMARY KEY
);

-- Equipment Table
CREATE TABLE Equipment (
    Equipment_Type VARCHAR(255) NOT NULL PRIMARY KEY,
    Maintenance_Date VARCHAR(255) NOT NULL
);

-- Exercises Table
CREATE TABLE Exercises (
    Name VARCHAR(255) NOT NULL PRIMARY KEY
);

-- Member Schedule Table
CREATE TABLE Member_Schedule (
    Member_ID INTEGER REFERENCES Member(Member_ID),
    Start_Time TIME NOT NULL,
    End_Time TIME NOT NULL,
    Date DATE NOT NULL,
    Name VARCHAR(255) REFERENCES Exercises(Name),
    Trainer_Name VARCHAR REFERENCES Trainer(Name),
    Equipment_Type VARCHAR REFERENCES Equipment(Equipment_Type),
    Room INTEGER REFERENCES Room(Room_ID)
);


-- Schedule Table
CREATE TABLE Schedule (
    Start_Time TIME NOT NULL,
    End_Time TIME NOT NULL,
    Date DATE NOT NULL,
    Trainer_Name VARCHAR REFERENCES Trainer(Name),
    Exersize_Name VARCHAR(255) REFERENCES Exercises(Name),
    Room INTEGER REFERENCES Room(Room_ID),
);

-- Profile Table
CREATE TABLE Profile (
    Weight FLOAT NOT NULL,
    Height FLOAT NOT NULL,
    Gender VARCHAR(255) NOT NULL,
    Age INTEGER NOT NULL,
    Goal_Weight FLOAT,
    Member_ID INTEGER REFERENCES Member(Member_ID)
);

-- Admin Table
CREATE TABLE Admin (
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL
);


