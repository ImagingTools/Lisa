ALTER TABLE "Users" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "Users" RENAME COLUMN Password TO "Password";
ALTER TABLE "Users" RENAME COLUMN Name TO "Name";
ALTER TABLE "Users" RENAME COLUMN Email TO "Email";
ALTER TABLE "Users" RENAME COLUMN Description TO "Description";
ALTER TABLE "Users" RENAME COLUMN Added TO "Added";
ALTER TABLE "Users" RENAME COLUMN LastModified TO "LastModified";

ALTER TYPE ActionType RENAME TO "ActionType";

ALTER TABLE "UserActionLog" RENAME COLUMN Id TO "Id";
ALTER TABLE "UserActionLog" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "UserActionLog" RENAME COLUMN Action TO "Action";
ALTER TABLE "UserActionLog" RENAME COLUMN ActionTime TO "ActionTime";

ALTER TABLE "Roles" RENAME COLUMN RoleId TO "RoleId";
ALTER TABLE "Roles" RENAME COLUMN ProductId TO "ProductId";
ALTER TABLE "Roles" RENAME COLUMN Name TO "Name";
ALTER TABLE "Roles" RENAME COLUMN Description TO "Description";

ALTER TABLE "ParentRoles" RENAME COLUMN RoleId TO "RoleId";
ALTER TABLE "ParentRoles" RENAME COLUMN ProductId TO "ProductId";
ALTER TABLE "ParentRoles" RENAME COLUMN ParentRoleId TO "ParentRoleId";
ALTER TABLE "ParentRoles" RENAME COLUMN ParentProductId TO "ParentProductId";

ALTER TABLE "UserGroups" RENAME COLUMN UserGroupId TO "UserGroupId";
ALTER TABLE "UserGroups" RENAME COLUMN Name TO "Name";
ALTER TABLE "UserGroups" RENAME COLUMN Description TO "Description";

ALTER TABLE "GroupUsers" RENAME COLUMN GroupId TO "GroupId";
ALTER TABLE "GroupUsers" RENAME COLUMN UserId TO "UserId";

ALTER TABLE "ParentGroups" RENAME COLUMN UserGroupId TO "UserGroupId";
ALTER TABLE "ParentGroups" RENAME COLUMN ParentUserGroupId TO "ParentUserGroupId";

ALTER TABLE "RolePermissions" RENAME COLUMN RoleId TO "RoleId";
ALTER TABLE "RolePermissions" RENAME COLUMN ProductId TO "ProductId";
ALTER TABLE "RolePermissions" RENAME COLUMN PermissionId TO "PermissionId";
ALTER TABLE "RolePermissions" RENAME COLUMN PermissionState TO "PermissionState";

ALTER TABLE "UserPermissions" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "UserPermissions" RENAME COLUMN PermissionId TO "PermissionId";

ALTER TABLE "UserRoles" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "UserRoles" RENAME COLUMN RoleId TO "RoleId";
ALTER TABLE "UserRoles" RENAME COLUMN ProductId TO "ProductId";

ALTER TABLE "UsersSettings" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "UsersSettings" RENAME COLUMN Settings TO "Settings";

ALTER TABLE "UsersSessions" RENAME COLUMN AccessToken TO "AccessToken";
ALTER TABLE "UsersSessions" RENAME COLUMN UserId TO "UserId";
ALTER TABLE "UsersSessions" RENAME COLUMN LastActivity TO "LastActivity";

ALTER TABLE "UsersSessions" RENAME TO "UserSessions";
ALTER TABLE "UsersSettings" RENAME TO "UserSettings";

ALTER TABLE "FeatureDependencies" RENAME COLUMN FeatureId TO "FeatureId";
ALTER TABLE "FeatureDependencies" RENAME COLUMN DependencyId TO "DependencyId";

ALTER TABLE "Features" RENAME COLUMN Id TO "Id";
ALTER TABLE "Features" RENAME COLUMN Name TO "Name";
ALTER TABLE "Features" RENAME COLUMN Description TO "Description";
ALTER TABLE "Features" RENAME COLUMN PackageId TO "PackageId";
ALTER TABLE "Features" RENAME COLUMN ParentId TO "ParentId";
ALTER TABLE "Features" RENAME COLUMN Optional TO "Optional";

ALTER TABLE "Packages" RENAME COLUMN Id TO "Id";
ALTER TABLE "Packages" RENAME COLUMN Name TO "Name";
ALTER TABLE "Packages" RENAME COLUMN Description TO "Description";
ALTER TABLE "Packages" RENAME COLUMN Added TO "Added";
ALTER TABLE "Packages" RENAME COLUMN LastModified TO "LastModified";

ALTER TABLE "ProductInstanceLicenses" RENAME COLUMN InstanceId TO "InstanceId";
ALTER TABLE "ProductInstanceLicenses" RENAME COLUMN LicenseId TO "LicenseId";
ALTER TABLE "ProductInstanceLicenses" RENAME COLUMN ProductId TO "ProductId";
ALTER TABLE "ProductInstanceLicenses" RENAME COLUMN ExpirationDate TO "ExpirationDate";

ALTER TABLE "ProductInstances" RENAME COLUMN InstanceId TO "InstanceId";
ALTER TABLE "ProductInstances" RENAME COLUMN ProductId TO "ProductId";
ALTER TABLE "ProductInstances" RENAME COLUMN AccountId TO "AccountId";
ALTER TABLE "ProductInstances" RENAME COLUMN Name TO "Name";
ALTER TABLE "ProductInstances" RENAME COLUMN Description TO "Description";
ALTER TABLE "ProductInstances" RENAME COLUMN Added TO "Added";
ALTER TABLE "ProductInstances" RENAME COLUMN LastModified TO "LastModified";

ALTER TABLE "ProductLicenseFeatures" RENAME COLUMN LicenseId TO "LicenseId";
ALTER TABLE "ProductLicenseFeatures" RENAME COLUMN FeatureId TO "FeatureId";

ALTER TABLE "ProductLicenses" RENAME COLUMN Id TO "Id";
ALTER TABLE "ProductLicenses" RENAME COLUMN Name TO "Name";
ALTER TABLE "ProductLicenses" RENAME COLUMN Description TO "Description";
ALTER TABLE "ProductLicenses" RENAME COLUMN ProductId TO "ProductId";

ALTER TABLE "Products" RENAME COLUMN Id TO "Id";
ALTER TABLE "Products" RENAME COLUMN Name TO "Name";
ALTER TABLE "Products" RENAME COLUMN Description TO "Description";
ALTER TABLE "Products" RENAME COLUMN Added TO "Added";
ALTER TABLE "Products" RENAME COLUMN LastModified TO "LastModified";
ALTER TABLE "Products" RENAME COLUMN CategoryId TO "CategoryId";
