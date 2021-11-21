CREATE TABLE Packages(
   Id VARCHAR (1000) NOT NULL,
   Name VARCHAR (1000) NOT NULL,
   Description VARCHAR (1000),
   Added TIMESTAMP,
   LastModified TIMESTAMP,
   PRIMARY KEY (Id)
);


CREATE TABLE Features(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  PackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id, PackageId),
  FOREIGN KEY (PackageId) REFERENCES Packages(Id) ON UPDATE CASCADE,
  FOREIGN KEY (PackageId) REFERENCES Packages(Id) ON DELETE CASCADE
);


CREATE TABLE Products(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  PRIMARY KEY (Id)
);


CREATE TABLE ProductLicenses(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  ProductId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (ProductId) REFERENCES Products(Id) ON UPDATE CASCADE,
  FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);


CREATE TABLE ProductLicenseFeatures(
  LicenseId VARCHAR (1000) NOT NULL,
  FeatureId VARCHAR (1000) NOT NULL,
  PackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (LicenseId, FeatureId),
  FOREIGN KEY (LicenseId) REFERENCES ProductLicenses(Id) ON UPDATE CASCADE,
  FOREIGN KEY (LicenseId) REFERENCES ProductLicenses(Id) ON DELETE CASCADE,
  FOREIGN KEY (FeatureId, PackageId) REFERENCES Features(Id, PackageId) ON UPDATE CASCADE,
  FOREIGN KEY (FeatureId, PackageId) REFERENCES Features(Id, PackageId) ON DELETE CASCADE
);


CREATE TABLE FeatureDependencies(
  FeatureId VARCHAR (1000) NOT NULL,
  FeaturePackageId VARCHAR (1000) NOT NULL,
  DependencyId VARCHAR (1000) NOT NULL,
  DependencyPackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (FeatureId, FeaturePackageId, DependencyId, DependencyPackageId),
  FOREIGN KEY (FeatureId, FeaturePackageId) REFERENCES Features(Id, PackageId),
  FOREIGN KEY (DependencyId, DependencyPackageId) REFERENCES Features(Id, PackageId)
);


INSERT INTO Packages(Id, Name, Description, Added) VALUES('StandardFramework', 'Standard Framework', 'Common features for all products', NOW());
INSERT INTO Packages(Id, Name, Description, Added) VALUES('TCVisionFramework', 'TCVision Framework', 'Common features for all products of the TCVision family', NOW());
INSERT INTO Packages(Id, Name, Description, Added)  VALUES('RTVisionFramework', 'RTVision Framework', 'Common features for all products of the RTVision family', NOW());
INSERT INTO Packages(Id, Name, Description, Added)  VALUES('RTVision3dFramework', 'RTVision.3d Framework', 'Common features of the RTV-3D-products', NOW());

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
