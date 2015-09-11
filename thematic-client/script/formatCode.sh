#!/bin/bash
# you must install https://www.npmjs.com/package/js-beautify
# npm i -g js-beautify

find -regex ".*\.\(js\|json\|css\|html\)" \
    -not -path "./bower_components/*" \
    -not -path "./node_modules/*" \
    -not -path "./dist/*" \
    -not -path "./.publish/*" \
    -not -path "./.tmp/*" \
    -not -path "./app/scripts/vendor/*" \
    | xargs js-beautify --replace