CREATE TYPE "DocumentState" AS ENUM ('Active', 'InActive', 'Disabled');

ALTER TABLE public."Features" RENAME TO "Features_new";
ALTER TABLE public."Licenses" RENAME TO "Licenses_new";
ALTER TABLE public."Products" RENAME TO "Products_new";
