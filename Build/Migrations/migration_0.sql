/**
    Logical package/container of features.
*/
CREATE TABLE Packages(
    Id VARCHAR (1000) NOT NULL,
	Name VARCHAR (1000) NOT NULL,
	Description VARCHAR (1000),
	Added TIMESTAMP,
	LastModified TIMESTAMP,
	PRIMARY KEY (Id)
);


/**
    Features assigned to defined packages.
*/
CREATE TABLE Features(
    Id VARCHAR (1000) NOT NULL,
	Name VARCHAR (1000) NOT NULL,
	Description VARCHAR (1000),
	PackageId VARCHAR (1000) NOT NULL,
	PRIMARY KEY (Id, PackageId),
	FOREIGN KEY (PackageId) REFERENCES Packages(Id) ON DELETE CASCADE ON UPDATE CASCADE
);


/**
    Dependencies between features. A Feature B can technically depend on Feature A (By example Feature <Biometric Access> is based on Feature <User Management>.
	In this case including the feature B into a product license means that the Feature A is should be also included.
*/
CREATE TABLE FeatureDependencies(
  FeatureId VARCHAR (1000) NOT NULL,
  FeaturePackageId VARCHAR (1000) NOT NULL,
  DependencyId VARCHAR (1000) NOT NULL,
  DependencyPackageId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (FeatureId, FeaturePackageId, DependencyId, DependencyPackageId),
  FOREIGN KEY (FeatureId, FeaturePackageId) REFERENCES Features(Id, PackageId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (DependencyId, DependencyPackageId) REFERENCES Features(Id, PackageId) ON DELETE CASCADE ON UPDATE CASCADE
);


/**
    List of products.
*/
CREATE TABLE Products(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  Added TIMESTAMP,
  LastModified TIMESTAMP,
  PRIMARY KEY (Id)
);


/**
    List of available product licenses
*/
CREATE TABLE ProductLicenses(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  ProductId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id, ProductId),
  FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE
);


/**
    A product license is defined as a set of features
*/
CREATE TABLE ProductLicenseFeatures(
  ProductId VARCHAR (1000) NOT NULL,
  LicenseId VARCHAR (1000) NOT NULL,
  PackageId VARCHAR (1000) NOT NULL,
  FeatureId VARCHAR (1000) NOT NULL,
  PRIMARY KEY (ProductId, LicenseId, PackageId, FeatureId),
  FOREIGN KEY (LicenseId, ProductId) REFERENCES ProductLicenses(Id, ProductId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (FeatureId, PackageId) REFERENCES Features(Id, PackageId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TYPE AccountType AS ENUM ('private', 'company');

CREATE TABLE Accounts(
  Id VARCHAR (1000) NOT NULL,
  Name VARCHAR (1000) NOT NULL,
  Description VARCHAR (1000),
  Type AccountType NOT NULL,
  OwnerMail VARCHAR (1000) NOT NULL,
  OwnerFirstName VARCHAR (1000) NOT NULL,
  OwnerLastName VARCHAR (1000) NOT NULL,
  PRIMARY KEY (Id)
);


CREATE TABLE ProductInstances(
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

CREATE TABLE ProductInstanceLicenses(
    InstanceId VARCHAR (1000) NOT NULL,
	LicenseId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
	ExpirationDate DATE,
	PRIMARY KEY (InstanceId, LicenseId, ProductId),
	FOREIGN KEY (LicenseId, ProductId) REFERENCES ProductLicenses(Id, ProductId) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (InstanceId) REFERENCES ProductInstances(InstanceId) ON DELETE CASCADE ON UPDATE CASCADE
);