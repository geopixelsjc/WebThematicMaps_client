/* global describe, it */

(function() {
    'use strict';

    describe('Map Module', function() {
        describe('#Constructor', function() {
            it('Map module should be an object', function() {
                expect(Map).to.be.ok;
                expect(Map).to.be.an('object');
                var mapObj = Map.getMap();
                expect(mapObj).to.be.ok;
                expect(mapObj).to.be.an('object');
            });
        });
    });
})();
