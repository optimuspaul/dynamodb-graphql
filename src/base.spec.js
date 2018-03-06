const index = require('./index.spec');
const base = require('./base');
const expect = require('chai').expect;


//--------------------------------------------------
// Tests that the basic API contract is maintained.
//--------------------------------------------------
const functions = [
    "hashPair",
    "prepareTriple",
    "getTriple",
    "writeTriple",
    "removeTriple",
    "getSubjectsWithPredicate",
    "getSubjectsWithPredicateValue",
    "getObject",
    "putObject",
    "removeObject",
    "getObjectTriples",
];


describe('base module api', function() {
    functions.forEach(function(func_name) {
        describe('"' + func_name + '"', function() {
            it('should export a function', function() {
                expect(base[func_name]).to.be.a('function');
            });
        });
    });
});


//--------------------------------------------------
// Tests for hashing
//--------------------------------------------------

describe('base module functionality', function() {
    describe('"hashPair"', function() {
        it('should produce a consistent hash for `key` and `value`', function() {
            expect(base.hashPair("key", "value")).to.equal('rn1Rn2ztJwrbwm9R7cp17Nuskdu3VHFl2c1zsL+kS6Q=');
        });
        it('should produce a consistent hash for `favorite` and `pencil`', function() {
            expect(base.hashPair("favorite", "pencil")).to.equal('/SUQv+hoyKDoSGKa12F7SXql3WnUCLMR7YdL3pmBFyw=');
        });
        it('should produce a consistent hash for `hormone` and `replacement`', function() {
            expect(base.hashPair("hormone", "replacement")).to.equal('TbYp7dXsyB2toW20b4ovYN6AsfTCVs2zb7qsqntKSwI=');
        });
    });
});



//--------------------------------------------------
// Tests for triple preparation
//--------------------------------------------------

describe('base module functionality', function() {
    describe('"prepareTriple"', function() {
        it('should produce a ddb formatted item for a triple', function() {
            expect(base.prepareTriple("subject", "predicate", "value", "modificationDate")).to.deep.equal({
                "id": {
                    "S": "subject"
                },
                "hash": {
                    "S": "navHUk2JAadxbRAqN+o/R1hpEoHXNisN9I3q5f7647Y="
                },
                "predicate": {
                    "S": "predicate"
                },
                "value": {
                    "S": "value"
                },
                "modificationDate": {
                    "S": "modificationDate"
                },
            });
        });
    });
});


//--
// Stuff
//---

var tableName = "unitTests";

describe('writeTriple/getTriple', function() {
    it("should write a triple to dynamo", async function() {
        await index.doUnitTest(async function() {
            let created = await base.writeTriple(tableName, "subject", "predicate", "value");
            expect(created).to.not.equal(null);
            let in_db = await base.getTriple(tableName, "subject", "predicate", "value");
            expect(in_db).to.deep.equal({
                value: 'value',
                hash: 'navHUk2JAadxbRAqN+o/R1hpEoHXNisN9I3q5f7647Y=',
                modificationDate: created.modificationDate.S,
                id: 'subject',
                predicate: 'predicate'
            });
            await base.removeTriple(tableName, "subject", "predicate", "value");
        }, [tableName]);
    });
});


describe('putObject/getObject', function() {
    it("should write a set of triples to dynamo", async function() {
        await index.doUnitTest(async function() {
            var anObject = {
                id: "thirdverse",
                name: "same as the first",
                monkees: [
                    "Micky Dolenz",
                    "Michael Nesmith",
                    "Peter Tork",
                    "Davy Jones"
                ],
                states: ["one"]
            };
            let created = await base.putObject(tableName, anObject);
            expect(created).to.not.equal(null);
            let in_db = await base.getObject(tableName, anObject.id);
            expect(in_db).to.deep.equal(anObject);
            await base.removeObject(tableName, "thirdverse");
        }, [tableName]);
    });
});




