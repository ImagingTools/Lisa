DELETE FROM public."GroupUsers";
DROP TABLE public."GroupUsers";

DELETE FROM public."ParentGroups";
DROP TABLE public."ParentGroups";

DELETE FROM public."UserGroups";
DROP TABLE public."UserGroups";

CREATE TABLE public."UserGroups"
(
    "Id" SERIAL,
    "DocumentId" character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    "Document" jsonb,
    "RevisionNumber" bigint,
    "LastModified" timestamp without time zone,
    "Checksum" bigint,
    "IsActive" boolean,
    CONSTRAINT "Orders_pkey" PRIMARY KEY ("Id")
)
