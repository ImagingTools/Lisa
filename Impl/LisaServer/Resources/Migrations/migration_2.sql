CREATE TABLE NewProductInstances(
    InstanceId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
	AccountId VARCHAR (1000) NOT NULL,
	Name VARCHAR (1000) NOT NULL,
	Description VARCHAR (1000),
	Added TIMESTAMP,
	LastModified TIMESTAMP,
	PRIMARY KEY (InstanceId, ProductId),
	FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (AccountId) REFERENCES Accounts(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE NewProductInstanceLicenses(
    InstanceId VARCHAR (1000) NOT NULL,
	LicenseId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
	ExpirationDate DATE,
	PRIMARY KEY (InstanceId, LicenseId, ProductId),
	FOREIGN KEY (LicenseId) REFERENCES ProductLicenses(Id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (InstanceId, ProductId) REFERENCES NewProductInstances(InstanceId, ProductId) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO NewProductInstances (InstanceId, ProductId, AccountId, Name, Description, Added, LastModified) SELECT * FROM ProductInstances ON CONFLICT DO NOTHING;
INSERT INTO NewProductInstanceLicenses (InstanceId, LicenseId, ProductId, ExpirationDate) SELECT * FROM ProductInstanceLicenses ON CONFLICT DO NOTHING;

DROP TABLE ProductInstanceLicenses CASCADE;
DROP TABLE ProductInstances CASCADE;

ALTER TABLE NewProductInstanceLicenses RENAME TO ProductInstanceLicenses;
ALTER TABLE NewProductInstances RENAME TO ProductInstances;