describe('removeObject', function() {
    it("should remove triples in DDB", async function() {
        await index.doUnitTest(async function() {
            var anObject = {
                id: "test-object",
                name: "same as the first",
                states: ["one"]
            };

            let created = await base.putObject(tableName, anObject)
            expect(created).to.not.equal(null);
            let in_db = await base.getObject(tableName, anObject.id);
            expect(in_db).to.deep.equal(anObject);
            await base.removeObject(tableName, anObject.id);
            let triples = await base.getObjectTriples(tableName, anObject.id);
            expect(triples.length).to.equal(0);
        }, [tableName]);
    });
});




describe('getSubjectsWithPredicate', function() {
    it("should find a set of subjects that have a specific predicate set.", async function() {
        await index.doUnitTest(async function() {
            const objs = [
                {id: "obj1", name: "one"},
                {id: "obj2", gnome: "none"},
                {id: "obj3", name: "one"},
            ];


            let creates = [];
            objs.forEach(async function(obj) {
                creates.push(base.putObject(tableName, obj));
            });

            await Promise.all(creates);

            let subjects = await base.getSubjectsWithPredicate(tableName, "name");
            let subset = new Set(subjects.subjects);
            let expected = [
                {id: "obj1"},
                {id: "obj3"}
            ];
            expect(subset).to.have.deep.keys(expected);


            subjects = await base.getSubjectsWithPredicate(tableName, "hats");
            expect(subjects.subjects.length).to.equal(0);

            let deletes = [];
            objs.forEach(async function(obj) {
                deletes.push(base.removeObject(tableName, obj.id));
            });

            await Promise.all(deletes);
        }, [tableName]);
    });
});

describe('getSubjectsWithPredicate-paginated', async function() {
        it("should find a set of subjects that have a specific predicate set - pagination supported", async function() {
            await index.doUnitTest(async function() {
                const objs = [
                    {id: "paginated_01", name: "name"},
                    {id: "paginated_02", name: "name"},
                    {id: "paginated_03", name: "name"},
                    {id: "paginated_04", name: "name"},
                    {id: "paginated_05", name: "name"},
                    {id: "paginated_06", name: "name"},
                    {id: "paginated_07", name: "name"},
                    {id: "paginated_08", name: "name"},
                    {id: "paginated_09", name: "name"},
                    {id: "paginated_10", name: "name"},
                    {id: "paginated_11", name: "name"},
                    {id: "paginated_12", name: "name"},
                    {id: "paginated_13", name: "name"},
                    {id: "paginated_14", name: "name"},
                    {id: "paginated_15", name: "name"},
                    {id: "paginated_16", name: "name"},
                    {id: "paginated_17", name: "name"},
                    {id: "paginated_18", name: "name"},
                    {id: "paginated_19", name: "name"},
                    {id: "paginated_20", name: "name"},
                ];
                creates = [];
                objs.forEach(async function(obj) {
                    creates.push(base.putObject(tableName, obj));
                });

                await Promise.all(creates);


                var page1 = await base.getSubjectsWithPredicate(tableName, "name", {
                    max_items: 15
                });
                expect(page1.subjects.length).to.equal(15);

                var page2 = await base.getSubjectsWithPredicate(tableName, "name", {
                    max_items: 15,
                    token: page1.pageInfo.token
                });
                expect(page2.subjects.length).to.equal(5);


                var deletes = [];
                objs.forEach(async function(obj) {
                    deletes.push(base.removeObject(tableName, obj.id));
                });

                await Promise.all(deletes);
            }, [tableName]);
        });
    });


describe('getSubjectsWithPredicateValue', function() {
        it("Should find a set of subjects that have a predicate / value set", async function() {
            await index.doUnitTest(async function() {
                let objs = [
                    {id: "obj6", name: "boston"},
                    {id: "obj7", name: "mclain"},
                ];

                creates = [];
                objs.forEach(async function(obj) {
                    creates.push(base.putObject(tableName, obj));
                });

                await Promise.all(creates);

                let subjects = await base.getSubjectsWithPredicateValue(tableName, "name", "boston");
                expect(new Set(subjects.subjects)).to.have.deep.keys([{id: "obj6"}]);

                var deletes = [];
                objs.forEach(async function(obj) {
                    deletes.push(base.removeObject(tableName, obj.id));
                });

                await Promise.all(deletes);
            }, [tableName]);
        });
    });

