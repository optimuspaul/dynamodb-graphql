const index = require('./index.spec');
const utils = require('./utils');
const expect = require('chai').expect;


//--------------------------------------------------
// Tests that the basic API contract is maintained.
//--------------------------------------------------
const functions = [
    "shouldBeVectors",
    "shouldBeScalars",
    "applyDefaults",
    "newid",
    "only",
];


describe('utils module api', function() {
    functions.forEach(function(func_name) {
        describe('"' + func_name + '"', function() {
            it('should export a function', function() {
                expect(utils[func_name]).to.be.a('function');
            });
        });
    });
});


describe('utils shouldBeVectors', function() {
    let obj = {
        name: "scalar value",
        list: [0, 1],
        shouldBeList: "pants",
        wildcat1: undefined,
        wildcat2: null,
        wildcat3: 0,
    };

    utils.shouldBeVectors(["list", "shouldBeList"], obj);
    expect(obj.name).to.equal("scalar value");
    expect(obj.list).to.deep.equal([0, 1]);
    expect(obj.shouldBeList).to.deep.equal(["pants"]);
    expect(obj.undef).to.equal(undefined);

    utils.shouldBeVectors(["undef", "wildcat1", "wildcat2", "wildcat3"], obj);
    expect(obj.undef).to.deep.equal([]);
    expect(obj.wildcat1).to.deep.equal([]);
    expect(obj.wildcat2).to.deep.equal([]);
    expect(obj.wildcat3).to.deep.equal([]);
});