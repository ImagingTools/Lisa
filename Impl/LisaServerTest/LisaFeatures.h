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
	featureManagementViewPageFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/View").split(';'));

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
	featureManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/Revisions/View;/FeatureManagement/Edit/Change").split(';'));

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
	productManagementViewPageFeatureInfo->SetRequirements(QByteArray("/ProductManagement/View").split(';'));

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
	productManagementEditAddFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/View").split(';'));

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
	productManagementEditChangeFeatureInfo->SetRequirements(QByteArray("/FeatureManagement/View").split(';'));

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
	productManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/ProductManagement/Revisions/View;/ProductManagement/Edit/Change").split(';'));

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
	licenseDefinitionManagementViewPageFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/View").split(';'));

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(licenseDefinitionManagementViewPageFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> licenseDefinitionManagementViewFeatureInfo;
	licenseDefinitionManagementViewFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	licenseDefinitionManagementViewFeatureInfo->SetFeatureId("View");
	licenseDefinitionManagementViewFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Licenses Definition"));
	licenseDefinitionManagementViewFeatureInfo->SetOptional(false);
	licenseDefinitionManagementViewFeatureInfo->SetIsPermission(true);
	licenseDefinitionManagementViewFeatureInfo->SetRequirements(QByteArray("/ProductManagement/View;/FeatureManagement/View").split(';'));

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
	licenseDefinitionManagementRevisionsRestoreFeatureInfo->SetRequirements(QByteArray("/LicenseDefinitionManagement/Revisions/View;/LicenseDefinitionManagement/Edit/Change").split(';'));

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

