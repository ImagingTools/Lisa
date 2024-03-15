#pragma once


#if defined _MSC_VER || defined __MINGW32__ || defined __MINGW64__
#define LISA_SDK_EXPORT __declspec(dllexport)
#elif defined __GNUC__
#define LISA_SDK_EXPORT __attribute__((visibility("default")))
#else
#define LISA_SDK_EXPORT
#endif

// Qt includes
#include <QtCore/QString>
#include <QtCore/QByteArray>
#include <QtCore/QDateTime>


namespace LisaSdk
{


class CLicenseControllerImpl;


/**
*	\ingroup LisaSdk
*/
class LISA_SDK_EXPORT CLicenseController
{
public:
	struct FeatureInfo
	{
		QString id;
		QString name;
		QString description;
		QDateTime expiration;
	};

	typedef QVector<FeatureInfo> FeatureInfoList;

public:
	/**
		Controller instance initialization using an existing license file path and related public key.
		If the decryption of the license file using this both parameters was successfull, the product feautures and associated using rights will be available.
	*/
	CLicenseController(const QString& licenseFilePath, const QByteArray& publicKey);

	virtual ~CLicenseController();

	/**
		Set the location of the license file.
		The controller will read this file using specified public key.
		Once the license file could be decrypted using this key, the available features will be provided
		\sa GetFeatureList
	*/
	virtual bool SetLicenseFilePath(const QString& licenseFilePath);

	/**
		Set public key for descryption of the license file.
	*/
	virtual bool SetPublicKey(const QByteArray& publicKey);

	/**
		Import the license file from some given location.
	*/
	virtual bool ImportLicense(const QString& licenseFilePath);

	/**
		Get the list of all available features provided by the license file.
		\note If the license file could not be decrypted, the list will be empty.
	*/
	FeatureInfoList GetFeatureList() const;

private:
	CLicenseControllerImpl* m_implPtr;
};


} // namespace LisaSdk


/**
\defgroup LisaSdk LISA SDK

\mainpage
\section Introduction

*/

