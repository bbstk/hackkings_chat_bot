/**
 * Created by manthanhd on 02/11/2016.
 */
const expect = require('expect');

describe('Classifier', function() {
    describe('getClassifications', function() {
        it('throws Error with helpful message when called', function(done) {
            const Classifier = require('../lib/Classifier');
            try {
                new Classifier().getClassifications();
                done('should have thrown error');
            } catch (e) {
                expect(e).toBeA(Error);
                expect(e.message).toBe('Override getClassifications method in your classifier.');
                done();
            }
        });
    });

    describe('trainDocument', function() {
        it('throws Error with helpful message when called', function(done) {
            const Classifier = require('../lib/Classifier');
            try {
                new Classifier().trainDocument();
                done('should have thrown error');
            } catch (e) {
                expect(e).toBeA(Error);
                expect(e.message).toBe('Override trainDocument method in your classifier.');
                done();
            }
        });
    });

    describe('initialize', function() {
        it('throws Error with helpful message when called', function(done) {
            const Classifier = require('../lib/Classifier');
            try {
                new Classifier().initialize();
                done('should have thrown error');
            } catch (e) {
                expect(e).toBeA(Error);
                expect(e.message).toBe('Override initialize method in your classifier.');
                done();
            }
        });
    });
});