ALTER TABLE features ADD COLUMN ParentId CHARACTER VARYING(1000);
ALTER TABLE features ADD FOREIGN KEY (ParentId)
  REFERENCES features(Id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE packages RENAME TO "Packages";
ALTER TABLE accounts RENAME TO "Accounts";
ALTER TABLE featuredependencies RENAME TO "FeatureDependencies";
ALTER TABLE features RENAME TO "Features";
ALTER TABLE groupusers RENAME TO "GroupUsers";
ALTER TABLE parentgroups RENAME TO "ParentGroups";
ALTER TABLE parentroles RENAME TO "ParentRoles";
ALTER TABLE productinstancelicenses RENAME TO "ProductInstanceLicenses";
ALTER TABLE productinstances RENAME TO "ProductInstances";
ALTER TABLE products RENAME TO "Products";
ALTER TABLE revisions RENAME TO "Revisions";
ALTER TABLE rolepermissions RENAME TO "RolePermissions";
ALTER TABLE roles RENAME TO "Roles";
ALTER TABLE useractionlog RENAME TO "UserActionLog";
ALTER TABLE usergroups RENAME TO "UserGroups";
ALTER TABLE userpermissions RENAME TO "UserPermissions";
ALTER TABLE userroles RENAME TO "UserRoles";
ALTER TABLE users RENAME TO "Users";
ALTER TABLE productlicenses RENAME TO "ProductLicenses";
ALTER TABLE productlicensefeatures RENAME TO "ProductLicenseFeatures";
















