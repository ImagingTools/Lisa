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

INSERT INTO Products(Id, Name, Description) VALUES('TCVision.l', 'TCVision.l', 'Shell inspection (Liner)');
INSERT INTO Products(Id, Name, Description) VALUES('TCVision.e', 'TCVision.e', 'End inspection');

INSERT INTO Products(Id, Name, Description) VALUES('RTVision', 'RTVision', 'Glue width inspection based in 2D-space');
INSERT INTO ProductLicenses(Id, Name, Description, ProductId) VALUES('12.1234', 'Standard', 'Standard license for RTVision product', 'RTVision');

INSERT INTO Products(Id, Name, Description) VALUES('RTVision.3d', 'RTVision.3d', 'Complete glue evaluation in 3D-space');
INSERT INTO ProductLicenses(Id, Name, Description, ProductId) VALUES('12.10128', 'Standard', 'Standard license for RTVision.3d product', 'RTVision.3d');
INSERT INTO ProductLicenses(Id, Name, Description, ProductId) VALUES('12.10135', 'Advanced', 'Advanced license for RTVision.3d product', 'RTVision.3d');
INSERT INTO ProductLicenses(Id, Name, Description, ProductId) VALUES('12.10140', 'Position Correction', 'Standard + position correction license for RTVision.3d product', 'RTVision.3d');