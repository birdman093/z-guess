-- Part C: Data Manipulation Queries --

-- Apartment Owners --

SELECT * FROM AptOwners;
SELECT * FROM AptOwners WHERE ownerID = :ownerIDInp;
SELECT * FROM AptOwners WHERE firstName LIKE '%firstNameInp%';
SELECT * FROM AptOwners WHERE lastName LIKE '%lastNameInp%';
SELECT * FROM AptOwners WHERE ssn LIKE '%ssnInp%';

INSERT INTO AptOwners (firstName, lastName, ssn)
VALUES (:firstNameInp, :lastNameInp, :ssnInp);

UPDATE AptOwners SET firstName = :firstNameInp, lastName = :lastNameInp, ssn = :ssnInp WHERE ownerID = :ownerIDInp;
DELETE FROM AptOwners WHERE ownerID =:ownerIDInp;


-- Apartments --

SELECT * FROM Apts;
SELECT * FROM Apts WHERE aptNum = :aptNumInp;
SELECT * FROM Apts WHERE sqFeet >= :sqFeetInp;
SELECT * FROM Apts WHERE floorNum = :floorNumInp;

INSERT INTO Apts (aptNum, sqFeet, floorNum, ownerID)
VALUES (:aptNumInp, :sqFeetInp, :floorNumInp, :ownerIDInp);

UPDATE Apts SET sqFeet = :sqFeetInp, floorNum = :floorNumInp WHERE aptNum = :aptNumInp;
DELETE FROM Apts WHERE aptNum = :aptNumInp;


-- Apartment Floors --

SELECT * FROM AptFloors;
SELECT * FROM AptFloors WHERE floorNum = :floorNumInp;
SELECT * FROM AptFloors WHERE fireExits >= :fireExitsInp;

INSERT INTO AptFloors (floorNum, fireExits)
VALUES (:floorNumInp, :fireExitsInp);

UPDATE AptFloors SET fireExits = :fireExitsInp WHERE floorNum = :floorNumInp;
DELETE FROM AptFloors WHERE floorNum = :floorNumInp;

-- Price History --

SELECT PH.invoiceNum, AO1.firstName AS "Seller First Name", AO1.lastName AS "Seller Last Name", 
AO2.firstName AS "Buyer First Name", AO2.lastName AS "Buyer Last Name", 
PH.aptNum, PH.dateSale, PH.price FROM PriceHistory AS PH 
JOIN AptOwners AS AO1 ON PH.sellerID = AO1.ownerID 
JOIN AptOwners AS AO2 ON PH.buyerID = AO2.ownerID
JOIN Apts ON Apts.aptNum = PH.aptNum; -- Updated after PS6 to show buyer and seller names

SELECT * FROM PriceHistory WHERE invoiceNum = :invoiceNumInp;
SELECT * FROM PriceHistory WHERE sellerID = :sellerIDInp;
SELECT * FROM PriceHistory WHERE buyerID = :buyerIDInp;
SELECT * FROM PriceHistory WHERE aptNum = :aptNumInp;
SELECT * FROM PriceHistory WHERE aptNum = :aptNumInp;
SELECT * FROM PriceHistory WHERE dateSale >= :dateSaleInp1 AND dateSale <= :dateSaleInp2 ;
SELECT * FROM PriceHistory WHERE price >= :priceInp1 AND price <= :priceInp2 ;


INSERT INTO PriceHistory (invoiceNum, sellerID, buyerID, aptNum, dateSale, price)
VALUES (:invoiceNumInp, :sellerIDInp, :buyerIDInp, :aptNumInp, :dateSaleInp, :priceInp);

UPDATE PriceHistory SET
                        sellerID = :sellerIDInp,
                        buyerID = :buyerIDInp,
                        aptNum = :aptNumInp,
                        dateSale = :dateSaleInp,
                        price = :priceInp
WHERE invoiceNum = :invoiceNumInp;
DELETE FROM AptFloors WHERE floorNum = :floorNumInp;

-- Rodents --

SELECT Rodents.rodentID, Rodents.rodentName,RodentsToFloors.floorNum FROM `Rodents`
JOIN `RodentsToFloors` ON Rodents.rodentID = RodentsToFloors.rodentID; -- Updated after PS6 to show rodent names

SELECT * FROM Rodents WHERE rodentID = :rodentIDInp;
SELECT * FROM Rodents WHERE rodentName LIKE '%rodentNameInp%';

INSERT INTO Rodents (rodentName)
VALUES (:rodentNameInp);

UPDATE Rodents SET rodentName = :rodentNameInp WHERE rodentID = :rodentIDInp;
DELETE FROM Rodents WHERE rodentId = :rodentIDInp;


-- Rodents To Floors --

SELECT * FROM RodentsToFloors;
SELECT * FROM RodentsToFloors WHERE rodentID = :rodentIDInp;
SELECT * FROM RodentsToFloors WHERE floorNum = :floorNumInp;

INSERT INTO RodentsToFloors (rodentID, floorNum)
VALUES (:rodentNameInp, :floorNumInp);

UPDATE RodentsToFloors SET rodentID = :rodentIDInp, floorNum = :floorNumInp WHERE rodentID = :rodentIDInp AND floorNum = :floorNumInp;
DELETE FROM RodentsToFloors WHERE rodentID = :rodentIDInp AND floorNum = :floorNumInp;