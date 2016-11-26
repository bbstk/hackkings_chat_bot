/**
 * Created by manthanhd on 01/11/2016.
 */
function Classifier() {
    this.getClassifications = function GetClassificationsFn(input, callback) {
        throw new Error('Override getClassifications method in your classifier.');
    };

    this.initialize = function InitializeFn(callback) {
        throw new Error('Override initialize method in your classifier.');
    };

    this.trainDocument = function TrainDocumentFn(trainingData, callback) {
        throw new Error('Override trainDocument method in your classifier.');
    };
}

module.exports = Classifier;