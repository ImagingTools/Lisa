#pragma once


// ACF includes
#include <icomp/CComponentBase.h>

// ImtCore includes
#include <imtbase/IObjectCollection.h>


namespace lisadb
{


class CDatabaseConverterComp: public icomp::CComponentBase
{
public:
	typedef icomp::CComponentBase BaseClass;

	I_BEGIN_COMPONENT(CDatabaseConverterComp)
		I_ASSIGN(m_featureNewCollectionCompPtr, "FeatureNewCollection", "Feature new collection", true, "FeatureNewCollection");
		I_ASSIGN(m_licenseNewCollectionCompPtr, "LicenseNewCollection", "License new collection", true, "LicenseNewCollection");
		I_ASSIGN(m_productNewCollectionCompPtr, "ProductNewCollection", "Product new collection", true, "ProductNewCollection");

		I_ASSIGN(m_featureOldCollectionCompPtr, "FeatureOldCollection", "Feature old collection", true, "FeatureOldCollection");
		I_ASSIGN(m_licenseOldCollectionCompPtr, "LicenseOldCollection", "License old collection", true, "LicenseOldCollection");
		I_ASSIGN(m_productOldCollectionCompPtr, "ProductOldCollection", "Product old collection", true, "ProductOldCollection");
	I_END_COMPONENT

protected:
	// reimplemented (icomp::CComponentBase)
	virtual void OnComponentCreated() override;
	virtual void OnComponentDestroyed() override;

private:
	I_REF(imtbase::IObjectCollection, m_featureNewCollectionCompPtr);
	I_REF(imtbase::IObjectCollection, m_licenseNewCollectionCompPtr);
	I_REF(imtbase::IObjectCollection, m_productNewCollectionCompPtr);
	I_REF(imtbase::IObjectCollection, m_featureOldCollectionCompPtr);
	I_REF(imtbase::IObjectCollection, m_licenseOldCollectionCompPtr);
	I_REF(imtbase::IObjectCollection, m_productOldCollectionCompPtr);
};


} // namespace prolifedb


