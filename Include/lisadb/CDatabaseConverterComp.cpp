#include <lisadb/CDatabaseConverterComp.h>


// Qt includes
#include <QtCore/QDebug>

// ImtCore includes
#include <imtbase/CObjectLink.h>
#include <imtlic/CHardwareInstanceInfo.h>
#include <imtbase/CObjectCollection.h>

// Lisa includes



namespace lisadb
{


// protected methods

// reimplemented (icomp::CComponentBase)

void CDatabaseConverterComp::OnComponentCreated()
{
	BaseClass::OnComponentCreated();

	qDebug() << "Lisa convertation has started";

	if (m_featureNewCollectionCompPtr.IsValid() && m_featureOldCollectionCompPtr.IsValid()){
		imtbase::IObjectCollection::Ids featureIds = m_featureOldCollectionCompPtr->GetElementIds();
		for (const imtbase::IObjectCollection::Id& featureId : featureIds){


		}
	}

	qDebug() << "Lisa convertation finished!";

	QCoreApplication::exit();
}


void CDatabaseConverterComp::OnComponentDestroyed()
{
	BaseClass::OnComponentDestroyed();
}


} // namespace imtdb


