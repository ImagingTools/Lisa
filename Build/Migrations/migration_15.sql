-- FEATURES

INSERT INTO public."Features" (
    "Id", "DocumentId", "TypeId", "Name", "Description", "Document", "TimeStamp", "RevisionInfo", "State", "DataMetaInfo"
)
SELECT 
    gen_random_uuid(), -- Генерируем новый UUID вместо SERIAL
    "DocumentId"::UUID, -- Преобразуем в UUID
	'Feature',
	"Document"->>'FeatureName',
	"Document"->>'FeatureDescription',
    "Document",
    COALESCE("LastModified", now()), -- Если NULL, ставим текущее время
    jsonb_build_object(
        'OwnerId', COALESCE("OwnerId", ''),
        'OwnerName', COALESCE("OwnerName", ''),
        'OperationDescription', COALESCE("OperationDescription", ''),
        'RevisionNumber', "RevisionNumber",
        'Checksum', "Checksum"
    ),
    CASE 
        WHEN "IsActive" = TRUE THEN 'Active'
        WHEN "IsActive" = FALSE THEN 'InActive'
        ELSE 'Disabled'
    END::"DocumentState",
    "Document" -- Копируем содержимое "Document" в "DataMetaInfo"
FROM public."Features_new";

DROP TABLE public."Features_new";


-- PRODUCTS

INSERT INTO public."Products" (
    "Id", "DocumentId", "TypeId", "Name", "Description", "Document", "TimeStamp", "RevisionInfo", "State", "DataMetaInfo"
)
SELECT 
    gen_random_uuid(), -- Генерируем новый UUID вместо SERIAL
    "DocumentId"::UUID, -- Преобразуем в UUID
	'Product',
	"Document"->>'ProductName',
	"Document"->>'ProductDescription',
    "Document",
    COALESCE("LastModified", now()), -- Если NULL, ставим текущее время
    jsonb_build_object(
        'OwnerId', COALESCE("OwnerId", ''),
        'OwnerName', COALESCE("OwnerName", ''),
        'OperationDescription', COALESCE("OperationDescription", ''),
        'RevisionNumber', "RevisionNumber",
        'Checksum', "Checksum"
    ),
    CASE 
        WHEN "IsActive" = TRUE THEN 'Active'
        WHEN "IsActive" = FALSE THEN 'InActive'
        ELSE 'Disabled'
    END::"DocumentState",
    "Document" -- Копируем содержимое "Document" в "DataMetaInfo"
FROM public."Products_new";

DROP TABLE public."Products_new";


-- LICENSES

INSERT INTO public."Licenses" (
    "Id", "DocumentId", "TypeId", "Name", "Description", "Document", "TimeStamp", "RevisionInfo", "State", "DataMetaInfo"
)
SELECT 
    gen_random_uuid(), -- Генерируем новый UUID вместо SERIAL
    "DocumentId"::UUID, -- Преобразуем в UUID
	'License',
	"Document"->>'LicenseName',
	"Document"->>'LicenseDescription',
    "Document",
    COALESCE("LastModified", now()), -- Если NULL, ставим текущее время
    jsonb_build_object(
        'OwnerId', COALESCE("OwnerId", ''),
        'OwnerName', COALESCE("OwnerName", ''),
        'OperationDescription', COALESCE("OperationDescription", ''),
        'RevisionNumber', "RevisionNumber",
        'Checksum', "Checksum"
    ),
    CASE 
        WHEN "IsActive" = TRUE THEN 'Active'
        WHEN "IsActive" = FALSE THEN 'InActive'
        ELSE 'Disabled'
    END::"DocumentState",
    "Document" -- Копируем содержимое "Document" в "DataMetaInfo"
FROM public."Licenses_new";

-- 3. Удаляем старую таблицу
DROP TABLE public."Licenses_new";
