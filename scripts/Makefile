#
# construct definitions for feeding to Object.defineProperties(obj, descriptor)
#
HASAK=../../../HL2Key/hasak
all: ../src/cwkeyerDescriptors.js ../src/defaultDescriptors.js ../src/hasakDescriptors.js

clean:
	rm -f ../src/cwkeyerDescriptors.js ../src/defaultDescriptors.js ../src/hasakDescriptors.js

test-cwkeyer:
	./make-descriptors.js cwkeyer

test-default:
	 ./make-descriptors.js default

test-hasak:
	./make-descriptors.js hasak

../src/hasakProperties.js: $(HASAK)/config.h $(HASAK)/doc/nrpn.tcl
	(cd $(HASAK) && ./doc/nrpn.tcl)> ../src/hasakProperties.js

../src/cwkeyerDescriptors.js: ../src/cwkeyerProperties.js ./make-descriptors.js
	./make-descriptors.js cwkeyer > ../src/cwkeyerDescriptors.js

../src/defaultDescriptors.js: ../src/cwkeyerProperties.js ./make-descriptors.js
	./make-descriptors.js default > ../src/defaultDescriptors.js

../src/hasakDescriptors.js: ../src/cwkeyerProperties.js ../src/hasakProperties.js ./make-descriptors.js
	./make-descriptors.js hasak > ../src/hasakDescriptors.js
