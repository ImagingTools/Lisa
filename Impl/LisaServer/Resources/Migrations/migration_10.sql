CREATE TABLE "LicenseDependencies"(
  "LicenseId" VARCHAR (1000) NOT NULL,
  "DependencyId" VARCHAR (1000) NOT NULL,
  PRIMARY KEY ("LicenseId", "DependencyId"),
  FOREIGN KEY ("LicenseId") REFERENCES "ProductLicenses"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("DependencyId") REFERENCES "ProductLicenses"("Id") ON DELETE CASCADE ON UPDATE CASCADE
);