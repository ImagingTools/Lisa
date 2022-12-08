CREATE TABLE "UserRoles"(
    UserId VARCHAR (1000) NOT NULL,
    RoleId VARCHAR (1000) NOT NULL,
	ProductId VARCHAR (1000) NOT NULL,
    PRIMARY KEY (UserId, RoleId, ProductId),
    FOREIGN KEY (RoleId, ProductId) REFERENCES "Roles" (RoleId, ProductId) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserId) REFERENCES "Users" (UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "Features" ADD COLUMN Optional BOOLEAN;

UPDATE "Features" SET Optional = true WHERE ParentId is null;
UPDATE "Features" SET Optional = false WHERE ParentId is not null;

CREATE TABLE "UsersSettings"(
    UserId VARCHAR (1000) NOT NULL,
    Settings TEXT NOT NULL,
    PRIMARY KEY (UserId),
    FOREIGN KEY (UserId) REFERENCES "Users" (UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "UsersSessions"(
	AccessToken UUID NOT NULL,
    UserId VARCHAR (1000) NOT NULL,
    LastActivity TIMESTAMP NOT NULL,
	PRIMARY KEY (AccessToken),
    FOREIGN KEY (UserId) REFERENCES "Users" (UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "FeatureDependencies" ADD FOREIGN KEY (DependencyId)
	REFERENCES "Features"(Id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FeatureDependencies" ADD FOREIGN KEY (FeatureId)
  REFERENCES "Features"(Id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductLicenseFeatures" ADD FOREIGN KEY (FeatureId)
	REFERENCES "Features"(Id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Features" ALTER COLUMN PackageId DROP NOT NULL;
ALTER TABLE "Roles" DROP CONSTRAINT roles_productid_fkey;
