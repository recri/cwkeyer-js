#
# construct definitions for feeding to Object.defineProperties(obj, descriptor)
#
HASAK=../../../HL2Key/hasak
all: ../src/cwkeyerDescriptors.js ../src/defaultDescriptors.js ../src/hasakDescriptors.js

clean:
	rm -f ../src/cwkeyerDescriptors.js ../src/defaultDescriptors.js ../src/hasakDescriptors.js

test-cwkeyer-descriptors:
	./make-descriptors.js cwkeyerDescriptors

test-default-descriptors:
	 ./make-descriptors.js defaultDescriptors

test-hasak-descriptors:
	./make-descriptors.js hasakDescriptors

test-cwkeyer-methods:
	./make-descriptors.js cwkeyerMethods

../src/hasakProperties.js: $(HASAK)/config.h $(HASAK)/doc/nrpn.tcl
	(cd $(HASAK) && ./doc/nrpn.tcl)> ../src/hasakProperties.js

../src/cwkeyerDescriptors.js: ../src/cwkeyerProperties.js ./make-descriptors.js
	./make-descriptors.js cwkeyerDescriptors > ../src/cwkeyerDescriptors.js

../src/defaultDescriptors.js: ../src/cwkeyerProperties.js ./make-descriptors.js
	./make-descriptors.js defaultDescriptors > ../src/defaultDescriptors.js

../src/hasakDescriptors.js: ../src/cwkeyerProperties.js ../src/hasakProperties.js ./make-descriptors.js
	./make-descriptors.js hasakDescriptors > ../src/hasakDescriptors.js
