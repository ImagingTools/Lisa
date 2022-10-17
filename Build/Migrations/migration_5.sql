DROP TABLE "UserRoles";

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
    SettingType VARCHAR (1000) NOT NULL,
	SettingValue VARCHAR (1000) NOT NULL,
    PRIMARY KEY (UserId, SettingType),
    FOREIGN KEY (UserId) REFERENCES "Users" (UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "UsersSessions"(
	AccessToken UUID NOT NULL,
    UserId VARCHAR (1000) NOT NULL,
    LastActivity TIMESTAMP NOT NULL,
	PRIMARY KEY (AccessToken),
    FOREIGN KEY (UserId) REFERENCES "Users" (UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "ProductLicenseFeatures" ADD COLUMN ParentFeatureId VARCHAR (1000);

UPDATE "ProductLicenseFeatures" SET ParentFeatureId = (SELECT ParentId FROM "Features" WHERE Id = FeatureId);

ALTER TABLE "ProductLicenseFeatures" ADD FOREIGN KEY (ParentFeatureId)
  REFERENCES "Features"(Id) ON DELETE CASCADE ON UPDATE CASCADE;



