// SPDX-License-Identifier: LicenseRef-Commercial
// Copyright (C) 2017-2020 ImagingTools GmbH
// All rights reserved.
//
// This file is part of the ImagingTools SDK.
//
// This file may be used under the terms of the ImagingTools License Agreement
// appearing in the file License.txt included in the packaging of this file.
// If you are unsure which license is appropriate for your use, please
// contact us at info@imagingtools.de.

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

	istd::TDelPtr<imtlic::CFeatureInfo> editFeatureFeatureInfo;
	editFeatureFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editFeatureFeatureInfo->SetFeatureId("EditFeature");
	editFeatureFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Feature"));
	editFeatureFeatureInfo->SetOptional(false);
	editFeatureFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeFeatureFeatureInfo;
	changeFeatureFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeFeatureFeatureInfo->SetFeatureId("ChangeFeature");
	changeFeatureFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Feature"));
	changeFeatureFeatureInfo->SetOptional(false);
	changeFeatureFeatureInfo->SetIsPermission(true);

	editFeatureFeatureInfo->InsertSubFeature(changeFeatureFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeFeatureFeatureInfo;
	removeFeatureFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeFeatureFeatureInfo->SetFeatureId("RemoveFeature");
	removeFeatureFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Feature"));
	removeFeatureFeatureInfo->SetOptional(false);
	removeFeatureFeatureInfo->SetIsPermission(true);

	editFeatureFeatureInfo->InsertSubFeature(removeFeatureFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addFeatureFeatureInfo;
	addFeatureFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addFeatureFeatureInfo->SetFeatureId("AddFeature");
	addFeatureFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Feature"));
	addFeatureFeatureInfo->SetOptional(false);
	addFeatureFeatureInfo->SetIsPermission(true);

	editFeatureFeatureInfo->InsertSubFeature(addFeatureFeatureInfo.PopPtr());

	featureManagementFeatureInfo->InsertSubFeature(editFeatureFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewFeaturesFeatureInfo;
	viewFeaturesFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewFeaturesFeatureInfo->SetFeatureId("ViewFeatures");
	viewFeaturesFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Features"));
	viewFeaturesFeatureInfo->SetOptional(false);
	viewFeaturesFeatureInfo->SetIsPermission(true);
	viewFeaturesFeatureInfo->SetDependencies(QByteArray("EditFeature;ChangeFeature;RemoveFeature;AddFeature").split(';'));

	featureManagementFeatureInfo->InsertSubFeature(viewFeaturesFeatureInfo.PopPtr());

	productInfo.AddFeature("9e32f708-df7c-47a6-a383-92afd3b1138b", *featureManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> productManagementFeatureInfo;
	productManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	productManagementFeatureInfo->SetObjectUuid("461f89cc-da43-4db2-9f5b-e9052b81f4df");
	productManagementFeatureInfo->SetFeatureId("ProductManagement");
	productManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Product Management"));
	productManagementFeatureInfo->SetOptional(false);
	productManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> editProductFeatureInfo;
	editProductFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editProductFeatureInfo->SetFeatureId("EditProduct");
	editProductFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Product"));
	editProductFeatureInfo->SetOptional(false);
	editProductFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeProductFeatureInfo;
	changeProductFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeProductFeatureInfo->SetFeatureId("ChangeProduct");
	changeProductFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Product"));
	changeProductFeatureInfo->SetOptional(false);
	changeProductFeatureInfo->SetIsPermission(true);

	editProductFeatureInfo->InsertSubFeature(changeProductFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeProductFeatureInfo;
	removeProductFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeProductFeatureInfo->SetFeatureId("RemoveProduct");
	removeProductFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Product"));
	removeProductFeatureInfo->SetOptional(false);
	removeProductFeatureInfo->SetIsPermission(true);

	editProductFeatureInfo->InsertSubFeature(removeProductFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addProductFeatureInfo;
	addProductFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addProductFeatureInfo->SetFeatureId("AddProduct");
	addProductFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Product"));
	addProductFeatureInfo->SetOptional(false);
	addProductFeatureInfo->SetIsPermission(true);

	editProductFeatureInfo->InsertSubFeature(addProductFeatureInfo.PopPtr());

	productManagementFeatureInfo->InsertSubFeature(editProductFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewProductsFeatureInfo;
	viewProductsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewProductsFeatureInfo->SetFeatureId("ViewProducts");
	viewProductsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Products"));
	viewProductsFeatureInfo->SetOptional(false);
	viewProductsFeatureInfo->SetIsPermission(true);
	viewProductsFeatureInfo->SetDependencies(QByteArray("EditProduct;ChangeProduct;RemoveProduct;AddProduct").split(';'));

	productManagementFeatureInfo->InsertSubFeature(viewProductsFeatureInfo.PopPtr());

	productInfo.AddFeature("461f89cc-da43-4db2-9f5b-e9052b81f4df", *productManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> licenseDefinitionManagementFeatureInfo;
	licenseDefinitionManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	licenseDefinitionManagementFeatureInfo->SetObjectUuid("a670fc3b-563d-4e46-9b59-ccc6434d206d");
	licenseDefinitionManagementFeatureInfo->SetFeatureId("LicenseDefinitionManagement");
	licenseDefinitionManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "License Definition Management"));
	licenseDefinitionManagementFeatureInfo->SetOptional(false);
	licenseDefinitionManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> editLicenseDefinitionFeatureInfo;
	editLicenseDefinitionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editLicenseDefinitionFeatureInfo->SetFeatureId("EditLicenseDefinition");
	editLicenseDefinitionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit License Definition"));
	editLicenseDefinitionFeatureInfo->SetOptional(false);
	editLicenseDefinitionFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeLicenseDefinitionFeatureInfo;
	changeLicenseDefinitionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeLicenseDefinitionFeatureInfo->SetFeatureId("ChangeLicenseDefinition");
	changeLicenseDefinitionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change License Definition"));
	changeLicenseDefinitionFeatureInfo->SetOptional(false);
	changeLicenseDefinitionFeatureInfo->SetIsPermission(true);

	editLicenseDefinitionFeatureInfo->InsertSubFeature(changeLicenseDefinitionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeLicenseDefinitionFeatureInfo;
	removeLicenseDefinitionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeLicenseDefinitionFeatureInfo->SetFeatureId("RemoveLicenseDefinition");
	removeLicenseDefinitionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove License Definition"));
	removeLicenseDefinitionFeatureInfo->SetOptional(false);
	removeLicenseDefinitionFeatureInfo->SetIsPermission(true);

	editLicenseDefinitionFeatureInfo->InsertSubFeature(removeLicenseDefinitionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addLicenseDefinitionFeatureInfo;
	addLicenseDefinitionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addLicenseDefinitionFeatureInfo->SetFeatureId("AddLicenseDefinition");
	addLicenseDefinitionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add License Definition"));
	addLicenseDefinitionFeatureInfo->SetOptional(false);
	addLicenseDefinitionFeatureInfo->SetIsPermission(true);

	editLicenseDefinitionFeatureInfo->InsertSubFeature(addLicenseDefinitionFeatureInfo.PopPtr());

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(editLicenseDefinitionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewLicensesDefinitionFeatureInfo;
	viewLicensesDefinitionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewLicensesDefinitionFeatureInfo->SetFeatureId("ViewLicensesDefinition");
	viewLicensesDefinitionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Licenses Definition"));
	viewLicensesDefinitionFeatureInfo->SetOptional(false);
	viewLicensesDefinitionFeatureInfo->SetIsPermission(true);
	viewLicensesDefinitionFeatureInfo->SetDependencies(QByteArray("EditLicenseDefinition;ChangeLicenseDefinition;RemoveLicenseDefinition;AddLicenseDefinition").split(';'));

	licenseDefinitionManagementFeatureInfo->InsertSubFeature(viewLicensesDefinitionFeatureInfo.PopPtr());

	productInfo.AddFeature("a670fc3b-563d-4e46-9b59-ccc6434d206d", *licenseDefinitionManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> administrationFeatureInfo;
	administrationFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	administrationFeatureInfo->SetObjectUuid("ce4a7f72-5303-4044-b25c-3a02020eebd3");
	administrationFeatureInfo->SetFeatureId("Administration");
	administrationFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Administration"));
	administrationFeatureInfo->SetOptional(false);
	administrationFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> editAdministrationFeatureInfo;
	editAdministrationFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editAdministrationFeatureInfo->SetFeatureId("EditAdministration");
	editAdministrationFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Administration"));
	editAdministrationFeatureInfo->SetOptional(false);
	editAdministrationFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> editGroupFeatureInfo;
	editGroupFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editGroupFeatureInfo->SetFeatureId("EditGroup");
	editGroupFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Group"));
	editGroupFeatureInfo->SetOptional(false);
	editGroupFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeGroupFeatureInfo;
	changeGroupFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeGroupFeatureInfo->SetFeatureId("ChangeGroup");
	changeGroupFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Group"));
	changeGroupFeatureInfo->SetOptional(false);
	changeGroupFeatureInfo->SetIsPermission(true);

	editGroupFeatureInfo->InsertSubFeature(changeGroupFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeGroupFeatureInfo;
	removeGroupFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeGroupFeatureInfo->SetFeatureId("RemoveGroup");
	removeGroupFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Group"));
	removeGroupFeatureInfo->SetOptional(false);
	removeGroupFeatureInfo->SetIsPermission(true);

	editGroupFeatureInfo->InsertSubFeature(removeGroupFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addGroupFeatureInfo;
	addGroupFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addGroupFeatureInfo->SetFeatureId("AddGroup");
	addGroupFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Group"));
	addGroupFeatureInfo->SetOptional(false);
	addGroupFeatureInfo->SetIsPermission(true);

	editGroupFeatureInfo->InsertSubFeature(addGroupFeatureInfo.PopPtr());

	editAdministrationFeatureInfo->InsertSubFeature(editGroupFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> editRoleFeatureInfo;
	editRoleFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editRoleFeatureInfo->SetFeatureId("EditRole");
	editRoleFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit Role"));
	editRoleFeatureInfo->SetOptional(false);
	editRoleFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeRoleFeatureInfo;
	changeRoleFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeRoleFeatureInfo->SetFeatureId("ChangeRole");
	changeRoleFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change Role"));
	changeRoleFeatureInfo->SetOptional(false);
	changeRoleFeatureInfo->SetIsPermission(true);

	editRoleFeatureInfo->InsertSubFeature(changeRoleFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeRoleFeatureInfo;
	removeRoleFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeRoleFeatureInfo->SetFeatureId("RemoveRole");
	removeRoleFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove Role"));
	removeRoleFeatureInfo->SetOptional(false);
	removeRoleFeatureInfo->SetIsPermission(true);

	editRoleFeatureInfo->InsertSubFeature(removeRoleFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addRoleFeatureInfo;
	addRoleFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addRoleFeatureInfo->SetFeatureId("AddRole");
	addRoleFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add Role"));
	addRoleFeatureInfo->SetOptional(false);
	addRoleFeatureInfo->SetIsPermission(true);

	editRoleFeatureInfo->InsertSubFeature(addRoleFeatureInfo.PopPtr());

	editAdministrationFeatureInfo->InsertSubFeature(editRoleFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> editUserFeatureInfo;
	editUserFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	editUserFeatureInfo->SetFeatureId("EditUser");
	editUserFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Edit User"));
	editUserFeatureInfo->SetOptional(false);
	editUserFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> changeUserFeatureInfo;
	changeUserFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	changeUserFeatureInfo->SetFeatureId("ChangeUser");
	changeUserFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Change User"));
	changeUserFeatureInfo->SetOptional(false);
	changeUserFeatureInfo->SetIsPermission(true);

	editUserFeatureInfo->InsertSubFeature(changeUserFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> removeUserFeatureInfo;
	removeUserFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	removeUserFeatureInfo->SetFeatureId("RemoveUser");
	removeUserFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Remove User"));
	removeUserFeatureInfo->SetOptional(false);
	removeUserFeatureInfo->SetIsPermission(true);

	editUserFeatureInfo->InsertSubFeature(removeUserFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> addUserFeatureInfo;
	addUserFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	addUserFeatureInfo->SetFeatureId("AddUser");
	addUserFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Add User"));
	addUserFeatureInfo->SetOptional(false);
	addUserFeatureInfo->SetIsPermission(true);

	editUserFeatureInfo->InsertSubFeature(addUserFeatureInfo.PopPtr());

	editAdministrationFeatureInfo->InsertSubFeature(editUserFeatureInfo.PopPtr());

	administrationFeatureInfo->InsertSubFeature(editAdministrationFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewAdministrationFeatureInfo;
	viewAdministrationFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewAdministrationFeatureInfo->SetFeatureId("ViewAdministration");
	viewAdministrationFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Administration"));
	viewAdministrationFeatureInfo->SetOptional(false);
	viewAdministrationFeatureInfo->SetIsPermission(true);
	viewAdministrationFeatureInfo->SetDependencies(QByteArray("EditAdministration;EditGroup;ChangeGroup;RemoveGroup;AddGroup;EditRole;ChangeRole;RemoveRole;AddRole;EditUser;ChangeUser;RemoveUser;AddUser").split(';'));

	istd::TDelPtr<imtlic::CFeatureInfo> viewGroupHistoryFeatureInfo;
	viewGroupHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewGroupHistoryFeatureInfo->SetFeatureId("ViewGroupHistory");
	viewGroupHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Group History"));
	viewGroupHistoryFeatureInfo->SetOptional(false);
	viewGroupHistoryFeatureInfo->SetIsPermission(true);

	viewAdministrationFeatureInfo->InsertSubFeature(viewGroupHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewUserHistoryFeatureInfo;
	viewUserHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewUserHistoryFeatureInfo->SetFeatureId("ViewUserHistory");
	viewUserHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View User History"));
	viewUserHistoryFeatureInfo->SetOptional(false);
	viewUserHistoryFeatureInfo->SetIsPermission(true);

	viewAdministrationFeatureInfo->InsertSubFeature(viewUserHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewRoleHistoryFeatureInfo;
	viewRoleHistoryFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewRoleHistoryFeatureInfo->SetFeatureId("ViewRoleHistory");
	viewRoleHistoryFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Role History"));
	viewRoleHistoryFeatureInfo->SetOptional(false);
	viewRoleHistoryFeatureInfo->SetIsPermission(true);

	viewAdministrationFeatureInfo->InsertSubFeature(viewRoleHistoryFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewGroupsFeatureInfo;
	viewGroupsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewGroupsFeatureInfo->SetFeatureId("ViewGroups");
	viewGroupsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Groups"));
	viewGroupsFeatureInfo->SetOptional(false);
	viewGroupsFeatureInfo->SetIsPermission(true);
	viewGroupsFeatureInfo->SetDependencies(QByteArray("EditGroup;ChangeGroup;RemoveGroup;AddGroup").split(';'));

	viewAdministrationFeatureInfo->InsertSubFeature(viewGroupsFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewUsersFeatureInfo;
	viewUsersFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewUsersFeatureInfo->SetFeatureId("ViewUsers");
	viewUsersFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Users"));
	viewUsersFeatureInfo->SetOptional(false);
	viewUsersFeatureInfo->SetIsPermission(true);
	viewUsersFeatureInfo->SetDependencies(QByteArray("EditUser;ChangeUser;RemoveUser;AddUser").split(';'));

	viewAdministrationFeatureInfo->InsertSubFeature(viewUsersFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewRolesFeatureInfo;
	viewRolesFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewRolesFeatureInfo->SetFeatureId("ViewRoles");
	viewRolesFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Roles"));
	viewRolesFeatureInfo->SetOptional(false);
	viewRolesFeatureInfo->SetIsPermission(true);
	viewRolesFeatureInfo->SetDependencies(QByteArray("EditRole;ChangeRole;RemoveRole;AddRole").split(';'));

	viewAdministrationFeatureInfo->InsertSubFeature(viewRolesFeatureInfo.PopPtr());

	administrationFeatureInfo->InsertSubFeature(viewAdministrationFeatureInfo.PopPtr());

	productInfo.AddFeature("ce4a7f72-5303-4044-b25c-3a02020eebd3", *administrationFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> revisionManagementFeatureInfo;
	revisionManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	revisionManagementFeatureInfo->SetObjectUuid("c52f36c9-0dbe-49f0-84a7-f59116bd7225");
	revisionManagementFeatureInfo->SetFeatureId("RevisionManagement");
	revisionManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Revision Management"));
	revisionManagementFeatureInfo->SetOptional(false);
	revisionManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> deleteRevisionFeatureInfo;
	deleteRevisionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	deleteRevisionFeatureInfo->SetFeatureId("DeleteRevision");
	deleteRevisionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Delete Revision"));
	deleteRevisionFeatureInfo->SetOptional(false);
	deleteRevisionFeatureInfo->SetIsPermission(true);

	revisionManagementFeatureInfo->InsertSubFeature(deleteRevisionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> exportRevisionFeatureInfo;
	exportRevisionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	exportRevisionFeatureInfo->SetFeatureId("ExportRevision");
	exportRevisionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Export Revision"));
	exportRevisionFeatureInfo->SetOptional(false);
	exportRevisionFeatureInfo->SetIsPermission(true);

	revisionManagementFeatureInfo->InsertSubFeature(exportRevisionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewRevisionsFeatureInfo;
	viewRevisionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewRevisionsFeatureInfo->SetFeatureId("ViewRevisions");
	viewRevisionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Revisions"));
	viewRevisionsFeatureInfo->SetOptional(false);
	viewRevisionsFeatureInfo->SetIsPermission(true);

	revisionManagementFeatureInfo->InsertSubFeature(viewRevisionsFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> backupRevisionFeatureInfo;
	backupRevisionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	backupRevisionFeatureInfo->SetFeatureId("BackupRevision");
	backupRevisionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Backup Revision"));
	backupRevisionFeatureInfo->SetOptional(false);
	backupRevisionFeatureInfo->SetIsPermission(true);

	revisionManagementFeatureInfo->InsertSubFeature(backupRevisionFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> restoreRevisionFeatureInfo;
	restoreRevisionFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	restoreRevisionFeatureInfo->SetFeatureId("RestoreRevision");
	restoreRevisionFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Restore Revision"));
	restoreRevisionFeatureInfo->SetOptional(false);
	restoreRevisionFeatureInfo->SetIsPermission(true);

	revisionManagementFeatureInfo->InsertSubFeature(restoreRevisionFeatureInfo.PopPtr());

	productInfo.AddFeature("c52f36c9-0dbe-49f0-84a7-f59116bd7225", *revisionManagementFeatureInfo.GetPtr());

	istd::TDelPtr<imtlic::CIdentifiableFeatureInfo> workspaceManagementFeatureInfo;
	workspaceManagementFeatureInfo.SetPtr(new imtlic::CIdentifiableFeatureInfo);
	workspaceManagementFeatureInfo->SetObjectUuid("df22ac46-7253-4b13-a1b8-d4391943adde");
	workspaceManagementFeatureInfo->SetFeatureId("WorkspaceManagement");
	workspaceManagementFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "Workspace Management"));
	workspaceManagementFeatureInfo->SetOptional(false);
	workspaceManagementFeatureInfo->SetIsPermission(true);

	istd::TDelPtr<imtlic::CFeatureInfo> viewWorkspaceFeatureInfo;
	viewWorkspaceFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewWorkspaceFeatureInfo->SetFeatureId("ViewWorkspace");
	viewWorkspaceFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View Workspace"));
	viewWorkspaceFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "View workspace page"));
	viewWorkspaceFeatureInfo->SetOptional(false);
	viewWorkspaceFeatureInfo->SetIsPermission(true);

	workspaceManagementFeatureInfo->InsertSubFeature(viewWorkspaceFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewUserActionsFeatureInfo;
	viewUserActionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewUserActionsFeatureInfo->SetFeatureId("ViewUserActions");
	viewUserActionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View User Actions"));
	viewUserActionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "View only your activity"));
	viewUserActionsFeatureInfo->SetOptional(false);
	viewUserActionsFeatureInfo->SetIsPermission(true);

	workspaceManagementFeatureInfo->InsertSubFeature(viewUserActionsFeatureInfo.PopPtr());

	istd::TDelPtr<imtlic::CFeatureInfo> viewAllUserActionsFeatureInfo;
	viewAllUserActionsFeatureInfo.SetPtr(new imtlic::CFeatureInfo);
	viewAllUserActionsFeatureInfo->SetFeatureId("ViewAllUserActions");
	viewAllUserActionsFeatureInfo->SetFeatureName(QT_TRANSLATE_NOOP("Feature", "View All User Actions"));
	viewAllUserActionsFeatureInfo->SetFeatureDescription(QT_TRANSLATE_NOOP("Feature", "View the activity of all users"));
	viewAllUserActionsFeatureInfo->SetOptional(false);
	viewAllUserActionsFeatureInfo->SetIsPermission(true);

	workspaceManagementFeatureInfo->InsertSubFeature(viewAllUserActionsFeatureInfo.PopPtr());

	productInfo.AddFeature("df22ac46-7253-4b13-a1b8-d4391943adde", *workspaceManagementFeatureInfo.GetPtr());

}


};

