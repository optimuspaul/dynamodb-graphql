const expect = require('chai').expect


//--------------------------------------------------
// Tests that the basic API contract is maintained.
//--------------------------------------------------
const functions = [
    "getLabels",
    "resolve",
];


functions.forEach(function(func_name) {
    describe('config module api', function() {  
      describe('"'+func_name+'"', function() {
        var config = require('./config');
        it('should export as a function', function() {
          expect(config[func_name]).to.be.a('function');
        });
      });
    });
});


//--------------------------------------------------
// Tests loading config from file.
//--------------------------------------------------
describe('config module functionality', function() {
    delete process.env["DDB-GQL-CONFIG"];
    delete process.env["DDB-GQL-LABELS"];
    describe('"no config defined"', function() {
        it('should get a list of labels in a file.', function() {
            delete process.env["DDB-GQL-CONFIG"];
            var config = require('./config');
            var labels = config.getLabels();
            expect(labels).to.deep.equal([]);
        });
    });
    describe('"config from file"', function() {
        it('should get a list of labels in a file.', function() {
            process.env["DDB-GQL-CONFIG"] = "./test-files/test-config.json";
            var config = require('./config');
            var labels = config.getLabels();
            expect(labels).to.deep.equal(["one", "message", "people", "hair"]);
        });
    });
    describe('"labels from ENV"', function() {
        it('should get a list of labels in a file.', function() {
            delete process.env["DDB-GQL-CONFIG"];
            process.env["DDB-GQL-LABELS"] = "animal,veggie,rocks";
            var config = require('./config');
            var labels = config.getLabels();
            expect(labels).to.deep.equal(["animal", "veggie", "rocks"]);
        });
    });
});

