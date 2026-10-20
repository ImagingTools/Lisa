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

#include <LisaSdk/LisaSdk.h>


// ACF includes
#include <icomp/export.h>
#include <iprm/IIdParam.h>
#include <ifile/IFileNameParam.h>

// ImtCore includes
#include <imtlic/ILicenseController.h>
#include <imtlic/IProductInstanceInfo.h>
#include <imtlic/ILicenseInstance.h>

// Local includes
#include <GeneratedFiles/LisaSdk/CLisaSdk.h>


namespace LisaSdk
{


class CLicenseControllerImpl
{
public:
	CLicenseControllerImpl()
	{
	}
	

	bool SetLicenseFilePath(const QString& licenseFilePath)
	{
		ifile::IFileNameParam* licenseFileParamPtr = m_sdk.GetInterface<ifile::IFileNameParam>("LicenseFile");
		if (licenseFileParamPtr != nullptr) {
			licenseFileParamPtr->SetPath(licenseFilePath);

			return true;
		}

		return false;
	}


	bool SetPublicKey(const QByteArray& publicKey)
	{
		iprm::IIdParam* publicKeyParamPtr = m_sdk.GetInterface<iprm::IIdParam>("PublicKey");
		if (publicKeyParamPtr != nullptr) {
			publicKeyParamPtr->SetId(publicKey);

			return true;
		}

		return false;
	}


	bool ImportLicense(const QString& licenseFilePath)
	{
		const imtlic::ILicenseController* controllerPtr = m_sdk.GetInterface<const imtlic::ILicenseController>();
		if (controllerPtr != nullptr){
			return controllerPtr->ImportLicense(licenseFilePath);
		}

		return false;
	}

	CLicenseController::FeatureInfoList GetFeatureList() const
	{
		CLicenseController::FeatureInfoList retVal;

		const imtlic::IProductInstanceInfo* productInstanceInfoPtr = m_sdk.GetInterface<const imtlic::IProductInstanceInfo>();
		if (productInstanceInfoPtr != nullptr) {
			const imtbase::ICollectionInfo& licenseList = productInstanceInfoPtr->GetLicenseInstances();

			const imtbase::IObjectCollectionInfo::Ids allInstanceLicenseIds = licenseList.GetElementIds();
			for (const QByteArray& licenseCollectionId : allInstanceLicenseIds) {
				const imtlic::ILicenseInstance* licenseInstancePtr = productInstanceInfoPtr->GetLicenseInstance(licenseCollectionId);
				if (licenseInstancePtr != nullptr) {
					CLicenseController::FeatureInfo featureInfo;
					featureInfo.name = licenseInstancePtr->GetLicenseName();
					featureInfo.id = licenseInstancePtr->GetLicenseId();
					featureInfo.expiration = licenseInstancePtr->GetExpiration();

					retVal.push_back(featureInfo);
				}
			}
		}

		return retVal;
	}

private:
	mutable CLisaSdk m_sdk;
};


// public methods

CLicenseController::CLicenseController(const QString& licenseFilePath, const QByteArray& publicKey)
	:m_implPtr(nullptr)
{
	m_implPtr = new CLicenseControllerImpl;

	SetLicenseFilePath(licenseFilePath);
	SetPublicKey(publicKey);
}


CLicenseController::~CLicenseController()
{
	if (m_implPtr != nullptr){
		delete m_implPtr;
	}
}


bool CLicenseController::SetLicenseFilePath(const QString& licenseFilePath)
{
	Q_ASSERT(m_implPtr != nullptr);

	return m_implPtr->SetLicenseFilePath(licenseFilePath);
}


bool CLicenseController::SetPublicKey(const QByteArray& publicKey)
{
	Q_ASSERT(m_implPtr != nullptr);

	return m_implPtr->SetPublicKey(publicKey);
}


bool CLicenseController::ImportLicense(const QString& licenseFilePath)
{
	Q_ASSERT(m_implPtr != nullptr);

	return m_implPtr->ImportLicense(licenseFilePath);
}


CLicenseController::FeatureInfoList CLicenseController::GetFeatureList() const
{
	Q_ASSERT(m_implPtr != nullptr);

	return m_implPtr->GetFeatureList();
}


}


