DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "Roles" CASCADE;
DROP TABLE IF EXISTS "UserGroups" CASCADE;
DROP TABLE IF EXISTS "UserActionLog" CASCADE;
DROP TABLE IF EXISTS "UserSessions" CASCADE;
DROP TABLE IF EXISTS "Packages" CASCADE;
DROP TABLE IF EXISTS "Features" CASCADE;
DROP TABLE IF EXISTS "FeatureDependencies" CASCADE;
DROP TABLE IF EXISTS "Products" CASCADE;
DROP TABLE IF EXISTS "ProductLicenses" CASCADE;
DROP TABLE IF EXISTS "ProductLicenseFeatures" CASCADE;
DROP TABLE IF EXISTS "LicenseDependencies" CASCADE;
DROP TABLE IF EXISTS "ProductInstanceLicenses" CASCADE;

CREATE TABLE public."Features"
(
    "Id" SERIAL,
    "DocumentId" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "Document" jsonb,
    "RevisionNumber" bigint,
    "LastModified" timestamp without time zone,
    "Checksum" bigint,
    "IsActive" boolean,
    "OwnerId" character varying(1000),
    "OwnerName" character varying(1000),
    "OperationDescription" character varying,
     PRIMARY KEY ("Id")
);


CREATE TABLE public."Products"
(
    "Id" SERIAL,
    "DocumentId" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "Document" jsonb,
    "RevisionNumber" bigint,
    "LastModified" timestamp without time zone,
    "Checksum" bigint,
    "IsActive" boolean,
    "OwnerId" character varying(1000),
    "OwnerName" character varying(1000),
    "OperationDescription" character varying,
     PRIMARY KEY ("Id")
);

CREATE TABLE public."Licenses"
(
    "Id" SERIAL,
    "DocumentId" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "Document" jsonb,
    "RevisionNumber" bigint,
    "LastModified" timestamp without time zone,
    "Checksum" bigint,
    "IsActive" boolean,
    "OwnerId" character varying(1000),
    "OwnerName" character varying(1000),
    "OperationDescription" character varying,
     PRIMARY KEY ("Id")
);
