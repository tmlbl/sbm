.PHONY: test
test:
	- ./node_modules/.bin/mocha --timeout 5000 ./test/*_test.js;
	- node ./test/cleanup.js;
