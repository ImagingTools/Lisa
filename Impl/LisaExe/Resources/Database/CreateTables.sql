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


INSERT INTO Packages(Id, Name) VALUES('StandardFramework', 'Standard Framework');
INSERT INTO Packages(Id, Name) VALUES('TCVisionFramework', 'TCVision Framework');
INSERT INTO Packages(Id, Name)  VALUES('RTVisionFramework', 'RTVision Framework');
INSERT INTO Packages(Id, Name)  VALUES('RTVision3dFramework', 'RTVision.3d Framework');

INSERT INTO Features(Id, Name, PackageId) VALUES('#UserManagement', 'User Management', 'StandardFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#DataExport', 'Data Export', 'StandardFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#BiometricAccess', 'Biometric Authentification', 'StandardFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#Report', 'Report', 'StandardFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#ModelSearch', 'Model Search', 'StandardFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#Automatic', 'Automatic', 'StandardFramework');

INSERT INTO Features(Id, Name, PackageId) VALUES('#ResultOverview', 'Result Overview', 'RTVisionFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#PatchInspection', 'Patch Inspection', 'RTVisionFramework');

INSERT INTO Features(Id, Name, PackageId) VALUES('#PrimerInspection', 'Primer Inspection', 'RTVision3dFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#VolumeInspection', 'Volume Inspection', 'RTVision3dFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#Teaching', 'Teaching', 'RTVision3dFramework');
INSERT INTO Features(Id, Name, PackageId) VALUES('#PositionCorrection', 'Position Correction', 'RTVision3dFramework');
