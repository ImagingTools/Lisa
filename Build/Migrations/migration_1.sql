CREATE TABLE NewFeatures(
    Id VARCHAR (1000) NOT NULL,
	Name VARCHAR (1000) NOT NULL,
	Description VARCHAR (1000),
	PackageId VARCHAR (1000) NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (PackageId) REFERENCES Packages(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewProductLicenses(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  ProductId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewFeatureDependencies(
  FeatureId VARCHAR (1000) NOT NULL,
  DependencyId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (FeatureId, DependencyId),
  FOREIGN KEY (FeatureId) REFERENCES NewFeatures(Id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (DependencyId) REFERENCES NewFeatures(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewProductLicenseFeatures(
  LicenseId VARCHAR (1000) NOT NULL,
  FeatureId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (LicenseId, FeatureId),
  FOREIGN KEY (LicenseId) REFERENCES NewProductLicenses(Id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (FeatureId) REFERENCES NewFeatures(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewProductInstances(
    InstanceId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
	AccountId VARCHAR (1000) NOT NULL,
	Name VARCHAR (1000) NOT NULL,
	Description VARCHAR (1000),
	Added TIMESTAMP,
	LastModified TIMESTAMP,
	PRIMARY KEY (InstanceId),
	FOREIGN KEY (AccountId) REFERENCES Accounts(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewProductInstanceLicenses(
    InstanceId VARCHAR (1000) NOT NULL,
	LicenseId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
	ExpirationDate DATE,
	PRIMARY KEY (InstanceId, LicenseId),
	FOREIGN KEY (LicenseId) REFERENCES NewProductLicenses(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (InstanceId) REFERENCES NewProductInstances(InstanceId) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO NewFeatures (Id, Name, Description, PackageId) SELECT * FROM Features ON CONFLICT DO NOTHING;
INSERT INTO NewFeatureDependencies (FeatureId, DependencyId) SELECT FeatureId, DependencyId FROM FeatureDependencies;
INSERT INTO NewProductLicenses (Id, Name, Description, ProductId) SELECT * FROM ProductLicenses ON CONFLICT DO NOTHING;
INSERT INTO NewProductLicenseFeatures (LicenseId, FeatureId) SELECT LicenseId, FeatureId FROM ProductLicenseFeatures;
INSERT INTO NewProductInstances (InstanceId, ProductId, AccountId, Name, Description, Added, LastModified) SELECT * FROM ProductInstances;
INSERT INTO NewProductInstanceLicenses (InstanceId, LicenseId, ProductId, ExpirationDate) SELECT * FROM ProductInstanceLicenses;

DROP TABLE ProductLicenses CASCADE;
DROP TABLE Features CASCADE;
DROP TABLE ProductLicenseFeatures CASCADE;
DROP TABLE FeatureDependencies CASCADE;
DROP TABLE ProductInstances CASCADE;
DROP TABLE ProductInstanceLicenses CASCADE;

ALTER TABLE NewFeatures RENAME TO Features;
ALTER TABLE NewProductLicenses RENAME TO ProductLicenses;
ALTER TABLE NewFeatureDependencies RENAME TO FeatureDependencies;
ALTER TABLE NewProductLicenseFeatures RENAME TO ProductLicenseFeatures;
ALTER TABLE NewProductInstanceLicenses RENAME TO ProductInstanceLicenses;
ALTER TABLE NewProductInstances RENAME TO ProductInstances;