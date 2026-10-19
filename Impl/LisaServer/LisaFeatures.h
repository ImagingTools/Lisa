// Qt includes
#include <QtCore/qglobal.h>

// ImtCore includes
#include <imtlic/CProductInfo.h>
#include <imtlic/CFeatureInfo.h>


namespace lisa
{


static void FillProduct(imtlic::IProductInfo& productInfo){
	productInfo.SetProductId("Lisa");
	productInfo.SetName(QT_TRANSLATE_NOOP("Product", "Lisa"));
	productInfo.SetCategoryId("Software");

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> featureManagementFeatureInfo;
	featureManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	featureManagementFeatureInfo->SetObjectUuid("9e32f708-df7c-47a6-a383-92afd3b1138b");
	featureManagementFeatureInfo->SetFeatureId("FeatureManagement");
	featureManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Feature Management"));
	featureManagementFeatureInfo->SetOptional(false);
	featureManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementViewPageFeatureInfo;
	featureManagementViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementViewPageFeatureInfo->SetFeatureId("ViewPage");
	featureManagementViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Feature Page"));
	featureManagementViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the feature page."));
	featureManagementViewPageFeatureInfo->SetOptional(false);
	featureManagementViewPageFeatureInfo->SetIsPermission(true);

	featureManagementFeatureInfo->InsertSubFeature(featureManagementViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementViewFeatureInfo;
	featureManagementViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementViewFeatureInfo->SetFeatureId("View");
	featureManagementViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Features"));
	featureManagementViewFeatureInfo->SetOptional(false);
	featureManagementViewFeatureInfo->SetIsPermission(true);

	featureManagementFeatureInfo->InsertSubFeature(featureManagementViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementEditFeatureInfo;
	featureManagementEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementEditFeatureInfo->SetFeatureId("Edit");
	featureManagementEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Feature"));
	featureManagementEditFeatureInfo->SetOptional(false);
	featureManagementEditFeatureInfo->SetIsPermission(true);
	featureManagementEditFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementEditAddFeatureInfo;
	featureManagementEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementEditAddFeatureInfo->SetFeatureId("Add");
	featureManagementEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Feature"));
	featureManagementEditAddFeatureInfo->SetOptional(false);
	featureManagementEditAddFeatureInfo->SetIsPermission(true);

	featureManagementEditFeatureInfo->InsertSubFeature(featureManagementEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementEditRemoveFeatureInfo;
	featureManagementEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementEditRemoveFeatureInfo->SetFeatureId("Remove");
	featureManagementEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Feature"));
	featureManagementEditRemoveFeatureInfo->SetOptional(false);
	featureManagementEditRemoveFeatureInfo->SetIsPermission(true);

	featureManagementEditFeatureInfo->InsertSubFeature(featureManagementEditRemoveFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementEditChangeFeatureInfo;
	featureManagementEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementEditChangeFeatureInfo->SetFeatureId("Change");
	featureManagementEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Feature"));
	featureManagementEditChangeFeatureInfo->SetOptional(false);
	featureManagementEditChangeFeatureInfo->SetIsPermission(true);

	featureManagementEditFeatureInfo->InsertSubFeature(featureManagementEditChangeFeatureInfo.PopPtr());

	featureManagementFeatureInfo->InsertSubFeature(featureManagementEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementRevisionsFeatureInfo;
	featureManagementRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementRevisionsFeatureInfo->SetFeatureId("Revisions");
	featureManagementRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Feature Revisions"));
	featureManagementRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of feature."));
	featureManagementRevisionsFeatureInfo->SetOptional(false);
	featureManagementRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementRevisionsViewFeatureInfo;
	featureManagementRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementRevisionsViewFeatureInfo->SetFeatureId("View");
	featureManagementRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Feature Revisions"));
	featureManagementRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of feature."));
	featureManagementRevisionsViewFeatureInfo->SetOptional(false);
	featureManagementRevisionsViewFeatureInfo->SetIsPermission(true);
	featureManagementRevisionsViewFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/View").split(';'));

	featureManagementRevisionsFeatureInfo->InsertSubFeature(featureManagementRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementRevisionsRestoreFeatureInfo;
	featureManagementRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	featureManagementRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Feature Revision"));
	featureManagementRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of feature."));
	featureManagementRevisionsRestoreFeatureInfo->SetOptional(false);
	featureManagementRevisionsRestoreFeatureInfo->SetIsPermission(true);
	featureManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/Revisions/View").split(';'));

	featureManagementRevisionsFeatureInfo->InsertSubFeature(featureManagementRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> featureManagementRevisionsDeleteFeatureInfo;
	featureManagementRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	featureManagementRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	featureManagementRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Feature Revision"));
	featureManagementRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of feature."));
	featureManagementRevisionsDeleteFeatureInfo->SetOptional(false);
	featureManagementRevisionsDeleteFeatureInfo->SetIsPermission(true);
	featureManagementRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/Revisions/View").split(';'));

	featureManagementRevisionsFeatureInfo->InsertSubFeature(featureManagementRevisionsDeleteFeatureInfo.PopPtr());

	featureManagementFeatureInfo->InsertSubFeature(featureManagementRevisionsFeatureInfo.PopPtr());

	productInfo.AddFeature("9e32f708-df7c-47a6-a383-92afd3b1138b", *featureManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> productManagementFeatureInfo;
	productManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	productManagementFeatureInfo->SetObjectUuid("461f89cc-da43-4db2-9f5b-e9052b81f4df");
	productManagementFeatureInfo->SetFeatureId("ProductManagement");
	productManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Product Management"));
	productManagementFeatureInfo->SetOptional(false);
	productManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementViewPageFeatureInfo;
	productManagementViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementViewPageFeatureInfo->SetFeatureId("ViewPage");
	productManagementViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Product Page"));
	productManagementViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the product page."));
	productManagementViewPageFeatureInfo->SetOptional(false);
	productManagementViewPageFeatureInfo->SetIsPermission(true);

	productManagementFeatureInfo->InsertSubFeature(productManagementViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementViewFeatureInfo;
	productManagementViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementViewFeatureInfo->SetFeatureId("View");
	productManagementViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Products"));
	productManagementViewFeatureInfo->SetOptional(false);
	productManagementViewFeatureInfo->SetIsPermission(true);

	productManagementFeatureInfo->InsertSubFeature(productManagementViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementEditFeatureInfo;
	productManagementEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementEditFeatureInfo->SetFeatureId("Edit");
	productManagementEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Product"));
	productManagementEditFeatureInfo->SetOptional(false);
	productManagementEditFeatureInfo->SetIsPermission(true);
	productManagementEditFeatureInfo->SetRequirements(QByteArray("/ProductManagement/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementEditAddFeatureInfo;
	productManagementEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementEditAddFeatureInfo->SetFeatureId("Add");
	productManagementEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Product"));
	productManagementEditAddFeatureInfo->SetOptional(false);
	productManagementEditAddFeatureInfo->SetIsPermission(true);

	productManagementEditFeatureInfo->InsertSubFeature(productManagementEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementEditRemoveFeatureInfo;
	productManagementEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementEditRemoveFeatureInfo->SetFeatureId("Remove");
	productManagementEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Product"));
	productManagementEditRemoveFeatureInfo->SetOptional(false);
	productManagementEditRemoveFeatureInfo->SetIsPermission(true);

	productManagementEditFeatureInfo->InsertSubFeature(productManagementEditRemoveFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementEditChangeFeatureInfo;
	productManagementEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementEditChangeFeatureInfo->SetFeatureId("Change");
	productManagementEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Product"));
	productManagementEditChangeFeatureInfo->SetOptional(false);
	productManagementEditChangeFeatureInfo->SetIsPermission(true);

	productManagementEditFeatureInfo->InsertSubFeature(productManagementEditChangeFeatureInfo.PopPtr());

	productManagementFeatureInfo->InsertSubFeature(productManagementEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementRevisionsFeatureInfo;
	productManagementRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementRevisionsFeatureInfo->SetFeatureId("Revisions");
	productManagementRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Product Revisions"));
	productManagementRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of product."));
	productManagementRevisionsFeatureInfo->SetOptional(false);
	productManagementRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementRevisionsViewFeatureInfo;
	productManagementRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementRevisionsViewFeatureInfo->SetFeatureId("View");
	productManagementRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Product Revisions"));
	productManagementRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of product."));
	productManagementRevisionsViewFeatureInfo->SetOptional(false);
	productManagementRevisionsViewFeatureInfo->SetIsPermission(true);
	productManagementRevisionsViewFeatureInfo->SetRequirements(QByteArray("/ProductManagement/View").split(';'));

	productManagementRevisionsFeatureInfo->InsertSubFeature(productManagementRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementRevisionsRestoreFeatureInfo;
	productManagementRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	productManagementRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Product Revision"));
	productManagementRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of product."));
	productManagementRevisionsRestoreFeatureInfo->SetOptional(false);
	productManagementRevisionsRestoreFeatureInfo->SetIsPermission(true);
	productManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/ProductManagement/Revisions/View").split(';'));

	productManagementRevisionsFeatureInfo->InsertSubFeature(productManagementRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> productManagementRevisionsDeleteFeatureInfo;
	productManagementRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	productManagementRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	productManagementRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Product Revision"));
	productManagementRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of product."));
	productManagementRevisionsDeleteFeatureInfo->SetOptional(false);
	productManagementRevisionsDeleteFeatureInfo->SetIsPermission(true);
	productManagementRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/ProductManagement/Revisions/View").split(';'));

	productManagementRevisionsFeatureInfo->InsertSubFeature(productManagementRevisionsDeleteFeatureInfo.PopPtr());

	productManagementFeatureInfo->InsertSubFeature(productManagementRevisionsFeatureInfo.PopPtr());

	productInfo.AddFeature("461f89cc-da43-4db2-9f5b-e9052b81f4df", *productManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> licenseDefinitionManagementFeatureInfo;
	licenseDefinitionManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	licenseDefinitionManagementFeatureInfo->SetObjectUuid("a670fc3b-563d-4e46-9b59-ccc6434d206d");
	licenseDefinitionManagementFeatureInfo->SetFeatureId("LicenseDefinitionManagement");
	licenseDefinitionManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "License Definition Management"));
	licenseDefinitionManagementFeatureInfo->SetOptional(false);
	licenseDefinitionManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementViewPageFeatureInfo;
	licenseDefinitionManagementViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementViewPageFeatureInfo->SetFeatureId("ViewPage");
	licenseDefinitionManagementViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View License Definition Page"));
	licenseDefinitionManagementViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the license definition page."));
	licenseDefinitionManagementViewPageFeatureInfo->SetOptional(false);
	licenseDefinitionManagementViewPageFeatureInfo->SetIsPermission(true);

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(licenseDefinitionManagementViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementViewFeatureInfo;
	licenseDefinitionManagementViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementViewFeatureInfo->SetFeatureId("View");
	licenseDefinitionManagementViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Licenses Definition"));
	licenseDefinitionManagementViewFeatureInfo->SetOptional(false);
	licenseDefinitionManagementViewFeatureInfo->SetIsPermission(true);

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(licenseDefinitionManagementViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementEditFeatureInfo;
	licenseDefinitionManagementEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementEditFeatureInfo->SetFeatureId("Edit");
	licenseDefinitionManagementEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit License Definition"));
	licenseDefinitionManagementEditFeatureInfo->SetOptional(false);
	licenseDefinitionManagementEditFeatureInfo->SetIsPermission(true);
	licenseDefinitionManagementEditFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementEditAddFeatureInfo;
	licenseDefinitionManagementEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementEditAddFeatureInfo->SetFeatureId("Add");
	licenseDefinitionManagementEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add License Definition"));
	licenseDefinitionManagementEditAddFeatureInfo->SetOptional(false);
	licenseDefinitionManagementEditAddFeatureInfo->SetIsPermission(true);

	licenseDefinitionManagementEditFeatureInfo->InsertSubFeature(licenseDefinitionManagementEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementEditRemoveFeatureInfo;
	licenseDefinitionManagementEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementEditRemoveFeatureInfo->SetFeatureId("Remove");
	licenseDefinitionManagementEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove License Definition"));
	licenseDefinitionManagementEditRemoveFeatureInfo->SetOptional(false);
	licenseDefinitionManagementEditRemoveFeatureInfo->SetIsPermission(true);

	licenseDefinitionManagementEditFeatureInfo->InsertSubFeature(licenseDefinitionManagementEditRemoveFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementEditChangeFeatureInfo;
	licenseDefinitionManagementEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementEditChangeFeatureInfo->SetFeatureId("Change");
	licenseDefinitionManagementEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change License Definition"));
	licenseDefinitionManagementEditChangeFeatureInfo->SetOptional(false);
	licenseDefinitionManagementEditChangeFeatureInfo->SetIsPermission(true);

	licenseDefinitionManagementEditFeatureInfo->InsertSubFeature(licenseDefinitionManagementEditChangeFeatureInfo.PopPtr());

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(licenseDefinitionManagementEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementRevisionsFeatureInfo;
	licenseDefinitionManagementRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementRevisionsFeatureInfo->SetFeatureId("Revisions");
	licenseDefinitionManagementRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "License Definition Revisions"));
	licenseDefinitionManagementRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of license definition."));
	licenseDefinitionManagementRevisionsFeatureInfo->SetOptional(false);
	licenseDefinitionManagementRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementRevisionsViewFeatureInfo;
	licenseDefinitionManagementRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetFeatureId("View");
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View License Definition Revisions"));
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of license definition."));
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetOptional(false);
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetIsPermission(true);
	licenseDefinitionManagementRevisionsViewFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/View").split(';'));

	licenseDefinitionManagementRevisionsFeatureInfo->InsertSubFeature(licenseDefinitionManagementRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementRevisionsRestoreFeatureInfo;
	licenseDefinitionManagementRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore License Definition Revision"));
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of license definition."));
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetOptional(false);
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetIsPermission(true);
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/Revisions/View").split(';'));

	licenseDefinitionManagementRevisionsFeatureInfo->InsertSubFeature(licenseDefinitionManagementRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementRevisionsDeleteFeatureInfo;
	licenseDefinitionManagementRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete License Definition Revision"));
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of license definition."));
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetOptional(false);
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetIsPermission(true);
	licenseDefinitionManagementRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/Revisions/View").split(';'));

	licenseDefinitionManagementRevisionsFeatureInfo->InsertSubFeature(licenseDefinitionManagementRevisionsDeleteFeatureInfo.PopPtr());

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(licenseDefinitionManagementRevisionsFeatureInfo.PopPtr());

	productInfo.AddFeature("a670fc3b-563d-4e46-9b59-ccc6434d206d", *licenseDefinitionManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> administrationFeatureInfo;
	administrationFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	administrationFeatureInfo->SetObjectUuid("ce4a7f72-5303-4044-b25c-3a02020eebd3");
	administrationFeatureInfo->SetFeatureId("Administration");
	administrationFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Administration"));
	administrationFeatureInfo->SetOptional(false);
	administrationFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersFeatureInfo;
	administrationUsersFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersFeatureInfo->SetFeatureId("Users");
	administrationUsersFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Users"));
	administrationUsersFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the users."));
	administrationUsersFeatureInfo->SetOptional(false);
	administrationUsersFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersViewPageFeatureInfo;
	administrationUsersViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersViewPageFeatureInfo->SetFeatureId("ViewPage");
	administrationUsersViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Users Page"));
	administrationUsersViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the users page."));
	administrationUsersViewPageFeatureInfo->SetOptional(false);
	administrationUsersViewPageFeatureInfo->SetIsPermission(true);

	administrationUsersFeatureInfo->InsertSubFeature(administrationUsersViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersViewFeatureInfo;
	administrationUsersViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersViewFeatureInfo->SetFeatureId("View");
	administrationUsersViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Users"));
	administrationUsersViewFeatureInfo->SetOptional(false);
	administrationUsersViewFeatureInfo->SetIsPermission(true);

	administrationUsersFeatureInfo->InsertSubFeature(administrationUsersViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersViewHistoryFeatureInfo;
	administrationUsersViewHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersViewHistoryFeatureInfo->SetFeatureId("ViewHistory");
	administrationUsersViewHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View User History"));
	administrationUsersViewHistoryFeatureInfo->SetOptional(false);
	administrationUsersViewHistoryFeatureInfo->SetIsPermission(true);
	administrationUsersViewHistoryFeatureInfo->SetRequirements(QByteArray("/Administration/Users/View").split(';'));

	administrationUsersFeatureInfo->InsertSubFeature(administrationUsersViewHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersEditFeatureInfo;
	administrationUsersEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersEditFeatureInfo->SetFeatureId("Edit");
	administrationUsersEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit User"));
	administrationUsersEditFeatureInfo->SetOptional(false);
	administrationUsersEditFeatureInfo->SetIsPermission(true);
	administrationUsersEditFeatureInfo->SetRequirements(QByteArray("/Administration/Users/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersEditAddFeatureInfo;
	administrationUsersEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersEditAddFeatureInfo->SetFeatureId("Add");
	administrationUsersEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add User"));
	administrationUsersEditAddFeatureInfo->SetOptional(false);
	administrationUsersEditAddFeatureInfo->SetIsPermission(true);

	administrationUsersEditFeatureInfo->InsertSubFeature(administrationUsersEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersEditChangeFeatureInfo;
	administrationUsersEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersEditChangeFeatureInfo->SetFeatureId("Change");
	administrationUsersEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change User"));
	administrationUsersEditChangeFeatureInfo->SetOptional(false);
	administrationUsersEditChangeFeatureInfo->SetIsPermission(true);

	administrationUsersEditFeatureInfo->InsertSubFeature(administrationUsersEditChangeFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersEditRemoveFeatureInfo;
	administrationUsersEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersEditRemoveFeatureInfo->SetFeatureId("Remove");
	administrationUsersEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove User"));
	administrationUsersEditRemoveFeatureInfo->SetOptional(false);
	administrationUsersEditRemoveFeatureInfo->SetIsPermission(true);

	administrationUsersEditFeatureInfo->InsertSubFeature(administrationUsersEditRemoveFeatureInfo.PopPtr());

	administrationUsersFeatureInfo->InsertSubFeature(administrationUsersEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersRevisionsFeatureInfo;
	administrationUsersRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersRevisionsFeatureInfo->SetFeatureId("Revisions");
	administrationUsersRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Users Revisions"));
	administrationUsersRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of users."));
	administrationUsersRevisionsFeatureInfo->SetOptional(false);
	administrationUsersRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersRevisionsViewFeatureInfo;
	administrationUsersRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersRevisionsViewFeatureInfo->SetFeatureId("View");
	administrationUsersRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Users Revisions"));
	administrationUsersRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of users."));
	administrationUsersRevisionsViewFeatureInfo->SetOptional(false);
	administrationUsersRevisionsViewFeatureInfo->SetIsPermission(true);
	administrationUsersRevisionsViewFeatureInfo->SetRequirements(QByteArray("/Administration/Users/View").split(';'));

	administrationUsersRevisionsFeatureInfo->InsertSubFeature(administrationUsersRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersRevisionsRestoreFeatureInfo;
	administrationUsersRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	administrationUsersRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Users Revision"));
	administrationUsersRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of users."));
	administrationUsersRevisionsRestoreFeatureInfo->SetOptional(false);
	administrationUsersRevisionsRestoreFeatureInfo->SetIsPermission(true);
	administrationUsersRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/Administration/Users/Revisions/View").split(';'));

	administrationUsersRevisionsFeatureInfo->InsertSubFeature(administrationUsersRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationUsersRevisionsDeleteFeatureInfo;
	administrationUsersRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationUsersRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	administrationUsersRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Users Revision"));
	administrationUsersRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of users."));
	administrationUsersRevisionsDeleteFeatureInfo->SetOptional(false);
	administrationUsersRevisionsDeleteFeatureInfo->SetIsPermission(true);
	administrationUsersRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/Administration/Users/Revisions/View").split(';'));

	administrationUsersRevisionsFeatureInfo->InsertSubFeature(administrationUsersRevisionsDeleteFeatureInfo.PopPtr());

	administrationUsersFeatureInfo->InsertSubFeature(administrationUsersRevisionsFeatureInfo.PopPtr());

	administrationFeatureInfo->InsertSubFeature(administrationUsersFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesFeatureInfo;
	administrationRolesFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesFeatureInfo->SetFeatureId("Roles");
	administrationRolesFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Roles"));
	administrationRolesFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the roles."));
	administrationRolesFeatureInfo->SetOptional(false);
	administrationRolesFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesViewPageFeatureInfo;
	administrationRolesViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesViewPageFeatureInfo->SetFeatureId("ViewPage");
	administrationRolesViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Roles Page"));
	administrationRolesViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the roles page."));
	administrationRolesViewPageFeatureInfo->SetOptional(false);
	administrationRolesViewPageFeatureInfo->SetIsPermission(true);

	administrationRolesFeatureInfo->InsertSubFeature(administrationRolesViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesViewFeatureInfo;
	administrationRolesViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesViewFeatureInfo->SetFeatureId("View");
	administrationRolesViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Roles"));
	administrationRolesViewFeatureInfo->SetOptional(false);
	administrationRolesViewFeatureInfo->SetIsPermission(true);

	administrationRolesFeatureInfo->InsertSubFeature(administrationRolesViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesViewHistoryFeatureInfo;
	administrationRolesViewHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesViewHistoryFeatureInfo->SetFeatureId("ViewHistory");
	administrationRolesViewHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Role History"));
	administrationRolesViewHistoryFeatureInfo->SetOptional(false);
	administrationRolesViewHistoryFeatureInfo->SetIsPermission(true);
	administrationRolesViewHistoryFeatureInfo->SetRequirements(QByteArray("/Administration/Roles/View").split(';'));

	administrationRolesFeatureInfo->InsertSubFeature(administrationRolesViewHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesEditFeatureInfo;
	administrationRolesEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesEditFeatureInfo->SetFeatureId("Edit");
	administrationRolesEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Role"));
	administrationRolesEditFeatureInfo->SetOptional(false);
	administrationRolesEditFeatureInfo->SetIsPermission(true);
	administrationRolesEditFeatureInfo->SetRequirements(QByteArray("/Administration/Roles/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesEditAddFeatureInfo;
	administrationRolesEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesEditAddFeatureInfo->SetFeatureId("Add");
	administrationRolesEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Role"));
	administrationRolesEditAddFeatureInfo->SetOptional(false);
	administrationRolesEditAddFeatureInfo->SetIsPermission(true);

	administrationRolesEditFeatureInfo->InsertSubFeature(administrationRolesEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesEditChangeFeatureInfo;
	administrationRolesEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesEditChangeFeatureInfo->SetFeatureId("Change");
	administrationRolesEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Role"));
	administrationRolesEditChangeFeatureInfo->SetOptional(false);
	administrationRolesEditChangeFeatureInfo->SetIsPermission(true);

	administrationRolesEditFeatureInfo->InsertSubFeature(administrationRolesEditChangeFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesEditRemoveFeatureInfo;
	administrationRolesEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesEditRemoveFeatureInfo->SetFeatureId("Remove");
	administrationRolesEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Role"));
	administrationRolesEditRemoveFeatureInfo->SetOptional(false);
	administrationRolesEditRemoveFeatureInfo->SetIsPermission(true);

	administrationRolesEditFeatureInfo->InsertSubFeature(administrationRolesEditRemoveFeatureInfo.PopPtr());

	administrationRolesFeatureInfo->InsertSubFeature(administrationRolesEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesRevisionsFeatureInfo;
	administrationRolesRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesRevisionsFeatureInfo->SetFeatureId("Revisions");
	administrationRolesRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Roles Revisions"));
	administrationRolesRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of roles."));
	administrationRolesRevisionsFeatureInfo->SetOptional(false);
	administrationRolesRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesRevisionsViewFeatureInfo;
	administrationRolesRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesRevisionsViewFeatureInfo->SetFeatureId("View");
	administrationRolesRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Roles Revisions"));
	administrationRolesRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of roles."));
	administrationRolesRevisionsViewFeatureInfo->SetOptional(false);
	administrationRolesRevisionsViewFeatureInfo->SetIsPermission(true);
	administrationRolesRevisionsViewFeatureInfo->SetRequirements(QByteArray("/Administration/Roles/View").split(';'));

	administrationRolesRevisionsFeatureInfo->InsertSubFeature(administrationRolesRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesRevisionsRestoreFeatureInfo;
	administrationRolesRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	administrationRolesRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Roles Revision"));
	administrationRolesRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of roles."));
	administrationRolesRevisionsRestoreFeatureInfo->SetOptional(false);
	administrationRolesRevisionsRestoreFeatureInfo->SetIsPermission(true);
	administrationRolesRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/Administration/Roles/Revisions/View").split(';'));

	administrationRolesRevisionsFeatureInfo->InsertSubFeature(administrationRolesRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationRolesRevisionsDeleteFeatureInfo;
	administrationRolesRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationRolesRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	administrationRolesRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Roles Revision"));
	administrationRolesRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of roles."));
	administrationRolesRevisionsDeleteFeatureInfo->SetOptional(false);
	administrationRolesRevisionsDeleteFeatureInfo->SetIsPermission(true);
	administrationRolesRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/Administration/Roles/Revisions/View").split(';'));

	administrationRolesRevisionsFeatureInfo->InsertSubFeature(administrationRolesRevisionsDeleteFeatureInfo.PopPtr());

	administrationRolesFeatureInfo->InsertSubFeature(administrationRolesRevisionsFeatureInfo.PopPtr());

	administrationFeatureInfo->InsertSubFeature(administrationRolesFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsFeatureInfo;
	administrationGroupsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsFeatureInfo->SetFeatureId("Groups");
	administrationGroupsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Groups"));
	administrationGroupsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the groups."));
	administrationGroupsFeatureInfo->SetOptional(false);
	administrationGroupsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsViewPageFeatureInfo;
	administrationGroupsViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsViewPageFeatureInfo->SetFeatureId("ViewPage");
	administrationGroupsViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Groups Page"));
	administrationGroupsViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the groups page."));
	administrationGroupsViewPageFeatureInfo->SetOptional(false);
	administrationGroupsViewPageFeatureInfo->SetIsPermission(true);

	administrationGroupsFeatureInfo->InsertSubFeature(administrationGroupsViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsViewFeatureInfo;
	administrationGroupsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsViewFeatureInfo->SetFeatureId("View");
	administrationGroupsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Groups"));
	administrationGroupsViewFeatureInfo->SetOptional(false);
	administrationGroupsViewFeatureInfo->SetIsPermission(true);

	administrationGroupsFeatureInfo->InsertSubFeature(administrationGroupsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsViewHistoryFeatureInfo;
	administrationGroupsViewHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsViewHistoryFeatureInfo->SetFeatureId("ViewHistory");
	administrationGroupsViewHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Group History"));
	administrationGroupsViewHistoryFeatureInfo->SetOptional(false);
	administrationGroupsViewHistoryFeatureInfo->SetIsPermission(true);
	administrationGroupsViewHistoryFeatureInfo->SetRequirements(QByteArray("/Administration/Groups/View").split(';'));

	administrationGroupsFeatureInfo->InsertSubFeature(administrationGroupsViewHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsEditFeatureInfo;
	administrationGroupsEditFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsEditFeatureInfo->SetFeatureId("Edit");
	administrationGroupsEditFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Group"));
	administrationGroupsEditFeatureInfo->SetOptional(false);
	administrationGroupsEditFeatureInfo->SetIsPermission(true);
	administrationGroupsEditFeatureInfo->SetRequirements(QByteArray("/Administration/Groups/View").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsEditAddFeatureInfo;
	administrationGroupsEditAddFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsEditAddFeatureInfo->SetFeatureId("Add");
	administrationGroupsEditAddFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Group"));
	administrationGroupsEditAddFeatureInfo->SetOptional(false);
	administrationGroupsEditAddFeatureInfo->SetIsPermission(true);

	administrationGroupsEditFeatureInfo->InsertSubFeature(administrationGroupsEditAddFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsEditChangeFeatureInfo;
	administrationGroupsEditChangeFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsEditChangeFeatureInfo->SetFeatureId("Change");
	administrationGroupsEditChangeFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Group"));
	administrationGroupsEditChangeFeatureInfo->SetOptional(false);
	administrationGroupsEditChangeFeatureInfo->SetIsPermission(true);

	administrationGroupsEditFeatureInfo->InsertSubFeature(administrationGroupsEditChangeFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsEditRemoveFeatureInfo;
	administrationGroupsEditRemoveFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsEditRemoveFeatureInfo->SetFeatureId("Remove");
	administrationGroupsEditRemoveFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Group"));
	administrationGroupsEditRemoveFeatureInfo->SetOptional(false);
	administrationGroupsEditRemoveFeatureInfo->SetIsPermission(true);

	administrationGroupsEditFeatureInfo->InsertSubFeature(administrationGroupsEditRemoveFeatureInfo.PopPtr());

	administrationGroupsFeatureInfo->InsertSubFeature(administrationGroupsEditFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsRevisionsFeatureInfo;
	administrationGroupsRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsRevisionsFeatureInfo->SetFeatureId("Revisions");
	administrationGroupsRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Groups Revisions"));
	administrationGroupsRevisionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Provides access to the revisions of groups."));
	administrationGroupsRevisionsFeatureInfo->SetOptional(false);
	administrationGroupsRevisionsFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsRevisionsViewFeatureInfo;
	administrationGroupsRevisionsViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsRevisionsViewFeatureInfo->SetFeatureId("View");
	administrationGroupsRevisionsViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Groups Revisions"));
	administrationGroupsRevisionsViewFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows viewing the revisions of groups."));
	administrationGroupsRevisionsViewFeatureInfo->SetOptional(false);
	administrationGroupsRevisionsViewFeatureInfo->SetIsPermission(true);
	administrationGroupsRevisionsViewFeatureInfo->SetRequirements(QByteArray("/Administration/Groups/View").split(';'));

	administrationGroupsRevisionsFeatureInfo->InsertSubFeature(administrationGroupsRevisionsViewFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsRevisionsRestoreFeatureInfo;
	administrationGroupsRevisionsRestoreFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsRevisionsRestoreFeatureInfo->SetFeatureId("Restore");
	administrationGroupsRevisionsRestoreFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Groups Revision"));
	administrationGroupsRevisionsRestoreFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows restoring a revision of groups."));
	administrationGroupsRevisionsRestoreFeatureInfo->SetOptional(false);
	administrationGroupsRevisionsRestoreFeatureInfo->SetIsPermission(true);
	administrationGroupsRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/Administration/Groups/Revisions/View").split(';'));

	administrationGroupsRevisionsFeatureInfo->InsertSubFeature(administrationGroupsRevisionsRestoreFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> administrationGroupsRevisionsDeleteFeatureInfo;
	administrationGroupsRevisionsDeleteFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	administrationGroupsRevisionsDeleteFeatureInfo->SetFeatureId("Delete");
	administrationGroupsRevisionsDeleteFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Groups Revision"));
	administrationGroupsRevisionsDeleteFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows deleting a revision of groups."));
	administrationGroupsRevisionsDeleteFeatureInfo->SetOptional(false);
	administrationGroupsRevisionsDeleteFeatureInfo->SetIsPermission(true);
	administrationGroupsRevisionsDeleteFeatureInfo->SetRequirements(QByteArray("/Administration/Groups/Revisions/View").split(';'));

	administrationGroupsRevisionsFeatureInfo->InsertSubFeature(administrationGroupsRevisionsDeleteFeatureInfo.PopPtr());

	administrationGroupsFeatureInfo->InsertSubFeature(administrationGroupsRevisionsFeatureInfo.PopPtr());

	administrationFeatureInfo->InsertSubFeature(administrationGroupsFeatureInfo.PopPtr());

	productInfo.AddFeature("ce4a7f72-5303-4044-b25c-3a02020eebd3", *administrationFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> workspaceManagementFeatureInfo;
	workspaceManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	workspaceManagementFeatureInfo->SetObjectUuid("df22ac46-7253-4b13-a1b8-d4391943adde");
	workspaceManagementFeatureInfo->SetFeatureId("WorkspaceManagement");
	workspaceManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Workspace Management"));
	workspaceManagementFeatureInfo->SetOptional(false);
	workspaceManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> workspaceManagementViewPageFeatureInfo;
	workspaceManagementViewPageFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	workspaceManagementViewPageFeatureInfo->SetFeatureId("ViewPage");
	workspaceManagementViewPageFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Workspace Page"));
	workspaceManagementViewPageFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "Allows opening the workspace page."));
	workspaceManagementViewPageFeatureInfo->SetOptional(false);
	workspaceManagementViewPageFeatureInfo->SetIsPermission(true);

	workspaceManagementFeatureInfo->InsertSubFeature(workspaceManagementViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> workspaceManagementViewUserActionsFeatureInfo;
	workspaceManagementViewUserActionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	workspaceManagementViewUserActionsFeatureInfo->SetFeatureId("ViewUserActions");
	workspaceManagementViewUserActionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View User Actions"));
	workspaceManagementViewUserActionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "View only your activity"));
	workspaceManagementViewUserActionsFeatureInfo->SetOptional(false);
	workspaceManagementViewUserActionsFeatureInfo->SetIsPermission(true);

	workspaceManagementFeatureInfo->InsertSubFeature(workspaceManagementViewUserActionsFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> workspaceManagementViewAllUserActionsFeatureInfo;
	workspaceManagementViewAllUserActionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	workspaceManagementViewAllUserActionsFeatureInfo->SetFeatureId("ViewAllUserActions");
	workspaceManagementViewAllUserActionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View All User Actions"));
	workspaceManagementViewAllUserActionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "View the activity of all users"));
	workspaceManagementViewAllUserActionsFeatureInfo->SetOptional(false);
	workspaceManagementViewAllUserActionsFeatureInfo->SetIsPermission(true);
	workspaceManagementViewAllUserActionsFeatureInfo->SetRequirements(QByteArray("/WorkspaceManagement/ViewUserActions").split(';'));

	workspaceManagementFeatureInfo->InsertSubFeature(workspaceManagementViewAllUserActionsFeatureInfo.PopPtr());

	productInfo.AddFeature("df22ac46-7253-4b13-a1b8-d4391943adde", *workspaceManagementFeatureInfo.GetPtr());

}


};

