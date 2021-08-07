CREATE TABLE Packages(
   Id VARCHAR (1000) NOT NULL,
   Name VARCHAR (1000) NOT NULL,
   PRIMARY KEY (Id)
);


CREATE TABLE Features(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  PackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (PackageId) REFERENCES Packages(Id)
);


CREATE TABLE FeatureDependencies(
  FeatureId VARCHAR (1000) NOT NULL,
  DependencyId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (FeatureId, DependencyId),
  FOREIGN KEY (FeatureId) REFERENCES Features(Id),
  FOREIGN KEY (DependencyId) REFERENCES Features(Id)  
);


CREATE TABLE Features(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  PackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (PackageId) REFERENCES Packages(Id)
);


INSERT INTO Packages VALUES('StandardFramework', 'Standard Framework');
INSERT INTO Packages VALUES('TCVisionFramework', 'TCVision Framework');
INSERT INTO Packages VALUES('RTVisionFramework', 'RTVision Framework');

INSERT INTO Features VALUES('#UserManagement', 'User Management', 'StandardFramework');

