// ACF includes
#include <ibase/IApplication.h>

#include <GeneratedFiles/LisaConverter/CLisaConverter.h>


int main(int argc, char *argv[])
{
    CLisaConverter instance;

	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


