-- CS 340: Intro To Databases -- 
-- Due Date: 02/24/22 --
-- Project Group 93 -- 
-- Russell Feathers and Jonathon Shea -- 

-- Part A: Table Creation --

-- Drop all tables on running database definition queries again
DROP TABLE IF EXISTS PriceHistory;
DROP TABLE IF EXISTS RodentsToFloors;
DROP TABLE IF EXISTS Apts;
DROP TABLE IF EXISTS Rodents;
DROP TABLE IF EXISTS AptOwners;
DROP TABLE IF EXISTS AptFloors;

-- Table creation
CREATE TABLE Rodents(
    rodentID INT(11) NOT NULL AUTO_INCREMENT, -- Changed value from previous project steps
    rodentName VARCHAR (255) NOT NULL,
    PRIMARY KEY (rodentID)
);

CREATE TABLE AptOwners(
    ownerID INT(11) NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    ssn VARCHAR(9),
    PRIMARY KEY (ownerID)
);

CREATE TABLE Apts(
    aptNum INT(11) UNIQUE NOT NULL,
    sqFeet INT(255), -- Changed value from previous project steps
    floorNum INT NOT NULL, -- FK added in later step
    ownerID INT, -- FK added in later step
    PRIMARY KEY (aptNum)
);

CREATE TABLE PriceHistory(
    invoiceNum INT NOT NULL AUTO_INCREMENT,
    sellerID INT, -- FK added in later step
    buyerID INT, -- FK added in later step
    aptNum INT NOT NULL, -- FK added in later step
    dateSale DATE NOT NULL,
    price DOUBLE(10,2) NOT NULL, -- Changed value from previous project steps
    PRIMARY KEY (invoiceNum),
    CONSTRAINT different_owners CHECK (PriceHistory.sellerID <> PriceHistory.buyerID) -- The two owners purchasing/selling the apartment must be distinct.

);


CREATE TABLE AptFloors(
    floorNum INT(255) UNIQUE NOT NULL,
    fireExits INT(255) NOT NULL,
    PRIMARY KEY (floorNum)
);

CREATE TABLE RodentsToFloors(
    rodentID INT NOT NULL, -- FK added in later step
    floorNum INT NOT NULL, -- FK added in later step
    PRIMARY KEY (rodentID, floorNum)
);

-- Add foreign keys to all tables
ALTER TABLE Apts ADD FOREIGN KEY (ownerID) REFERENCES AptOwners (ownerID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PriceHistory ADD FOREIGN KEY (sellerID) REFERENCES AptOwners (ownerID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PriceHistory ADD FOREIGN KEY (buyerID) REFERENCES AptOwners (ownerID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE PriceHistory ADD FOREIGN KEY (aptNum) REFERENCES Apts (aptNum) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE RodentsToFloors ADD FOREIGN KEY (rodentID) REFERENCES Rodents (rodentID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE RodentsToFloors ADD FOREIGN KEY (floorNum) REFERENCES AptFloors (floorNum) ON DELETE CASCADE ON UPDATE CASCADE;

-- Part B: Sample Data Insertion --
-- NOTES: : used to show where code insertion is --

INSERT INTO AptOwners (firstName, lastName, ssn) VALUES 
('Alex','Rodriguez',666666666), ('Jennifer','Lopez',333333333), ('Bill','DeBlasio',999999999), ('Corner','Guy',111222333), ('Corporate','FatCat',232323231);

INSERT INTO Apts (aptNum, sqFeet, floorNum) VALUES
(1,666,55), (2,1113,55), (3,2009,44), (4,756,33), (5,73,11);

INSERT INTO AptFloors (floorNum, fireExits) VALUES 
(1,3), (2, 2), (3,9), (4,9), (11,1), (33,1), (44,1), (55,1);

INSERT INTO PriceHistory (sellerID, buyerID, aptNum, dateSale, price) VALUES
(1,2,1,'2021-10-10',666666.22), (2,3,2,'2021-05-10',666266.22), (1,4,1,'2020-1-1',3336.21),(1,2,3,'2021-10-10',666666.22),(3,4,4,'2021-10-10',666666.22);

INSERT INTO Rodents (rodentName) VALUES 
('PizzaRat'), ('MutantRat'), ('NinjaRat'), ('Imma'), ('Bug');

-- Based on assumption of ID values for Rodents --
INSERT INTO RodentsToFloors VALUES 
(1,33), (1,44), (1,55), (4,11), (5,55);

