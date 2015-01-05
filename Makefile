.PHONY: test
test:
	- cd test && ../node_modules/.bin/mocha --timeout 10000 ./*_test.js;
	- cd test && node cleanup.js;
