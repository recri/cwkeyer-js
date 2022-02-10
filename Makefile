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

rsync:: build
	cp './assets/icon-512x512.png' 'dist/assets'
	cp './assets/icon-192x192.png' 'dist/assets'
	cp './assets/icon-180x180.png' 'dist/assets'
	cp './assets/icon-167x167.png' 'dist/assets'
	cp './assets/icon-152x152.png' 'dist/assets'
	cp './assets/icon-144x144.png' 'dist/assets'
	rsync -av ./dist/ elf021@elf021.pairserver.com:/usr/home/elf021/public_html/cwkeyer.elf.org/
