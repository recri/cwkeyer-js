all:: preprocess lint

preprocess::
	(cd scripts && make)

lint::
	npm run lint
start::
	npm run start
build::
	npm run build
test::
	npm run test
commit::
	git commit -a
push::
	git push origin main

start-build::
	npm run start:build
